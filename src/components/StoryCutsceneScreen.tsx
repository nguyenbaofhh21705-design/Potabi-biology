import React, { useEffect, useState } from 'react';
import { IMAGES } from '../data/biologyData';

interface StoryCutsceneScreenProps {
  onContinueToLab: () => void;
  onExitToMap: () => void;
  onOpenMicroscope: () => void;
  onOpenStain: () => void;
  onOpenNotebook: () => void;
}

interface IntroSceneConfig {
  step: number;
  sceneTitle: string;
  stageLabel: string;
  organIndex: number;
  backgroundUrl: string;
  backgroundFilter: string;
  overlayStyle: React.CSSProperties;
  potabiSprite: string;
  potabiPositionClass: string;
  potabiSizeClass: string;
  potabiBubbleIcon: string;
  potabiBubbleText: string;
  text: React.ReactNode;
}

const INTRO_SCENES: IntroSceneConfig[] = [
  {
    step: 1,
    sceneTitle: 'Potabi trên lát bánh mì',
    stageLabel: 'Bữa sáng chuẩn bị bắt đầu',
    organIndex: 0,
    backgroundUrl: IMAGES.cutsceneToastBg,
    backgroundFilter: 'saturate(1.15) contrast(1.02) brightness(1.05)',
    overlayStyle: {
      background:
        'radial-gradient(circle at 46% 38%, rgba(249, 188, 78, 0.28) 0%, rgba(74, 36, 51, 0.45) 68%, rgba(49, 16, 30, 0.85) 100%)',
    },
    potabiSprite: IMAGES.potabiAvatar,
    potabiPositionClass: 'left-[44%] top-[34%] -rotate-3',
    potabiSizeClass: 'w-28 h-28',
    potabiBubbleIcon: 'wb_sunny',
    potabiBubbleText: 'Thơm quá~',
    text: (
      <>
        “Xin chào! Mình là{' '}
        <span className="text-tertiary-fixed font-semibold">Potabi</span> – một nhà thám hiểm vi mô
        tí hon! Sáng nay mình đang nằm tắm nắng trên một{' '}
        <span className="text-tertiary-fixed font-semibold">lát bánh mì nướng</span> thơm phức, giòn
        rụm thì...”
      </>
    ),
  },
  {
    step: 2,
    sceneTitle: 'Sự cố bất ngờ',
    stageLabel: '1. Khoang Miệng (Sắp tiến vào)',
    organIndex: 0,
    backgroundUrl: IMAGES.cutsceneToastBg,
    backgroundFilter: 'saturate(1.1) contrast(1.12) brightness(0.88)',
    overlayStyle: {
      background:
        'linear-gradient(180deg, rgba(25, 8, 16, 0.82) 0%, rgba(49, 16, 30, 0.55) 48%, rgba(74, 36, 51, 0.88) 100%)',
    },
    potabiSprite: IMAGES.potabiBlueAvatar,
    potabiPositionClass: 'left-[33%] top-[38%] -rotate-6',
    potabiSizeClass: 'w-32 h-32',
    potabiBubbleIcon: 'warning',
    potabiBubbleText: 'Áaa?! Khoan đã!',
    text: (
      <>
        “Áaa! Một bóng đen khổng lồ vừa ập xuống! Có ai đó đang đói bụng và chuẩn bị{' '}
        <span className="text-tertiary-fixed font-semibold">cắn một miếng bánh mì thật to</span>...
        mà không hề biết mình vẫn đang đứng ở trên này!”
      </>
    ),
  },
  {
    step: 3,
    sceneTitle: 'Rơi vào cơ thể',
    stageLabel: '1. Khoang Miệng ➔ 2. Thực Quản',
    organIndex: 1,
    backgroundUrl: IMAGES.cutsceneToastBg,
    backgroundFilter: 'saturate(1.2) contrast(1.08)',
    overlayStyle: {
      background:
        'radial-gradient(circle at 32% 48%, rgba(247, 181, 195, 0.18) 0%, rgba(74, 36, 51, 0.55) 65%, rgba(49, 16, 30, 0.9) 100%)',
    },
    potabiSprite: IMAGES.potabiBlueAvatar,
    potabiPositionClass: 'left-[29%] top-[44%] rotate-6',
    potabiSizeClass: 'w-28 h-28',
    potabiBubbleIcon: 'air',
    potabiBubbleText: 'Trượt nhanh quá!',
    text: (
      <>
        “Ực! Thế là mình bị cuốn thẳng qua{' '}
        <span className="text-tertiary-fixed font-semibold">Khoang miệng</span> ấm áp đầy enzym
        Amylase, rồi trượt dọc theo đường ống{' '}
        <span className="text-tertiary-fixed font-semibold">Thực quản</span> mềm mại đang co bóp
        từng đợt đẩy thức ăn xuống sâu bên dưới!”
      </>
    ),
  },
  {
    step: 4,
    sceneTitle: 'Khám phá thế giới mới',
    stageLabel: '2. Thực Quản ➔ 3. Dạ Dày',
    organIndex: 1,
    backgroundUrl: IMAGES.mapBg,
    backgroundFilter: 'saturate(1.18) contrast(1.06)',
    overlayStyle: {
      background:
        'radial-gradient(circle at 50% 45%, rgba(162, 60, 91, 0.25) 0%, rgba(49, 16, 30, 0.72) 72%, rgba(35, 11, 22, 0.92) 100%)',
    },
    potabiSprite: IMAGES.potabiAvatar,
    potabiPositionClass: 'left-[26%] top-[42%] -rotate-3',
    potabiSizeClass: 'w-28 h-28',
    potabiBubbleIcon: 'auto_awesome',
    potabiBubbleText: 'Kỳ diệu thật!',
    text: (
      <>
        “Oa... Nhìn xung quanh kìa! Cơ thể con người giống hệt một{' '}
        <span className="text-tertiary-fixed font-semibold">cỗ máy sinh học khổng lồ</span> đang vận
        hành không ngừng nghỉ: từ dạ dày nhào trộn thức ăn cho đến trái tim bơm máu nuôi hàng chục
        nghìn tỷ tế bào!”
      </>
    ),
  },
  {
    step: 5,
    sceneTitle: 'Bắt đầu hành trình',
    stageLabel: '3. Dạ Dày (Điểm khởi đầu)',
    organIndex: 2,
    backgroundUrl: IMAGES.stomachStageBg,
    backgroundFilter: 'saturate(1.12) contrast(1.05)',
    overlayStyle: {
      background:
        'linear-gradient(180deg, rgba(49, 16, 30, 0.55) 0%, rgba(74, 36, 51, 0.35) 55%, rgba(49, 16, 30, 0.88) 100%)',
    },
    potabiSprite: IMAGES.potabiAvatar,
    potabiPositionClass: 'left-[22%] top-[45%] rotate-0',
    potabiSizeClass: 'w-32 h-32',
    potabiBubbleIcon: 'volunteer_activism',
    potabiBubbleText: 'Giúp mình với nhé!',
    text: (
      <>
        “Hiện giờ mình đã rơi xuống{' '}
        <span className="text-tertiary-fixed font-semibold">Hang động Dạ Dày</span> rồi! Môi trường
        axit ở đây khắc nghiệt lắm, một mình mình không vượt qua nổi. Bạn hãy đồng hành cùng mình
        khám phá các trạm sinh học và tìm đường ra nhé!”
      </>
    ),
  },
];

