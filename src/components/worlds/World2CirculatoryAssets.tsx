/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * WORLD 2: CIRCULATORY SYSTEM (HỆ TUẦN HOÀN - BUỒNG TIM & DÒNG MÁU)
 * Bio Blossom Tactile 2D Game Assets & SVG Definitions
 * Palette: Crimson, Rose, Soft Coral, Carmine, Oxygen Azure, Golden Amber
 */

import React from 'react';

export interface LayerProps {
  className?: string;
  style?: React.CSSProperties;
  opacity?: number;
}

// ============================================================================
// 1. PARALLAX LAYERS (BACKGROUND & FOREGROUND)
// ============================================================================

/** Layer 1: Distant Heart Muscle Wall Silhouettes & Great Vessel Arches */
export const CirculatoryBackgroundDistant: React.FC<LayerProps> = ({
  className = '',
  style = {},
  opacity = 0.55,
}) => (
  <svg
    viewBox="0 0 1920 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full select-none pointer-events-none ${className}`}
    style={{ opacity, ...style }}
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="cvDistWallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4c0519" stopOpacity="0.8" />
        <stop offset="40%" stopColor="#881337" stopOpacity="0.65" />
        <stop offset="80%" stopColor="#be123c" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.85" />
      </linearGradient>

      <radialGradient id="cvChamberGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fb7185" stopOpacity="0.35" />
        <stop offset="70%" stopColor="#e11d48" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#4c0519" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Cardiac chamber muscular ridges (Trabeculae carneae) */}
    <path
      d="M0,480 C240,360 480,440 760,380 C1040,320 1320,400 1600,340 C1760,310 1860,330 1920,350 L1920,600 L0,600 Z"
      fill="url(#cvDistWallGrad)"
    />

    {/* Distant heart chamber ambient glow spheres */}
    <circle cx="340" cy="280" r="170" fill="url(#cvChamberGlow)" />
    <circle cx="980" cy="220" r="220" fill="url(#cvChamberGlow)" />
    <circle cx="1620" cy="260" r="180" fill="url(#cvChamberGlow)" />

    {/* Distant Aorta Arch curves */}
    <path
      d="M1200,350 C1260,140 1480,120 1560,320"
      stroke="#fda4af"
      strokeWidth="28"
      strokeLinecap="round"
      strokeOpacity="0.3"
      fill="none"
    />
    <path
      d="M1240,360 C1290,180 1450,160 1520,330"
      stroke="#f43f5e"
      strokeWidth="14"
      strokeLinecap="round"
      strokeOpacity="0.4"
      fill="none"
    />
  </svg>
);

