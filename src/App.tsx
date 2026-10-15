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
import { HomeScreen } from './components/HomeScreen';
import { JourneyMapScreen } from './components/JourneyMapScreen';
import { StoryCutsceneScreen } from './components/StoryCutsceneScreen';
import { StomachStageScreen } from './components/StomachStageScreen';
import { Stage2DRunner } from './components/Stage2DRunner';
import { WorldAssetShowcase } from './components/WorldAssetShowcase';
import { WeeklyQuestsScreen } from './components/WeeklyQuestsScreen';
import {
  LabToolModal,
  ProfileScreen,
  WardrobeScreen,
} from './components/WardrobeAndProfileScreens';
import { AuthGateModal } from './components/AuthGateModal';

export type ScreenMode =
  | 'trang-chu'
  | 'hanh-trinh'
  | 'nhiem-vu-tuan'
  | 'trang-phuc'
  | 'ho-so'
  | 'cutscene'
  | 'stomach-2d'
  | 'stage-2d'
  | 'asset-showcase';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenMode>('trang-chu');
  const [currentPlayingStageId, setCurrentPlayingStageId] = useState<string>('tuan-hoan');
  const [pendingStageToPlay, setPendingStageToPlay] = useState<string>('tuan-hoan');
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
    const metaAvatar = 'blue' as const;

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

  // Gate entry to any 2D Stage with AuthGateModal if not yet signed in
  const handlePlayStage2D = (stageId: string = 'tuan-hoan') => {
    setCurrentPlayingStageId(stageId);
    if (currentUser) {
      setActiveScreen('stage-2d');
    } else {
      setPendingStageToPlay(stageId);
      setPending2DNavigation(true);
      setIsAuthModalOpen(true);
    }
  };

  const requestEnterStomach2D = () => {
    handlePlayStage2D('tieu-hoa');
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

      if (stageId === 'tieu-hoa') {
        unlockedStages.add('tuan-hoan');
      } else if (stageId === 'tuan-hoan') {
        unlockedStages.add('ho-hap');
      } else if (stageId === 'ho-hap') {
        unlockedStages.add('than-kinh');
      } else if (stageId === 'than-kinh') {
        unlockedStages.add('van-dong');
      } else if (stageId === 'van-dong') {
        unlockedStages.add('bai-tiet');
      } else if (stageId === 'bai-tiet') {
        unlockedStages.add('noi-tiet');
      } else if (stageId === 'noi-tiet') {
        unlockedStages.add('sinh-duc');
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
    avatar_variant?: 'blue';
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

  const handleStartOrContinueAdventure = () => {
    // If brand new explorer who hasn't seen the intro cutscene yet, begin the story
    if (!gameState.cutsceneSeen) {
      setActiveScreen('cutscene');
    } else {
      // Returning explorer: enter 2D stomach stage directly
      requestEnterStomach2D();
    }
  };

  const isImmersiveGameScreen =
    activeScreen === 'cutscene' ||
    activeScreen === 'stomach-2d' ||
    activeScreen === 'stage-2d';
  const headerAvatarSrc = IMAGES.potabiBlueAvatar;

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface select-none relative">
      {/* Standard Top Header for Hub Screens (Home, Map, Weekly Quests, Wardrobe, Profile) */}
      {!isImmersiveGameScreen && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] safe-p-top">
          <div className="h-16 md:h-20 w-full px-3 sm:px-6 md:px-margin flex items-center justify-between gap-2 sm:gap-space-md">
            {/* Left Brand (Click returns to 2D Adventure Home Screen) */}
            <div className="flex items-center gap-2 sm:gap-space-md">
              <button
                onClick={() => setActiveScreen('trang-chu')}
                title="Về Trang Chủ Thế Giới 2D"
                className="flex items-center gap-1.5 sm:gap-space-sm bg-surface-container px-3 sm:px-space-md py-1 sm:py-space-xs rounded-full cursor-pointer hover:bg-surface-container-high transition-colors"
              >
                <span className="font-headline-sm sm:font-headline-md text-headline-sm sm:text-headline-md text-primary tracking-tight">
                  Potabi
                </span>
                <span className="font-label-sm text-[11px] sm:text-label-sm bg-primary text-on-primary px-2 sm:px-space-sm py-0.5 rounded-full uppercase font-bold">
                  Sinh Học
                </span>
              </button>

              {/* Explorer Level Badge (Desktop & Tablet) */}
              <div className="hidden sm:flex items-center gap-space-sm bg-surface-container-low px-3 sm:px-space-md py-1 sm:py-space-xs rounded-full">
                <div className="flex flex-col">
                  <span className="font-label-sm sm:font-label-md text-label-sm sm:text-label-md text-on-surface truncate max-w-[120px] md:max-w-none">
                    {playerProfile?.display_name || 'Nhà Thám Hiểm'}
                  </span>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-sm text-label-sm text-primary">Cấp {level}</span>
                    <div className="w-16 md:w-24 h-1.5 md:h-2 bg-secondary-container rounded-full overflow-hidden">
                      <div
                        className="bg-tertiary-fixed-dim h-full rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-full text-tertiary font-label-sm sm:font-label-md text-label-sm sm:text-label-md font-bold">
                  <span className="material-symbols-outlined text-sm sm:text-base">diamond</span>
                  <span>{gameState.diamonds}</span>
                </div>
              </div>

              {/* Mobile-only compact diamond counter */}
              <div className="flex sm:hidden items-center gap-1 bg-surface-container px-2.5 py-1 rounded-full text-tertiary font-label-sm text-label-sm font-bold">
                <span className="material-symbols-outlined text-sm">diamond</span>
                <span>{gameState.diamonds}</span>
              </div>
            </div>

            {/* Center Navigation Pills (Desktop only >= 1024px) */}
            <nav className="hidden lg:flex items-center gap-space-sm bg-surface-container-high/80 p-1.5 rounded-full">
              <button
                onClick={() => setActiveScreen('trang-chu')}
                className={`px-space-md py-1.5 rounded-full font-label-lg text-label-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeScreen === 'trang-chu'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                Trang chủ
              </button>
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
              <button
                onClick={() => setActiveScreen('asset-showcase')}
                title="Khám phá thiết kế thị giác và kho asset SVG 3 thế giới mới"
                className={`px-space-md py-1.5 rounded-full font-label-lg text-label-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeScreen === 'asset-showcase'
                    ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white shadow-md'
                    : 'text-purple-900 bg-purple-100/80 hover:bg-purple-200/90 font-bold'
                }`}
              >
                <span className="material-symbols-outlined text-base text-purple-600 group-hover:rotate-12 transition-transform">
                  palette
                </span>
                <span>Asset 3 Màn Mới ✨</span>
              </button>
            </nav>

            {/* Right Quick Screen Switcher, Cloud Sync Badge & Profile Avatar */}
            <div className="flex items-center gap-1.5 sm:gap-space-sm">
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
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed hover:opacity-90 font-label-sm text-label-sm cursor-pointer transition-opacity font-bold shadow-sm"
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
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg sm:text-xl">settings</span>
              </button>
              <button
                onClick={() => setActiveScreen('ho-so')}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden cursor-pointer ring-2 ring-primary/30 bg-surface-container-low p-0.5 flex items-center justify-center"
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
      <main className={isImmersiveGameScreen ? 'w-full h-screen overflow-hidden' : 'w-full pt-16 md:pt-20 pb-24 lg:pb-8 bg-surface flex-1'}>
        {activeScreen === 'trang-chu' && (
          <HomeScreen
            gameState={gameState}
            playerProfile={playerProfile}
            currentUser={currentUser}
            onNavigate={(screen) => setActiveScreen(screen)}
            onStartOrContinueAdventure={handleStartOrContinueAdventure}
            onOpenLabTool={handleOpenLabTool}
            onRequestEnterStomach2D={requestEnterStomach2D}
            onOpenAuthModal={() => {
              setPending2DNavigation(false);
              setIsAuthModalOpen(true);
            }}
          />
        )}

        {activeScreen === 'hanh-trinh' && (
          <JourneyMapScreen
            completedStageIds={gameState.completedStageIds}
            diamonds={gameState.diamonds}
            exp={gameState.exp}
            onCompleteStageQuiz={handleCompleteStageQuiz}
            onNavigateQuests={() => setActiveScreen('nhiem-vu-tuan')}
            onOpenNotebook={() => handleOpenLabTool('notebook')}
            onPlayCutscene={() => setActiveScreen('cutscene')}
            onPlayStage2D={handlePlayStage2D}
            stageProgress={gameState.stageProgress}
            unlockedSpecimens={gameState.unlockedSpecimens}
            unlockedStageIds={gameState.unlockedStageIds}
            onOpenAssetShowcase={() => setActiveScreen('asset-showcase')}
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

        {activeScreen === 'stage-2d' && (
          <Stage2DRunner
            stageId={currentPlayingStageId}
            equippedOutfitId={gameState.equippedOutfitId}
            onExitToMap={() => setActiveScreen('hanh-trinh')}
            onStageVictory={(stageId, expReward, diamondReward) => {
              handleCompleteStageQuiz(stageId, expReward, diamondReward);
            }}
            onOpenNotebook={() => handleOpenLabTool('notebook')}
          />
        )}

        {activeScreen === 'asset-showcase' && (
          <WorldAssetShowcase
            onPlayStage2D={(stageId) => handlePlayStage2D(stageId)}
            onBackToMap={() => setActiveScreen('hanh-trinh')}
          />
        )}
      </main>

      {/* Mobile & Tablet Fixed Bottom Navigation Bar (< 1024px) */}
      {!isImmersiveGameScreen && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-surface/95 backdrop-blur-xl border-t border-surface-container-high/80 shadow-[0_-4px_16px_rgba(49,16,30,0.08)] safe-p-bottom">
          <div className="h-16 px-1.5 sm:px-4 flex items-center justify-around gap-1 max-w-lg mx-auto">
            {/* Tab 1: Trang chủ 2D */}
            <button
              onClick={() => setActiveScreen('trang-chu')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer ${
                activeScreen === 'trang-chu'
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div
                className={`p-1 rounded-full transition-all ${
                  activeScreen === 'trang-chu' ? 'bg-primary-fixed text-on-primary-fixed scale-110 shadow-sm' : ''
                }`}
              >
                <span className="material-symbols-outlined text-xl">cottage</span>
              </div>
              <span className="text-[11px] font-label-sm mt-0.5 whitespace-nowrap">Trang chủ</span>
            </button>

            {/* Tab 2: Hành trình */}
            <button
              onClick={() => setActiveScreen('hanh-trinh')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer ${
                activeScreen === 'hanh-trinh'
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div
                className={`p-1 rounded-full transition-all ${
                  activeScreen === 'hanh-trinh' ? 'bg-primary-fixed text-on-primary-fixed scale-110 shadow-sm' : ''
                }`}
              >
                <span className="material-symbols-outlined text-xl">map</span>
              </div>
              <span className="text-[11px] font-label-sm mt-0.5 whitespace-nowrap">Hành trình</span>
            </button>

            {/* Center Prominent 2D Action Button */}
            <button
              onClick={requestEnterStomach2D}
              title="Vào Chơi Màn 2D Dạ Dày"
              className="flex flex-col items-center justify-center -mt-5 mx-1 group cursor-pointer"
            >
              <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-tertiary to-tertiary-fixed-dim text-on-tertiary-fixed flex items-center justify-center shadow-lg ring-4 ring-surface active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-2xl font-bold animate-pulse">sports_esports</span>
              </div>
              <span className="text-[10px] font-label-sm font-bold text-tertiary mt-0.5">Màn 2D</span>
            </button>

            {/* Tab 3: Nhiệm vụ tuần */}
            <button
              onClick={() => setActiveScreen('nhiem-vu-tuan')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer ${
                activeScreen === 'nhiem-vu-tuan'
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div
                className={`p-1 rounded-full transition-all ${
                  activeScreen === 'nhiem-vu-tuan' ? 'bg-primary-fixed text-on-primary-fixed scale-110 shadow-sm' : ''
                }`}
              >
                <span className="material-symbols-outlined text-xl">calendar_month</span>
              </div>
              <span className="text-[11px] font-label-sm mt-0.5 whitespace-nowrap">Nhiệm vụ</span>
            </button>

            {/* Tab 4: Hồ sơ */}
            <button
              onClick={() => setActiveScreen('ho-so')}
              className={`flex-1 flex flex-col items-center justify-center py-1 rounded-2xl transition-all cursor-pointer ${
                activeScreen === 'ho-so'
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div
                className={`p-1 rounded-full transition-all ${
                  activeScreen === 'ho-so' ? 'bg-primary-fixed text-on-primary-fixed scale-110 shadow-sm' : ''
                }`}
              >
                <span className="material-symbols-outlined text-xl">person</span>
              </div>
              <span className="text-[11px] font-label-sm mt-0.5 whitespace-nowrap">Hồ sơ</span>
            </button>
          </div>
        </nav>
      )}

      {/* Standard Footer for Hub Screens */}
      {!isImmersiveGameScreen && (
        <footer className="w-full bg-surface-container-low py-space-lg mb-20 lg:mb-0">
          <div className="w-full px-4 sm:px-6 md:px-margin flex flex-col md:flex-row items-center justify-between gap-space-sm text-center md:text-left">
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
            setCurrentPlayingStageId(pendingStageToPlay);
            setActiveScreen('stage-2d');
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
            setCurrentPlayingStageId(pendingStageToPlay);
            setActiveScreen('stage-2d');
          }
        }}
      />
    </div>
  );
}
