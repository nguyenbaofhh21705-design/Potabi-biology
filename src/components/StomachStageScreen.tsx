import React, { useEffect, useState } from 'react';
import { IMAGES } from '../data/biologyData';

interface StomachStageScreenProps {
  onExitToMap: () => void;
  onOpenMicroscope: () => void;
  onOpenStain: () => void;
  onOpenNotebook: () => void;
  onRewardEarned: (exp: number, diamonds: number) => void;
}

interface StationDetail {
  id: string;
  title: string;
  subtitle: string;
  pH: string;
  enzyme: string;
  description: string;
  question: string;
  options: string[];
  correctIdx: number;
}

const STATIONS: Record<string, StationDetail> = {
  'tram-1': {
    id: 'tram-1',
    title: 'Trạm 1: Nghiền Cơ Học Dạ Dày',
    subtitle: 'Ba lớp cơ trơn: Cơ dọc, Cơ vòng, Cơ chéo',
    pH: 'pH 3.0 - 4.0',
    enzyme: 'Nhu động co bóp cơ học',
    description:
      'Thành dạ dày có cấu tạo gồm 3 lớp cơ trơn khỏe mạnh (cơ dọc, cơ vòng, cơ chéo). Khi co rút nhịp nhàng, chúng nghiền nhỏ thức ăn và trộn đều với dịch vị.',
    question: 'Nhờ cấu tạo nào mà dạ dày co bóp nghiền thức ăn cực kỳ hiệu quả?',
    options: [
      'A. Chỉ có 1 lớp cơ vòng mỏng',
      'B. Có 3 lớp cơ trơn: cơ dọc, cơ vòng và cơ chéo',
      'C. Nhờ các lông mao chuyển động liên tục',
    ],
    correctIdx: 1,
  },
  'tram-2': {
    id: 'tram-2',
    title: 'Trạm 2: Axit HCl & Enzym Pepsin',
    subtitle: 'Phân giải chuỗi Protein thành Polypeptide ngắn',
    pH: 'pH 1.5 - 2.5',
    enzyme: 'Pepsinogen + HCl → Pepsin hoạt động',
    description:
      'Tuyến vị tiết ra axit Clohiđric (HCl) tạo môi trường pH rất thấp (1.5 - 2.5), giúp biến đổi Pepsinogen chưa hoạt động thành enzym Pepsin cắt nhỏ các phân tử Protein.',
    question: 'Vai trò chính của axit HCl trong dịch vị dạ dày là gì?',
    options: [
      'A. Hoạt hóa Pepsinogen thành Pepsin và tiêu diệt vi khuẩn',
      'B. Biến đổi tinh bột thành đường glucose ngay lập tức',
      'C. Làm tăng độ pH lên mức kiềm (pH > 8)',
    ],
    correctIdx: 0,
  },
  'tram-3': {
    id: 'tram-3',
    title: 'Trạm 3: Lớp Chất Nhầy Bảo Vệ',
    subtitle: 'Hàng rào ngăn axit HCl và Pepsin tự ăn mòn dạ dày',
    pH: 'pH bề mặt niêm mạc ~ 7.0',
    enzyme: 'Mucin (Chất nhầy kiềm tính)',
    description:
      'Các tế bào tiết chất nhầy phủ kín bề mặt niêm mạc dạ dày một lớp màng dày khoảng 1mm, ngăn không cho axit HCl và enzym Pepsin phân hủy chính thành dạ dày.',
    question: 'Vì sao thành dạ dày có bản chất là protein nhưng không bị Pepsin phân hủy?',
    options: [
      'A. Vì Pepsin không hoạt động ở nhiệt độ cơ thể 37°C',
      'B. Nhờ lớp chất nhầy phủ bề mặt niêm mạc ngăn cách với HCl và Pepsin',
      'C. Vì thức ăn không bao giờ chạm vào thành dạ dày',
    ],
    correctIdx: 1,
  },
};

