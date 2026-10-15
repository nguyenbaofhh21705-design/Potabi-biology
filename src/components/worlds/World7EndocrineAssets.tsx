/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * WORLD 7: ENDOCRINE SYSTEM (HỆ NỘI TIẾT)
 * Bio Blossom Tactile 2D Game Assets & SVG Definitions
 * Palette: Pastel purple, mint green, peach, soft yellow, sky blue
 */

import React from 'react';

export interface LayerProps {
  className?: string;
  style?: React.CSSProperties;
  opacity?: number;
}

// ============================================================================
// 1. WIDE SCROLLING BACKGROUND (PARALLAX LAYERS)
// ============================================================================

/** Layer 1: Distant Endocrine Gland Silhouettes & Chemical Signal Nebulae */
export const EndocrineBackgroundDistant: React.FC<LayerProps> = ({
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
      <linearGradient id="endoDistantGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2e1065" stopOpacity="0.5" />
        <stop offset="40%" stopColor="#4c1d95" stopOpacity="0.35" />
        <stop offset="80%" stopColor="#064e3b" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#431407" stopOpacity="0.45" />
      </linearGradient>
      <radialGradient id="pituitaryGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#c084fc" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#6b21a8" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="thyroidGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fdba74" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#9a3412" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Distant organic contours of body tissue */}
    <path
      d="M0,420 C320,310 640,400 960,330 C1280,260 1600,360 1920,310 L1920,600 L0,600 Z"
      fill="url(#endoDistantGrad)"
    />

    {/* Distant Master Gland (Tuyến Yên - Pituitary Gland dome) */}
    <circle cx="340" cy="270" r="160" fill="url(#pituitaryGlow)" />
    <circle cx="1020" cy="230" r="180" fill="url(#thyroidGlow)" />
    <circle cx="1620" cy="280" r="150" fill="url(#pituitaryGlow)" />

    {/* Soft glowing hormone communication pathways */}
    <path
      d="M100,340 Q340,160 580,290 T1060,210 T1540,260 T1900,320"
      stroke="#6ee7b7"
      strokeWidth="5"
      strokeDasharray="16 20"
      strokeLinecap="round"
      strokeOpacity="0.4"
      fill="none"
    />
  </svg>
);

/** Layer 2: Mid-ground Blood Stream Highway & Glandular Secretion Lobes */
export const EndocrineBackgroundMid: React.FC<LayerProps> = ({
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
      <linearGradient id="endoCapillaryGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#e879f9" stopOpacity="0.45" />
        <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.55" />
        <stop offset="60%" stopColor="#34d399" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.55" />
      </linearGradient>
    </defs>

    {/* Capillary stream conveying hormones to target tissues */}
    <path
      d="M -50,340 C 220,240 380,480 620,380 C 860,280 1020,460 1260,340 C 1500,220 1660,420 1970,330"
      stroke="url(#endoCapillaryGrad)"
      strokeWidth="56"
      strokeLinecap="round"
      fill="none"
    />

    {/* Luminal signal highway */}
    <path
      d="M -50,340 C 220,240 380,480 620,380 C 860,280 1020,460 1260,340 C 1500,220 1660,420 1970,330"
      stroke="#fef08a"
      strokeWidth="12"
      strokeDasharray="20 28"
      strokeLinecap="round"
      strokeOpacity="0.6"
      fill="none"
    />

    {/* Thyroid butterfly lobe in midground */}
    <g transform="translate(760, 160) scale(0.65)" opacity="0.8">
      <path
        d="M 60,60 C 20,20 10,90 40,130 C 70,160 100,130 90,90 Z"
        fill="#fdba74"
        fillOpacity="0.75"
        stroke="#fed7aa"
        strokeWidth="6"
      />
      <path
        d="M 140,60 C 180,20 190,90 160,130 C 130,160 100,130 110,90 Z"
        fill="#fdba74"
        fillOpacity="0.75"
        stroke="#fed7aa"
        strokeWidth="6"
      />
      {/* Isthmus connection */}
      <rect x="80" y="85" width="40" height="22" rx="10" fill="#fb923c" />
    </g>
  </svg>
);

/** Layer 3: Foreground Chemical Messengers & Target Cell Receptors */
export const EndocrineBackgroundNear: React.FC<LayerProps> = ({
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
    {/* Floating hormone vesicles and target receptors */}
    {[
      { cx: 180, cy: 190, r: 12, fill: '#6ee7b7' },
      { cx: 420, cy: 400, r: 16, fill: '#fde047' },
      { cx: 680, cy: 170, r: 10, fill: '#c084fc' },
      { cx: 940, cy: 410, r: 14, fill: '#fdba74' },
      { cx: 1200, cy: 180, r: 11, fill: '#38bdf8' },
      { cx: 1480, cy: 420, r: 15, fill: '#a7f3d0' },
      { cx: 1760, cy: 200, r: 13, fill: '#f472b6' },
    ].map((h, idx) => (
      <g key={idx} className="animate-pulse" style={{ animationDuration: `${2.8 + (idx % 3) * 0.7}s` }}>
        <circle cx={h.cx} cy={h.cy} r={h.r} fill={h.fill} fillOpacity="0.5" />
        <circle cx={h.cx - h.r * 0.3} cy={h.cy - h.r * 0.3} r={h.r * 0.3} fill="#ffffff" fillOpacity="0.85" />
      </g>
    ))}
  </svg>
);

// ============================================================================
// 2 & 3. DECORATIONS (BACKGROUND & FOREGROUND)
// ============================================================================

/** Target Cell Receptor Dock Decoration (Thụ thể màng tế bào đích) */
export const TargetReceptorDeco: React.FC<{ size?: number; className?: string }> = ({
  size = 110,
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
    <defs>
      <linearGradient id="recGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#6ee7b7" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
    {/* Cell membrane phospholipid bilayer portion */}
    <rect x="10" y="90" width="120" height="35" rx="10" fill="#cbd5e1" fillOpacity="0.75" />
    <line x1="15" y1="92" x2="125" y2="92" stroke="#94a3b8" strokeWidth="4" strokeDasharray="6 6" />

    {/* Transmembrane G-protein coupled / receptor socket */}
    <path
      d="M 45,90 L 45,55 C 45,40 55,30 70,30 C 85,30 95,40 95,55 L 95,90 Z"
      fill="url(#recGrad)"
      stroke="#a7f3d0"
      strokeWidth="4"
    />
    {/* Keyhole docking pocket */}
    <path
      d="M 60,32 C 60,45 80,45 80,32"
      stroke="#fef08a"
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="70" cy="62" r="7" fill="#fef08a" />
  </svg>
);

// ============================================================================
// 4. REUSABLE 2D PLATFORMS
// ============================================================================

export interface PlatformVisualProps {
  width?: string | number;
  height?: number;
  label?: string;
  type?: 'normal' | 'bouncy' | 'speed';
  className?: string;
}

/** 4A: Glandular Tissue Platform (Thềm mô tuyến nội tiết - Soft pastel purple) */
export const GlandularTissuePlatform: React.FC<PlatformVisualProps> = ({
  width = '100%',
  height = 42,
  label = 'Thềm Tuyến Nội Tiết (Tiết Hormone Trực Tiếp)',
  type = 'normal',
  className = '',
}) => (
  <div
    className={`relative rounded-3xl overflow-hidden shadow-lg border-2 border-purple-200/80 backdrop-blur-md ${className}`}
    style={{
      width,
      height: `${height}px`,
      background: 'linear-gradient(135deg, rgba(192, 132, 252, 0.94) 0%, rgba(147, 51, 234, 0.9) 100%)',
    }}
  >
    {/* Secretory vesicles rim */}
    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-100 via-pink-100 to-amber-100 opacity-90 rounded-t-3xl" />
    <div className="absolute inset-0 px-3 flex items-center justify-between text-white font-bold text-[11px] drop-shadow-sm">
      <span className="flex items-center gap-1.5 truncate">
        <span className="material-symbols-outlined text-sm text-yellow-200">bubble_chart</span>
        <span>{label}</span>
      </span>
      {type === 'normal' && (
        <span className="text-[9px] bg-white/20 text-purple-100 px-2 py-0.5 rounded-full font-semibold shrink-0">
          Ngấm vào Máu
        </span>
      )}
    </div>
  </div>
);

/** 4B: Pancreatic Islet Bouncy Platform (Đảo tụy Langerhans - Bouncy golden platform) */
export const PancreaticIsletBouncyPlatform: React.FC<PlatformVisualProps> = ({
  width = '100%',
  height = 44,
  label = 'Đảo Tụy Langerhans (Insulin & Glucagon)',
  className = '',
}) => (
  <div
    className={`relative rounded-3xl overflow-hidden shadow-xl border-2 border-amber-300/80 backdrop-blur-md hover:scale-[1.01] transition-transform ${className}`}
    style={{
      width,
      height: `${height}px`,
      background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.95) 0%, rgba(217, 119, 6, 0.9) 100%)',
    }}
  >
    {/* Golden hormone glow */}
    <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-yellow-100 via-amber-200 to-yellow-100 opacity-95 animate-pulse" />
    <div className="absolute inset-0 px-3 flex items-center justify-between text-amber-950 font-bold text-[11px] drop-shadow-xs">
      <span className="flex items-center gap-1.5 truncate">
        <span className="material-symbols-outlined text-sm text-amber-900">bolt</span>
        <span>{label}</span>
      </span>
      <span className="text-[9px] bg-yellow-200 text-amber-950 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide shrink-0 shadow-xs">
        BẬT NHẢY CAO ⬆
      </span>
    </div>
  </div>
);

/** 4C: Hormone Signal Speed Platform (Dòng tín hiệu hóa học gia tốc) */
export const HormoneSignalSpeedPlatform: React.FC<PlatformVisualProps> = ({
  width = '100%',
  height = 42,
  label = 'Dòng Tín Hiệu Thể Dịch (Hormone Máu)',
  className = '',
}) => (
  <div
    className={`relative rounded-3xl overflow-hidden shadow-lg border-2 border-emerald-200/80 backdrop-blur-md ${className}`}
    style={{
      width,
      height: `${height}px`,
      background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.92) 0%, rgba(5, 150, 105, 0.9) 100%)',
    }}
  >
    {/* Flowing animated stripes */}
    <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,#ffffff,#ffffff_10px,transparent_10px,transparent_20px)] animate-move-bg" />
    <div className="absolute top-0 left-0 right-0 h-2 bg-emerald-100 opacity-90 rounded-t-3xl" />
    <div className="absolute inset-0 px-3 flex items-center justify-between text-white font-bold text-[11px] drop-shadow-sm">
      <span className="flex items-center gap-1.5 truncate">
        <span className="material-symbols-outlined text-sm text-yellow-200">flash_on</span>
        <span>{label}</span>
      </span>
      <span className="text-[9px] bg-emerald-300 text-emerald-950 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide shrink-0">
        GIA TỐC ⏩
      </span>
    </div>
  </div>
);

