/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * WORLD 6: EXCRETORY SYSTEM (HỆ BÀI TIẾT)
 * Bio Blossom Tactile 2D Game Assets & SVG Definitions
 * Palette: Soft lavender, pale blue, turquoise, pink, warm cream
 */

import React from 'react';

// ============================================================================
// 1. WIDE SCROLLING BACKGROUND (PARALLAX LAYERS)
// ============================================================================

export interface LayerProps {
  className?: string;
  style?: React.CSSProperties;
  opacity?: number;
}

/** Layer 1: Distant Kidney Silhouettes & Glomerulus Domes */
export const ExcretoryBackgroundDistant: React.FC<LayerProps> = ({
  className = '',
  style = {},
  opacity = 0.5,
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
      <linearGradient id="exDistantGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.45" />
        <stop offset="50%" stopColor="#6d28d9" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#2e1065" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="exGlomerulusGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f472b6" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
      </linearGradient>
      <radialGradient id="exDomeGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Distant kidney lobe curvatures */}
    <path
      d="M0,450 C300,320 650,420 960,350 C1280,280 1600,380 1920,320 L1920,600 L0,600 Z"
      fill="url(#exDistantGrad1)"
    />

    {/* Distant giant Glomerulus capillary spheres */}
    <circle cx="280" cy="300" r="140" fill="url(#exDomeGrad)" />
    <circle cx="850" cy="240" r="180" fill="url(#exDomeGrad)" />
    <circle cx="1520" cy="270" r="160" fill="url(#exDomeGrad)" />

    {/* Soft glowing glomerulus capillary tuft outlines */}
    <path
      d="M200,320 Q240,240 290,280 T350,260 T380,330"
      stroke="#c4b5fd"
      strokeWidth="4"
      strokeLinecap="round"
      strokeOpacity="0.4"
      fill="none"
    />
    <path
      d="M780,260 Q820,180 880,210 T940,240 T980,280"
      stroke="#fbcfe8"
      strokeWidth="5"
      strokeLinecap="round"
      strokeOpacity="0.45"
      fill="none"
    />
    <path
      d="M1440,280 Q1490,200 1550,230 T1610,270"
      stroke="#7dd3fc"
      strokeWidth="4.5"
      strokeLinecap="round"
      strokeOpacity="0.4"
      fill="none"
    />
  </svg>
);

/** Layer 2: Mid-ground Curving Nephron Passages & Bowman Capsules */
export const ExcretoryBackgroundMid: React.FC<LayerProps> = ({
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
      <linearGradient id="exMidNephronGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.5" />
        <stop offset="35%" stopColor="#38bdf8" stopOpacity="0.6" />
        <stop offset="70%" stopColor="#2dd4bf" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#f472b6" stopOpacity="0.5" />
      </linearGradient>
      <linearGradient id="exFiltrationGlow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#5eead4" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.1" />
      </linearGradient>
    </defs>

    {/* Serpentine Renal Tubule Channel (Quai Henle & Ống lượn) */}
    <path
      d="M -40,380 C 180,440 260,200 440,240 C 620,280 680,480 860,500 C 1040,520 1100,260 1280,280 C 1460,300 1560,460 1740,430 C 1860,410 1940,360 2000,370"
      stroke="url(#exMidNephronGrad)"
      strokeWidth="48"
      strokeLinecap="round"
      fill="none"
    />

    {/* Luminal fluid inner stream */}
    <path
      d="M -40,380 C 180,440 260,200 440,240 C 620,280 680,480 860,500 C 1040,520 1100,260 1280,280 C 1460,300 1560,460 1740,430 C 1860,410 1940,360 2000,370"
      stroke="#e0f2fe"
      strokeWidth="12"
      strokeDasharray="24 32"
      strokeLinecap="round"
      strokeOpacity="0.65"
      fill="none"
    />

    {/* Bowman's Capsule Cups (Nang cầu thận) in mid-distance */}
    <g transform="translate(380, 160) scale(0.65)">
      <path
        d="M 20,80 C 20,20 120,0 160,50 C 190,90 190,140 140,170 C 100,190 40,170 30,130"
        stroke="#f472b6"
        strokeWidth="16"
        strokeLinecap="round"
        fill="url(#exFiltrationGlow)"
      />
      <circle cx="105" cy="95" r="45" fill="#f43f5e" fillOpacity="0.4" />
      <circle cx="105" cy="95" r="35" stroke="#fecdd3" strokeWidth="6" strokeDasharray="8 8" fill="none" />
    </g>

    <g transform="translate(1220, 190) scale(0.7)">
      <path
        d="M 20,80 C 20,20 120,0 160,50 C 190,90 190,140 140,170 C 100,190 40,170 30,130"
        stroke="#a78bfa"
        strokeWidth="16"
        strokeLinecap="round"
        fill="url(#exFiltrationGlow)"
      />
      <circle cx="105" cy="95" r="45" fill="#8b5cf6" fillOpacity="0.4" />
      <circle cx="105" cy="95" r="35" stroke="#ddd6fe" strokeWidth="6" strokeDasharray="8 8" fill="none" />
    </g>
  </svg>
);

/** Layer 3: Foreground Bioluminescent Fluid Flow & Microscopic Spores */
export const ExcretoryBackgroundNear: React.FC<LayerProps> = ({
  className = '',
  style = {},
  opacity = 0.85,
}) => (
  <svg
    viewBox="0 0 1920 600"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full select-none pointer-events-none ${className}`}
    style={{ opacity, ...style }}
    preserveAspectRatio="none"
  >
    {/* Ambient floating fluid droplets */}
    {[
      { cx: 120, cy: 180, r: 10, fill: '#38bdf8' },
      { cx: 280, cy: 380, r: 14, fill: '#2dd4bf' },
      { cx: 520, cy: 140, r: 8, fill: '#c084fc' },
      { cx: 740, cy: 420, r: 12, fill: '#f472b6' },
      { cx: 980, cy: 190, r: 16, fill: '#38bdf8' },
      { cx: 1240, cy: 360, r: 9, fill: '#a78bfa' },
      { cx: 1480, cy: 160, r: 13, fill: '#5eead4' },
      { cx: 1720, cy: 390, r: 11, fill: '#fbcfe8' },
    ].map((drop, idx) => (
      <g key={idx} className="animate-pulse" style={{ animationDuration: `${3 + (idx % 3)}s` }}>
        <circle cx={drop.cx} cy={drop.cy} r={drop.r} fill={drop.fill} fillOpacity="0.45" />
        <circle cx={drop.cx - drop.r * 0.3} cy={drop.cy - drop.r * 0.3} r={drop.r * 0.3} fill="#ffffff" fillOpacity="0.8" />
      </g>
    ))}
  </svg>
);

// ============================================================================
// 2 & 3. DECORATIONS (BACKGROUND & FOREGROUND)
// ============================================================================

/** Glomerulus Capillary Tuft Decoration (Búi mao mạch cầu thận) */
export const GlomerulusTuftDeco: React.FC<{ size?: number; className?: string }> = ({
  size = 120,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none ${className}`}
  >
    <defs>
      <radialGradient id="glomGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fb7185" stopOpacity="0.8" />
        <stop offset="70%" stopColor="#e11d48" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#881337" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Capillary mesh ball */}
    <circle cx="80" cy="80" r="72" fill="url(#glomGlow)" />
    <path
      d="M 40,80 Q 60,30 90,50 T 120,90 T 80,130 T 40,80"
      stroke="#ffe4e6"
      strokeWidth="8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M 60,60 Q 90,40 110,70 T 90,110 T 60,90 Z"
      stroke="#f43f5e"
      strokeWidth="6"
      strokeLinecap="round"
      fill="none"
    />
    {/* Filtration slits indicator */}
    <circle cx="75" cy="70" r="5" fill="#fef08a" />
    <circle cx="95" cy="85" r="4.5" fill="#fef08a" />
    <circle cx="65" cy="100" r="4" fill="#fef08a" />
  </svg>
);

/** Epithelial Podocyte Cell (Tế bào có chân bao bọc mao mạch cầu thận) */
export const PodocyteCellDeco: React.FC<{ size?: number; className?: string }> = ({
  size = 100,
  className = '',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 140 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`select-none ${className}`}
  >
    <path
      d="M 70,40 C 90,40 100,55 95,75 C 115,80 120,105 100,115 C 80,125 60,120 50,110 C 30,115 20,90 35,75 C 30,55 50,40 70,40 Z"
      fill="#a78bfa"
      fillOpacity="0.85"
      stroke="#ddd6fe"
      strokeWidth="4"
    />
    {/* Pedicel interlocking feet */}
    <path d="M 40,85 Q 25,95 20,110" stroke="#c4b5fd" strokeWidth="5" strokeLinecap="round" />
    <path d="M 60,115 Q 55,130 50,135" stroke="#c4b5fd" strokeWidth="5" strokeLinecap="round" />
    <path d="M 85,118 Q 95,130 105,135" stroke="#c4b5fd" strokeWidth="5" strokeLinecap="round" />
    <path d="M 105,100 Q 120,105 130,110" stroke="#c4b5fd" strokeWidth="5" strokeLinecap="round" />
    <circle cx="68" cy="74" r="14" fill="#6d28d9" fillOpacity="0.7" />
    <circle cx="64" cy="70" r="4" fill="#ffffff" fillOpacity="0.85" />
  </svg>
);

// ============================================================================
// 4. REUSABLE 2D PLATFORMS (TRANSPARENT BACKGROUNDS)
// ============================================================================

export interface PlatformVisualProps {
  width?: string | number;
  height?: number;
  label?: string;
  type?: 'normal' | 'bouncy' | 'speed';
  className?: string;
}

/** 4A: Renal Tubule Platform (Thềm ống lượn thận - Soft epithelial surface) */
export const RenalTubulePlatform: React.FC<PlatformVisualProps> = ({
  width = '100%',
  height = 42,
  label = 'Thềm Ống Lượn Thận (Tái Hấp Thu)',
  type = 'normal',
  className = '',
}) => (
  <div
    className={`relative rounded-3xl overflow-hidden shadow-lg border-2 border-purple-300/60 backdrop-blur-md transition-all ${className}`}
    style={{
      width,
      height: `${height}px`,
      background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.92) 0%, rgba(109, 40, 217, 0.88) 100%)',
    }}
  >
    {/* Soft top microvilli rim */}
    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-200 via-pink-200 to-sky-200 opacity-90 rounded-t-3xl" />
    
    {/* Cell junction scalloped pattern */}
    <div className="absolute inset-x-2 top-2 flex justify-between opacity-35 pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="w-4 h-2 rounded-b-full bg-white/60" />
      ))}
    </div>

    {/* Platform content / label */}
    <div className="absolute inset-0 px-3 flex items-center justify-between text-white font-bold text-[11px] drop-shadow-sm">
      <span className="flex items-center gap-1.5 truncate">
        <span className="material-symbols-outlined text-sm text-sky-200">filter_alt</span>
        <span>{label}</span>
      </span>
      {type === 'normal' && (
        <span className="text-[9px] bg-white/20 text-purple-100 px-2 py-0.5 rounded-full font-semibold shrink-0">
          Tái hấp thu H2O
        </span>
      )}
    </div>
  </div>
);