/** Layer 2: Mid-ground Coronary Capillaries, Valve Rims & Plasma Streams */
export const CirculatoryBackgroundMid: React.FC<LayerProps> = ({
  className = '',
  style = {},
  opacity = 0.75,
}) => (
  <svg
    viewBox="0 0 1920 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full select-none pointer-events-none ${className}`}
    style={{ opacity, ...style }}
    preserveAspectRatio="none"
  >
    <defs>
      <linearGradient id="cvStreamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#e11d48" stopOpacity="0.35" />
        <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.45" />
        <stop offset="70%" stopColor="#fb7185" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#e11d48" stopOpacity="0.35" />
      </linearGradient>

      <radialGradient id="cvRbcGrad" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#ff8a9e" />
        <stop offset="55%" stopColor="#e11d48" />
        <stop offset="100%" stopColor="#881337" />
      </radialGradient>
    </defs>

    {/* Flowing Blood Plasma Stream Wave */}
    <path
      d="M -60,390 C 200,450 360,250 580,280 C 800,310 920,490 1140,460 C 1360,430 1500,260 1720,290 C 1840,310 1920,380 2000,360"
      stroke="url(#cvStreamGrad)"
      strokeWidth="42"
      strokeLinecap="round"
      fill="none"
    />

    {/* Ascending Left Plasma Channel (From User Artwork) */}
    <path
      d="M 60,600 C 70,400 90,200 130,0"
      stroke="#ec4899"
      strokeWidth="56"
      strokeOpacity="0.45"
      fill="none"
    />
    <path
      d="M 60,600 C 70,400 90,200 130,0"
      stroke="#fdf2f8"
      strokeWidth="12"
      strokeDasharray="16 28"
      strokeOpacity="0.7"
      fill="none"
    />

    {/* Central Heart Chambers Internal Glow with ECG Waves (From User Artwork) */}
    <g transform="translate(760, 180)">
      {/* Right Ventricle Chamber ECG */}
      <rect x="0" y="0" width="160" height="120" rx="40" fill="#9f1239" fillOpacity="0.4" stroke="#f43f5e" strokeWidth="3" />
      <path
        d="M 15,60 L 50,60 L 60,25 L 70,95 L 80,10 L 90,75 L 100,60 L 145,60"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-pulse"
      />
      {/* Left Ventricle Chamber ECG */}
      <rect x="180" y="0" width="180" height="130" rx="45" fill="#881337" fillOpacity="0.5" stroke="#fb7185" strokeWidth="3.5" />
      <path
        d="M 195,65 L 235,65 L 245,20 L 255,105 L 265,5 L 278,85 L 290,65 L 345,65"
        fill="none"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-pulse"
      />
    </g>

    {/* Inner fluid pulse dash stream */}
    <path
      d="M -60,390 C 200,450 360,250 580,280 C 800,310 920,490 1140,460 C 1360,430 1500,260 1720,290 C 1840,310 1920,380 2000,360"
      stroke="#ffe4e6"
      strokeWidth="10"
      strokeDasharray="28 36"
      strokeLinecap="round"
      strokeOpacity="0.75"
      fill="none"
    />

    {/* Midground drifting biconcave Red Blood Cells */}
    {[
      { x: 180, y: 220, r: 24, rot: 15 },
      { x: 420, y: 340, r: 28, rot: -25 },
      { x: 620, y: 210, r: 26, rot: 30 },
      { x: 740, y: 240, r: 32, rot: 35 },
      { x: 1060, y: 360, r: 26, rot: 10 },
      { x: 1220, y: 190, r: 25, rot: -15 },
      { x: 1380, y: 210, r: 30, rot: -18 },
      { x: 1680, y: 320, r: 25, rot: 40 },
    ].map((rbc, idx) => (
      <g
        key={idx}
        transform={`translate(${rbc.x}, ${rbc.y}) rotate(${rbc.rot})`}
        opacity="0.85"
      >
        <ellipse cx="0" cy="0" rx={rbc.r} ry={rbc.r * 0.65} fill="url(#cvRbcGrad)" />
        <ellipse cx="0" cy="0" rx={rbc.r * 0.45} ry={rbc.r * 0.28} fill="#9f1239" opacity="0.6" />
        <ellipse cx={-rbc.r * 0.2} cy={-rbc.r * 0.15} rx={rbc.r * 0.2} ry={rbc.r * 0.1} fill="#fecdd3" opacity="0.5" />
      </g>
    ))}

    {/* Floating Golden Energy Orbs & Cyan Oxygen Spheres (From User Artwork) */}
    {[
      { x: 260, y: 360, color: 'gold', r: 16 },
      { x: 480, y: 230, color: 'cyan', r: 14 },
      { x: 710, y: 440, color: 'gold', r: 18 },
      { x: 880, y: 320, color: 'cyan', r: 15 },
      { x: 1150, y: 420, color: 'gold', r: 17 },
      { x: 1320, y: 260, color: 'cyan', r: 16 },
      { x: 1540, y: 360, color: 'cyan', r: 14 },
      { x: 1720, y: 220, color: 'gold', r: 15 },
    ].map((orb, idx) => (
      <g key={idx} transform={`translate(${orb.x}, ${orb.y})`}>
        {orb.color === 'gold' ? (
          <>
            <circle cx="0" cy="0" r={orb.r} fill="#f59e0b" fillOpacity="0.3" filter="blur(4px)" />
            <circle cx="0" cy="0" r={orb.r * 0.75} fill="#fef08a" fillOpacity="0.9" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx={-orb.r * 0.25} cy={-orb.r * 0.25} r={orb.r * 0.25} fill="#ffffff" />
          </>
        ) : (
          <>
            <circle cx="0" cy="0" r={orb.r} fill="#38bdf8" fillOpacity="0.35" filter="blur(4px)" />
            <circle cx="0" cy="0" r={orb.r * 0.75} fill="#bae6fd" fillOpacity="0.95" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx={-orb.r * 0.25} cy={-orb.r * 0.25} r={orb.r * 0.25} fill="#ffffff" />
          </>
        )}
      </g>
    ))}
  </svg>
);

