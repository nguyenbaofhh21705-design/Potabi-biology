/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * WORLD 8: REPRODUCTIVE SYSTEM (HỆ SINH DỤC & THỤ TINH KHOA HỌC)
 * Bio Blossom Tactile 2D Game Assets & SVG Definitions (Grade 8 Biology Education)
 * Palette: Soft rose pink, lavender, pale blue, warm cream, gentle coral
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

/** Layer 1: Distant Cellular Domes & Protective Biological Envelopes */
export const ReproductiveBackgroundDistant: React.FC<LayerProps> = ({
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
      <linearGradient id="reproDistantGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4c0519" stopOpacity="0.4" />
        <stop offset="40%" stopColor="#831843" stopOpacity="0.3" />
        <stop offset="80%" stopColor="#4c1d95" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.5" />
      </linearGradient>
      <radialGradient id="ovumDomeGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f472b6" stopOpacity="0.38" />
        <stop offset="100%" stopColor="#9d174d" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="gameteFieldGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Distant soft uterine & oviduct tissue ridges */}
    <path
      d="M0,430 C300,320 620,410 940,340 C1260,270 1580,370 1920,320 L1920,600 L0,600 Z"
      fill="url(#reproDistantGrad)"
    />

    {/* Distant majestic Ovum cell dome (Tế bào Trứng noãn bào vĩ đại) */}
    <circle cx="360" cy="280" r="170" fill="url(#ovumDomeGlow)" />
    <circle cx="1120" cy="240" r="190" fill="url(#ovumDomeGlow)" />
    <circle cx="1680" cy="290" r="150" fill="url(#gameteFieldGlow)" />

    {/* Soft glowing biological pathways */}
    <path
      d="M80,360 Q360,180 640,310 T1140,230 T1620,280 T1920,340"
      stroke="#fda4af"
      strokeWidth="5"
      strokeDasharray="18 22"
      strokeLinecap="round"
      strokeOpacity="0.45"
      fill="none"
    />
  </svg>
);

/** Layer 2: Mid-ground Ciliated Conduit & Zona Pellucida Glow */
export const ReproductiveBackgroundMid: React.FC<LayerProps> = ({
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
      <linearGradient id="reproConduitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f472b6" stopOpacity="0.45" />
        <stop offset="30%" stopColor="#c084fc" stopOpacity="0.55" />
        <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#fb7185" stopOpacity="0.55" />
      </linearGradient>
    </defs>

    {/* Fallopian ciliated conduit passage (Ống dẫn trứng mềm mại) */}
    <path
      d="M -40,360 C 240,260 380,480 640,380 C 900,280 1060,460 1320,340 C 1580,220 1720,420 1980,350"
      stroke="url(#reproConduitGrad)"
      strokeWidth="54"
      strokeLinecap="round"
      fill="none"
    />

    {/* Luminal fluid stream with guidance cilia waves */}
    <path
      d="M -40,360 C 240,260 380,480 640,380 C 900,280 1060,460 1320,340 C 1580,220 1720,420 1980,350"
      stroke="#ffe4e6"
      strokeWidth="12"
      strokeDasharray="22 30"
      strokeLinecap="round"
      strokeOpacity="0.65"
      fill="none"
    />

    {/* Scientific Egg Cell (Ovum) in midground with corona radiata cells */}
    <g transform="translate(820, 160) scale(0.68)" opacity="0.85">
      <circle cx="100" cy="100" r="75" fill="#fbcfe8" fillOpacity="0.75" stroke="#f472b6" strokeWidth="6" />
      {/* Corona radiata follicle satellites */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x = 100 + 82 * Math.cos(angle);
        const y = 100 + 82 * Math.sin(angle);
        return <circle key={i} cx={x} cy={y} r="10" fill="#f472b6" fillOpacity="0.5" />;
      })}
      <circle cx="100" cy="100" r="28" fill="#fda4af" stroke="#ffffff" strokeWidth="3" />
      <text x="100" y="105" textAnchor="middle" fill="#831843" fontSize="13" fontWeight="bold">
        n=23
      </text>
    </g>
  </svg>
);

