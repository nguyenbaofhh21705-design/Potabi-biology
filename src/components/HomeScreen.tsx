/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { User } from '@supabase/supabase-js';
import { IMAGES, STAGES } from '../data/biologyData';
import {
  GameProgressState,
  PlayerProfileRecord,
  calculateExplorerLevel,
} from '../data/gameProgress';
import { ScreenMode } from '../App';

interface HomeScreenProps {
  gameState: GameProgressState;
  playerProfile: PlayerProfileRecord | null;
  currentUser: User | null;
  onNavigate: (screen: ScreenMode) => void;
  onStartOrContinueAdventure: () => void;
  onOpenLabTool: (tool: 'notebook' | 'microscope' | 'stain') => void;
  onRequestEnterStomach2D: () => void;
  onOpenAuthModal: () => void;
}

// Fun biological dialogue tips for Potabi when tapped
const POTABI_BIOLOGY_QUOTES = [
  'Chào Nhà Thám Hiểm! Potabi đã sẵn sàng cùng bạn phiêu lưu vào cơ thể người!',
  'Bạn có biết? Tuyến nước bọt tiết ra enzym Amylase giúp thủy phân tinh bột chín ở pH 7.2!',
  'Thành dạ dày có cấu tạo 3 lớp cơ trơn siêu khỏe: cơ dọc, cơ vòng và cơ chéo!',
  'Chất nhầy Mucin phủ kín niêm mạc dạ dày để bảo vệ tế bào khỏi axit HCl pH 1.5 - 2.5 đó!',
  'Enzym Pepsin cần môi trường axit HCl đậm đặc để hoạt hóa và cắt đứt chuỗi protein!',
  'Hãy nhấn nút hành động để bước vào màn chơi 2D Hang Dạ Dày cùng Potabi nhé!',
];