// ============================================================================
// 5. INTERACTIVE OBJECTS & COLLECTIBLES
// ============================================================================

/** Insulin Hormone Molecule Collectible (Phân tử Insulin hạ đường huyết) */
export const InsulinHormoneCollectible: React.FC<{ size?: number; className?: string }> = ({
  size = 46,
  className = '',
}) => (
  <div
    className={`relative flex flex-col items-center justify-center animate-bounce select-none ${className}`}
    style={{ width: size, height: size }}
  >
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <defs>
        <radialGradient id="insGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="50%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </radialGradient>
      </defs>
      {/* Peptide twin chain key */}
      <circle cx="30" cy="30" r="22" fill="url(#insGrad)" stroke="#ffffff" strokeWidth="2.5" />
      {/* Disulfide cross-link bridges */}
      <line x1="20" y1="26" x2="40" y2="26" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
      <line x1="20" y1="34" x2="40" y2="34" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
      <circle cx="20" cy="26" r="3" fill="#ffffff" />
      <circle cx="40" cy="26" r="3" fill="#ffffff" />
      <circle cx="20" cy="34" r="3" fill="#ffffff" />
      <circle cx="40" cy="34" r="3" fill="#ffffff" />
    </svg>
    <span className="text-[9px] font-black text-emerald-950 bg-emerald-100/90 px-1.5 py-0.2 rounded-full -mt-1 shadow-xs border border-emerald-300">
      Insulin
    </span>
  </div>
);