export const StoryCutsceneScreen: React.FC<StoryCutsceneScreenProps> = ({
  onContinueToLab,
  onExitToMap,
  onOpenMicroscope,
  onOpenStain,
  onOpenNotebook,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isVoiceOn, setIsVoiceOn] = useState<boolean>(true);
  const [showSkipModal, setShowSkipModal] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const isFirstScene = currentIdx === 0;
  const isLastScene = currentIdx === INTRO_SCENES.length - 1;

  const advanceStory = () => {
    if (currentIdx < INTRO_SCENES.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      onContinueToLab();
    }
  };

  const previousStory = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.code === 'Escape') {
        e.preventDefault();
        if (isPaused) {
          setIsPaused(false);
        } else {
          setShowSkipModal((prev) => !prev);
        }
        return;
      }

      if (showSkipModal || isPaused) {
        return;
      }

      if (e.code === 'Space' || e.code === 'ArrowRight') {
        e.preventDefault();
        advanceStory();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        previousStory();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIdx, showSkipModal, isPaused]);

  const currentScene = INTRO_SCENES[currentIdx];

  return (
    <div className="bg-inverse-surface font-body-md text-body-md text-inverse-on-surface overflow-hidden select-none relative w-full h-screen">
      {/* Fixed HUD Frame Matching Bio Blossom Tactile */}
      <div className="pointer-events-none fixed inset-0 z-40 p-margin flex flex-col justify-between">
        <div className="flex items-start justify-between w-full pointer-events-auto">
          <button
            onClick={onExitToMap}
            className="flex items-center gap-space-sm bg-inverse-surface/80 hover:bg-inverse-surface backdrop-blur-md px-space-md py-space-xs rounded-full transition-colors cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-tertiary-fixed">eco</span>
            <span className="font-label-md text-label-md text-inverse-on-surface">
              Thế giới Vi mô
            </span>
          </button>

          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-space-xs bg-inverse-surface/80 backdrop-blur-md px-space-md py-space-xs rounded-full">
              <span className="material-symbols-outlined text-tertiary-fixed">flag</span>
              <span className="font-label-sm text-label-sm text-inverse-on-surface">
                Chặng hiện tại: {currentScene.stageLabel}
              </span>
            </div>
            <button
              onClick={() => setIsPaused(true)}
              className="w-10 h-10 rounded-full bg-inverse-surface/80 backdrop-blur-md text-inverse-on-surface flex items-center justify-center hover:bg-inverse-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">pause</span>
            </button>
          </div>
        </div>

        {/* Bottom Floating Microscope Action Dock */}
        <div className="flex justify-center w-full pointer-events-auto">
          <div className="flex items-center gap-space-md bg-inverse-surface/80 backdrop-blur-md px-space-lg py-space-sm rounded-full shadow-xl border border-outline/20">
            <button
              onClick={onOpenMicroscope}
              className="flex items-center gap-space-xs font-label-md text-label-md text-inverse-on-surface hover:text-tertiary-fixed transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">zoom_in</span>
              <span>Phóng to kính</span>
            </button>
            <div className="w-px h-4 bg-outline/40"></div>
            <button
              onClick={onOpenStain}
              className="flex items-center gap-space-xs font-label-md text-label-md text-inverse-on-surface hover:text-tertiary-fixed transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">colorize</span>
              <span>Nhuộm mẫu</span>
            </button>
            <div className="w-px h-4 bg-outline/40"></div>
            <button
              onClick={onOpenNotebook}
              className="flex items-center gap-space-xs font-label-md text-label-md text-inverse-on-surface hover:text-tertiary-fixed transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">menu_book</span>
              <span>Sổ tay</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Cutscene Canvas */}
      <main className="w-full h-full relative z-0">
        <div className="flex flex-col w-full relative h-screen overflow-hidden select-none bg-inverse-surface">
          {/* Background Cutscene Artwork (Static per Scene) */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center scale-105"
              style={{
                backgroundImage: `url('${currentScene.backgroundUrl}')`,
                filter: currentScene.backgroundFilter,
              }}
            ></div>
            <div
              className="absolute inset-0 pointer-events-none"
              style={currentScene.overlayStyle}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-transparent to-inverse-surface/80 opacity-90 pointer-events-none"></div>

            {/* Ambient Bioluminescent Spores (Static decorative dots) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="28%" cy="56%" fill="#ffdeab" r="3"></circle>
              <circle cx="34%" cy="48%" fill="#f9bc4e" r="4"></circle>
              <circle cx="45%" cy="65%" fill="#fffbff" r="2"></circle>
              <circle cx="68%" cy="40%" fill="#f7b5c3" r="3.5"></circle>
              <circle cx="75%" cy="30%" fill="#ffdeab" r="2"></circle>
              <circle cx="58%" cy="75%" fill="#fcdade" r="4"></circle>
            </svg>

            {/* Potabi Mascot Positioned According to Current Scene */}
            <div
              className={`absolute ${currentScene.potabiPositionClass} ${currentScene.potabiSizeClass} pointer-events-none z-10 filter drop-shadow-[0_12px_14px_rgba(49,16,30,0.6)] transform`}
            >
              <img
                alt={`Potabi - ${currentScene.sceneTitle}`}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                src={currentScene.potabiSprite}
              />
              <div className="absolute -bottom-1 left-4 w-16 h-3 bg-tertiary-container/40 rounded-full blur-xs -z-10"></div>
              <div className="absolute -top-4 -right-4 bg-tertiary-fixed text-on-tertiary-fixed px-space-xs py-0.5 rounded-full font-label-sm text-label-sm shadow-sm flex items-center gap-1 whitespace-nowrap">
                <span className="material-symbols-outlined text-xs">
                  {currentScene.potabiBubbleIcon}
                </span>
                <span>{currentScene.potabiBubbleText}</span>
              </div>
            </div>
          </div>

          {/* Sub-Header Cutscene Progress & Voice / Skip Controls */}
          <div className="relative z-20 flex items-center justify-between px-margin pt-20 pointer-events-auto">
            <div className="flex items-center gap-space-sm bg-inverse-surface/85 backdrop-blur-md px-space-md py-space-xs rounded-full shadow-md">
              <span className="material-symbols-outlined text-tertiary-fixed-dim">
                movie_filter
              </span>
              <div className="flex items-baseline gap-space-xs">
                <span className="font-label-md text-label-md text-tertiary-fixed font-bold tracking-wide">
                  CẢNH {currentScene.step}/5:
                </span>
                <span className="font-body-sm text-body-sm text-inverse-on-surface font-semibold">
                  {currentScene.sceneTitle}
                </span>
              </div>
              <span className="text-secondary-fixed-dim text-xs hidden sm:inline">•</span>
              <span className="font-label-sm text-label-sm text-secondary-fixed bg-primary/40 px-2 py-0.5 rounded-full hidden sm:inline">
                Mở đầu câu chuyện
              </span>
            </div>

            <div className="flex items-center gap-space-sm">
              <button
                onClick={() => setIsVoiceOn(!isVoiceOn)}
                className="flex items-center gap-space-xs bg-inverse-surface/85 hover:bg-inverse-surface backdrop-blur-md text-inverse-on-surface px-space-md py-space-xs rounded-full transition-colors shadow-sm cursor-pointer"
              >
                <span className="material-symbols-outlined text-tertiary-fixed-dim text-sm">
                  {isVoiceOn ? 'volume_up' : 'volume_off'}
                </span>
                <span className="font-label-sm text-label-sm">
                  Giọng đọc: {isVoiceOn ? 'BẬT' : 'TẮT'}
                </span>
              </button>
              <button
                onClick={() => setShowSkipModal(true)}
                className="flex items-center gap-space-xs bg-surface-container-high/20 hover:bg-surface-container-high/40 text-inverse-on-surface backdrop-blur-md px-space-md py-space-xs rounded-full transition-colors shadow-sm cursor-pointer"
              >
                <span className="font-label-sm text-label-sm">Bỏ qua</span>
                <span className="font-label-sm text-label-sm px-1.5 py-0.2 bg-inverse-surface/90 text-secondary-fixed-dim rounded">
                  ESC
                </span>
              </button>
            </div>
          </div>

          {/* Bottom Story Dialogue Box & Digestive Path Bar */}
          <div className="mt-auto relative z-20 px-margin pb-20 flex flex-col items-center gap-space-md">
            <div className="w-full max-w-4xl bg-inverse-surface/90 backdrop-blur-xl rounded-[2rem] p-space-lg shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-tertiary via-tertiary-fixed to-primary"></div>

              <div className="flex items-start gap-space-md">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full bg-surface-container-highest p-1 shadow-md flex items-center justify-center overflow-hidden">
                    <img
                      alt="Potabi Portrait"
                      className="w-full h-full object-contain rounded-full"
                      referrerPolicy="no-referrer"
                      src={currentScene.potabiSprite}
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-tertiary-container text-tertiary-fixed items-center justify-center text-[10px]">
                      👑
                    </span>
                  </span>
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-sm text-headline-sm text-tertiary-fixed">
                        Potabi
                      </span>
                      <span className="font-label-sm text-label-sm text-secondary-fixed-dim bg-primary-container/40 px-2 py-0.5 rounded-full">
                        Nhà thám hiểm vi mô
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-80">
                      <span className="w-2 h-2 rounded-full bg-tertiary-fixed"></span>
                      <span className="font-label-sm text-label-sm text-secondary-fixed">
                        Cảnh {currentScene.step} / {INTRO_SCENES.length}
                      </span>
                    </div>
                  </div>
                  <p className="font-body-lg text-body-lg text-inverse-on-surface leading-relaxed tracking-normal">
                    {currentScene.text}
                  </p>
                </div>
              </div>

              <div className="mt-space-md pt-space-sm flex flex-wrap items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="flex items-center gap-1.5">
                    {INTRO_SCENES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIdx(idx)}
                        title={`Chuyển tới Cảnh ${idx + 1}`}
                        className={`rounded-full transition-all cursor-pointer ${
                          idx === currentIdx
                            ? 'w-2.5 h-2.5 bg-tertiary-fixed'
                            : 'w-1.5 h-1.5 bg-outline-variant hover:bg-secondary-fixed-dim'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary-fixed-dim hidden sm:inline">
                    Nhấn{' '}
                    <kbd className="px-1.5 py-0.5 bg-inverse-surface rounded text-inverse-on-surface font-label-sm">
                      Phím Cách
                    </kbd>{' '}
                    để tiếp tục
                  </span>
                </div>

                <div className="flex items-center gap-space-sm">
                  {!isFirstScene && (
                    <button
                      onClick={previousStory}
                      className="flex items-center gap-space-xs px-space-md py-space-xs rounded-full font-label-md text-label-md bg-surface-container-high/20 hover:bg-surface-container-high/35 text-inverse-on-surface transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_back</span>
                      <span>Quay lại</span>
                    </button>
                  )}

                  <button
                    onClick={advanceStory}
                    className={`flex items-center gap-space-xs px-space-lg py-space-xs rounded-full font-label-lg text-label-lg transition-transform active:scale-95 shadow-md group cursor-pointer ${
                      isLastScene
                        ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                        : 'bg-primary hover:bg-primary-container text-on-primary'
                    }`}
                  >
                    <span>{isLastScene ? 'BẮT ĐẦU HÀNH TRÌNH' : 'Tiếp tục'}</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Digestive Journey Progress Bar */}
            <div className="w-full max-w-4xl flex flex-wrap items-center justify-between px-space-md bg-inverse-surface/60 backdrop-blur-md rounded-full py-1.5 gap-2">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-tertiary-fixed-dim text-sm">
                  map
                </span>
                <span className="font-label-sm text-label-sm text-secondary-fixed-dim">
                  Hành trình tiêu hoá:
                </span>
              </div>

              <div className="flex items-center gap-space-md">
                <button
                  onClick={() => setCurrentIdx(0)}
                  className={`flex items-center gap-1.5 cursor-pointer ${
                    currentScene.organIndex === 0
                      ? 'text-tertiary-fixed font-semibold'
                      : 'text-secondary-fixed-dim opacity-70'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {currentScene.organIndex === 0 ? 'radio_button_checked' : 'check_circle'}
                  </span>
                  <span className="font-label-sm text-label-sm">1. Khoang Miệng</span>
                </button>
                <span className="text-outline-variant text-xs">➔</span>
                <button
                  onClick={() => setCurrentIdx(2)}
                  className={`flex items-center gap-1.5 cursor-pointer ${
                    currentScene.organIndex === 1
                      ? 'text-tertiary-fixed font-semibold'
                      : 'text-secondary-fixed-dim opacity-60'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {currentScene.organIndex === 1
                      ? 'radio_button_checked'
                      : currentScene.organIndex > 1
                      ? 'check_circle'
                      : 'radio_button_unchecked'}
                  </span>
                  <span className="font-label-sm text-label-sm">2. Thực Quản</span>
                </button>
                <span className="text-outline-variant text-xs">➔</span>
                <button
                  onClick={() => setCurrentIdx(4)}
                  className={`flex items-center gap-1.5 cursor-pointer ${
                    currentScene.organIndex === 2
                      ? 'text-tertiary-fixed font-semibold'
                      : 'text-secondary-fixed-dim opacity-60'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {currentScene.organIndex === 2
                      ? 'radio_button_checked'
                      : 'radio_button_unchecked'}
                  </span>
                  <span className="font-label-sm text-label-sm">3. Dạ Dày</span>
                </button>
                <span className="text-outline-variant text-xs">➔</span>
                <div className="flex items-center gap-1.5 text-secondary-fixed-dim opacity-60">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  <span className="font-label-sm text-label-sm">4. Ruột Non</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-secondary-fixed-dim">
                <span className="material-symbols-outlined text-sm">star</span>
                <span className="font-label-sm text-label-sm">1/3 Sao Mở Khóa</span>
              </div>
            </div>
          </div>

          {/* Skip Confirmation Modal */}
          {showSkipModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/75 backdrop-blur-md p-space-md">
              <div className="bg-surface-container-high rounded-3xl p-space-lg max-w-sm w-full text-center shadow-2xl flex flex-col items-center gap-space-sm">
                <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">fast_forward</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Bỏ qua phần mở đầu?
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Bạn sẽ kết thúc phần giới thiệu cốt truyện và trở về Bản đồ Hành trình. Bạn vẫn
                  có thể xem lại bất cứ lúc nào qua nút Cốt truyện.
                </p>
                <div className="flex items-center justify-center gap-space-sm w-full mt-space-sm">
                  <button
                    onClick={() => setShowSkipModal(false)}
                    className="flex-1 py-2 rounded-full bg-surface text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors cursor-pointer"
                  >
                    Ở lại
                  </button>
                  <button
                    onClick={() => {
                      setShowSkipModal(false);
                      onExitToMap();
                    }}
                    className="flex-1 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm cursor-pointer"
                  >
                    Bỏ qua
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pause Modal */}
          {isPaused && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/75 backdrop-blur-md p-space-md">
              <div className="bg-surface-container-lowest rounded-3xl p-space-lg max-w-sm w-full text-center shadow-2xl flex flex-col items-center gap-space-md">
                <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">pause_circle</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Tạm dừng Hoạt cảnh
                </h3>
                <div className="flex flex-col gap-space-xs w-full">
                  <button
                    onClick={() => setIsPaused(false)}
                    className="w-full py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md cursor-pointer"
                  >
                    Tiếp tục xem
                  </button>
                  <button
                    onClick={onContinueToLab}
                    className="w-full py-2.5 rounded-full bg-surface-container-high text-primary font-label-md text-label-md cursor-pointer"
                  >
                    Sang màn 2D Dạ Dày
                  </button>
                  <button
                    onClick={onExitToMap}
                    className="w-full py-2.5 rounded-full bg-surface-container text-on-surface-variant font-label-md text-label-md cursor-pointer"
                  >
                    Về Bản đồ Hành trình
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