export function HomeScreen({
  gameState,
  playerProfile,
  currentUser,
  onNavigate,
  onStartOrContinueAdventure,
  onOpenLabTool,
  onRequestEnterStomach2D,
  onOpenAuthModal,
}: HomeScreenProps) {
  // Parallax mouse position
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [potabiQuoteIdx, setPotabiQuoteIdx] = useState(0);
  const [potabiBounce, setPotabiBounce] = useState(false);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [isAudioMuted, setIsAudioMuted] = useState(true);

  // Audio synthesis for tactile clicks
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playTone = (freq = 523.25, type: OscillatorType = 'sine', duration = 0.15) => {
    if (isAudioMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + duration);
      }
    } catch {
      // Audio not supported or blocked
    }
  };

  // Determine whether this is a brand new player or returning explorer
  const isNewPlayer = useMemo(() => {
    const hasProgress =
      gameState.cutsceneSeen ||
      (gameState.completedStations && gameState.completedStations.length > 0) ||
      (gameState.completedStageIds && gameState.completedStageIds.length > 0) ||
      gameState.exp > 0;
    return !hasProgress;
  }, [gameState]);

  const { level, percent } = useMemo(
    () => calculateExplorerLevel(gameState.exp),
    [gameState.exp]
  );

  const completedStationsCount = (gameState.completedStations || []).length;
  const completedQuestsCount = useMemo(() => {
    let count = 0;
    if (gameState.weeklyQuests.enzymeQuizDone) count++;
    if (gameState.weeklyQuests.bloodCellMatchDone) count++;
    if (gameState.weeklyQuests.oxygenPathDone) count++;
    return count;
  }, [gameState.weeklyQuests]);

  // Handle gentle mouse movement for subtle depth parallax
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({
      x: Math.max(-1, Math.min(1, xRatio)),
      y: Math.max(-1, Math.min(1, yRatio)),
    });
  };

  const handlePotabiClick = (e: React.MouseEvent) => {
    playTone(659.25, 'sine', 0.2); // E5 note
    setPotabiBounce(true);
    setPotabiQuoteIdx((prev) => (prev + 1) % POTABI_BIOLOGY_QUOTES.length);

    // Spawn tiny heart sparkles
    const rect = e.currentTarget.getBoundingClientRect();
    const newSparkle = {
      id: Date.now(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setSparkles((prev) => [...prev.slice(-4), newSparkle]);

    setTimeout(() => setPotabiBounce(false), 600);
  };

  useEffect(() => {
    if (sparkles.length === 0) return;
    const timer = setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => Date.now() - s.id < 1200));
    }, 1200);
    return () => clearTimeout(timer);
  }, [sparkles]);

  // Current adventure status label
  const currentObjectiveText = useMemo(() => {
    if (isNewPlayer) {
      return 'Bắt đầu cuộc phiêu lưu: Theo chân Potabi thu nhỏ kích thước tiến vào thế giới tế bào!';
    }
    if ((gameState.completedStageIds || []).length >= 5) {
      return 'Chúc mừng Bậc Thầy Sinh Học! Bạn đã hoàn thành 5/5 Đại Hệ Cơ Quan và mở khóa toàn bộ tiêu bản Sinh học 8. Tự do phiêu lưu và ôn luyện bất kỳ trạm nào!';
    }
    if (!gameState.completedStations.includes('tram-1')) {
      return 'Trạm 1: Khám phá Khoang Miệng & Enzym Amylase biến đổi tinh bột.';
    }
    if (!gameState.completedStations.includes('tram-2')) {
      return 'Trạm 2: Vượt qua Hang Dạ Dày co bóp & Thử thách dịch vị HCl pH 2.0.';
    }
    if (!gameState.completedStations.includes('tram-3')) {
      return 'Trạm 3: Pepsin phân giải chuỗi protein & Mở khóa Màn 2 Hệ Tuần Hoàn!';
    }
    return 'Hang Dạ Dày đã hoàn thành xuất sắc! Tiếp tục tới Buồng Tim & Vòng Tuần Hoàn.';
  }, [isNewPlayer, gameState.completedStations, gameState.completedStageIds]);

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#fff2f5] via-[#fff7f9] to-[#f5f9fc]"
    >
      {/* ============================================================== */}
      {/* 2D ADVENTURE WORLD BACKGROUND WITH MULTI-LAYERED DEPTH           */}
      {/* ============================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Layer 0: Bioluminescent sky glow & ambient lighting */}
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[120vw] max-w-6xl h-96 rounded-full bg-gradient-to-b from-primary-fixed/40 via-secondary-fixed/30 to-transparent blur-3xl opacity-70 transition-transform duration-700 ease-out"
          style={{
            transform: `translate3d(calc(-50% + ${mouseOffset.x * 12}px), ${mouseOffset.y * 8}px, 0)`,
          }}
        />

        {/* Ambient floating spores / ATP particles */}
        <div className="absolute inset-0">
          {[
            { top: '15%', left: '10%', delay: '0s', size: 'w-3 h-3', color: 'bg-primary/20' },
            { top: '25%', left: '80%', delay: '1.2s', size: 'w-4 h-4', color: 'bg-tertiary-fixed-dim/30' },
            { top: '45%', left: '22%', delay: '2.5s', size: 'w-2.5 h-2.5', color: 'bg-sky-300/30' },
            { top: '60%', left: '72%', delay: '0.8s', size: 'w-3.5 h-3.5', color: 'bg-pink-300/30' },
            { top: '75%', left: '15%', delay: '3.1s', size: 'w-3 h-3', color: 'bg-emerald-300/30' },
            { top: '35%', left: '50%', delay: '1.8s', size: 'w-2 h-2', color: 'bg-amber-300/30' },
          ].map((spore, idx) => (
            <div
              key={idx}
              className={`absolute rounded-full ${spore.size} ${spore.color} blur-[1px] animate-pulse`}
              style={{
                top: spore.top,
                left: spore.left,
                animationDelay: spore.delay,
                animationDuration: '4s',
              }}
            />
          ))}
        </div>

        {/* Layer 1 (Distant): Microscopic Organ Mountain Silhouettes & Cellular Domes */}
        <svg
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          className="absolute bottom-32 sm:bottom-28 w-full h-56 sm:h-72 opacity-40 transition-transform duration-500 ease-out"
          style={{
            transform: `translate3d(${mouseOffset.x * -10}px, ${mouseOffset.y * -6}px, 0)`,
          }}
        >
          <defs>
            <linearGradient id="bioHillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f7b5c3" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#dfbfc2" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="bioCitadelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f9bc4e" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#e2849b" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {/* Distant rolling cellular hills */}
          <path
            d="M0,280 C240,160 480,240 720,180 C960,120 1200,200 1440,150 L1440,400 L0,400 Z"
            fill="url(#bioHillGrad1)"
          />
          {/* Distant Stomach Cavern & Heart Chamber structures */}
          <circle cx="360" cy="180" r="42" fill="url(#bioCitadelGrad)" />
          <circle cx="1080" cy="150" r="54" fill="url(#bioCitadelGrad)" />
          <path
            d="M360,140 Q400,100 440,140 Q480,180 440,220 Q400,260 360,220 Z"
            fill="#fad7db"
            opacity="0.3"
          />
        </svg>

        {/* Layer 2 (Midground): Bio Blossom Trees & Giant Flowering Chloroplasts */}
        <div
          className="absolute bottom-20 sm:bottom-16 w-full h-48 sm:h-64 pointer-events-none transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${mouseOffset.x * -18}px, ${mouseOffset.y * -10}px, 0)`,
          }}
        >
          {/* Left Bio Blossom Tree cluster */}
          <div className="absolute left-[-20px] sm:left-6 bottom-0 w-44 sm:w-60 h-44 sm:h-60 opacity-80 animate-sway-slow">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
              <path
                d="M100,200 C95,140 85,110 70,80 C60,60 45,50 40,30"
                stroke="#804d59"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M80,120 C100,100 120,80 135,50"
                stroke="#804d59"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              {/* Petals / Blossom Clusters */}
              <circle cx="40" cy="30" r="26" fill="#fcdade" />
              <circle cx="30" cy="20" r="18" fill="#ffd9e4" />
              <circle cx="55" cy="35" r="16" fill="#f7b5c3" />
              <circle cx="135" cy="50" r="24" fill="#fad7db" />
              <circle cx="145" cy="40" r="16" fill="#ffd9e0" />
              <circle cx="70" cy="75" r="18" fill="#fcdade" />
            </svg>
          </div>

          {/* Right Micro-villi and Glowing Enzyme tendril flora */}
          <div className="absolute right-[-10px] sm:right-10 bottom-0 w-40 sm:w-56 h-40 sm:h-56 opacity-85">
            <svg viewBox="0 0 180 180" className="w-full h-full drop-shadow-sm">
              {/* Villi stalks */}
              <path
                d="M40,180 Q45,120 55,80 Q65,40 70,20"
                stroke="#683844"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="70" cy="20" r="16" fill="#ffdeab" />
              <circle cx="70" cy="20" r="9" fill="#f9bc4e" />

              <path
                d="M110,180 Q115,130 125,95 Q135,60 145,35"
                stroke="#683844"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="145" cy="35" r="20" fill="#fcdade" />
              <circle cx="145" cy="35" r="12" fill="#ffd9e4" />

              <path
                d="M80,180 Q85,140 95,110 Q100,85 102,65"
                stroke="#683844"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="102" cy="65" r="14" fill="#bae6fd" />
            </svg>
          </div>
        </div>

        {/* Layer 3 (Foreground): The Meandering Biological Exploration Path */}
        <svg
          viewBox="0 0 1440 260"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full h-36 sm:h-52 drop-shadow-md transition-transform duration-200 ease-out"
          style={{
            transform: `translate3d(${mouseOffset.x * -8}px, 0, 0)`,
          }}
        >
          <defs>
            <linearGradient id="bioGroundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffe8ee" />
              <stop offset="40%" stopColor="#ffd9e4" />
              <stop offset="100%" stopColor="#fad7db" />
            </linearGradient>
            <linearGradient id="bioPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff8f8" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#fff0f3" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffdeab" stopOpacity="0.75" />
            </linearGradient>
          </defs>
          {/* Meadow hill */}
          <path
            d="M0,80 C360,30 720,110 1080,50 C1260,20 1380,40 1440,60 L1440,260 L0,260 Z"
            fill="url(#bioGroundGrad)"
          />
          {/* Tactile cobblestone / biological winding road */}
          <path
            d="M-50,260 C200,240 450,170 650,150 C850,130 1100,100 1440,110 L1440,190 C1100,180 850,210 650,230 C450,250 200,260 -50,260 Z"
            fill="url(#bioPathGrad)"
          />
          {/* Bioluminescent moss pebbles along the road */}
          <circle cx="480" cy="180" r="5" fill="#f7b5c3" opacity="0.8" />
          <circle cx="560" cy="195" r="4" fill="#f9bc4e" opacity="0.8" />
          <circle cx="680" cy="175" r="6" fill="#38bdf8" opacity="0.7" />
          <circle cx="820" cy="160" r="5" fill="#f7b5c3" opacity="0.8" />
          <circle cx="980" cy="140" r="6" fill="#f9bc4e" opacity="0.7" />
        </svg>
      </div>

      {/* ============================================================== */}
      {/* TOP COMPACT EXPEDITION BAR (Sub-header inside game world)      */}
      {/* ============================================================== */}
      <div className="relative z-20 w-full px-4 sm:px-6 md:px-margin pt-4 pb-2">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 bg-surface-container-lowest/80 backdrop-blur-md px-4 sm:px-6 py-2.5 rounded-3xl border border-surface-container-high/60 shadow-[0_2px_12px_rgba(49,16,30,0.04)]">
          {/* World State & Current Level */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <span className="material-symbols-outlined text-2xl font-bold">explore</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  {playerProfile?.display_name || 'Nhà Thám Hiểm Vi Mô'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-[11px] font-bold">
                  Cấp {level}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-24 sm:w-36 h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-[11px] font-medium text-on-surface-variant">
                  {gameState.exp} EXP
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats: Diamonds, Unlocked Specimens, and Audio Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full text-tertiary font-label-md text-label-md font-bold">
              <span className="material-symbols-outlined text-base">diamond</span>
              <span>{gameState.diamonds}</span>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-base text-primary">biotech</span>
              <span>{gameState.unlockedSpecimens.length} Mẫu vật</span>
            </div>

            {/* Tactile Audio Synthesis Toggle */}
            <button
              onClick={() => {
                const next = !isAudioMuted;
                setIsAudioMuted(next);
                if (!next) playTone(587.33, 'sine', 0.15);
              }}
              title={isAudioMuted ? 'Bật âm thanh tương tác' : 'Tắt âm thanh'}
              className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">
                {isAudioMuted ? 'volume_off' : 'volume_up'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MAIN 2D STAGE AREA: POTABI + PRIMARY ACTION CALL-TO-ACTION     */}
      {/* ============================================================== */}
      <div className="relative z-20 flex-1 flex flex-col justify-center items-center px-4 py-4 md:py-6">
        <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 lg:gap-16">
          {/* ========================================================== */}
          {/* CENTRAL CHARACTER: POTABI THE BLUE ADVENTURER              */}
          {/* ========================================================== */}
          <div className="flex flex-col items-center relative group select-none">
            {/* Interactive Speech Bubble with Biology Tidbits */}
            <div
              onClick={() => {
                playTone(523.25, 'sine', 0.1);
                setPotabiQuoteIdx((prev) => (prev + 1) % POTABI_BIOLOGY_QUOTES.length);
              }}
              className="relative mb-3 max-w-xs sm:max-w-sm px-4 py-3 rounded-2xl bg-surface/95 backdrop-blur-md border border-primary/20 shadow-[0_6px_20px_rgba(128,77,89,0.12)] text-center cursor-pointer hover:border-primary/40 transition-all hover:scale-[1.02] active:scale-98"
            >
              <p className="text-body-sm font-semibold text-on-surface leading-snug">
                “{POTABI_BIOLOGY_QUOTES[potabiQuoteIdx]}”
              </p>
              <span className="text-[10px] text-primary/80 font-bold block mt-1">
                (Chạm vào Potabi để trò chuyện ✨)
              </span>

              {/* Bubble pointer triangle */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-surface rotate-45 border-r border-b border-primary/20" />
            </div>

            {/* Potabi Character Body */}
            <div
              onClick={handlePotabiClick}
              className={`relative cursor-pointer transition-transform duration-300 ease-out ${
                potabiBounce ? 'scale-110 -translate-y-4' : 'hover:scale-105'
              }`}
            >
              {/* Soft pulsating biological aura */}
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse-halo pointer-events-none" />

              {/* Potabi blue SVG official asset */}
              <img
                src={IMAGES.potabiBlueAvatar}
                alt="Potabi Xanh Dương - Nhân vật Thám Hiểm 2D"
                className="relative z-10 w-44 sm:w-56 md:w-64 h-auto object-contain animate-potabi-idle drop-shadow-[0_12px_24px_rgba(49,16,30,0.15)]"
                draggable={false}
              />

              {/* Soft shadow that pulses with Potabi's bounce */}
              <div className="mx-auto w-32 sm:w-40 h-5 bg-[#804d59]/25 rounded-full blur-sm animate-shadow-pulse mt-[-8px]" />

              {/* Floating Sparkle Emitters when clicked */}
              {sparkles.map((sp) => (
                <div
                  key={sp.id}
                  className="absolute pointer-events-none text-tertiary-fixed-dim text-lg animate-bounce"
                  style={{
                    left: `${sp.x}px`,
                    top: `${sp.y - 30}px`,
                    animationDuration: '0.8s',
                  }}
                >
                  ✨
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================== */}
          {/* PRIMARY ACTION BUTTON & EXPEDITION BRIEF                   */}
          {/* ========================================================== */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-md w-full">
            {/* World Title Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary-container/80 text-on-secondary-container border border-secondary-container mb-2">
              <span className="material-symbols-outlined text-sm font-bold text-primary">local_florist</span>
              <span className="text-[12px] font-bold tracking-wide uppercase">
                Thế Giới Vi Mô 2D • Học Viện Sinh Học
              </span>
            </div>

            <h1 className="text-headline-lg sm:text-headline-xl font-bold text-on-surface tracking-tight mb-2">
              Chuyến Thám Hiểm <br className="hidden sm:inline" />
              <span className="text-primary bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
                Cơ Thể Người
              </span>
            </h1>

            {/* Current Quest Briefing Box */}
            <div className="w-full bg-surface-container-low/90 backdrop-blur-md border border-surface-container-high rounded-2xl p-3.5 sm:p-4 mb-5 text-left shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[11px] font-bold uppercase text-primary tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">flag</span>
                  Nhiệm vụ trọng tâm
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed">
                  {isNewPlayer ? 'Khởi hành' : `Đã hoàn thành ${completedStationsCount}/3`}
                </span>
              </div>
              <p className="text-body-sm text-on-surface leading-relaxed font-medium">
                {currentObjectiveText}
              </p>
            </div>

            {/* Prominent Play / Continue Button */}
            <div className="relative w-full sm:w-auto">
              {/* Outer pulsing energy halo */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary to-tertiary-fixed-dim opacity-40 blur-lg animate-pulse-halo" />

              <button
                onClick={() => {
                  playTone(783.99, 'sine', 0.25); // G5 note
                  onStartOrContinueAdventure();
                }}
                className="relative w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-4.5 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline-sm sm:font-headline-md text-headline-sm sm:text-headline-md font-bold tracking-tight shadow-[0_10px_30px_rgba(128,77,89,0.35)] ring-4 ring-tertiary-fixed/60 hover:ring-tertiary-fixed hover:scale-[1.03] active:scale-98 transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-full bg-on-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl font-bold">
                    {isNewPlayer ? 'rocket_launch' : 'play_arrow'}
                  </span>
                </div>
                <div className="text-left">
                  <div className="leading-tight">
                    {isNewPlayer
                      ? 'BẮT ĐẦU KHÁM PHÁ'
                      : (gameState.completedStageIds || []).length >= 5
                      ? 'TIẾP TỤC THÁM HIỂM (ĐÃ MỞ KHÓA 100%)'
                      : 'TIẾP TỤC HÀNH TRÌNH'}
                  </div>
                  <div className="text-[11px] font-medium text-on-primary/80">
                    {isNewPlayer
                      ? 'Xem cốt truyện & Khởi hành'
                      : (gameState.completedStageIds || []).length >= 5
                      ? 'Tự do thám hiểm Màn 2D & Mọi chặng cơ thể'
                      : 'Tiến vào Màn chơi 2D Dạ Dày'}
                  </div>
                </div>
                <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* DISCOVERY PATHWAYS: INTERACTIVE BIOLOGICAL LANDMARKS           */}
      {/* ============================================================== */}
      <div className="relative z-20 w-full px-4 sm:px-6 md:px-margin pb-6 pt-2">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">signpost</span>
              <h2 className="font-label-lg text-label-lg font-bold text-on-surface">
                Cột Mốc Thám Hiểm & Lối Đi Khám Phá
              </h2>
            </div>
            <span className="text-[12px] text-on-surface-variant font-medium">
              Chạm để mở cổng thế giới
            </span>
          </div>

          {/* Grid of Tactile Waypoint Signs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
            {/* Landmark 1: Journey Map */}
            <button
              onClick={() => {
                playTone(523.25, 'sine', 0.1);
                onNavigate('hanh-trinh');
              }}
              className="flex flex-col items-center sm:items-start p-3 sm:p-4 rounded-2xl bg-surface/90 hover:bg-surface-container-low border border-surface-container-high/80 hover:border-primary/40 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 text-center sm:text-left"
            >
              <div className="w-11 h-11 rounded-2xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-xs">
                <span className="material-symbols-outlined text-2xl">map</span>
              </div>
              <span className="font-label-md text-label-md font-bold text-on-surface line-clamp-1">
                Bản đồ Hành trình
              </span>
              <span className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                5 Hệ Cơ Quan Vi Mô
              </span>
              <span className="mt-2 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                Mở Bản đồ →
              </span>
            </button>

            {/* Landmark 2: 2D Stomach Stage */}
            <button
              onClick={() => {
                playTone(587.33, 'sine', 0.1);
                onRequestEnterStomach2D();
              }}
              className="flex flex-col items-center sm:items-start p-3 sm:p-4 rounded-2xl bg-surface/90 hover:bg-surface-container-low border border-surface-container-high/80 hover:border-tertiary-fixed-dim shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 text-center sm:text-left"
            >
              <div className="w-11 h-11 rounded-2xl bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-xs">
                <span className="material-symbols-outlined text-2xl">sports_esports</span>
              </div>
              <span className="font-label-md text-label-md font-bold text-on-surface line-clamp-1">
                Màn 2D Dạ Dày
              </span>
              <span className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                Thử thách Thực địa
              </span>
              <span className="mt-2 text-[10px] font-bold text-tertiary bg-tertiary-fixed/60 px-2 py-0.5 rounded-full">
                Vào chơi 2D →
              </span>
            </button>

            {/* Landmark 3: Biology Notebook */}
            <button
              onClick={() => {
                playTone(659.25, 'sine', 0.1);
                onOpenLabTool('notebook');
              }}
              className="flex flex-col items-center sm:items-start p-3 sm:p-4 rounded-2xl bg-surface/90 hover:bg-surface-container-low border border-surface-container-high/80 hover:border-sky-400/40 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 text-center sm:text-left"
            >
              <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-xs">
                <span className="material-symbols-outlined text-2xl">menu_book</span>
              </div>
              <span className="font-label-md text-label-md font-bold text-on-surface line-clamp-1">
                Sổ tay Sinh học
              </span>
              <span className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                Lý thuyết & Mẫu vật
              </span>
              <span className="mt-2 text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                Tra cứu →
              </span>
            </button>

            {/* Landmark 4: Weekly Quests */}
            <button
              onClick={() => {
                playTone(698.46, 'sine', 0.1);
                onNavigate('nhiem-vu-tuan');
              }}
              className="flex flex-col items-center sm:items-start p-3 sm:p-4 rounded-2xl bg-surface/90 hover:bg-surface-container-low border border-surface-container-high/80 hover:border-amber-400/40 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 text-center sm:text-left"
            >
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-xs">
                <span className="material-symbols-outlined text-2xl">calendar_month</span>
              </div>
              <span className="font-label-md text-label-md font-bold text-on-surface line-clamp-1">
                Nhiệm vụ tuần
              </span>
              <span className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                {completedQuestsCount}/3 đã hoàn thành
              </span>
              <span className="mt-2 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                Xem nhiệm vụ →
              </span>
            </button>

            {/* Landmark 5: Wardrobe & Outfits */}
            <button
              onClick={() => {
                playTone(783.99, 'sine', 0.1);
                onNavigate('trang-phuc');
              }}
              className="col-span-2 sm:col-span-1 flex flex-col items-center sm:items-start p-3 sm:p-4 rounded-2xl bg-surface/90 hover:bg-surface-container-low border border-surface-container-high/80 hover:border-pink-400/40 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:-translate-y-0.5 text-center sm:text-left"
            >
              <div className="w-11 h-11 rounded-2xl bg-pink-100 text-pink-800 flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform shadow-xs">
                <span className="material-symbols-outlined text-2xl">apparel</span>
              </div>
              <span className="font-label-md text-label-md font-bold text-on-surface line-clamp-1">
                Tủ đồ Potabi
              </span>
              <span className="text-[11px] text-on-surface-variant line-clamp-1 mt-0.5">
                {gameState.ownedOutfitIds.length} Trang phục
              </span>
              <span className="mt-2 text-[10px] font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded-full">
                Mở tủ đồ →
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