/** Layer 3: Foreground Floating Biological Vesicles & Haploid Signals */
export const ReproductiveBackgroundNear: React.FC<LayerProps> = ({
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
    {[
      { cx: 160, cy: 190, r: 13, fill: '#f472b6' },
      { cx: 380, cy: 390, r: 16, fill: '#7dd3fc' },
      { cx: 660, cy: 180, r: 10, fill: '#c084fc' },
      { cx: 920, cy: 420, r: 14, fill: '#fbcfe8' },
      { cx: 1180, cy: 190, r: 12, fill: '#fef08a' },
      { cx: 1460, cy: 380, r: 15, fill: '#fda4af' },
      { cx: 1740, cy: 210, r: 11, fill: '#bae6fd' },
    ].map((b, idx) => (
      <g key={idx} className="animate-pulse" style={{ animationDuration: `${3 + (idx % 3) * 0.6}s` }}>
        <circle cx={b.cx} cy={b.cy} r={b.r} fill={b.fill} fillOpacity="0.45" />
        <circle cx={b.cx - b.r * 0.3} cy={b.cy - b.r * 0.3} r={b.r * 0.3} fill="#ffffff" fillOpacity="0.85" />
      </g>
    ))}
  </svg>
);

// ============================================================================
// 2 & 3. DECORATIONS (BACKGROUND & FOREGROUND)
// ============================================================================

/** Scientific Gamete Cell Duo (Trứng & Tinh Trùng Khoa Học n=23) */
export const GameteDuoDeco: React.FC<{ size?: number; className?: string }> = ({
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
    {/* Scientific Ovum (Noãn bào n=23) */}
    <circle cx="65" cy="80" r="48" fill="#fbcfe8" fillOpacity="0.85" stroke="#f472b6" strokeWidth="5" />
    <circle cx="65" cy="80" r="22" fill="#fda4af" stroke="#ffffff" strokeWidth="2.5" />
    <text x="65" y="85" textAnchor="middle" fill="#881337" fontSize="12" fontWeight="bold">
      n = 23
    </text>

    {/* Scientific Spermatozoon approach (Tinh trùng tế bào n=23) */}
    <g transform="translate(100, 45) rotate(-35)">
      {/* Head */}
      <ellipse cx="20" cy="15" rx="14" ry="9" fill="#7dd3fc" stroke="#38bdf8" strokeWidth="3" />
      {/* Midpiece mitochondria */}
      <rect x="33" y="12" width="10" height="6" rx="2" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />
      {/* Flagellum wave tail */}
      <path d="M 43,15 Q 55,8 65,16 T 85,15" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <text x="19" y="18" textAnchor="middle" fill="#0369a1" fontSize="9" fontWeight="bold">
        n=23
      </text>
    </g>
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

/** 4A: Ciliated Oviduct Platform (Thềm biểu bì lông rung vòi trứng) */
export const CiliatedOviductPlatform: React.FC<PlatformVisualProps> = ({
  width = '100%',
  height = 42,
  label = 'Thềm Lông Rung Vòi Trứng (Dẫn Đường)',
  type = 'normal',
  className = '',
}) => (
  <div
    className={`relative rounded-3xl overflow-hidden shadow-lg border-2 border-pink-200/80 backdrop-blur-md ${className}`}
    style={{
      width,
      height: `${height}px`,
      background: 'linear-gradient(135deg, rgba(244, 114, 182, 0.94) 0%, rgba(190, 24, 93, 0.9) 100%)',
    }}
  >
    {/* Microscopic wave cilia top border */}
    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-100 via-rose-100 to-purple-100 opacity-90 rounded-t-3xl" />
    <div className="absolute inset-0 px-3 flex items-center justify-between text-white font-bold text-[11px] drop-shadow-sm">
      <span className="flex items-center gap-1.5 truncate">
        <span className="material-symbols-outlined text-sm text-pink-200">waves</span>
        <span>{label}</span>
      </span>
      {type === 'normal' && (
        <span className="text-[9px] bg-white/20 text-pink-100 px-2 py-0.5 rounded-full font-semibold shrink-0">
          Chuyển động nhu động
        </span>
      )}
    </div>
  </div>
);

/** 4B: Zona Pellucida Bouncy Platform (Màng trong suốt noãn bào - Bouncy spring) */
export const ZonaPellucidaBouncyPlatform: React.FC<PlatformVisualProps> = ({
  width = '100%',
  height = 44,
  label = 'Màng Noãn Bào Đàn Hồi (Zona Pellucida)',
  className = '',
}) => (
  <div
    className={`relative rounded-3xl overflow-hidden shadow-xl border-2 border-rose-300/80 backdrop-blur-md hover:scale-[1.01] transition-transform ${className}`}
    style={{
      width,
      height: `${height}px`,
      background: 'linear-gradient(135deg, rgba(251, 113, 133, 0.95) 0%, rgba(225, 29, 72, 0.9) 100%)',
    }}
  >
    {/* Resilient springy rim */}
    <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-yellow-200 via-rose-100 to-amber-200 opacity-95 animate-pulse" />
    <div className="absolute inset-0 px-3 flex items-center justify-between text-white font-bold text-[11px] drop-shadow-sm">
      <span className="flex items-center gap-1.5 truncate">
        <span className="material-symbols-outlined text-sm text-yellow-200">radio_button_checked</span>
        <span>{label}</span>
      </span>
      <span className="text-[9px] bg-yellow-300 text-rose-950 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide shrink-0 shadow-xs">
        BẬT NHẢY CAO ⬆
      </span>
    </div>
  </div>
);

/** 4C: Gamete Conduit Speed Platform (Dòng dịch nuôi dưỡng tế bào gia tốc) */
export const GameteConduitSpeedPlatform: React.FC<PlatformVisualProps> = ({
  width = '100%',
  height = 42,
  label = 'Dòng Dịch Dinh Dưỡng Vận Động Gia Tốc',
  className = '',
}) => (
  <div
    className={`relative rounded-3xl overflow-hidden shadow-lg border-2 border-sky-200/80 backdrop-blur-md ${className}`}
    style={{
      width,
      height: `${height}px`,
      background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.92) 0%, rgba(3, 105, 161, 0.9) 100%)',
    }}
  >
    <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,#ffffff,#ffffff_10px,transparent_10px,transparent_20px)] animate-move-bg" />
    <div className="absolute top-0 left-0 right-0 h-2 bg-sky-100 opacity-90 rounded-t-3xl" />
    <div className="absolute inset-0 px-3 flex items-center justify-between text-white font-bold text-[11px] drop-shadow-sm">
      <span className="flex items-center gap-1.5 truncate">
        <span className="material-symbols-outlined text-sm text-sky-200">near_me</span>
        <span>{label}</span>
      </span>
      <span className="text-[9px] bg-sky-300 text-sky-950 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide shrink-0">
        GIA TỐC ⏩
      </span>
    </div>
  </div>
);

// ============================================================================
// 5. INTERACTIVE OBJECTS & COLLECTIBLES
// ============================================================================

/** Haploid Chromosome Set Collectible (Bộ Nhiễm Sắc Thể Đơn Bội n = 23) */
export const ChromosomeHaploidCollectible: React.FC<{ size?: number; className?: string }> = ({
  size = 46,
  className = '',
}) => (
  <div
    className={`relative flex flex-col items-center justify-center animate-bounce select-none ${className}`}
    style={{ width: size, height: size }}
  >
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <defs>
        <radialGradient id="chromGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ddd6fe" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7e22ce" />
        </radialGradient>
      </defs>
      {/* Chromosome X shape */}
      <path
        d="M 18,12 C 18,18 26,26 26,30 C 26,34 18,42 18,48 C 22,50 26,46 30,36 C 34,46 38,50 42,48 C 42,42 34,34 34,30 C 34,26 42,18 42,12 C 38,10 34,14 30,24 C 26,14 22,10 18,12 Z"
        fill="url(#chromGrad)"
        stroke="#ffffff"
        strokeWidth="2.5"
      />
      <circle cx="30" cy="30" r="3.5" fill="#fef08a" />
    </svg>
    <span className="text-[9px] font-black text-purple-950 bg-purple-100/90 px-1.5 py-0.2 rounded-full -mt-1 shadow-xs border border-purple-300">
      NST n = 23
    </span>
  </div>
);

/** Ovum Nutrient Sphere Collectible (Hạt Dinh Dưỡng Noãn Bào) */
export const OvumNutrientCollectible: React.FC<{ size?: number; className?: string }> = ({
  size = 46,
  className = '',
}) => (
  <div
    className={`relative flex flex-col items-center justify-center animate-bounce select-none ${className}`}
    style={{ width: size, height: size }}
  >
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <defs>
        <radialGradient id="nutriGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
      </defs>
      <circle cx="30" cy="30" r="22" fill="url(#nutriGrad)" stroke="#ffffff" strokeWidth="2.5" />
      <circle cx="23" cy="23" r="5" fill="#ffffff" fillOpacity="0.85" />
    </svg>
    <span className="text-[9px] font-black text-amber-950 bg-amber-100/90 px-1.5 py-0.2 rounded-full -mt-1 shadow-xs border border-amber-300">
      Noãn Hoàng
    </span>
  </div>
);

/** Friendly Biology Educator Cell NPC (TS. Tế Bào Mầm Sinh Học) */
export const ReproductiveGuideCellNpc: React.FC<{ size?: number; className?: string }> = ({
  size = 72,
  className = '',
}) => (
  <div className={`flex flex-col items-center group cursor-pointer select-none ${className}`}>
    <div className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold shadow-md mb-1 animate-pulse flex items-center gap-1">
      <span className="material-symbols-outlined text-xs">biotech</span>
      <span>TS. Tế Bào Mầm</span>
    </div>
    <div
      className="relative rounded-3xl bg-gradient-to-tr from-rose-400 via-pink-400 to-sky-300 flex items-center justify-center shadow-xl ring-4 ring-rose-200 group-hover:scale-105 transition-transform"
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.75} height={size * 0.75} viewBox="0 0 60 60" fill="none">
        <circle cx="30" cy="30" r="26" fill="#be185d" fillOpacity="0.8" />
        <circle cx="30" cy="30" r="14" fill="#f472b6" />
        {/* Friendly eyes */}
        <circle cx="24" cy="27" r="3.5" fill="#ffffff" />
        <circle cx="36" cy="27" r="3.5" fill="#ffffff" />
        <circle cx="25" cy="27" r="1.5" fill="#000000" />
        <circle cx="37" cy="27" r="1.5" fill="#000000" />
        {/* Smile */}
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

/** Viscous Mucus Resistance Barrier Hazard (Dòng dịch nhầy quá mức) */
export const ViscousMucusHazard: React.FC<{ width?: string; label?: string }> = ({
  width = '100%',
  label = 'Vùng Dịch Nhầy Cản Trở Chuyển Động Tế Bào',
}) => (
  <div
    className="relative rounded-2xl overflow-hidden border-2 border-pink-400/80 shadow-inner"
    style={{
      width,
      height: '38px',
      background: 'linear-gradient(to top, #500724 0%, #831843 50%, #9d174d 100%)',
    }}
  >
    <div className="absolute inset-0 flex items-center justify-around opacity-40">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-2.5 h-2.5 rounded-full bg-pink-300 animate-ping" style={{ animationDelay: `${i * 0.25}s` }} />
      ))}
    </div>
    <div className="absolute inset-0 flex items-center justify-center gap-1.5 text-pink-200 text-xs font-bold animate-pulse">
      <span className="material-symbols-outlined text-sm text-yellow-300">warning</span>
      <span>{label}</span>
    </div>
  </div>
);