/** Layer 3: Foreground Floating Blood Cells & Soft-Glow Plasma Droplets */
export const CirculatoryForegroundPlasma: React.FC<LayerProps> = ({
  className = '',
  style = {},
  opacity = 0.45,
}) => (
  <svg
    viewBox="0 0 1920 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full select-none pointer-events-none ${className}`}
    style={{ opacity, ...style }}
    preserveAspectRatio="none"
  >
    {/* Large out-of-focus foreground red blood cells creating cinematic tactile depth */}
    <g transform="translate(120, 480) rotate(-20)" filter="blur(6px)">
      <ellipse cx="0" cy="0" rx="90" ry="58" fill="#e11d48" opacity="0.5" />
      <ellipse cx="0" cy="0" rx="42" ry="26" fill="#881337" opacity="0.45" />
    </g>

    <g transform="translate(820, 80) rotate(35)" filter="blur(8px)">
      <ellipse cx="0" cy="0" rx="110" ry="70" fill="#be123c" opacity="0.4" />
      <ellipse cx="0" cy="0" rx="55" ry="32" fill="#4c0519" opacity="0.5" />
    </g>

    <g transform="translate(1680, 520) rotate(15)" filter="blur(7px)">
      <ellipse cx="0" cy="0" rx="95" ry="62" fill="#fb7185" opacity="0.45" />
      <ellipse cx="0" cy="0" rx="48" ry="28" fill="#9f1239" opacity="0.4" />
    </g>

    {/* Floating tiny oxygen bubbles */}
    <circle cx="360" cy="180" r="10" fill="#bae6fd" opacity="0.6" filter="blur(2px)" />
    <circle cx="1180" cy="140" r="12" fill="#e0f2fe" opacity="0.55" filter="blur(3px)" />
    <circle cx="1450" cy="460" r="8" fill="#7dd3fc" opacity="0.7" filter="blur(1px)" />
  </svg>
);

// ============================================================================
// 2. PLATFORMS & TACTILE RUNWAY ASSETS
// ============================================================================

export interface PlatformVisualProps {
  label: string;
  type?: 'normal' | 'bouncy' | 'speed';
}

/** Tactile Heart Muscle / Vascular Wall Platform with Cardiac Striations & ECG Glow */
export const PlatformHeartMuscle: React.FC<PlatformVisualProps> = ({ label }) => (
  <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-rose-300/70 shadow-[0_8px_28px_rgba(225,29,72,0.5)] bg-gradient-to-b from-rose-600 via-rose-800 to-rose-950 flex flex-col justify-between">
    {/* Upper soft cellular membrane highlight */}
    <div className="w-full h-2.5 bg-gradient-to-r from-rose-200 via-white to-rose-200 opacity-95 rounded-t-xl shadow-sm" />
    
    {/* Microscopic cardiac muscle fibers & glowing ECG heartbeat wave inside */}
    <div className="absolute inset-0 top-2.5 opacity-35 pointer-events-none flex items-center justify-center">
      <svg viewBox="0 0 100 20" className="w-full h-4">
        <path
          d="M0,10 L30,10 L35,4 L40,16 L45,2 L50,14 L55,10 L100,10"
          fill="none"
          stroke="#fed7aa"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="animate-pulse"
        />
      </svg>
    </div>

    {/* Platform Title */}
    <div className="relative px-3 py-1 flex items-center justify-between text-[11px] font-bold text-white tracking-wide truncate z-10 drop-shadow">
      <span className="truncate flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-rose-300 animate-ping" />
        {label}
      </span>
      <span className="text-[9px] uppercase tracking-wider text-rose-200 font-bold shrink-0 ml-2 bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-300/30">
        Cơ Tim
      </span>
    </div>
  </div>
);

