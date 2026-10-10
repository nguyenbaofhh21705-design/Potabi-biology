import React, { useEffect, useState } from 'react';
import { IMAGES } from '../data/biologyData';

interface StoryCutsceneScreenProps {
  onContinueToLab: () => void;
  onExitToMap: () => void;
  onOpenMicroscope: () => void;
  onOpenStain: () => void;
  onOpenNotebook: () => void;
}

const DIALOGUE_STEPS = [
  {
    step: 1,
    organIndex: 0,
    text: (
      <>
        “Ôi, mình bị mắc kẹt trong một{' '}
        <span className="text-tertiary-fixed font-semibold">“cỗ máy sinh học khổng lồ”</span>. Mình
        cảm thấy cô đơn quá đi mất... Bạn ơi, bạn cũng bị kẹt ở đây ư? Mình đi khám phá và bị nuốt
        vào đây trong lúc đang ở trên một miếng bánh mì này!”
      </>
    ),
  },
  {
    step: 2,
    organIndex: 0,
    text: (
      <>
        “Nhìn kìa! Những vách hồng xung quanh đang co bóp nhẹ nhàng. Có những giọt chất lỏng lấp
        lánh đang bao bọc lấy bánh mì... Đó là{' '}
        <span className="text-tertiary-fixed font-semibold">enzym Amylase từ tuyến nước bọt</span>{' '}
        đang phân giải tinh bột chín thành đường đôi Maltose đấy!”
      </>
    ),
  },
  {
    step: 3,
    organIndex: 1,
    text: (
      <>
        “Ối! Sóng nhu động của{' '}
        <span className="text-tertiary-fixed font-semibold">Thực Quản</span> đang đẩy tụi mình trượt
        xuống phía dưới! Nắp thanh quản đã đóng lại kịp thời để thức ăn không lọt vào đường hô hấp.”
      </>
    ),
  },
  {
    step: 4,
    organIndex: 2,
    text: (
      <>
        “Chuyến hành trình chỉ mới bắt đầu thôi. Bạn hãy dùng các công cụ{' '}
        <span className="text-tertiary-fixed font-semibold">Phóng to kính</span> và{' '}
        <span className="text-tertiary-fixed font-semibold">Nhuộm mẫu</span> ở thanh dưới, hoặc
        tiến thẳng vào Hang động Dạ dày ngay nhé!”
      </>
    ),
  },
  {
    step: 5,
    organIndex: 2,
    text: (
      <>
        “Chuẩn bị sẵn sàng! Chúng ta cùng tiến vào bước thám hiểm cơ chế co bóp và dịch vị dạ dày
        ngay bây giờ!”
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

  const advanceStory = () => {
    if (currentIdx < DIALOGUE_STEPS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      onContinueToLab();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        advanceStory();
      } else if (e.code === 'Escape') {
        setShowSkipModal((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const currentDialogue = DIALOGUE_STEPS[currentIdx];

  return (
    <div className="bg-inverse-surface font-body-md text-body-md text-inverse-on-surface overflow-hidden select-none relative w-full h-screen">
      {/* Fixed HUD Frame Matching HTML 2 */}
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
                Mục tiêu: Soi màng tế bào vảy hành
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
          {/* Background Cutscene Artwork */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-1000 ease-out"
              style={{
                backgroundImage: `url('${IMAGES.cutsceneToastBg}')`,
                filter: 'saturate(1.15) contrast(1.05)',
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-transparent to-inverse-surface/80 opacity-90 pointer-events-none"></div>

            {/* Ambient Bioluminescent Spores */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="animate-ping"
                cx="28%"
                cy="56%"
                fill="#ffdeab"
                r="3"
                style={{ animationDuration: '3s' }}
              ></circle>
              <circle
                className="animate-pulse"
                cx="34%"
                cy="48%"
                fill="#f9bc4e"
                r="4"
                style={{ animationDuration: '2s' }}
              ></circle>
              <circle
                className="animate-ping"
                cx="45%"
                cy="65%"
                fill="#fffbff"
                r="2"
                style={{ animationDuration: '4s' }}
              ></circle>
              <circle
                className="animate-pulse"
                cx="68%"
                cy="40%"
                fill="#f7b5c3"
                r="3.5"
                style={{ animationDuration: '2.5s' }}
              ></circle>
              <circle
                className="animate-ping"
                cx="75%"
                cy="30%"
                fill="#ffdeab"
                r="2"
                style={{ animationDuration: '3.5s' }}
              ></circle>
              <circle
                className="animate-pulse"
                cx="58%"
                cy="75%"
                fill="#fcdade"
                r="4"
                style={{ animationDuration: '1.8s' }}
              ></circle>
            </svg>

            {/* Potabi Mascot Floating on Toast */}
            <div className="absolute left-[29%] top-[41%] w-28 h-28 pointer-events-none z-10 filter drop-shadow-[0_12px_14px_rgba(49,16,30,0.6)] transform -rotate-6 hover:scale-105 transition-transform duration-500">
              <img
                alt="Potabi Mascot on toast"
                className="w-full h-full object-contain rounded-2xl bg-surface-container-lowest p-1"
                referrerPolicy="no-referrer"
                src={IMAGES.potabiAvatar}
              />
              <div className="absolute -bottom-1 left-4 w-16 h-3 bg-tertiary-container/40 rounded-full blur-xs -z-10"></div>
              <div className="absolute -top-4 -right-2 bg-tertiary-fixed text-on-tertiary-fixed px-space-xs py-0.5 rounded-full font-label-sm text-label-sm shadow-sm flex items-center gap-0.5 animate-bounce">
                <span className="material-symbols-outlined text-xs">help</span>
                <span>Aaa?!</span>
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
                  HỒI 1:
                </span>
                <span className="font-body-sm text-body-sm text-inverse-on-surface">
                  Lạc vào Cỗ máy Sinh học Khổng lồ
                </span>
              </div>
              <span className="text-secondary-fixed-dim text-xs">•</span>
              <span className="font-label-sm text-label-sm text-secondary-fixed bg-primary/40 px-2 py-0.5 rounded-full">
                Đoạn {currentDialogue.step}/5
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
                      src={IMAGES.potabiAvatar}
                    />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed-dim opacity-75"></span>
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
                        Vi trùng phiêu lưu
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-70">
                      <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></span>
                      <span className="font-label-sm text-label-sm text-secondary-fixed">
                        Đang trò chuyện
                      </span>
                    </div>
                  </div>
                  <p className="font-body-lg text-body-lg text-inverse-on-surface leading-relaxed tracking-normal">
                    {currentDialogue.text}
                  </p>
                </div>
              </div>

              <div className="mt-space-md pt-space-sm flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="flex items-center gap-1.5">
                    {DIALOGUE_STEPS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIdx(idx)}
                        className={`rounded-full transition-all cursor-pointer ${
                          idx === currentIdx
                            ? 'w-2.5 h-2.5 bg-tertiary-fixed'
                            : 'w-1.5 h-1.5 bg-outline-variant'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-label-sm text-label-sm text-secondary-fixed-dim">
                    Nhấn{' '}
                    <kbd className="px-1.5 py-0.5 bg-inverse-surface rounded text-inverse-on-surface font-label-sm">
                      Phím Cách
                    </kbd>{' '}
                    để tiếp tục
                  </span>
                </div>

                <button
                  onClick={advanceStory}
                  className={`flex items-center gap-space-xs px-space-lg py-space-xs rounded-full font-label-lg text-label-lg transition-transform active:scale-95 shadow-md group cursor-pointer ${
                    currentIdx === DIALOGUE_STEPS.length - 1
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed'
                      : 'bg-primary hover:bg-primary-container text-on-primary'
                  }`}
                >
                  <span>
                    {currentIdx === DIALOGUE_STEPS.length - 1
                      ? 'Vào Hang Động Dạ Dày'
                      : 'Tiếp tục khám phá'}
                  </span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
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
                    currentDialogue.organIndex === 0
                      ? 'text-tertiary-fixed font-semibold'
                      : 'text-secondary-fixed-dim opacity-70'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {currentDialogue.organIndex === 0
                      ? 'radio_button_checked'
                      : 'check_circle'}
                  </span>
                  <span className="font-label-sm text-label-sm">1. Khoang Miệng</span>
                </button>
                <span className="text-outline-variant text-xs">➔</span>
                <button
                  onClick={() => setCurrentIdx(2)}
                  className={`flex items-center gap-1.5 cursor-pointer ${
                    currentDialogue.organIndex === 1
                      ? 'text-tertiary-fixed font-semibold'
                      : 'text-secondary-fixed-dim opacity-60'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {currentDialogue.organIndex === 1
                      ? 'radio_button_checked'
                      : 'radio_button_unchecked'}
                  </span>
                  <span className="font-label-sm text-label-sm">2. Thực Quản</span>
                </button>
                <span className="text-outline-variant text-xs">➔</span>
                <button
                  onClick={onContinueToLab}
                  className={`flex items-center gap-1.5 cursor-pointer ${
                    currentDialogue.organIndex === 2
                      ? 'text-tertiary-fixed font-semibold'
                      : 'text-secondary-fixed-dim opacity-60'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {currentDialogue.organIndex === 2
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
                  Bỏ qua hoạt cảnh?
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Bạn sẽ chuyển ngay đến phần thám hiểm 2D tại Hang động Dạ dày và giải cứu Potabi.
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
                      onContinueToLab();
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