// ============================================================================
// 7. EDUCATIONAL VISUAL ELEMENTS
// ============================================================================

/** Educational Fertilization Science Concept Card (Sinh học 8) */
export const FertilizationConceptCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`p-4 rounded-3xl bg-surface/95 backdrop-blur-xl border border-rose-200 shadow-xl text-left ${className}`}>
    <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-rose-100">
      <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
        <span className="material-symbols-outlined text-lg">spa</span>
      </div>
      <div>
        <h4 className="font-bold text-sm text-on-surface">Khoa Học Thụ Tinh & Thụ Thai (Sinh học 8)</h4>
        <span className="text-[11px] text-rose-600 font-semibold">Giao tử Đực (n=23) + Giao tử Cái (n=23) = Hợp tử (2n=46)</span>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
      <div className="p-2 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col items-center">
        <span className="font-bold text-sky-700 text-[11px]">1. Tế bào giao tử đơn bội</span>
        <span className="text-[10px] text-sky-900 mt-1">Trứng và tinh trùng đều mang bộ NST đơn bội n = 23 chiếc.</span>
      </div>
      <div className="p-2 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col items-center">
        <span className="font-bold text-rose-700 text-[11px]">2. Sự Thụ tinh (Fertilization)</span>
        <span className="text-[10px] text-rose-900 mt-1">Kết hợp tại 1/3 ngoài ống dẫn trứng tạo hợp tử lưỡng bội 2n = 46.</span>
      </div>
      <div className="p-2 rounded-2xl bg-purple-50 border border-purple-200 flex flex-col items-center">
        <span className="font-bold text-purple-700 text-[11px]">3. Sự Thụ thai & Phát triển</span>
        <span className="text-[10px] text-purple-900 mt-1">Phôi di chuyển xuống làm tổ an toàn trong niêm mạc tử cung.</span>
      </div>
    </div>
  </div>
);