/** Tactile Red Blood Cell & Fibrous Tendon Web Platform (From User Artwork) */
export const PlatformTendonWebRBC: React.FC<PlatformVisualProps> = ({ label }) => (
  <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-rose-200 shadow-[0_8px_30px_rgba(244,63,94,0.7)] ring-3 ring-rose-400/50 bg-gradient-to-r from-red-600 via-rose-500 to-red-600 flex items-center justify-between px-3 animate-pulse">
    {/* Top spring cushion glow */}
    <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-white via-rose-100 to-white rounded-full" />
    
    {/* Intricate white fibrous tendon mesh cords (Thừng gân van tim & Mạng sợi collagen) */}
    <div className="absolute inset-0 opacity-45 pointer-events-none flex items-center justify-center">
      <svg viewBox="0 0 120 30" className="w-full h-full" preserveAspectRatio="none">
        <path
          d="M 5,15 Q 30,2 60,15 T 115,15 M 10,22 Q 40,8 70,22 T 110,22 M 15,8 Q 50,25 80,8 T 105,8"
          stroke="#ffffff"
          strokeWidth="1.5"
          fill="none"
        />
        <circle cx="20" cy="15" r="2.5" fill="#fef08a" />
        <circle cx="60" cy="15" r="2.5" fill="#fef08a" />
        <circle cx="100" cy="15" r="2.5" fill="#fef08a" />
      </svg>
    </div>

    <div className="relative flex items-center gap-2 text-white font-black text-[11px] truncate z-10 drop-shadow">
      <span className="material-symbols-outlined text-sm text-yellow-300 animate-bounce">
        keyboard_double_arrow_up
      </span>
      <span className="truncate">{label}</span>
    </div>

    <span className="relative z-10 text-[9px] bg-red-950/90 text-yellow-200 px-2 py-0.5 rounded-full font-black uppercase tracking-wider border border-yellow-300/60 shadow shrink-0 flex items-center gap-1">
      <span className="material-symbols-outlined text-[10px]">rocket_launch</span>
      Thừng Gân Bật Cao
    </span>
  </div>
);

/** Bouncy Platform: Giant Biconcave Red Blood Cell Springboard */
export const PlatformBouncyRBC: React.FC<PlatformVisualProps> = ({ label }) => (
  <PlatformTendonWebRBC label={label} type="bouncy" />
);

/** Speed Platform: High-Velocity Arterial Blood Stream */
export const PlatformSpeedArtery: React.FC<PlatformVisualProps> = ({ label }) => (
  <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-sky-300 shadow-[0_8px_28px_rgba(56,189,248,0.55)] ring-4 ring-sky-400/35 bg-gradient-to-r from-indigo-700 via-sky-600 to-rose-600 flex items-center justify-between px-3.5">
    {/* Upper fast flow stream */}
    <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-sky-100 via-white to-sky-200 rounded-t-xl" />
    
    {/* Animated velocity dash pattern */}
    <div className="absolute inset-0 opacity-25 flex items-center justify-around pointer-events-none">
      <span className="text-white text-lg font-black animate-pulse">›››</span>
      <span className="text-white text-lg font-black animate-pulse">›››</span>
      <span className="text-white text-lg font-black animate-pulse">›››</span>
    </div>

    <div className="relative flex items-center gap-2 text-white font-black text-[11px] truncate z-10 drop-shadow">
      <span className="material-symbols-outlined text-sm text-sky-200 animate-spin-slow">
        speed
      </span>
      <span className="truncate">{label}</span>
    </div>

    <span className="relative z-10 text-[9px] bg-indigo-950/90 text-sky-200 px-2 py-0.5 rounded-full font-black uppercase tracking-wider border border-sky-300/60 shadow shrink-0 flex items-center gap-1">
      <span className="material-symbols-outlined text-[10px]">bolt</span>
      Gia Tốc Máu
    </span>
  </div>
);

// ============================================================================
// 3. COLLECTIBLES & BIOLOGICAL SPECIMENS
// ============================================================================

