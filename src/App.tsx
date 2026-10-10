/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { IMAGES } from './data/biologyData';
import { JourneyMapScreen } from './components/JourneyMapScreen';
import { StoryCutsceneScreen } from './components/StoryCutsceneScreen';
import { StomachStageScreen } from './components/StomachStageScreen';
import { WeeklyQuestsScreen } from './components/WeeklyQuestsScreen';
import {
  LabToolModal,
  ProfileScreen,
  WardrobeScreen,
} from './components/WardrobeAndProfileScreens';

export type ScreenMode =
  | 'hanh-trinh'
  | 'nhiem-vu-tuan'
  | 'trang-phuc'
  | 'ho-so'
  | 'cutscene'
  | 'stomach-2d';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenMode>('hanh-trinh');
  const [diamonds, setDiamonds] = useState<number>(420);
  const [exp, setExp] = useState<number>(2370);
  const [equippedOutfitId, setEquippedOutfitId] = useState<string>('blouse-bac-si');
  const [activeLabTool, setActiveLabTool] = useState<
    'microscope' | 'stain' | 'notebook' | null
  >(null);

  const handleRewardEarned = (addedExp: number, addedDiamonds: number) => {
    setExp((prev) => prev + addedExp);
    setDiamonds((prev) => prev + addedDiamonds);
  };

  const handleBuyOutfit = (_id: string, price: number) => {
    setDiamonds((prev) => Math.max(0, prev - price));
  };

  const isImmersiveGameScreen = activeScreen === 'cutscene' || activeScreen === 'stomach-2d';

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
                    Nhà Thám Hiểm
                  </span>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-sm text-label-sm text-primary">Cấp 12</span>
                    <div className="w-24 h-2 bg-secondary-container rounded-full overflow-hidden">
                      <div
                        className="bg-tertiary-fixed-dim h-full rounded-full"
                        style={{ width: '68%' }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-surface-container px-space-sm py-0.5 rounded-full text-tertiary font-label-md text-label-md">
                  <span className="material-symbols-outlined text-base">diamond</span>
                  <span>{diamonds}</span>
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

            {/* Right Quick Screen Switcher & Profile Avatar */}
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
                onClick={() => setActiveScreen('stomach-2d')}
                title="Vào Màn chơi Thử thách 2D"
                className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed hover:opacity-90 font-label-sm text-label-sm cursor-pointer transition-opacity"
              >
                <span className="material-symbols-outlined text-base">sports_esports</span>
                <span>Màn 2D Dạ Dày</span>
              </button>
              <button
                onClick={() => setActiveLabTool('notebook')}
                title="Cài đặt & Sổ tay Sinh học"
                className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">settings</span>
              </button>
              <button
                onClick={() => setActiveScreen('ho-so')}
                className="w-8 h-8 rounded-full overflow-hidden cursor-pointer ring-2 ring-primary/30"
              >
                <img
                  alt="Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  src={IMAGES.potabiAvatar}
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
            diamonds={diamonds}
            exp={exp}
            onNavigateQuests={() => setActiveScreen('nhiem-vu-tuan')}
            onOpenNotebook={() => setActiveLabTool('notebook')}
            onPlayCutscene={() => setActiveScreen('cutscene')}
            onPlayStage2D={() => setActiveScreen('stomach-2d')}
          />
        )}

        {activeScreen === 'nhiem-vu-tuan' && (
          <WeeklyQuestsScreen
            onClaimReward={handleRewardEarned}
            onOpenNotebook={() => setActiveLabTool('notebook')}
          />
        )}

        {activeScreen === 'trang-phuc' && (
          <WardrobeScreen
            diamonds={diamonds}
            equippedOutfitId={equippedOutfitId}
            onBuyOutfit={handleBuyOutfit}
            onEquipOutfit={setEquippedOutfitId}
          />
        )}

        {activeScreen === 'ho-so' && (
          <ProfileScreen
            diamonds={diamonds}
            exp={exp}
            onOpenNotebook={() => setActiveLabTool('notebook')}
          />
        )}

        {activeScreen === 'cutscene' && (
          <StoryCutsceneScreen
            onContinueToLab={() => setActiveScreen('stomach-2d')}
            onExitToMap={() => setActiveScreen('hanh-trinh')}
            onOpenMicroscope={() => setActiveLabTool('microscope')}
            onOpenNotebook={() => setActiveLabTool('notebook')}
            onOpenStain={() => setActiveLabTool('stain')}
          />
        )}

        {activeScreen === 'stomach-2d' && (
          <StomachStageScreen
            onExitToMap={() => setActiveScreen('hanh-trinh')}
            onOpenMicroscope={() => setActiveLabTool('microscope')}
            onOpenNotebook={() => setActiveLabTool('notebook')}
            onOpenStain={() => setActiveLabTool('stain')}
            onRewardEarned={handleRewardEarned}
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
      <LabToolModal activeTool={activeLabTool} onClose={() => setActiveLabTool(null)} />
    </div>
  );
}