/** 4B: Bowman's Capsule Bouncy Platform (Nang Bowman - Springy, high bounce) */
export const BowmanBouncyPlatform: React.FC<PlatformVisualProps> = ({
  width = '100%',
  height = 44,
  label = 'Nang Bowman Bật Nhảy (Áp Lực Lọc)',
  className = '',
}) => (
  <div
    className={`relative rounded-3xl overflow-hidden shadow-xl border-2 border-pink-300/80 backdrop-blur-md transition-transform hover:scale-[1.01] ${className}`}
    style={{
      width,
      height: `${height}px`,
      background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.95) 0%, rgba(219, 39, 119, 0.9) 100%)',
    }}
  >
    {/* Springy energy glow on surface */}
    <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-yellow-200 via-pink-100 to-amber-200 opacity-95 animate-pulse" />
    
    <div className="absolute inset-0 px-3 flex items-center justify-between text-white font-bold text-[11px] drop-shadow-sm">
      <span className="flex items-center gap-1.5 truncate">
        <span className="material-symbols-outlined text-sm text-yellow-200">expand_less</span>
        <span>{label}</span>
      </span>
      <span className="text-[9px] bg-yellow-300 text-pink-950 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide shrink-0 shadow-xs">
        BẬT NHẢY CAO ⬆
      </span>
    </div>
  </div>
);