/** Oxygen Molecule O2 (HbO2) Collectible - Matching Cyan Glow Spheres in Artwork */
export const CollectibleOxygenO2: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex flex-col items-center group pointer-events-none animate-bounce">
    <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-sky-400 via-cyan-300 to-white text-sky-950 flex items-center justify-center shadow-[0_0_28px_rgba(56,189,248,0.95)] ring-4 ring-cyan-200/90 border-2 border-white">
      {/* Translucent sphere inner core */}
      <div className="w-8 h-8 rounded-full bg-white/70 shadow-inner flex items-center justify-center backdrop-blur-sm">
        <span className="text-[11px] font-black text-sky-800 tracking-tighter">O₂</span>
      </div>
      <div className="absolute top-1 left-2 w-3 h-2 rounded-full bg-white opacity-90" />
      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-white animate-ping" />
    </div>
    <span className="text-[10px] font-extrabold text-cyan-100 bg-slate-950/90 px-2.5 py-0.5 rounded-full mt-1.5 whitespace-nowrap border border-cyan-400/60 shadow-lg">
      {name}
    </span>
  </div>
);

/** Erythrocyte Red Blood Cell Collectible */
export const CollectibleRBC: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex flex-col items-center group pointer-events-none animate-bounce">
    <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-rose-600 via-red-500 to-rose-300 text-white flex items-center justify-center shadow-[0_0_28px_rgba(244,63,94,0.9)] ring-4 ring-rose-300/80 border-2 border-white">
      {/* Disc center depression */}
      <div className="w-7 h-4 rounded-full bg-rose-950/60 flex items-center justify-center">
        <span className="text-[9px] font-black text-rose-200">Hb</span>
      </div>
    </div>
    <span className="text-[10px] font-extrabold text-rose-100 bg-slate-950/90 px-2.5 py-0.5 rounded-full mt-1.5 whitespace-nowrap border border-rose-300/60 shadow-lg">
      {name}
    </span>
  </div>
);

/** Calcium Ion Ca2+ / Nutrient Energy Orb - Matching Golden Amber Spheres in Artwork */
export const CollectibleCalcium: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex flex-col items-center group pointer-events-none animate-bounce">
    <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-100 text-amber-950 flex items-center justify-center shadow-[0_0_28px_rgba(245,158,11,0.95)] ring-4 ring-yellow-200/90 border-2 border-white">
      {/* Translucent sphere inner core */}
      <div className="w-8 h-8 rounded-full bg-yellow-100/70 shadow-inner flex items-center justify-center backdrop-blur-sm">
        <span className="text-[10px] font-black text-amber-900 tracking-tight">Ca²⁺</span>
      </div>
      <div className="absolute top-1 left-2 w-3 h-2 rounded-full bg-white opacity-90" />
    </div>
    <span className="text-[10px] font-extrabold text-amber-100 bg-slate-950/90 px-2.5 py-0.5 rounded-full mt-1.5 whitespace-nowrap border border-amber-400/60 shadow-lg">
      {name}
    </span>
  </div>
);

/** SA Node Electrical Spark Collectible */
export const CollectibleSANode: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex flex-col items-center group pointer-events-none animate-bounce">
    <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-300 text-white flex items-center justify-center shadow-[0_0_24px_rgba(217,70,239,0.85)] ring-4 ring-fuchsia-300/80 border-2 border-white">
      <span className="material-symbols-outlined text-2xl font-bold">bolt</span>
    </div>
    <span className="text-[10px] font-extrabold text-fuchsia-100 bg-slate-900/90 px-2 py-0.5 rounded-full mt-1.5 whitespace-nowrap border border-fuchsia-300/50 shadow-lg">
      {name}
    </span>
  </div>
);

// ============================================================================
// 4. CHECKPOINT ECG BEACON
// ============================================================================