export const StomachStageScreen: React.FC<StomachStageScreenProps> = ({
  onExitToMap,
  onOpenMicroscope,
  onOpenStain,
  onOpenNotebook,
  onRewardEarned,
}) => {
  const [showPotabiModal, setShowPotabiModal] = useState<boolean>(false);
  const [activeStation, setActiveStation] = useState<StationDetail | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [completedStations, setCompletedStations] = useState<string[]>(['tram-1', 'tram-2']);
  const [potabiPos, setPotabiPos] = useState<number>(17); // percentage left
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [showAmylaseTip, setShowAmylaseTip] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'E') {
        setShowPotabiModal((prev) => !prev);
      } else if (e.key === 'Escape') {
        setShowPotabiModal(false);
        setActiveStation(null);
      } else if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        setPotabiPos((prev) => Math.max(10, prev - 5));
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        setPotabiPos((prev) => Math.min(78, prev + 5));
      } else if (e.code === 'Space') {
        e.preventDefault();
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 450);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        onOpenNotebook();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenNotebook]);

  const handleCompleteStation = () => {
    if (!activeStation) return;
    if (selectedAnswer === activeStation.correctIdx) {
      if (!completedStations.includes(activeStation.id)) {
        setCompletedStations((prev) => [...prev, activeStation.id]);
        onRewardEarned(250, 15);
      }
      setActiveStation(null);
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="bg-inverse-surface font-body-md text-body-md text-inverse-on-surface overflow-hidden select-none relative w-full h-screen">
      {/* Top & Bottom Outer Frame Matching Screen 3 (Image 5) */}
      <div className="pointer-events-none fixed inset-0 z-40 p-margin flex flex-col justify-between">
        <div className="flex items-start justify-between w-full pointer-events-auto">
          <button
            onClick={onExitToMap}
            className="flex items-center gap-space-sm bg-inverse-surface/80 hover:bg-inverse-surface backdrop-blur-md px-space-md py-space-xs rounded-full transition-colors cursor-pointer"
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
              onClick={onExitToMap}
              title="Tạm dừng / Về bản đồ"
              className="w-10 h-10 rounded-full bg-inverse-surface/80 backdrop-blur-md text-inverse-on-surface flex items-center justify-center hover:bg-inverse-surface transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">pause</span>
            </button>
          </div>
        </div>

        {/* Bottom Dock */}
        <div className="flex justify-center w-full pointer-events-auto">
          <div className="flex items-center gap-space-md bg-inverse-surface/80 backdrop-blur-md px-space-lg py-space-sm rounded-full shadow-xl">
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

      {/* Main 2D Stage Canvas */}
      <main className="w-full h-full relative z-0">
        <div className="flex flex-col w-full h-screen overflow-hidden select-none relative font-body-md text-on-surface">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center overflow-hidden"
            style={{ backgroundImage: `url('${IMAGES.stomachStageBg}')` }}
          >
            {/* Atmospheric Ambient Mist & Gastric Vapors */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-inverse-surface/40 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#68B88B]/25 to-transparent pointer-events-none animate-pulse"></div>

            {/* Interactive In-World Checkpoint 1: Nghiền Cơ Học */}
            <div
              onClick={() => {
                setSelectedAnswer(null);
                setActiveStation(STATIONS['tram-1']);
              }}
              className="absolute top-[58%] left-[22%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
            >
              <div className="relative flex flex-col items-center">
                <div className="mb-2 px-space-sm py-1 bg-surface-container-lowest/90 backdrop-blur-md rounded-full shadow-lg flex items-center gap-1.5 transform transition-transform group-hover:scale-110">
                  <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-ping"></span>
                  <span className="font-label-sm text-label-sm text-on-surface">
                    Trạm 1: Nghiền cơ học
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary-fixed/40 flex items-center justify-center animate-bounce shadow-md">
                  <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-sm">compress</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive In-World Checkpoint 2: Axit HCl & Pepsin */}
            <div
              onClick={() => {
                setSelectedAnswer(null);
                setActiveStation(STATIONS['tram-2']);
              }}
              className="absolute top-[63%] left-[44%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
            >
              <div className="relative flex flex-col items-center">
                <div className="mb-2 px-space-sm py-1 bg-surface-container-lowest/90 backdrop-blur-md rounded-full shadow-lg flex items-center gap-1.5 transform transition-transform group-hover:scale-110">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="font-label-sm text-label-sm text-on-surface">
                    Trạm 2: Axit HCl &amp; Pepsin
                  </span>
                </div>
                <div
                  className="w-10 h-10 rounded-full bg-primary-fixed/50 flex items-center justify-center animate-bounce shadow-md"
                  style={{ animationDelay: '0.3s' }}
                >
                  <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">science</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive In-World Checkpoint 3: Dịch vị & Tuyến nhầy */}
            <div
              onClick={() => {
                setSelectedAnswer(null);
                setActiveStation(STATIONS['tram-3']);
              }}
              className="absolute top-[72%] right-[18%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
            >
              <div className="relative flex flex-col items-center">
                <div className="mb-2 px-space-sm py-1 bg-surface-container-lowest/90 backdrop-blur-md rounded-full shadow-lg flex items-center gap-1.5 transform transition-transform group-hover:scale-110">
                  <span className="material-symbols-outlined text-xs text-tertiary-fixed-dim">
                    {completedStations.includes('tram-3') ? 'check_circle' : 'lock'}
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary">
                    Trạm 3: Dịch vị
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-variant/40 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-surface-container-high text-outline flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">water_drop</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active 2D Game Companion: Potabi Sprite on Main Mucosal Ledge */}
            <div
              onClick={() => setShowPotabiModal(true)}
              style={{ left: `${potabiPos}%` }}
              className={`absolute bottom-[34%] -translate-x-1/2 z-20 flex flex-col items-center cursor-pointer group select-none transition-all duration-200 ${
                isJumping ? '-translate-y-14' : ''
              }`}
            >
              <div className="mb-2 px-space-md py-1 bg-surface-container-lowest/95 backdrop-blur-md rounded-full shadow-xl flex items-center gap-1.5 transform transition-transform group-hover:scale-105">
                <span className="font-label-sm text-label-sm text-primary font-bold px-1.5 py-0.5 bg-secondary-fixed rounded-md">
                  [E]
                </span>
                <span className="font-label-sm text-label-sm text-on-surface">
                  Nói chuyện với Potabi
                </span>
              </div>
              <div className="w-24 h-24 relative flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-2 bg-surface-container-lowest p-1.5 shadow-lg">
                <img
                  alt="Potabi Mascot 2D Companion"
                  className="w-full h-full object-contain pointer-events-none"
                  referrerPolicy="no-referrer"
                  src={IMAGES.potabiAvatar}
                />
                <div className="absolute -bottom-2 w-16 h-3 bg-inverse-surface/30 rounded-full blur-[2px]"></div>
              </div>
            </div>

            {/* Friendly NPC: Enzyme Amylase in Protective Vesicle Bubble */}
            <div
              onClick={() => setShowAmylaseTip(!showAmylaseTip)}
              className="absolute top-[32%] right-[32%] z-20 flex flex-col items-center cursor-pointer group"
            >
              <div className="mb-2 px-space-md py-1 bg-surface-container-lowest/95 backdrop-blur-md rounded-full shadow-xl flex items-center gap-1.5 opacity-95 group-hover:opacity-100 transform transition-transform group-hover:scale-105">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-ping"></span>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                  {showAmylaseTip
                    ? 'Amylase: "Mình chỉ hoạt động ở pH ~ 7 tại khoang miệng thôi!"'
                    : 'Túi Tiết Amylase: "Độ pH ở đây thấp quá!"'}
                </span>
              </div>
              <div className="w-16 h-16 rounded-full bg-tertiary-fixed/30 backdrop-blur-sm p-1.5 flex items-center justify-center shadow-lg animate-pulse">
                <div className="w-full h-full rounded-full bg-surface-container-lowest/80 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-2xl">bubble_chart</span>
                </div>
              </div>
            </div>
          </div>

          {/* IN-GAME HUD OVERLAYS */}
          <div className="absolute inset-0 pointer-events-none p-margin flex flex-col justify-between z-30">
            {/* TOP HUD ROW */}
            <div className="flex items-start justify-between w-full pointer-events-auto mt-12">
              {/* Top-Left: Player & Potabi Status Panel */}
              <div className="flex items-center gap-space-md bg-surface-container-lowest/90 backdrop-blur-md p-space-sm rounded-[2rem] shadow-xl max-w-md">
                <div className="w-14 h-14 rounded-full bg-secondary-container p-1 flex-shrink-0 relative shadow-sm">
                  <img
                    alt="Potabi Avatar"
                    className="w-full h-full object-contain rounded-full"
                    referrerPolicy="no-referrer"
                    src={IMAGES.potabiAvatar}
                  />
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-tertiary-fixed-dim rounded-full flex items-center justify-center text-[10px] font-bold text-on-tertiary-fixed">
                    6
                  </span>
                </div>
                <div className="flex flex-col min-w-0 pr-space-sm">
                  <div className="flex items-center justify-between gap-space-sm mb-1">
                    <span className="font-label-md text-label-md text-on-surface truncate">
                      Nhà Thám Hiểm Sinh Học
                    </span>
                    <span className="font-label-sm text-label-sm text-primary">Cấp độ 6</span>
                  </div>
                  <div className="w-48 h-3.5 bg-secondary-fixed rounded-full overflow-hidden shadow-inner relative mb-1.5">
                    <div className="h-full bg-primary rounded-full w-[82%] relative">
                      <div className="absolute top-0 inset-x-0 h-1 bg-surface-container-lowest/40 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-on-surface-variant truncate">
                    <span className="material-symbols-outlined text-xs text-primary flex-shrink-0">
                      task_alt
                    </span>
                    <span className="font-label-sm text-label-sm truncate">
                      Thu thập 3 Enzyme Pepsin &amp; Khám phá cơ chế co bóp
                    </span>
                  </div>
                </div>
              </div>

              {/* Top-Right: Biology Discovery Tracker & Radar */}
              <div className="flex items-center gap-space-md">
                <div className="bg-surface-container-lowest/90 backdrop-blur-md p-space-sm rounded-[2rem] shadow-xl flex items-center gap-space-md">
                  <div className="flex flex-col pl-2">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="material-symbols-outlined text-sm text-tertiary">
                        biotech
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface font-bold">
                        Mẫu vật: {completedStations.length}/4
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className={`w-2.5 h-2.5 rounded-full ${
                            i < completedStations.length ? 'bg-primary' : 'bg-secondary-fixed'
                          }`}
                        ></span>
                      ))}
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-surface-container-high relative overflow-hidden flex items-center justify-center shadow-inner">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/10 to-transparent"></div>
                    <div className="w-8 h-8 rounded-full border border-dashed border-outline-variant/60 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-ping"></div>
                    </div>
                    <div className="absolute top-2 left-4 w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full bg-secondary"></div>
                  </div>
                </div>

                <button
                  onClick={onExitToMap}
                  className="h-14 px-space-md bg-surface-container-lowest/90 backdrop-blur-md rounded-[2rem] shadow-xl flex items-center gap-1.5 text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">tune</span>
                  <span className="font-label-sm text-label-sm font-bold">[ESC]</span>
                </button>
              </div>
            </div>

            {/* BOTTOM GAMEPLAY CONTROL DECK */}
            <div className="flex flex-col items-center w-full mb-16 pointer-events-auto">
              <div className="bg-surface-container-lowest/95 backdrop-blur-lg px-space-xl py-space-md rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-space-sm max-w-2xl w-full">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-xl">
                      sports_esports
                    </span>
                    <span className="font-label-md text-label-md text-primary uppercase tracking-wide">
                      Khu vực thử thách sinh học 2D
                    </span>
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <span className="px-space-sm py-0.5 bg-secondary-fixed rounded-full font-label-sm text-label-sm text-on-secondary-fixed flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-tertiary">star</span>{' '}
                      +250 EXP
                    </span>
                    <span className="px-space-sm py-0.5 bg-tertiary-fixed rounded-full font-label-sm text-label-sm text-on-tertiary-fixed flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-tertiary">
                        diamond
                      </span>{' '}
                      +15 Ngọc
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedAnswer(null);
                    setActiveStation(STATIONS['tram-2']);
                  }}
                  className="w-full py-space-sm px-space-lg bg-primary hover:bg-primary-container text-on-primary rounded-full font-label-lg text-label-lg shadow-lg flex items-center justify-center gap-space-sm transform transition active:translate-y-0.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">play_circle</span>
                  <span>BẮT ĐẦU PHÁ THỬ THÁCH DẠ DÀY 🎮</span>
                </button>

                <div className="flex items-center justify-center flex-wrap gap-x-space-md gap-y-1 text-on-surface-variant font-label-sm text-label-sm pt-1">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-surface-container rounded font-bold text-on-surface text-[11px]">
                      A/D
                    </kbd>{' '}
                    hoặc{' '}
                    <kbd className="px-1.5 py-0.5 bg-surface-container rounded font-bold text-on-surface text-[11px]">
                      ◄ ►
                    </kbd>{' '}
                    Di chuyển
                  </span>
                  <span className="text-outline-variant">•</span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-0.5 bg-surface-container rounded font-bold text-on-surface text-[11px]">
                      Space
                    </kbd>{' '}
                    Nhảy
                  </span>
                  <span className="text-outline-variant">•</span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-surface-container rounded font-bold text-on-surface text-[11px]">
                      E
                    </kbd>{' '}
                    Tương tác
                  </span>
                  <span className="text-outline-variant">•</span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 bg-surface-container rounded font-bold text-on-surface text-[11px]">
                      Tab
                    </kbd>{' '}
                    Sổ tay Sinh học
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Modal Dialogue for Potabi Companion */}
          {showPotabiModal && (
            <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-space-md">
              <div className="bg-surface-container-lowest max-w-lg w-full rounded-3xl p-space-lg shadow-2xl flex flex-col gap-space-md transform transition-all border-4 border-primary">
                <div className="flex items-start gap-space-md">
                  <div className="w-16 h-16 rounded-full bg-secondary-fixed p-1.5 flex-shrink-0">
                    <img
                      alt="Potabi Dialogue Portrait"
                      className="w-full h-full object-contain rounded-full"
                      referrerPolicy="no-referrer"
                      src={IMAGES.potabiAvatar}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-headline-sm text-headline-sm text-primary">
                      Potabi đồng hành
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                      "Cậu có thấy những lớp cơ dạ dày đang co bóp xung quanh không? Thức ăn được
                      nhào trộn với axit Clohiđric (HCl) và enzym Pepsin để biến thành chất nhuyễn
                      dạng dưỡng trấp đấy! Hãy bấm vào các Trạm 1, 2, 3 trên màn hình để kiểm tra
                      kiến thức nhé!"
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-space-sm pt-space-xs">
                  <button
                    onClick={() => setShowPotabiModal(false)}
                    className="px-space-lg py-space-xs bg-primary text-on-primary rounded-full font-label-md text-label-md hover:bg-primary-container shadow-md cursor-pointer"
                  >
                    Đã hiểu, thám hiểm tiếp!
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Station Quiz Modal */}
          {activeStation && (
            <div className="fixed inset-0 z-50 bg-inverse-surface/70 backdrop-blur-sm flex items-center justify-center p-space-md">
              <div className="bg-surface-container-lowest max-w-xl w-full rounded-3xl p-space-lg shadow-2xl border-4 border-primary flex flex-col gap-space-md">
                <div className="flex items-start justify-between gap-space-sm border-b border-surface-container-high pb-space-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                        {activeStation.pH}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                        {activeStation.enzyme}
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface mt-1">
                      {activeStation.title}
                    </h3>
                    <p className="font-label-sm text-label-sm text-primary">
                      {activeStation.subtitle}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveStation(null)}
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>

                <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low p-space-md rounded-2xl">
                  {activeStation.description}
                </p>

                <div className="flex flex-col gap-space-xs">
                  <p className="font-label-md text-label-md text-on-surface">
                    Câu đố phản xạ: {activeStation.question}
                  </p>
                  {activeStation.options.map((opt, idx) => {
                    const isSelected = selectedAnswer === idx;
                    const isCorrect = idx === activeStation.correctIdx;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedAnswer(idx)}
                        className={`w-full text-left p-3 rounded-2xl font-body-sm text-body-sm border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                              : 'bg-error-container/50 border-error text-on-error-container'
                            : 'bg-surface-container-low border-outline-variant/50 hover:border-primary text-on-surface'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && (
                          <span className="material-symbols-outlined text-lg">
                            {isCorrect ? 'check_circle' : 'error'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end gap-space-sm pt-space-xs">
                  <button
                    onClick={() => setActiveStation(null)}
                    className="px-space-md py-2 rounded-full bg-surface-container text-on-surface font-label-md text-label-md cursor-pointer"
                  >
                    Để sau
                  </button>
                  <button
                    disabled={selectedAnswer !== activeStation.correctIdx}
                    onClick={handleCompleteStation}
                    className={`px-space-lg py-2 rounded-full font-label-md text-label-md transition-all ${
                      selectedAnswer === activeStation.correctIdx
                        ? 'bg-primary text-on-primary shadow-md cursor-pointer'
                        : 'bg-surface-container-highest text-outline cursor-not-allowed'
                    }`}
                  >
                    Thu thập Mẫu vật (+250 EXP)
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
