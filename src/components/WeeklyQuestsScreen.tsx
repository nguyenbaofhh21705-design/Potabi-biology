import React, { useState } from 'react';
import { IMAGES } from '../data/biologyData';

interface WeeklyQuestsScreenProps {
  onOpenNotebook: () => void;
  onClaimReward: (exp: number, diamonds: number) => void;
}

export const WeeklyQuestsScreen: React.FC<WeeklyQuestsScreenProps> = ({
  onOpenNotebook,
  onClaimReward,
}) => {
  const [chestExp, setChestExp] = useState<number>(80);
  const [chestOpened, setChestOpened] = useState<boolean>(false);

  // Challenge 1 state (Quiz)
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [quizStep, setQuizStep] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Challenge 2 state (Matching)
  const [matchCompleted, setMatchCompleted] = useState<boolean>(false);
  const [showMatchModal, setShowMatchModal] = useState<boolean>(false);
  const [matches, setMatches] = useState<Record<string, string>>({});

  const quizQuestions = [
    {
      q: 'Câu 4/5: Enzym Pepsin trong dịch vị dạ dày phân giải chất nào sau đây?',
      options: [
        'A. Tinh bột chín thành đường đôi Maltose',
        'B. Protein chuỗi dài thành các chuỗi Polypeptide ngắn',
        'C. Lipit thành axit béo và glixerin',
      ],
      correct: 1,
    },
    {
      q: 'Câu 5/5: Enzym Trypsin do tuyến tụy tiết ra hoạt động mạnh nhất ở đâu?',
      options: [
        'A. Khoang miệng (môi trường trung tính)',
        'B. Dạ dày (môi trường axit pH 1.5 - 2.5)',
        'C. Ruột non (môi trường kiềm nhẹ pH 7.5 - 8.5)',
      ],
      correct: 2,
    },
  ];

  const handleAnswerQuiz = () => {
    if (selectedOption !== quizQuestions[quizStep].correct) return;
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
      setShowQuizModal(false);
      setChestExp((prev) => Math.min(100, prev + 20));
      onClaimReward(120, 25);
    }
  };

  const handleCompleteMatching = () => {
    if (
      matches['hong-cau'] === 'van-chuyen-khi' &&
      matches['bach-cau'] === 'mien-dich' &&
      matches['tieu-cau'] === 'dong-mau'
    ) {
      setMatchCompleted(true);
      setShowMatchModal(false);
      setChestExp((prev) => Math.min(100, prev + 20));
      onClaimReward(150, 30);
    }
  };

  const completedCount = 1 + (quizCompleted ? 1 : 0) + (matchCompleted ? 1 : 0);
  const weeklyExp = 370 + (quizCompleted ? 120 : 0) + (matchCompleted ? 150 : 0);

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[1536px] mx-auto px-margin py-space-lg flex flex-col gap-space-lg">
        {/* Top Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md bg-surface-container-low p-space-lg rounded-[2rem] shadow-sm relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-surface-container-high/60 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center gap-space-md z-10">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-[0_4px_0_#4a2433]">
              <span
                className="material-symbols-outlined text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                calendar_month
              </span>
            </div>
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm uppercase bg-primary-fixed text-on-primary-fixed px-space-sm py-0.5 rounded-full font-bold">
                  Tuần 42 • Học Kỳ 1
                </span>
                <span className="font-label-sm text-label-sm text-primary font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">timer</span> Làm mới mỗi Thứ
                  Hai
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                Nhiệm vụ tuần &amp; Thử thách Sinh học
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-space-md z-10 w-full md:w-auto justify-end">
            <div className="flex items-center gap-space-sm bg-surface-container-lowest px-space-md py-space-sm rounded-full shadow-sm">
              <span
                className="material-symbols-outlined text-tertiary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                hourglass_top
              </span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant leading-none">
                  Thời gian còn lại
                </span>
                <span className="font-label-lg text-label-lg text-tertiary font-bold tracking-tight">
                  Còn 3 ngày 14 giờ
                </span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-space-xs bg-surface-container-high px-space-md py-space-sm rounded-full">
              <span className="material-symbols-outlined text-primary text-base">bolt</span>
              <span className="font-label-md text-label-md text-on-surface">
                Điểm tuần:{' '}
                <strong className="text-primary font-bold">{weeklyExp}/450 EXP</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Main 12-Col Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          {/* Left Column (5 cols): Chest & Badge */}
          <div className="lg:col-span-5 flex flex-col gap-gutter">
            <div className="bg-surface-container-low rounded-[2rem] p-space-lg shadow-sm flex flex-col gap-space-md relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span
                    className="material-symbols-outlined text-tertiary-container"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    lock_open
                  </span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">
                    Rương Sinh Học Cấp 3
                  </h2>
                </div>
                <span className="font-label-sm text-label-sm bg-tertiary-fixed text-on-tertiary-fixed px-space-sm py-1 rounded-full font-bold uppercase shadow-sm">
                  Độ Hiếm: Vàng
                </span>
              </div>

              <div className="relative w-full bg-surface-container-highest rounded-[2rem] p-space-lg flex flex-col items-center justify-center text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-surface-container-low/40 to-transparent pointer-events-none"></div>
                <div className="relative my-space-xs flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full bg-tertiary-fixed-dim/40 absolute animate-ping opacity-40"></div>
                  <button
                    onClick={() => {
                      if (chestExp >= 100 && !chestOpened) {
                        setChestOpened(true);
                        onClaimReward(200, 50);
                      }
                    }}
                    className={`w-24 h-24 rounded-full bg-gradient-to-br from-tertiary-fixed-dim to-tertiary-fixed flex items-center justify-center shadow-[0_8px_0_#9a6c00] relative transition-transform ${
                      chestExp >= 100 ? 'cursor-pointer hover:scale-105' : ''
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-5xl text-on-tertiary-fixed"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {chestOpened ? 'redeem' : 'card_giftcard'}
                    </span>
                    <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-on-primary text-xs font-bold shadow">
                      3
                    </span>
                  </button>
                </div>

                <p className="font-label-lg text-label-lg text-on-surface mt-space-sm font-bold">
                  Rương Khám Phá Vi Sinh Vật
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                  {chestOpened
                    ? 'Chúc mừng! Bạn đã mở khóa Áo Blouse Bác sĩ Vi Sinh (+200 EXP, +50 KC)!'
                    : 'Mở khóa để nhận vật phẩm độc quyền trang phục học viện!'}
                </p>

                <div className="w-full mt-space-md flex flex-col gap-space-xs">
                  <div className="flex justify-between items-center text-label-sm font-label-sm">
                    <span className="text-on-surface-variant">Tiến trình mở khóa</span>
                    <span className="font-bold text-primary">{chestExp} / 100 EXP</span>
                  </div>
                  <div className="w-full h-5 bg-surface-container rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-tertiary-fixed-dim to-tertiary rounded-full relative transition-all duration-500"
                      style={{ width: `${chestExp}%` }}
                    >
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-surface-container-lowest/30 rounded-t-full"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-space-md w-full flex items-center justify-center gap-space-sm bg-surface-container-lowest p-space-sm rounded-full shadow-sm">
                  <span
                    className="material-symbols-outlined text-primary text-lg"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    apparel
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                    Chứa: <span className="text-primary font-bold">Áo Blouse Bác sĩ Vi Sinh</span>{' '}
                    (Thời hạn vĩnh viễn)
                  </span>
                </div>
              </div>

              <div className="relative bg-surface-container-lowest p-space-md rounded-[1.5rem] shadow-sm flex items-start gap-space-md">
                <div className="relative shrink-0">
                  <img
                    alt="Potabi Mascot"
                    className="w-20 h-20 rounded-full object-cover bg-surface-container p-1 shadow-inner"
                    referrerPolicy="no-referrer"
                    src={IMAGES.potabiAvatar}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-tertiary text-on-tertiary w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow">
                    ★
                  </div>
                </div>
                <div className="flex flex-col gap-space-xs relative">
                  <div className="flex items-center gap-space-xs">
                    <span className="font-label-md text-label-md text-primary font-bold">
                      Potabi Đồng Hành
                    </span>
                    <span
                      className="material-symbols-outlined text-tertiary text-base"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                  </div>
                  <div className="relative bg-surface-container-low px-space-md py-space-sm rounded-2xl text-on-surface">
                    <p className="font-body-sm text-body-sm leading-relaxed">
                      {chestExp >= 100 ? (
                        <>
                          “Tuyệt vời quá! Rương Sinh Học Cấp 3 đã đủ 100/100 EXP rồi, bạn bấm vào{' '}
                          <strong className="text-primary font-bold">Rương Vàng</strong> phía trên
                          để nhận thưởng nhé!”
                        </>
                      ) : (
                        <>
                          “Cố lên bạn ơi! Hoàn thành thêm{' '}
                          <strong className="text-primary font-bold">1 nhiệm vụ nữa</strong> để mở
                          Rương Sinh Học chứa{' '}
                          <strong className="text-tertiary font-bold">Áo Blouse Bác sĩ</strong>{' '}
                          nhé!”
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-high/60 rounded-[2rem] p-space-md flex items-center justify-between gap-space-md shadow-sm">
              <div className="flex items-center gap-space-sm">
                <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed shadow-[0_3px_0_#9a6c00]">
                  <span
                    className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    military_tech
                  </span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">
                    Huy hiệu danh giá tuần
                  </span>
                  <p className="font-headline-sm text-headline-sm text-on-surface font-bold">
                    Bác sĩ Vi Sinh Nhí
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-tertiary-fixed-dim text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-tertiary-fixed-dim text-xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                <span
                  className={`material-symbols-outlined text-xl ${
                    completedCount === 3 ? 'text-tertiary-fixed-dim' : 'text-outline-variant'
                  }`}
                  style={completedCount === 3 ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  star
                </span>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Challenge List */}
          <div className="lg:col-span-7 flex flex-col gap-gutter">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Danh sách thử thách
                </span>
                <span className="font-label-sm text-label-sm bg-primary text-on-primary px-space-sm py-0.5 rounded-full font-bold">
                  {3 - completedCount}/3 Sẵn sàng
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Làm lại sau mỗi 24 giờ nếu thất bại
              </span>
            </div>

            <div className="flex flex-col gap-space-md">
              {/* Challenge Card 1 */}
              <div className="bg-surface-container-lowest rounded-[2rem] p-space-lg shadow-sm hover:shadow-md transition-shadow flex flex-col gap-space-md relative">
                <div className="flex flex-wrap items-start justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary shadow-[0_3px_0_#d5c2c4]">
                      <span className="material-symbols-outlined text-2xl">quiz</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed px-space-sm py-0.5 rounded-full font-bold">
                          Trắc nghiệm Sinh học 7
                        </span>
                        <span className="font-label-sm text-label-sm text-primary font-bold">
                          • 5 Phút
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">
                        Câu hỏi Sinh học nhanh: Men tiêu hóa
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-full">
                    <span className="font-label-md text-label-md text-primary font-bold">
                      {quizCompleted ? 'Hoàn thành 5/5 câu ✔' : 'Tiến độ: 3/5 câu'}
                    </span>
                  </div>
                </div>

                <p className="font-body-md text-body-md text-on-surface-variant">
                  Tìm hiểu vai trò của enzym Pepsin, Amylase và Trypsin trong quá trình phân giải
                  chất hữu cơ ở người.
                </p>

                <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{ width: quizCompleted ? '100%' : '60%' }}
                  ></div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs">
                  <div className="flex items-center gap-space-md">
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase">
                      Phần thưởng:
                    </span>
                    <div className="flex items-center gap-space-xs bg-surface-container-high px-space-sm py-1 rounded-full text-on-surface font-label-sm text-label-sm font-bold">
                      <span className="material-symbols-outlined text-sm text-primary">bolt</span>{' '}
                      +120 EXP
                    </div>
                    <div className="flex items-center gap-space-xs bg-surface-container-high px-space-sm py-1 rounded-full text-tertiary font-label-sm text-label-sm font-bold">
                      <span
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        diamond
                      </span>{' '}
                      +25 Kim cương
                    </div>
                  </div>

                  <button
                    disabled={quizCompleted}
                    onClick={() => setShowQuizModal(true)}
                    className={`w-full sm:w-auto px-space-lg py-space-sm font-label-lg text-label-lg rounded-full transition-all flex items-center justify-center gap-space-xs ${
                      quizCompleted
                        ? 'bg-surface-container text-on-surface-variant cursor-not-allowed opacity-75'
                        : 'bg-primary text-on-primary shadow-[0_5px_0_#4a2433] hover:bg-primary-container hover:-translate-y-0.5 active:translate-y-1 cursor-pointer'
                    }`}
                  >
                    <span>{quizCompleted ? 'Đã nhận thưởng' : 'Thực hiện thử thách'}</span>
                    <span className="material-symbols-outlined text-base">
                      {quizCompleted ? 'task_alt' : 'arrow_forward'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Challenge Card 2 */}
              <div className="bg-surface-container-lowest rounded-[2rem] p-space-lg shadow-sm hover:shadow-md transition-shadow flex flex-col gap-space-md relative">
                <div className="flex flex-wrap items-start justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary shadow-[0_3px_0_#d5c2c4]">
                      <span className="material-symbols-outlined text-2xl">cable</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-label-sm text-label-sm bg-secondary-fixed text-on-secondary-fixed px-space-sm py-0.5 rounded-full font-bold">
                          Ghép Đôi Thuật Ngữ
                        </span>
                        <span className="font-label-sm text-label-sm text-primary font-bold">
                          • Kéo thả
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">
                        Nối thuật ngữ với khái niệm: Tế bào máu
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-full">
                    <span className="font-label-md text-label-md text-on-surface-variant font-bold">
                      {matchCompleted ? 'Hoàn thành 1/1 bộ ✔' : 'Tiến độ: 0/1 bộ'}
                    </span>
                  </div>
                </div>

                <p className="font-body-md text-body-md text-on-surface-variant">
                  Phân định và nối đúng chức năng sinh học chính giữa{' '}
                  <strong className="text-on-surface">Hồng cầu</strong> (vận chuyển khí),{' '}
                  <strong className="text-on-surface">Bạch cầu</strong> (miễn dịch bảo vệ), và{' '}
                  <strong className="text-on-surface">Tiểu cầu</strong> (đông máu).
                </p>

                <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{ width: matchCompleted ? '100%' : '0%' }}
                  ></div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs">
                  <div className="flex items-center gap-space-md">
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase">
                      Phần thưởng:
                    </span>
                    <div className="flex items-center gap-space-xs bg-surface-container-high px-space-sm py-1 rounded-full text-on-surface font-label-sm text-label-sm font-bold">
                      <span className="material-symbols-outlined text-sm text-primary">bolt</span>{' '}
                      +150 EXP
                    </div>
                    <div className="flex items-center gap-space-xs bg-surface-container-high px-space-sm py-1 rounded-full text-tertiary font-label-sm text-label-sm font-bold">
                      <span
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        diamond
                      </span>{' '}
                      +30 Kim cương
                    </div>
                  </div>

                  <button
                    disabled={matchCompleted}
                    onClick={() => setShowMatchModal(true)}
                    className={`w-full sm:w-auto px-space-lg py-space-sm font-label-lg text-label-lg rounded-full transition-all flex items-center justify-center gap-space-xs ${
                      matchCompleted
                        ? 'bg-surface-container text-on-surface-variant cursor-not-allowed opacity-75'
                        : 'bg-primary text-on-primary shadow-[0_5px_0_#4a2433] hover:bg-primary-container hover:-translate-y-0.5 active:translate-y-1 cursor-pointer'
                    }`}
                  >
                    <span>{matchCompleted ? 'Đã nhận thưởng' : 'Thực hiện thử thách'}</span>
                    <span className="material-symbols-outlined text-base">
                      {matchCompleted ? 'task_alt' : 'arrow_forward'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Challenge Card 3 (Completed) */}
              <div className="bg-surface-container-high/40 rounded-[2rem] p-space-lg shadow-sm flex flex-col gap-space-md relative opacity-90">
                <div className="flex flex-wrap items-start justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-secondary">
                      <span
                        className="material-symbols-outlined text-2xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <span className="font-label-sm text-label-sm bg-surface-container-highest text-secondary px-space-sm py-0.5 rounded-full font-bold">
                          Điền Khuyết Ngắn
                        </span>
                        <span className="font-label-sm text-label-sm text-secondary font-bold">
                          • Đã xong
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface mt-0.5 line-through decoration-secondary decoration-2">
                        Câu trả lời ngắn: Đường đi của Oxy
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-xs bg-surface-container px-space-md py-space-xs rounded-full">
                    <span className="material-symbols-outlined text-primary text-base">
                      done_all
                    </span>
                    <span className="font-label-md text-label-md text-primary font-bold">
                      Hoàn thành ✔
                    </span>
                  </div>
                </div>

                <p className="font-body-md text-body-md text-on-surface-variant">
                  Điền sơ đồ trao đổi khí từ phế nang phổi, mao mạch phế nang đến tâm nhĩ trái của
                  tim.
                </p>

                <div className="w-full bg-surface-container rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{ width: '100%' }}
                  ></div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs">
                  <div className="flex items-center gap-space-md">
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase">
                      Đã nhận:
                    </span>
                    <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-1 rounded-full text-secondary font-label-sm text-label-sm font-semibold">
                      <span className="material-symbols-outlined text-sm">bolt</span> +100 EXP
                    </div>
                    <div className="flex items-center gap-space-xs bg-surface-container px-space-sm py-1 rounded-full text-secondary font-label-sm text-label-sm font-semibold">
                      <span className="material-symbols-outlined text-sm">diamond</span> +20 Kim
                      cương
                    </div>
                  </div>
                  <button
                    className="w-full sm:w-auto px-space-lg py-space-sm bg-surface-container text-on-surface-variant font-label-lg text-label-lg rounded-full cursor-not-allowed opacity-75 flex items-center justify-center gap-space-xs"
                    disabled
                  >
                    <span className="material-symbols-outlined text-base">task_alt</span>
                    <span>Đã nhận thưởng</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Weekly Tip Banner */}
        <div className="w-full bg-surface-container-low rounded-[2rem] p-space-md flex flex-col md:flex-row items-center justify-between gap-space-md text-center md:text-left shadow-sm">
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-2xl">tips_and_updates</span>
            </div>
            <div>
              <p className="font-label-lg text-label-lg text-on-surface font-bold">
                Mẹo tuần này cho Nhà Khám Phá
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Hãy ôn lại sơ đồ vòng tuần hoàn lớn và nhỏ trong bài học “Hệ Tuần Hoàn” để vượt qua
                câu đố ghép nối nhanh hơn 20%!
              </p>
            </div>
          </div>
          <button
            onClick={onOpenNotebook}
            className="px-space-md py-space-xs bg-surface-container-highest text-primary font-label-md text-label-md rounded-full hover:bg-surface-container transition-colors whitespace-nowrap cursor-pointer"
          >
            Mở Sổ Tay Sinh Học ➔
          </button>
        </div>
      </div>

      {/* Modal 1: Enzyme Quick Quiz */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/70 backdrop-blur-md p-space-md">
          <div className="bg-surface-container-lowest rounded-3xl max-w-xl w-full p-space-lg shadow-2xl border-4 border-primary flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-space-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Câu hỏi Sinh học nhanh: Men tiêu hóa
              </h3>
              <button
                onClick={() => setShowQuizModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <p className="font-label-lg text-label-lg text-primary">
              {quizQuestions[quizStep].q}
            </p>

            <div className="flex flex-col gap-space-xs">
              {quizQuestions[quizStep].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  className={`p-3.5 rounded-2xl text-left font-body-md text-body-md border-2 transition-all cursor-pointer flex items-center justify-between ${
                    selectedOption === idx
                      ? idx === quizQuestions[quizStep].correct
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                        : 'bg-error-container/50 border-error text-on-error-container'
                      : 'bg-surface-container-low border-outline-variant/40 hover:border-primary'
                  }`}
                >
                  <span>{opt}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-space-sm">
              <button
                onClick={() => setShowQuizModal(false)}
                className="px-space-md py-2 rounded-full bg-surface-container text-on-surface font-label-md text-label-md cursor-pointer"
              >
                Đóng
              </button>
              <button
                disabled={selectedOption !== quizQuestions[quizStep].correct}
                onClick={handleAnswerQuiz}
                className={`px-space-lg py-2 rounded-full font-label-md text-label-md ${
                  selectedOption === quizQuestions[quizStep].correct
                    ? 'bg-primary text-on-primary cursor-pointer'
                    : 'bg-surface-container-highest text-outline cursor-not-allowed'
                }`}
              >
                {quizStep < quizQuestions.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành (+120 EXP)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Blood Cell Term Matching */}
      {showMatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/70 backdrop-blur-md p-space-md">
          <div className="bg-surface-container-lowest rounded-3xl max-w-xl w-full p-space-lg shadow-2xl border-4 border-primary flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-space-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Ghép Đôi Thuật Ngữ: Tế Bào Máu
              </h3>
              <button
                onClick={() => setShowMatchModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Chọn đúng chức năng sinh học tương ứng cho từng loại tế bào máu bên dưới:
            </p>

            {[
              { id: 'hong-cau', label: '1. Hồng cầu (Erythrocyte)' },
              { id: 'bach-cau', label: '2. Bạch cầu (Leukocyte)' },
              { id: 'tieu-cau', label: '3. Tiểu cầu (Thrombocyte)' },
            ].map((cell) => (
              <div
                key={cell.id}
                className="bg-surface-container-low p-space-md rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <span className="font-label-lg text-label-lg text-on-surface">{cell.label}</span>
                <select
                  value={matches[cell.id] || ''}
                  onChange={(e) => setMatches({ ...matches, [cell.id]: e.target.value })}
                  className="px-3 py-2 rounded-full bg-surface-container-lowest border-2 border-primary/40 font-label-md text-label-md text-primary cursor-pointer"
                >
                  <option value="">-- Chọn chức năng --</option>
                  <option value="van-chuyen-khi">Vận chuyển khí O2 và CO2</option>
                  <option value="mien-dich">Miễn dịch, thực bào bảo vệ cơ thể</option>
                  <option value="dong-mau">Giải phóng enzym giúp đông máu</option>
                </select>
              </div>
            ))}

            <div className="flex justify-end gap-space-sm pt-2">
              <button
                onClick={() => setShowMatchModal(false)}
                className="px-space-md py-2 rounded-full bg-surface-container text-on-surface font-label-md text-label-md cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleCompleteMatching}
                className="px-space-lg py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md cursor-pointer shadow-md"
              >
                Kiểm tra &amp; Nhận +150 EXP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