/** Thyroxine Hormone Molecule Collectible (Hormone Tuyến Giáp Chứa I-ốt) */
export const ThyroxineHormoneCollectible: React.FC<{ size?: number; className?: string }> = ({
  size = 46,
  className = '',
}) => (
  <div
    className={`relative flex flex-col items-center justify-center animate-bounce select-none ${className}`}
    style={{ width: size, height: size }}
  >
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <defs>
        <radialGradient id="thxGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="50%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#c2410c" />
        </radialGradient>
      </defs>
      <circle cx="30" cy="30" r="22" fill="url(#thxGrad)" stroke="#ffffff" strokeWidth="2.5" />
      {/* 4 Iodine atoms (T4) */}
      <circle cx="20" cy="20" r="4.5" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="40" cy="20" r="4.5" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="20" cy="40" r="4.5" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="40" cy="40" r="4.5" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="30" cy="30" r="5" fill="#ffffff" />
    </svg>
    <span className="text-[9px] font-black text-amber-950 bg-amber-100/90 px-1.5 py-0.2 rounded-full -mt-1 shadow-xs border border-amber-300">
      Thyroxin (T₄)
    </span>
  </div>
);

/** Master Endocrine Guide Cell NPC (Tế Bào Tuyến Yên Chỉ Huy) */
export const EndocrineGuideCellNpc: React.FC<{ size?: number; className?: string }> = ({
  size = 72,
  className = '',
}) => (
  <div className={`flex flex-col items-center group cursor-pointer select-none ${className}`}>
    <div className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-md mb-1 animate-pulse flex items-center gap-1">
      <span className="material-symbols-outlined text-xs">campaign</span>
      <span>TS. Tuyến Yên Chỉ Huy</span>
    </div>
    <div
      className="relative rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-purple-400 flex items-center justify-center shadow-xl ring-4 ring-emerald-200 group-hover:scale-105 transition-transform"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.75} height={size * 0.75} viewBox="0 0 60 60" fill="none">
        <circle cx="30" cy="30" r="26" fill="#047857" fillOpacity="0.8" />
        <circle cx="30" cy="30" r="14" fill="#34d399" />
        {/* Crown of master gland */}
        <polygon points="20,18 25,12 30,16 35,12 40,18" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
        {/* Eyes & smile */}
        <circle cx="24" cy="28" r="3" fill="#ffffff" />
        <circle cx="36" cy="28" r="3" fill="#ffffff" />
        <path d="M 25,37 Q 30,42 35,37" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
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

