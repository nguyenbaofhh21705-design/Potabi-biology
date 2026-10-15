/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ExplorationWorldRenderer.tsx
 * Pure SVG + CSS Multi-layer Biological Environment Renderer
 * Completely independent of external images.
 * Bio Blossom Tactile Style: Organic curves, pastel gradients, rhythmic gentle animations.
 */

import React from 'react';
import { ExplorationStageConfig, InteractableEntity } from './ExplorationTypes';

interface ExplorationWorldRendererProps {
  config: ExplorationStageConfig;
  cameraX: number; // percentage in world coords
  completedPuzzles: string[];
  activeNearbyEntityId: string | null;
  onInteractWithEntity: (entity: InteractableEntity) => void;
}

export const ExplorationWorldRenderer: React.FC<ExplorationWorldRendererProps> = ({
  config,
  cameraX,
  completedPuzzles,
  activeNearbyEntityId,
  onInteractWithEntity,
}) => {
  const isCirculatory = config.id === 'tuan-hoan';

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none">
      {/* ================================================================= */}
      {/* PARALLAX LAYER 1: FAR BACKGROUND (Distant Chamber Silhouettes)   */}
      {/* ================================================================= */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-75 ease-out will-change-transform"
        style={{
          transform: `translateX(-${cameraX * 0.18}%)`,
          width: `${config.worldWidthPercent * 0.6 + 100}%`,
        }}
      >
        {isCirculatory ? (
          <CirculatoryFarBackgroundSVG />
        ) : (
          <GenericFarBackgroundSVG stageId={config.id} />
        )}
      </div>

      {/* ================================================================= */}
      {/* PARALLAX LAYER 2: MIDGROUND (Capillaries & Organic Tissues)       */}
      {/* ================================================================= */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-75 ease-out will-change-transform"
        style={{
          transform: `translateX(-${cameraX * 0.45}%)`,
          width: `${config.worldWidthPercent * 0.75 + 100}%`,
        }}
      >
        {isCirculatory ? (
          <CirculatoryMidgroundSVG />
        ) : (
          <GenericMidgroundSVG stageId={config.id} />
        )}
      </div>

      {/* ================================================================= */}
      {/* LAYER 3: MAIN EXPLORATION PATHWAY & INTERACTABLE ENTITIES (1.0x)  */}
      {/* ================================================================= */}
      <div
        className="absolute inset-0 h-full pointer-events-auto transition-transform duration-75 ease-out will-change-transform"
        style={{
          transform: `translateX(-${cameraX}%)`,
          width: `${config.worldWidthPercent}%`,
        }}
      >
        {/* Anatomical Walking Floor (Endocardium & Vascular Endothelium) */}
        {isCirculatory ? (
          <CirculatoryPathwayFloorSVG walkingGroundY={config.walkingGroundY} />
        ) : (
          <GenericPathwayFloorSVG walkingGroundY={config.walkingGroundY} stageId={config.id} />
        )}

        {/* Anatomical Zone Markers on Ground */}
        {config.zones.map((zone) => (
          <div
            key={zone.id}
            className="absolute top-[28%] -translate-x-1/2 flex flex-col items-center pointer-events-none"
            style={{ left: `${(zone.startX + zone.endX) / 2}%` }}
          >
            <div className="bg-surface/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-primary/30 shadow-lg flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-bold text-primary whitespace-nowrap">
                {zone.name}
              </span>
            </div>
            <span className="text-[10px] text-on-surface-variant font-medium mt-1 bg-surface-container/70 px-2.5 py-0.5 rounded-md backdrop-blur-xs">
              {zone.subtitle}
            </span>
          </div>
        ))}

        {/* Interactable Entities, Puzzles & NPCs */}
        {config.interactables.map((entity) => {
          const isNearby = activeNearbyEntityId === entity.id;
          const isDone = completedPuzzles.includes(entity.id);

          return (
            <div
              key={entity.id}
              onClick={() => onInteractWithEntity(entity)}
              className={`absolute -translate-x-1/2 -translate-y-full cursor-pointer group flex flex-col items-center transition-all ${
                isNearby ? 'scale-110 z-30' : 'hover:scale-105 z-20'
              }`}
              style={{
                left: `${entity.x}%`,
                top: `${entity.y}%`,
              }}
            >
              {/* Proximity / Interaction Floating Prompt */}
              {isNearby && (
                <div className="mb-2 px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-[11px] font-bold shadow-xl border-2 border-white flex items-center gap-1.5 animate-bounce whitespace-nowrap">
                  <span className="material-symbols-outlined text-sm font-bold">touch_app</span>
                  <span>[E] {entity.label}</span>
                </div>
              )}

              {/* Entity Body Representation */}
              {renderEntityGraphic(entity, isDone, isNearby)}

              {/* Entity Base Label */}
              <div className="mt-1 px-2.5 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-[10px] font-bold text-white border border-white/20 whitespace-nowrap flex items-center gap-1 shadow-md">
                {isDone ? (
                  <span className="material-symbols-outlined text-xs text-emerald-400">
                    check_circle
                  </span>
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                )}
                <span>{entity.name}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================================================================= */}
      {/* PARALLAX LAYER 4: FOREGROUND OVERLAY (Floating Shimmer & Arches)   */}
      {/* ================================================================= */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none transition-transform duration-75 ease-out will-change-transform z-20"
        style={{
          transform: `translateX(-${cameraX * 1.25}%)`,
          width: `${config.worldWidthPercent * 0.9 + 100}%`,
        }}
      >
        <CirculatoryForegroundSVG />
      </div>
    </div>
  );
};

/* ========================================================================= */
/* ENTITY GRAPHIC RENDERING HELPER                                           */
/* ========================================================================= */
function renderEntityGraphic(
  entity: InteractableEntity,
  isDone: boolean,
  isNearby: boolean
) {
  // Goal Portal (Cổng Động Mạch Chủ / Về Đích)
  if (entity.type === 'goal') {
    return (
      <div className="relative flex flex-col items-center">
        <div
          className={`w-24 h-32 rounded-t-full transition-all duration-500 flex flex-col items-center justify-center p-2 border-4 ${
            isDone
              ? 'bg-gradient-to-t from-emerald-600 via-teal-500 to-amber-300 border-white shadow-[0_0_50px_rgba(16,185,129,0.8)] ring-8 ring-emerald-300/60 animate-pulse'
              : 'bg-gradient-to-t from-amber-600 via-rose-500 to-amber-400 border-amber-200 shadow-[0_0_35px_rgba(245,158,11,0.6)] ring-4 ring-amber-300/40'
          }`}
        >
          <span className="material-symbols-outlined text-4xl text-white animate-spin-slow">
            {entity.icon || 'door_open'}
          </span>
          <span className="text-[10px] font-bold text-white text-center mt-1">
            {isDone ? 'CỔNG ĐÃ MỞ' : 'CỔNG ĐÍCH'}
          </span>
        </div>
      </div>
    );
  }

  // NPC (Dr. Erythro & Specialist Cells)
  if (entity.type === 'npc') {
    return (
      <div className="relative flex flex-col items-center">
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl border-2 transition-transform duration-300 ${
            isDone
              ? 'bg-emerald-500 border-white text-white'
              : isNearby
              ? 'bg-primary border-white text-white scale-110 ring-4 ring-primary-fixed'
              : 'bg-surface-container-highest border-primary/50 text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-3xl">
            {entity.icon || 'school'}
          </span>
        </div>
      </div>
    );
  }

  // Oxygen Delivery Puzzle
  if (entity.puzzleId === 'oxygen-load') {
    return (
      <div className="relative flex items-center justify-center">
        <div
          className={`w-16 h-16 rounded-full transition-all duration-500 flex items-center justify-center border-3 ${
            isDone
              ? 'bg-gradient-to-tr from-rose-500 to-red-600 border-white shadow-[0_0_25px_rgba(239,68,68,0.7)]'
              : 'bg-gradient-to-tr from-rose-950 to-rose-800 border-rose-400 shadow-lg animate-pulse'
          }`}
        >
          <span className="material-symbols-outlined text-2xl text-white">
            bubble_chart
          </span>
        </div>
        {!isDone && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-400 text-cyan-950 font-bold text-[9px] flex items-center justify-center shadow-md animate-bounce">
            O₂
          </span>
        )}
      </div>
    );
  }

  // Valve Timing Puzzle
  if (entity.puzzleId === 'valve-timing') {
    return (
      <div className="relative flex items-center justify-center">
        <div
          className={`w-14 h-16 rounded-xl transition-all duration-300 flex flex-col items-center justify-center border-2 shadow-lg ${
            isDone
              ? 'bg-emerald-600 border-white text-white'
              : 'bg-gradient-to-tr from-rose-700 to-amber-600 border-amber-300 text-white'
          }`}
        >
          <span className="material-symbols-outlined text-2xl animate-pulse">
            valve
          </span>
          <span className="text-[9px] font-bold">1 CHIỀU</span>
        </div>
      </div>
    );
  }

  // Blood Flow Route Puzzle
  if (entity.puzzleId === 'blood-flow') {
    return (
      <div className="relative flex items-center justify-center">
        <div
          className={`w-16 h-16 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center border-3 shadow-xl ${
            isDone
              ? 'bg-emerald-600 border-white text-white'
              : 'bg-gradient-to-tr from-sky-600 to-indigo-600 border-sky-300 text-white'
          }`}
        >
          <span className="material-symbols-outlined text-3xl">alt_route</span>
        </div>
      </div>
    );
  }

  // Default puzzle or specimen
  return (
    <div className="relative flex items-center justify-center">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border-2 transition-transform ${
          isDone
            ? 'bg-emerald-500 border-white text-white'
            : 'bg-primary border-primary-fixed text-white'
        }`}
      >
        <span className="material-symbols-outlined text-2xl">{entity.icon}</span>
      </div>
    </div>
  );
}

/* ========================================================================= */
/* SVG SUITE: HỆ TUẦN HOÀN (BUỒNG TIM & DÒNG MÁU)                            */
/* ========================================================================= */

/** Parallax Layer 1: Cardiac Chambers & Muscle Architecture */
const CirculatoryFarBackgroundSVG: React.FC = () => (
  <svg
    viewBox="0 0 2400 700"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="circBgGradFar" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2b0312" />
        <stop offset="30%" stopColor="#4c0519" />
        <stop offset="60%" stopColor="#881337" />
        <stop offset="100%" stopColor="#1e1022" />
      </linearGradient>

      <radialGradient id="ventricleAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.3" />
        <stop offset="70%" stopColor="#be123c" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#4c0519" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Background Base Fill */}
    <rect width="2400" height="700" fill="url(#circBgGradFar)" />

    {/* Ambient Heart Chamber Glow Orbs */}
    <circle cx="450" cy="300" r="280" fill="url(#ventricleAura)" />
    <circle cx="1150" cy="280" r="320" fill="url(#ventricleAura)" />
    <circle cx="1850" cy="320" r="350" fill="url(#ventricleAura)" />

    {/* Distant muscular arches (Trabeculae) */}
    <path
      d="M0,520 C350,380 650,490 950,420 C1250,350 1600,480 1950,410 C2200,360 2350,390 2400,420 L2400,700 L0,700 Z"
      fill="#4c0519"
      opacity="0.7"
    />

    {/* Grand Aorta Arch Curve */}
    <path
      d="M1600,440 C1680,180 1950,150 2060,420"
      stroke="#fda4af"
      strokeWidth="48"
      strokeLinecap="round"
      strokeOpacity="0.25"
      fill="none"
    />
    <path
      d="M1650,450 C1720,230 1910,200 2010,430"
      stroke="#f43f5e"
      strokeWidth="24"
      strokeLinecap="round"
      strokeOpacity="0.35"
      fill="none"
    />
  </svg>
);

/** Parallax Layer 2: Coronary Capillary Web & Flowing Erythrocyte Silhouettes */
const CirculatoryMidgroundSVG: React.FC = () => (
  <svg
    viewBox="0 0 2400 700"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="plasmaMidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#e11d48" stopOpacity="0.25" />
        <stop offset="40%" stopColor="#0284c7" stopOpacity="0.3" />
        <stop offset="70%" stopColor="#fb7185" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#e11d48" stopOpacity="0.3" />
      </linearGradient>
    </defs>

    {/* Flowing Plasma Wave Ribbon */}
    <path
      d="M0,320 C400,280 800,360 1200,310 C1600,260 2000,340 2400,290 L2400,420 C2000,460 1600,380 1200,430 C800,480 400,400 0,440 Z"
      fill="url(#plasmaMidGrad)"
    />

    {/* Capillary Branches */}
    <g stroke="#fca5a5" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.3" fill="none">
      <path d="M200,340 Q350,220 500,280 T800,240" />
      <path d="M1000,320 Q1200,200 1400,260 T1700,210" />
      <path d="M1750,300 Q1950,180 2150,240 T2350,220" />
    </g>

    {/* Floating Blood Cell Disc Silhouettes */}
    <circle cx="320" cy="260" r="14" fill="#e11d48" opacity="0.4" />
    <circle cx="580" cy="360" r="18" fill="#e11d48" opacity="0.35" />
    <circle cx="940" cy="220" r="16" fill="#0284c7" opacity="0.35" />
    <circle cx="1380" cy="250" r="15" fill="#f43f5e" opacity="0.45" />
    <circle cx="1720" cy="340" r="20" fill="#f43f5e" opacity="0.4" />
    <circle cx="2140" cy="270" r="16" fill="#e11d48" opacity="0.45" />
  </svg>
);

/** Layer 3 Floor: Biological Endothelium Pathway */
const CirculatoryPathwayFloorSVG: React.FC<{ walkingGroundY: number }> = ({
  walkingGroundY,
}) => (
  <div
    className="absolute left-0 right-0 bottom-0 pointer-events-none"
    style={{ top: `${walkingGroundY}%` }}
  >
    <svg
      viewBox="0 0 2400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="circFloorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9f1239" />
          <stop offset="30%" stopColor="#881337" />
          <stop offset="70%" stopColor="#4c0519" />
          <stop offset="100%" stopColor="#1e050f" />
        </linearGradient>

        <linearGradient id="floorTrimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="30%" stopColor="#38bdf8" />
          <stop offset="70%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>

      {/* Main Floor Body */}
      <path
        d="M0,15 C400,5 800,25 1200,12 C1600,0 2000,20 2400,10 L2400,300 L0,300 Z"
        fill="url(#circFloorGrad)"
      />

      {/* Soft Luminescent Endothelial Rim */}
      <path
        d="M0,15 C400,5 800,25 1200,12 C1600,0 2000,20 2400,10"
        stroke="url(#floorTrimGrad)"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
      />

      {/* Rhythmic Endothelial Cell Pattern Accents */}
      {Array.from({ length: 24 }).map((_, i) => (
        <ellipse
          key={i}
          cx={i * 100 + 40}
          cy={25 + (i % 2) * 8}
          rx="22"
          ry="6"
          fill="#fda4af"
          opacity="0.3"
        />
      ))}
    </svg>
  </div>
);

/** Parallax Layer 4: Foreground Plasma & Vascular Arch Borders */
const CirculatoryForegroundSVG: React.FC = () => (
  <svg
    viewBox="0 0 2400 700"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
    preserveAspectRatio="none"
  >
    {/* Top Vascular Border Arch */}
    <path
      d="M0,0 L2400,0 L2400,50 C1900,110 1400,35 900,90 C500,45 200,80 0,40 Z"
      fill="#2b0312"
      opacity="0.65"
    />

    {/* Floating foreground plasma sparkles */}
    <circle cx="280" cy="180" r="8" fill="#fda4af" opacity="0.4" />
    <circle cx="750" cy="120" r="10" fill="#38bdf8" opacity="0.4" />
    <circle cx="1320" cy="160" r="9" fill="#fda4af" opacity="0.4" />
    <circle cx="1980" cy="140" r="11" fill="#fbbf24" opacity="0.4" />
  </svg>
);

/* ========================================================================= */
/* SVG SUITE: GENERIC ORGAN WORLDS (TIÊU HÓA, HÔ HẤP, THẦN KINH, V.V.)       */
/* ========================================================================= */

const GenericFarBackgroundSVG: React.FC<{ stageId: string }> = ({ stageId }) => {
  // Pastel/tactile palette based on stage
  const bgColors: Record<string, [string, string, string]> = {
    'tieu-hoa': ['#4a044e', '#701a75', '#831843'],
    'ho-hap': ['#082f49', '#0369a1', '#075985'],
    'than-kinh': ['#1e1b4b', '#312e81', '#3730a3'],
    'van-dong': ['#451a03', '#78350f', '#92400e'],
    'bai-tiet': ['#1e1b4b', '#1e3a8a', '#172554'],
    'noi-tiet': ['#064e3b', '#065f46', '#047857'],
    'sinh-duc': ['#4c0519', '#831843', '#500724'],
  };

  const colors = bgColors[stageId] || ['#1e1022', '#3f1a35', '#572242'];

  return (
    <svg viewBox="0 0 2400 700" fill="none" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`genBgFar_${stageId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colors[0]} />
          <stop offset="50%" stopColor={colors[1]} />
          <stop offset="100%" stopColor={colors[2]} />
        </linearGradient>
      </defs>
      <rect width="2400" height="700" fill={`url(#genBgFar_${stageId})`} />
      <path
        d="M0,520 C400,420 800,500 1200,440 C1600,380 2000,480 2400,430 L2400,700 L0,700 Z"
        fill={colors[0]}
        opacity="0.6"
      />
    </svg>
  );
};

const GenericMidgroundSVG: React.FC<{ stageId: string }> = ({ stageId }) => (
  <svg viewBox="0 0 2400 700" fill="none" className="w-full h-full" preserveAspectRatio="none">
    <path
      d="M0,360 C500,300 1000,400 1500,340 C2000,280 2300,350 2400,320 L2400,450 C2000,480 1500,400 1000,460 C500,500 200,420 0,440 Z"
      fill="#ffffff"
      opacity="0.08"
    />
  </svg>
);

const GenericPathwayFloorSVG: React.FC<{ walkingGroundY: number; stageId: string }> = ({
  walkingGroundY,
  stageId,
}) => (
  <div
    className="absolute left-0 right-0 bottom-0 pointer-events-none"
    style={{ top: `${walkingGroundY}%` }}
  >
    <svg viewBox="0 0 2400 300" fill="none" className="w-full h-full" preserveAspectRatio="none">
      <path
        d="M0,15 C400,5 800,25 1200,12 C1600,0 2000,20 2400,10 L2400,300 L0,300 Z"
        fill="#1e1022"
      />
      <path
        d="M0,15 C400,5 800,25 1200,12 C1600,0 2000,20 2400,10"
        stroke="#f472b6"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  </div>
);