/** 4C: Fluid Current Speed Platform (Dòng nước tiểu đầu gia tốc) */
export const FluidCurrentSpeedPlatform: React.FC<PlatformVisualProps> = ({
  width = '100%',
  height = 42,
  label = 'Dòng Dịch Lọc Gia Tốc (Quai Henle)',
  className = '',
}) => (
  <div
    className={`relative rounded-3xl overflow-hidden shadow-lg border-2 border-cyan-200/80 backdrop-blur-md ${className}`}
    style={{
      width,
      height: `${height}px`,
      background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.92) 0%, rgba(14, 116, 144, 0.9) 100%)',
    }}
  >
    {/* Flowing animated stripes */}
    <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(45deg,#ffffff,#ffffff_10px,transparent_10px,transparent_20px)] animate-move-bg" />
    <div className="absolute top-0 left-0 right-0 h-2 bg-cyan-100 opacity-90 rounded-t-3xl" />

    <div className="absolute inset-0 px-3 flex items-center justify-between text-white font-bold text-[11px] drop-shadow-sm">
      <span className="flex items-center gap-1.5 truncate">
        <span className="material-symbols-outlined text-sm text-cyan-200">fast_forward</span>
        <span>{label}</span>
      </span>
      <span className="text-[9px] bg-cyan-300 text-teal-950 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide shrink-0">
        GIA TỐC ⏩
      </span>
    </div>
  </div>
);

