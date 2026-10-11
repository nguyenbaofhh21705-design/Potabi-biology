/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { IMAGES } from './data/biologyData';
import {
  calculateExplorerLevel,
  DEFAULT_GAME_STATE,
  ensurePlayerProfile,
  fetchCloudLeaderboard,
  GameProgressState,
  hasExistingSaveData,
  LeaderboardEntry,
  loadGameProgress,
  PlayerProfileRecord,
  pullAndMergeCloudProgress,
  pushProgressToCloud,
  saveGameProgress,
  StationSavedProgress,
  updatePlayerProfile,
} from './data/gameProgress';
import { getSupabaseClient, isSupabaseConfigured } from './lib/supabase';
import { JourneyMapScreen } from './components/JourneyMapScreen';
import { StoryCutsceneScreen } from './components/StoryCutsceneScreen';
import { StomachStageScreen } from './components/StomachStageScreen';
import { WeeklyQuestsScreen } from './components/WeeklyQuestsScreen';
import {
  LabToolModal,
  ProfileScreen,
  WardrobeScreen,
} from './components/WardrobeAndProfileScreens';
import { AuthGateModal } from './components/AuthGateModal';

export type ScreenMode =
  | 'hanh-trinh'
  | 'nhiem-vu-tuan'
  | 'trang-phuc'
  | 'ho-so'
  | 'cutscene'
  | 'stomach-2d';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenMode>(() =>
    hasExistingSaveData() ? 'hanh-trinh' : 'cutscene'
  );
  const [gameState, setGameState] = useState<GameProgressState>(() => loadGameProgress());
  const [activeLabTool, setActiveLabTool] = useState<
    'microscope' | 'stain' | 'notebook' | null
  >(null);

  // Supabase Auth & Cloud Sync states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfileRecord | null>(null);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<
    'idle' | 'syncing' | 'synced' | 'offline' | 'unconfigured'
  >(() => (isSupabaseConfigured() ? 'idle' : 'unconfigured'));
  const [cloudSyncError, setCloudSyncError] = useState<string | null>(null);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);

  // Auth Gate Modal state (mandatory gate before entering 2D stage unless logged in or explicit offline fallback)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [pending2DNavigation, setPending2DNavigation] = useState<boolean>(false);

  const gameStateRef = useRef<GameProgressState>(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const initialHydrationDoneRef = useRef<boolean>(false);

  // Always persist every state change to localStorage immediately
  useEffect(() => {
    saveGameProgress(gameState);
  }, [gameState]);

  // Helper to refresh leaderboard from Supabase
  const handleRefreshLeaderboard = async () => {
    if (!isSupabaseConfigured()) return;
    const { entries } = await fetchCloudLeaderboard();
    setLeaderboardEntries(entries);
  };

  // Hydrate profile + smart-merge cloud progress when a user session becomes active
  const hydrateAuthenticatedUser = async (user: User) => {
    setCloudSyncStatus('syncing');
    setCloudSyncError(null);

    const metaName =
      (user.user_metadata?.display_name as string) ||
      (user.user_metadata?.full_name as string) ||
      user.email?.split('@')[0] ||
      'Nhà Thám Hiểm Vi Mô';
    const metaAvatar =
      user.user_metadata?.avatar_variant === 'blue' ? 'blue' : ('yellow' as const);

    const { profile } = await ensurePlayerProfile(user.id, metaName, metaAvatar);
    if (profile) {
      setPlayerProfile(profile);
    }

    const { mergedState, error } = await pullAndMergeCloudProgress(user.id, gameStateRef.current);
    initialHydrationDoneRef.current = true;
    setGameState(mergedState);

    if (error) {
      setCloudSyncStatus('offline');
      setCloudSyncError(error);
    } else {
      setCloudSyncStatus('synced');
      setCloudSyncError(null);
    }

    await handleRefreshLeaderboard();
  };

  // Subscribe to Supabase Auth session & OAuth popup changes
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setCloudSyncStatus('unconfigured');
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user ?? null;
      setCurrentUser(user);
      if (user) {
        hydrateAuthenticatedUser(user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setCurrentUser(user);
      if (user) {
        hydrateAuthenticatedUser(user);
      } else {
        initialHydrationDoneRef.current = false;
        setPlayerProfile(null);
        setCloudSyncStatus('idle');
      }
    });

    handleRefreshLeaderboard();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Debounced automatic cloud sync whenever gameState mutates while logged in
  useEffect(() => {
    if (!currentUser || !initialHydrationDoneRef.current) return;

    const timer = window.setTimeout(async () => {
      setCloudSyncStatus('syncing');
      const { ok, error } = await pushProgressToCloud(currentUser.id, gameState);
      if (ok) {
        setCloudSyncStatus('synced');
        setCloudSyncError(null);
        if (gameState.pendingCloudSync) {
          setGameState((prev) => ({ ...prev, pendingCloudSync: false }));
        }
      } else {
        setCloudSyncStatus('offline');
        setCloudSyncError(error);
        if (!gameState.pendingCloudSync) {
          setGameState((prev) => ({ ...prev, pendingCloudSync: true }));
        }
      }
    }, 850);

    return () => window.clearTimeout(timer);
  }, [
    currentUser,
    gameState.exp,
    gameState.diamonds,
    gameState.equippedOutfitId,
    gameState.ownedOutfitIds,
    gameState.unlockedStageIds,
    gameState.completedStageIds,
    gameState.completedStations,
    gameState.unlockedSpecimens,
    gameState.weeklyQuests,
    gameState.cutsceneSeen,
    gameState.microscopeInspected,
    gameState.amylaseInspected,
    gameState.stationProgressMap,
  ]);

  // Retry pending cloud sync automatically when browser regains network connectivity
  useEffect(() => {
    const handleOnline = async () => {
      if (currentUser && gameStateRef.current.pendingCloudSync) {
        setCloudSyncStatus('syncing');
        const { ok, error } = await pushProgressToCloud(currentUser.id, gameStateRef.current);
        if (ok) {
          setCloudSyncStatus('synced');
          setCloudSyncError(null);
          setGameState((prev) => ({ ...prev, pendingCloudSync: false }));
        } else {
          setCloudSyncStatus('offline');
          setCloudSyncError(error);
        }
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [currentUser]);

  // Gate entry to the 2D Stomach Stage with AuthGateModal if not yet signed in
  const requestEnterStomach2D = () => {
    if (currentUser) {
      setActiveScreen('stomach-2d');
    } else {
      setPending2DNavigation(true);
      setIsAuthModalOpen(true);
    }
  };

  const handleFinishIntroToGameplay = () => {
    setGameState((prev) => ({
      ...prev,
      cutsceneSeen: true,
      updatedAt: new Date().toISOString(),
    }));
    requestEnterStomach2D();
  };

  const handleExitIntroToMap = () => {
    setGameState((prev) => ({
      ...prev,
      cutsceneSeen: true,
      updatedAt: new Date().toISOString(),
    }));
    setActiveScreen('hanh-trinh');
  };

  const handleOpenLabTool = (tool: 'microscope' | 'stain' | 'notebook') => {
    setActiveLabTool(tool);
    if (tool === 'microscope' || tool === 'stain') {
      setGameState((prev) =>
        prev.microscopeInspected
          ? prev
          : { ...prev, microscopeInspected: true, updatedAt: new Date().toISOString() }
      );
    }
  };

  const handleAmylaseInspected = () => {
    setGameState((prev) =>
      prev.amylaseInspected
        ? prev
        : { ...prev, amylaseInspected: true, updatedAt: new Date().toISOString() }
    );
  };

  const handleUpdateStationProgressMap = (nextMap: Record<string, StationSavedProgress>) => {
    setGameState((prev) => ({
      ...prev,
      stationProgressMap: nextMap,
      updatedAt: new Date().toISOString(),
    }));
  };

  const { level, percent } = calculateExplorerLevel(gameState.exp);

  const handleStationCompleted = (
    stationId: string,
    specimenId: string,
    expReward: number,
    diamondReward: number
  ) => {
    setGameState((prev) => {
      const alreadyDone = prev.completedStations.includes(stationId);
      const updatedStations = alreadyDone
        ? prev.completedStations
        : [...prev.completedStations, stationId];
      const updatedSpecimens = prev.unlockedSpecimens.includes(specimenId)
        ? prev.unlockedSpecimens
        : [...prev.unlockedSpecimens, specimenId];

      const allThreeDone =
        updatedStations.includes('tram-1') &&
        updatedStations.includes('tram-2') &&
        updatedStations.includes('tram-3');

      const tieuHoaProgress = Math.min(100, Math.round((updatedStations.length / 3) * 100));

      const unlockedStages = new Set(prev.unlockedStageIds);
      const completedStages = new Set(prev.completedStageIds);
      if (allThreeDone) {
        completedStages.add('tieu-hoa');
        unlockedStages.add('tuan-hoan');
      }

      const nextStationMap = { ...(prev.stationProgressMap || {}) };
      delete nextStationMap[stationId];

      return {
        ...prev,
        exp: alreadyDone ? prev.exp : prev.exp + expReward,
        diamonds: alreadyDone ? prev.diamonds : prev.diamonds + diamondReward,
        completedStations: updatedStations,
        unlockedSpecimens: updatedSpecimens,
        unlockedStageIds: Array.from(unlockedStages),
        completedStageIds: Array.from(completedStages),
        stageProgress: {
          ...prev.stageProgress,
          'tieu-hoa': tieuHoaProgress,
        },
        stationProgressMap: nextStationMap,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleCompleteStageQuiz = (
    stageId: string,
    expReward: number,
    diamondReward: number
  ) => {
    setGameState((prev) => {
      const alreadyCompleted = prev.completedStageIds.includes(stageId);
      const completedStages = new Set(prev.completedStageIds);
      const unlockedStages = new Set(prev.unlockedStageIds);
      completedStages.add(stageId);

      if (stageId === 'tuan-hoan') {
        unlockedStages.add('ho-hap');
      } else if (stageId === 'ho-hap') {
        unlockedStages.add('than-kinh');
      }

      return {
        ...prev,
        exp: alreadyCompleted ? prev.exp : prev.exp + expReward,
        diamonds: alreadyCompleted ? prev.diamonds : prev.diamonds + diamondReward,
        completedStageIds: Array.from(completedStages),
        unlockedStageIds: Array.from(unlockedStages),
        stageProgress: {
          ...prev.stageProgress,
          [stageId]: 100,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleBuyOutfit = (id: string, price: number) => {
    setGameState((prev) => ({
      ...prev,
      diamonds: Math.max(0, prev.diamonds - price),
      ownedOutfitIds: prev.ownedOutfitIds.includes(id)
        ? prev.ownedOutfitIds
        : [...prev.ownedOutfitIds, id],
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleEquipOutfit = (id: string) => {
    setGameState((prev) => ({
      ...prev,
      equippedOutfitId: id,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleCompleteEnzymeQuiz = () => {
    setGameState((prev) => {
      if (prev.weeklyQuests.enzymeQuizDone) return prev;
      return {
        ...prev,
        exp: prev.exp + 120,
        diamonds: prev.diamonds + 25,
        weeklyQuests: {
          ...prev.weeklyQuests,
          enzymeQuizDone: true,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleCompleteBloodCellMatch = () => {
    setGameState((prev) => {
      if (prev.weeklyQuests.bloodCellMatchDone) return prev;
      return {
        ...prev,
        exp: prev.exp + 150,
        diamonds: prev.diamonds + 30,
        weeklyQuests: {
          ...prev.weeklyQuests,
          bloodCellMatchDone: true,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleClaimChest = () => {
    setGameState((prev) => {
      if (prev.weeklyQuests.chestClaimed) return prev;
      return {
        ...prev,
        exp: prev.exp + 200,
        diamonds: prev.diamonds + 50,
        ownedOutfitIds: prev.ownedOutfitIds.includes('blouse-bac-si')
          ? prev.ownedOutfitIds
          : [...prev.ownedOutfitIds, 'blouse-bac-si'],
        weeklyQuests: {
          ...prev.weeklyQuests,
          chestClaimed: true,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleResetProgress = () => {
    setGameState({
      ...DEFAULT_GAME_STATE,
      ownerUserId: currentUser?.id ?? null,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleManualSyncCloud = async () => {
    if (!currentUser) return;
    setCloudSyncStatus('syncing');
    const { mergedState, error } = await pullAndMergeCloudProgress(currentUser.id, gameState);
    setGameState(mergedState);
    if (error) {
      setCloudSyncStatus('offline');
      setCloudSyncError(error);
    } else {
      setCloudSyncStatus('synced');
      setCloudSyncError(null);
      await handleRefreshLeaderboard();
    }
  };

  const handleUpdateProfileInfo = async (updates: {
    display_name: string;
    avatar_variant: 'yellow' | 'blue';
    grade_class: string;
  }) => {
    if (!currentUser) return;
    const { profile, error } = await updatePlayerProfile(currentUser.id, updates);
    if (profile) {
      setPlayerProfile(profile);
      await handleRefreshLeaderboard();
    }
    if (error) {
      setCloudSyncError(error);
    }
  };

  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    setPlayerProfile(null);
    setCloudSyncStatus(isSupabaseConfigured() ? 'idle' : 'unconfigured');
  };

  const isImmersiveGameScreen = activeScreen === 'cutscene' || activeScreen === 'stomach-2d';
  const headerAvatarSrc =
    playerProfile?.avatar_variant === 'blue' ? IMAGES.potabiBlueAvatar : IMAGES.potabiAvatar;

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface select-none relative">
      {/* Standard Top Header for Hub Screens (Map, Weekly Quests, Wardrobe, Profile) */}
      {!isImmersiveGameScreen && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="h-20 w-full px-margin flex items-center justify-between gap-space-md">
            {/* Left Brand + Explorer Level Badge */}
            <div className="flex items-center gap-space-md">
              <button
                onClick={() => setActiveScreen('hanh-trinh')}
                className="flex items-center gap-space-sm bg-surface-container px-space-md py-space-xs rounded-full cursor-pointer"
              >
                <span className="font-headline-md text-headline-md text-primary tracking-tight">
                  Potabi
                </span>
                <span className="font-label-sm text-label-sm bg-primary text-on-primary px-space-sm py-0.5 rounded-full uppercase">
                  Sinh Học
                </span>
              </button>

              <div className="hidden xl:flex items-center gap-space-sm bg-surface-container-low px-space-md py-space-xs rounded-full">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface">
                    {playerProfile?.display_name || 'Nhà Thám Hiểm'}
                  </span>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-sm text-label-sm text-primary">Cấp {level}</span>
                    <div className="w-24 h-2 bg-secondary-container rounded-full overflow-hidden">
                      <div
                        className="bg-tertiary-fixed-dim h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-surface-container px-space-sm py-0.5 rounded-full text-tertiary font-label-md text-label-md">
                  <span className="material-symbols-outlined text-base">diamond</span>
                  <span>{gameState.diamonds}</span>
                </div>
              </div>
            </div>

            {/* Center Navigation Pills */}
            <nav className="flex items-center gap-space-sm bg-surface-container-high/80 p-1.5 rounded-full">
              <button
                onClick={() => setActiveScreen('hanh-trinh')}
                className={`px-space-md py-1.5 rounded-full font-label-lg text-label-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeScreen === 'hanh-trinh'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                Hành trình
              </button>
              <button
                onClick={() => setActiveScreen('nhiem-vu-tuan')}
                className={`px-space-md py-1.5 rounded-full font-label-lg text-label-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeScreen === 'nhiem-vu-tuan'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                Nhiệm vụ tuần
              </button>
              <button
                onClick={() => setActiveScreen('trang-phuc')}
                className={`px-space-md py-1.5 rounded-full font-label-lg text-label-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeScreen === 'trang-phuc'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                Trang phục
              </button>
              <button
                onClick={() => setActiveScreen('ho-so')}
                className={`px-space-md py-1.5 rounded-full font-label-lg text-label-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeScreen === 'ho-so'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                Hồ sơ
              </button>
            </nav>

            {/* Right Quick Screen Switcher, Cloud Sync Badge & Profile Avatar */}
            <div className="flex items-center gap-space-sm">
              <button
                onClick={() => setActiveScreen('cutscene')}
                title="Xem Hoạt cảnh Cốt truyện 2D"
                className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container text-primary hover:bg-surface-container-high font-label-sm text-label-sm cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-base">movie</span>
                <span>Cốt truyện</span>
              </button>
              <button
                onClick={requestEnterStomach2D}
                title="Vào Màn chơi Thử thách 2D"
                className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed hover:opacity-90 font-label-sm text-label-sm cursor-pointer transition-opacity"
              >
                <span className="material-symbols-outlined text-base">sports_esports</span>
                <span>Màn 2D Dạ Dày</span>
              </button>

              {/* Cloud Sync / Login Button */}
              {currentUser ? (
                <button
                  onClick={() => setActiveScreen('ho-so')}
                  title="Trạng thái đồng bộ đám mây"
                  className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-900 font-label-sm text-label-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">
                    {cloudSyncStatus === 'syncing'
                      ? 'sync'
                      : cloudSyncStatus === 'offline'
                      ? 'cloud_off'
                      : 'cloud_done'}
                  </span>
                  <span>
                    {cloudSyncStatus === 'syncing'
                      ? 'Đang lưu...'
                      : cloudSyncStatus === 'offline'
                      ? 'Lưu máy'
                      : 'Đã lưu Mây'}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setPending2DNavigation(false);
                    setIsAuthModalOpen(true);
                  }}
                  title="Đăng nhập để đồng bộ tiến trình lên đám mây"
                  className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed hover:bg-secondary-fixed-dim font-label-sm text-label-sm cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">cloud_upload</span>
                  <span>Đăng nhập</span>
                </button>
              )}

              <button
                onClick={() => handleOpenLabTool('notebook')}
                title="Mở Sổ tay Sinh học"
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">settings</span>
              </button>
              <button
                onClick={() => setActiveScreen('ho-so')}
                className="w-8 h-8 rounded-full overflow-hidden cursor-pointer ring-2 ring-primary/30 bg-surface-container-low p-0.5"
              >
                <img
                  alt="Profile"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  src={headerAvatarSrc}
                />
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className={isImmersiveGameScreen ? 'w-full h-screen' : 'w-full pt-20 bg-surface flex-1'}>
        {activeScreen === 'hanh-trinh' && (
          <JourneyMapScreen
            completedStageIds={gameState.completedStageIds}
            diamonds={gameState.diamonds}
            exp={gameState.exp}
            onCompleteStageQuiz={handleCompleteStageQuiz}
            onNavigateQuests={() => setActiveScreen('nhiem-vu-tuan')}
            onOpenNotebook={() => handleOpenLabTool('notebook')}
            onPlayCutscene={() => setActiveScreen('cutscene')}
            onPlayStage2D={requestEnterStomach2D}
            stageProgress={gameState.stageProgress}
            unlockedSpecimens={gameState.unlockedSpecimens}
            unlockedStageIds={gameState.unlockedStageIds}
          />
        )}

        {activeScreen === 'nhiem-vu-tuan' && (
          <WeeklyQuestsScreen
            onClaimChest={handleClaimChest}
            onCompleteBloodCellMatch={handleCompleteBloodCellMatch}
            onCompleteEnzymeQuiz={handleCompleteEnzymeQuiz}
            onOpenNotebook={() => handleOpenLabTool('notebook')}
            weeklyQuests={gameState.weeklyQuests}
          />
        )}

        {activeScreen === 'trang-phuc' && (
          <WardrobeScreen
            diamonds={gameState.diamonds}
            equippedOutfitId={gameState.equippedOutfitId}
            onBuyOutfit={handleBuyOutfit}
            onEquipOutfit={handleEquipOutfit}
            ownedOutfitIds={gameState.ownedOutfitIds}
          />
        )}

        {activeScreen === 'ho-so' && (
          <ProfileScreen
            cloudSyncError={cloudSyncError}
            cloudSyncStatus={cloudSyncStatus}
            completedStageIds={gameState.completedStageIds}
            diamonds={gameState.diamonds}
            exp={gameState.exp}
            leaderboardEntries={leaderboardEntries}
            onManualSyncCloud={handleManualSyncCloud}
            onOpenAuthModal={() => {
              setPending2DNavigation(false);
              setIsAuthModalOpen(true);
            }}
            onOpenNotebook={() => handleOpenLabTool('notebook')}
            onRefreshLeaderboard={handleRefreshLeaderboard}
            onResetProgress={handleResetProgress}
            onSignOut={handleSignOut}
            onUpdateProfileInfo={handleUpdateProfileInfo}
            playerProfile={playerProfile}
            unlockedSpecimens={gameState.unlockedSpecimens}
            userEmail={currentUser?.email ?? null}
          />
        )}

        {activeScreen === 'cutscene' && (
          <StoryCutsceneScreen
            onContinueToLab={handleFinishIntroToGameplay}
            onExitToMap={handleExitIntroToMap}
            onOpenMicroscope={() => handleOpenLabTool('microscope')}
            onOpenNotebook={() => handleOpenLabTool('notebook')}
            onOpenStain={() => handleOpenLabTool('stain')}
          />
        )}

        {activeScreen === 'stomach-2d' && (
          <StomachStageScreen
            amylaseInspected={Boolean(gameState.amylaseInspected)}
            completedStations={gameState.completedStations}
            equippedOutfitId={gameState.equippedOutfitId}
            onAmylaseInspected={handleAmylaseInspected}
            onExitToMap={() => setActiveScreen('hanh-trinh')}
            onOpenMicroscope={() => handleOpenLabTool('microscope')}
            onOpenNotebook={() => handleOpenLabTool('notebook')}
            onOpenStain={() => handleOpenLabTool('stain')}
            onStageVictory={() => setActiveScreen('hanh-trinh')}
            onStationCompleted={handleStationCompleted}
            onUpdateStationProgressMap={handleUpdateStationProgressMap}
            stationProgressMap={gameState.stationProgressMap || {}}
          />
        )}
      </main>

      {/* Standard Footer for Hub Screens */}
      {!isImmersiveGameScreen && (
        <footer className="w-full bg-surface-container-low py-space-lg">
          <div className="w-full px-margin flex flex-col md:flex-row items-center justify-between gap-space-sm text-center md:text-left">
            <div className="flex items-center gap-space-sm">
              <span className="font-label-md text-label-md text-primary font-bold">
                Potabi Biology
              </span>
              <span className="text-outline-variant">•</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Học viện Khám phá Sinh học 2D
              </span>
            </div>
            <div className="font-label-sm text-label-sm text-on-surface-variant">
              © 2024 Potabi. Vui vẻ khám phá muôn loài.
            </div>
          </div>
        </footer>
      )}

      {/* Interactive Microscope / Staining / Notebook Modal */}
      <LabToolModal
        activeTool={activeLabTool}
        onClose={() => setActiveLabTool(null)}
        unlockedSpecimens={gameState.unlockedSpecimens}
      />

      {/* Supabase Auth Gate & Account Sync Modal */}
      <AuthGateModal
        isGateFor2D={pending2DNavigation}
        isOpen={isAuthModalOpen}
        onAuthSuccess={() => {
          setIsAuthModalOpen(false);
          if (pending2DNavigation) {
            setPending2DNavigation(false);
            setActiveScreen('stomach-2d');
          }
        }}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPending2DNavigation(false);
        }}
        onContinueOfflineGuest={() => {
          setIsAuthModalOpen(false);
          if (pending2DNavigation) {
            setPending2DNavigation(false);
            setActiveScreen('stomach-2d');
          }
        }}
      />
    </div>
  );
}