/** Hormone Surge & Receptor Desensitization Hazard */
export const HormoneSurgeHazard: React.FC<{ width?: string; label?: string }> = ({
  width = '100%',
  label = 'Xung Rối Loạn Điều Hòa Đường Huyết (Khủng Hoảng Hormone)',
}) => (
  <div
    className="relative rounded-2xl overflow-hidden border-2 border-amber-400/80 shadow-inner"
    style={{
      width,
      height: '38px',
      background: 'linear-gradient(to top, #451a03 0%, #78350f 50%, #b45309 100%)',
    }}
  >
    <div className="absolute inset-0 flex items-center justify-around opacity-40">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-2.5 h-2.5 rounded-full bg-yellow-300 animate-ping" style={{ animationDelay: `${i * 0.25}s` }} />
      ))}
    </div>
    <div className="absolute inset-0 flex items-center justify-center gap-1.5 text-amber-200 text-xs font-bold animate-pulse">
      <span className="material-symbols-outlined text-sm text-yellow-300">warning</span>
      <span>{label}</span>
    </div>
  </div>
);

// ============================================================================
// 7. EDUCATIONAL VISUAL ELEMENTS
// ============================================================================

/** Educational Endocrine Signaling Concept Card */
export const EndocrineConceptCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-4 rounded-3xl bg-surface/95 backdrop-blur-xl border border-emerald-200 shadow-xl text-left ${className}`}>
    <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-emerald-100">
      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
        <span className="material-symbols-outlined text-lg">alt_route</span>
      </div>
      <div>
        <h4 className="font-bold text-sm text-on-surface">Cơ Chế Tác Dụng Của Tuyến Nội Tiết (Sinh học 8)</h4>
        <span className="text-[11px] text-emerald-600 font-semibold">Tuyến → Máu → Tế bào đích có Thụ thể (Khóa & Chìa)</span>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
      <div className="p-2 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col items-center">
        <span className="font-bold text-purple-700 text-[11px]">1. Không có ống dẫn</span>
        <span className="text-[10px] text-purple-900 mt-1">Sản phẩm tiết (hormone) ngấm thẳng vào dòng máu.</span>
      </div>
      <div className="p-2 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center">
        <span className="font-bold text-amber-700 text-[11px]">2. Tính đặc hiệu cao</span>
        <span className="text-[10px] text-amber-900 mt-1">Hormone chỉ tác dụng lên tế bào đích có thụ thể tương ứng.</span>
      </div>
      <div className="p-2 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center">
        <span className="font-bold text-emerald-700 text-[11px]">3. Hiệu lực sinh học lớn</span>
        <span className="text-[10px] text-emerald-900 mt-1">Một lượng cực nhỏ cũng gây chuyển biến sinh lý mạnh mẽ.</span>
      </div>
    </div>
  </div>
);