// ============================================================================
// 5. INTERACTIVE OBJECTS & COLLECTIBLES
// ============================================================================

/** Water Molecule Droplet Collectible (Giọt Nước Tinh Khiết H2O) */
export const WaterDropletCollectible: React.FC<{ size?: number; className?: string }> = ({
  size = 46,
  className = '',
}) => (
  <div
    className={`relative flex flex-col items-center justify-center animate-bounce select-none ${className}`}
    style={{ width: size, height: size }}
  >
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <defs>
        <radialGradient id="waterDropGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="40%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </radialGradient>
        <filter id="waterGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Drop teardrop shape */}
      <path
        d="M 30,8 C 30,8 12,28 12,39 C 12,49 20,55 30,55 C 40,55 48,49 48,39 C 48,28 30,8 30,8 Z"
        fill="url(#waterDropGrad)"
        filter="url(#waterGlow)"
        stroke="#ffffff"
        strokeWidth="2.5"
      />
      {/* High-gloss shine */}
      <ellipse cx="23" cy="32" rx="4" ry="7" transform="rotate(-25 23 32)" fill="#ffffff" fillOpacity="0.85" />
      <circle cx="36" cy="44" r="2.5" fill="#ffffff" fillOpacity="0.75" />
    </svg>
    <span className="text-[9px] font-black text-sky-900 bg-sky-100/90 px-1.5 py-0.2 rounded-full -mt-1 shadow-xs border border-sky-300">
      H₂O
    </span>
  </div>
);

/** Filtered Glucose Nutrient Pellet (Hạt Glucozơ Tái Hấp Thu) */
export const FilteredGlucoseCollectible: React.FC<{ size?: number; className?: string }> = ({
  size = 46,
  className = '',
}) => (
  <div
    className={`relative flex flex-col items-center justify-center animate-bounce select-none ${className}`}
    style={{ width: size, height: size }}
  >
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <defs>
        <linearGradient id="glucoseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      {/* Hexagonal ring of glucose */}
      <polygon
        points="30,8 48,18 48,42 30,52 12,42 12,18"
        fill="url(#glucoseGrad)"
        stroke="#ffffff"
        strokeWidth="2.5"
        filter="drop-shadow(0 4px 6px rgba(202,138,4,0.4))"
      />
      <circle cx="30" cy="30" r="8" fill="#fef9c3" fillOpacity="0.9" />
    </svg>
    <span className="text-[9px] font-black text-amber-950 bg-amber-200/90 px-1.5 py-0.2 rounded-full -mt-1 shadow-xs border border-amber-300">
      Glucozơ
    </span>
  </div>
);