export const CheckpointECGBeacon: React.FC<{ isActive: boolean; label: string }> = ({
  isActive,
  label,
}) => (
  <div className="flex flex-col items-center group pointer-events-none">
    {/* Status badge */}
    <div
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xl mb-1 flex items-center gap-1 transition-all ${
        isActive
          ? 'bg-emerald-500 text-white ring-4 ring-emerald-300/60 scale-105'
          : 'bg-slate-900/90 text-slate-300 border border-white/20'
      }`}
    >
      <span className="material-symbols-outlined text-xs">
        {isActive ? 'favorite' : 'ecg_heart'}
      </span>
      <span>{isActive ? 'ĐÃ LƯU TRẠM' : 'TRẠM NHỊP TIM'}</span>
    </div>

    {/* ECG heart wave monitor screen */}
    <div
      className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shadow-2xl border-2 transition-all overflow-hidden ${
        isActive
          ? 'bg-slate-950 text-emerald-400 border-emerald-400 ring-4 ring-emerald-400/50 scale-110'
          : 'bg-slate-900 text-slate-500 border-slate-700'
      }`}
    >
      {/* ECG animated SVG wave line */}
      <svg viewBox="0 0 40 20" className="w-10 h-6">
        <path
          d="M0,10 L10,10 L13,4 L16,16 L19,2 L22,12 L24,10 L40,10"
          fill="none"
          stroke={isActive ? '#34d399' : '#64748b'}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-[8px] font-bold text-center tracking-tighter">
        {isActive ? '75 BPM' : 'STANDBY'}
      </span>
    </div>

    <span className="text-[9px] font-bold text-white/90 mt-1 whitespace-nowrap bg-black/75 px-1.5 py-0.5 rounded-md border border-white/20">
      {label}
    </span>
  </div>
);

// ============================================================================
// 5. INTERACTIVE NPC: BÁC SĨ HỒNG CẦU ERYTHRO
// ============================================================================

export const NPCDrErythro: React.FC<{ isInteracted: boolean; name: string }> = ({
  isInteracted,
  name,
}) => (
  <div className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105">
    {/* Notification Banner */}
    <div
      className={`px-3 py-0.5 rounded-full text-[10px] font-black shadow-xl mb-1 flex items-center gap-1 transition-all ${
        isInteracted
          ? 'bg-emerald-500 text-white'
          : 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-400/60'
      }`}
    >
      <span className="material-symbols-outlined text-xs">school</span>
      <span>{isInteracted ? 'ĐÃ HOÀN THÀNH' : 'BÀI HỌC TIM [E]'}</span>
    </div>

    {/* Tactile Cute Character Avatar */}
    <div className="relative w-15 h-15 rounded-3xl bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-300 text-white flex items-center justify-center shadow-2xl ring-4 ring-rose-300/80 border-3 border-white group-hover:scale-110 transition-transform">
      <span className="material-symbols-outlined text-4xl">vital_signs</span>
      
      {/* Stethoscope icon badge */}
      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white text-rose-600 flex items-center justify-center shadow border border-rose-300">
        <span className="material-symbols-outlined text-sm font-bold">stethoscope</span>
      </div>
    </div>

    <span className="text-[10px] text-white font-extrabold bg-black/80 px-2 py-0.5 rounded-md mt-1 border border-white/20 shadow">
      {name} [E]
    </span>
  </div>
);

// ============================================================================
// 6. VICTORY GOAL: CỔNG ĐỘNG MẠCH CHỦ TOÀN THÂN (AORTA ARCH PORTAL)
// ============================================================================

export const GoalAortaArchPortal: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105">
    <div className="px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 text-[11px] font-black shadow-2xl mb-1.5 animate-bounce flex items-center gap-1.5 border-2 border-white">
      <span className="material-symbols-outlined text-sm">flag</span>
      <span>{label}</span>
    </div>

    <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-600 via-amber-500 to-yellow-200 text-amber-950 flex items-center justify-center shadow-[0_0_36px_rgba(245,158,11,0.75)] ring-4 ring-amber-300 border-3 border-white group-hover:scale-110 transition-transform">
      {/* Outer pulsing arterial valve rings */}
      <div className="absolute inset-1 rounded-2xl border-2 border-white/40 animate-ping" />
      
      <span className="material-symbols-outlined text-5xl text-white drop-shadow animate-pulse">
        favorite
      </span>
    </div>
  </div>
);
