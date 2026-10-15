/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TopDownHUD.tsx
 * Top-Down Adventure HUD & Responsive Touch Controls
 * Displays active quests, chamber badges, pause menu, and on-screen 4-way D-Pad.
 */

import React, { useState } from 'react';
import { HeartChamberZone, TopDownQuest } from './TopDownTypes';

interface TopDownHUDProps {
  stageName: string;
  organBadge: string;
  currentChamber: HeartChamberZone | null;
  quests: TopDownQuest[];
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  onOpenNotebook: () => void;
  onPause: () => void;
  toastMessage: string | null;
  nearbyInteractableLabel: string | null;
  onInteract: () => void;
  onDirectionInputStart: (dir: 'up' | 'down' | 'left' | 'right') => void;
  onDirectionInputEnd: (dir: 'up' | 'down' | 'left' | 'right') => void;
}

export const TopDownHUD: React.FC<TopDownHUDProps> = ({
  stageName,
  organBadge,
  currentChamber,
  quests,
  isAudioMuted,
  onToggleAudio,
  onOpenNotebook,
  onPause,
  toastMessage,
  nearbyInteractableLabel,
  onInteract,
  onDirectionInputStart,
  onDirectionInputEnd,
}) => {
  const [showQuestDrawer, setShowQuestDrawer] = useState<boolean>(false);

  const completedQuestsCount = quests.filter((q) => q.isCompleted).length;

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden select-none">
      {/* ============================================================== */}
      {/* TOP HEADER: CHAMBER BADGE & UTILITY BUTTONS                   */}
      {/* ============================================================== */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
        {/* Left: Pause + Chamber Badge */}
        <div className="flex items-center gap-2.5 bg-surface/90 backdrop-blur-md px-3.5 sm:px-4 py-2 rounded-2xl shadow-xl border border-white/20 pointer-events-auto">
          <button
            onClick={onPause}
            className="w-9 h-9 rounded-xl bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-on-surface cursor-pointer"
            title="Tạm dừng [Esc]"
          >
            <span className="material-symbols-outlined text-xl">pause</span>
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                {organBadge}
              </span>
              <span className="text-[10px] text-on-surface-variant font-medium">
                • {currentChamber ? currentChamber.name : 'Trung Tâm Tim'}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-on-surface truncate max-w-[170px] sm:max-w-none">
              {stageName}
            </span>
          </div>
        </div>

        {/* Right: Quest Checklist Button + Notebook + Audio Toggle */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Quest Tracker Button */}
          <button
            onClick={() => setShowQuestDrawer((prev) => !prev)}
            className="bg-surface/90 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-2xl shadow-xl border border-white/20 flex items-center gap-2 text-xs font-bold text-on-surface hover:bg-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-amber-500 text-lg">
              checklist
            </span>
            <span>
              Nhiệm vụ: {completedQuestsCount}/{quests.length}
            </span>
            <span className="material-symbols-outlined text-xs">
              {showQuestDrawer ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {/* Sổ tay sinh học */}
          <button
            onClick={onOpenNotebook}
            className="w-10 h-10 rounded-2xl bg-surface/90 backdrop-blur-md text-primary hover:bg-surface flex items-center justify-center shadow-xl border border-white/20 cursor-pointer"
            title="Sổ tay sinh học"
          >
            <span className="material-symbols-outlined text-xl">menu_book</span>
          </button>

          {/* Âm thanh */}
          <button
            onClick={onToggleAudio}
            className="w-10 h-10 rounded-2xl bg-surface/90 backdrop-blur-md text-on-surface hover:bg-surface flex items-center justify-center shadow-xl border border-white/20 cursor-pointer"
            title="Bật/Tắt âm thanh"
          >
            <span className="material-symbols-outlined text-xl">
              {isAudioMuted ? 'volume_off' : 'volume_up'}
            </span>
          </button>
        </div>
      </div>

      {/* Quest Drawer Dropdown */}
      {showQuestDrawer && (
        <div className="absolute top-18 right-3 z-50 w-80 max-w-[90vw] bg-surface-container-lowest/95 backdrop-blur-xl border-2 border-primary/40 rounded-3xl p-4 shadow-2xl pointer-events-auto flex flex-col gap-3 animate-scale-up">
          <div className="flex items-center justify-between border-b border-surface-container-high pb-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">task_alt</span>
              DANH SÁCH NHIỆM VỤ SINH HỌC
            </span>
            <button
              onClick={() => setShowQuestDrawer(false)}
              className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-xs text-on-surface cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
            {quests.map((q) => (
              <div
                key={q.id}
                className={`p-3 rounded-2xl border text-xs flex flex-col gap-1 transition-all ${
                  q.isCompleted
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-surface-container-low border-surface-container-high text-on-surface'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{q.title}</span>
                  {q.isCompleted ? (
                    <span className="material-symbols-outlined text-base text-emerald-600">
                      check_circle
                    </span>
                  ) : q.targetCount ? (
                    <span className="font-bold text-primary">
                      {q.currentCount}/{q.targetCount} O₂
                    </span>
                  ) : (
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                      Đang làm
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-on-surface-variant">{q.description}</p>
                <span className="text-[10px] font-bold text-amber-600 self-end">
                  Thưởng: +{q.expReward} EXP
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating System Toast */}
      {toastMessage && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-amber-950 px-5 py-2.5 rounded-2xl shadow-2xl font-bold text-xs sm:text-sm flex items-center gap-2 border-2 border-white animate-bounce pointer-events-none">
          <span className="material-symbols-outlined text-base">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* MOBILE TOUCH 4-WAY D-PAD & CONTEXT ACTION BUTTON               */}
      {/* ============================================================== */}
      <div className="absolute bottom-6 left-4 right-4 flex items-end justify-between pointer-events-none md:hidden">
        {/* Virtual 4-Way D-Pad on Left */}
        <div className="relative w-36 h-36 pointer-events-auto">
          {/* UP Button */}
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              onDirectionInputStart('up');
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              onDirectionInputEnd('up');
            }}
            onPointerCancel={() => onDirectionInputEnd('up')}
            className="absolute top-0 left-12 w-12 h-12 rounded-xl bg-surface/90 backdrop-blur-md active:bg-primary active:text-white flex items-center justify-center text-2xl font-bold text-on-surface shadow-xl border-2 border-white/40 cursor-pointer select-none"
          >
            ▲
          </button>

          {/* DOWN Button */}
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              onDirectionInputStart('down');
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              onDirectionInputEnd('down');
            }}
            onPointerCancel={() => onDirectionInputEnd('down')}
            className="absolute bottom-0 left-12 w-12 h-12 rounded-xl bg-surface/90 backdrop-blur-md active:bg-primary active:text-white flex items-center justify-center text-2xl font-bold text-on-surface shadow-xl border-2 border-white/40 cursor-pointer select-none"
          >
            ▼
          </button>

          {/* LEFT Button */}
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              onDirectionInputStart('left');
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              onDirectionInputEnd('left');
            }}
            onPointerCancel={() => onDirectionInputEnd('left')}
            className="absolute top-12 left-0 w-12 h-12 rounded-xl bg-surface/90 backdrop-blur-md active:bg-primary active:text-white flex items-center justify-center text-2xl font-bold text-on-surface shadow-xl border-2 border-white/40 cursor-pointer select-none"
          >
            ◀
          </button>

          {/* RIGHT Button */}
          <button
            onPointerDown={(e) => {
              e.preventDefault();
              onDirectionInputStart('right');
            }}
            onPointerUp={(e) => {
              e.preventDefault();
              onDirectionInputEnd('right');
            }}
            onPointerCancel={() => onDirectionInputEnd('right')}
            className="absolute top-12 right-0 w-12 h-12 rounded-xl bg-surface/90 backdrop-blur-md active:bg-primary active:text-white flex items-center justify-center text-2xl font-bold text-on-surface shadow-xl border-2 border-white/40 cursor-pointer select-none"
          >
            ▶
          </button>

          {/* Center decorative hub */}
          <div className="absolute top-12 left-12 w-12 h-12 rounded-lg bg-surface-container-high/60 flex items-center justify-center pointer-events-none">
            <span className="w-4 h-4 rounded-full bg-primary/40" />
          </div>
        </div>

        {/* Action Button on Right */}
        <div className="pointer-events-auto">
          {nearbyInteractableLabel ? (
            <button
              onClick={onInteract}
              className="h-16 px-6 rounded-3xl bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 font-bold text-sm shadow-2xl border-3 border-white flex items-center gap-2 animate-bounce cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">touch_app</span>
              <span>{nearbyInteractableLabel} [E]</span>
            </button>
          ) : (
            <div className="h-14 px-4 rounded-2xl bg-black/40 text-white/40 text-xs font-semibold flex items-center border border-white/10">
              Đến gần để tương tác
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