/** Friendly Nephron Guide Cell NPC (Tế Bào Biểu Bì Ống Thận) */
export const NephronGuideCellNpc: React.FC<{ size?: number; className?: string }> = ({
  size = 72,
  className = '',
}) => (
  <div className={`flex flex-col items-center group cursor-pointer select-none ${className}`}>
    <div className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold shadow-md mb-1 animate-pulse flex items-center gap-1">
      <span className="material-symbols-outlined text-xs">science</span>
      <span>TS. Nephron Ống Thận</span>
    </div>
    <div
      className="relative rounded-3xl bg-gradient-to-tr from-purple-500 via-pink-400 to-sky-300 flex items-center justify-center shadow-xl ring-4 ring-purple-200 group-hover:scale-105 transition-transform"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.75} height={size * 0.75} viewBox="0 0 60 60" fill="none">
        {/* Cell body with nucleus */}
        <circle cx="30" cy="30" r="26" fill="#7c3aed" fillOpacity="0.8" />
        <circle cx="30" cy="30" r="14" fill="#a78bfa" />
        {/* Cute science glasses */}
        <circle cx="23" cy="28" r="6" stroke="#ffffff" strokeWidth="2" fill="#38bdf8" fillOpacity="0.5" />
        <circle cx="37" cy="28" r="6" stroke="#ffffff" strokeWidth="2" fill="#38bdf8" fillOpacity="0.5" />
        <line x1="29" y1="28" x2="31" y2="28" stroke="#ffffff" strokeWidth="2" />
        {/* Happy smile */}
        <path d="M 25,38 Q 30,43 35,38" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    </div>
    <span className="text-[9px] text-white/90 font-bold bg-black/60 px-2 py-0.5 rounded-full mt-1">
      [Nhấn E / Chạm]
    </span>
  </div>
);

// ============================================================================
// 6. HAZARDS & OBSTACLES
// ============================================================================

/** Concentrated Urea & Waste Surge Hazard (Dòng dịch thải Ure đậm đặc) */
export const UreaSurgeHazard: React.FC<{ width?: string; label?: string }> = ({
  width = '100%',
  label = 'Dòng Axit Uric & Ure Đậm Đặc (Chất Thải)',
}) => (
  <div
    className="relative rounded-2xl overflow-hidden border-2 border-red-400/80 shadow-inner"
    style={{
      width,
      height: '38px',
      background: 'linear-gradient(to top, #4c0519 0%, #881337 50%, #9f1239 100%)',
    }}
  >
    {/* Toxic bubbles and steam */}
    <div className="absolute inset-0 flex items-center justify-around opacity-40">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" style={{ animationDelay: `${i * 0.3}s` }} />
      ))}
    </div>
    <div className="absolute inset-0 flex items-center justify-center gap-1.5 text-red-200 text-xs font-bold animate-pulse">
      <span className="material-symbols-outlined text-sm text-yellow-300">warning</span>
      <span>{label}</span>
    </div>
  </div>
);

// ============================================================================
// 7. EDUCATIONAL VISUAL ELEMENTS
// ============================================================================

/** Educational Filtration & Reabsorption Diagram Card */
export const ExcretoryConceptCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-4 rounded-3xl bg-surface/95 backdrop-blur-xl border border-purple-200 shadow-xl text-left ${className}`}>
    <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-purple-100">
      <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
        <span className="material-symbols-outlined text-lg">water_drop</span>
      </div>
      <div>
        <h4 className="font-bold text-sm text-on-surface">Cơ Chế Tạo Thành Nước Tiểu (Sinh học 8)</h4>
        <span className="text-[11px] text-purple-600 font-semibold">Cầu Thận → Ống Thận → Bể Thận</span>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
      <div className="p-2 rounded-2xl bg-pink-50 border border-pink-200 flex flex-col items-center">
        <span className="font-bold text-pink-700 text-[11px]">1. Quá trình Lọc máu</span>
        <span className="text-[10px] text-pink-900 mt-1">Tại Cầu thận: Máu qua màng lọc tạo ~170L nước tiểu đầu/ngày.</span>
      </div>
      <div className="p-2 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col items-center">
        <span className="font-bold text-purple-700 text-[11px]">2. Quá trình Hấp thụ lại</span>
        <span className="text-[10px] text-purple-900 mt-1">Tại Ống thận: Hấp thụ lại 99% H2O, Glucozơ, ion Na+, Cl-.</span>
      </div>
      <div className="p-2 rounded-2xl bg-cyan-50 border border-cyan-200 flex flex-col items-center">
        <span className="font-bold text-cyan-700 text-[11px]">3. Quá trình Bài tiết tiếp</span>
        <span className="text-[10px] text-cyan-900 mt-1">Thải Ure, Axit uric, thuốc tạo 1.5L nước tiểu chính thức.</span>
      </div>
    </div>
  </div>
);
