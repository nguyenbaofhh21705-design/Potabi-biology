import React, { useState } from 'react';
import { IMAGES, NOTEBOOK_ENTRIES, STAGES } from '../data/biologyData';
import { calculateExplorerLevel } from '../data/gameProgress';

interface JourneyMapScreenProps {
  onPlayCutscene: () => void;
  onPlayStage2D: (stageId: string) => void;
  onOpenNotebook: () => void;
  onNavigateQuests: () => void;
  diamonds: number;
  exp: number;
  unlockedStageIds: string[];
  completedStageIds: string[];
  stageProgress: Record<string, number>;
  unlockedSpecimens: string[];
  onCompleteStageQuiz: (stageId: string, expReward: number, diamondReward: number) => void;
  onOpenAssetShowcase?: () => void;
}

const CIRCULATORY_QUIZ = [
  {
    q: 'Câu 1/3 (Sinh học 8 - Bài 16): Ở người, ngăn tim nào có thành cơ dày nhất để bơm máu giàu O2 vào động mạch chủ đi nuôi toàn bộ cơ thể?',
    options: [
      'A. Tâm nhĩ phải',
      'B. Tâm thất phải',
      'C. Tâm thất trái',
    ],
    correct: 2,
    hint: 'Gợi ý: Ngăn tim này là điểm xuất phát của Vòng tuần hoàn lớn đi khắp cơ thể.',
    explanation: 'Chính xác! Tâm thất trái có thành cơ dày nhất vì phải tạo lực đẩy lớn nhất đưa máu vào Vòng tuần hoàn lớn.',
  },
  {
    q: 'Câu 2/3 (Sinh học 8 - Bài 17): Mỗi chu kỳ co dãn của tim người trưởng thành kéo dài khoảng 0,8 giây gồm 3 pha theo thứ tự nào?',
    options: [
      'A. Pha nhĩ co (0,1s) → Pha thất co (0,3s) → Pha dãn chung (0,4s)',
      'B. Pha thất co (0,4s) → Pha nhĩ co (0,2s) → Pha dãn chung (0,2s)',
      'C. Pha dãn chung (0,6s) → Pha nhĩ co (0,1s) → Pha thất co (0,1s)',
    ],
    correct: 0,
    hint: 'Gợi ý: Nhờ thời gian nghỉ (pha dãn chung) chiếm tới một nửa chu kỳ (0,4s) mà cơ tim có thể làm việc suốt đời không mỏi.',
    explanation: 'Tuyệt vời! Chu kỳ tim 0,8s gồm: Pha nhĩ co 0,1s, Pha thất co 0,3s và Pha dãn chung 0,4s.',
  },
  {
    q: 'Câu 3/3 (Sinh học 8 - Bài 16): Loại mạch máu nào có thành chỉ gồm một lớp biểu bì mỏng và lòng mạch hẹp nhất giúp thực hiện trao đổi chất với tế bào?',
    options: [
      'A. Động mạch chủ',
      'B. Tĩnh mạch chủ',
      'C. Mao mạch',
    ],
    correct: 2,
    hint: 'Gợi ý: Mạch máu nối giữa tiểu động mạch và tiểu tĩnh mạch, nơi hồng cầu phải đi thành hàng một.',
    explanation: 'Xuất sắc! Mao mạch có thành chỉ gồm 1 lớp tế bào biểu bì và vận tốc máu chậm nhất giúp trao đổi O2, CO2 và chất dinh dưỡng hiệu quả.',
  },
];

const RESPIRATORY_QUIZ = [
  {
    q: 'Câu 1/3 (Sinh học 8 - Bài 21): Sự trao đổi khí giữa phế nang ở phổi và máu trong mao mạch diễn ra theo cơ chế vật lý nào?',
    options: [
      'A. Khuếch tán khí từ nơi có nồng độ (phân áp) cao tới nơi có nồng độ thấp',
      'B. Vận chuyển chủ động tiêu tốn toàn bộ năng lượng của phế nang',
      'C. Thẩm thấu của phân tử nước qua màng tế bào',
    ],
    correct: 0,
    hint: 'Gợi ý: Nồng độ O2 trong không khí phế nang cao hơn trong máu mao mạch phổi.',
    explanation: 'Chính xác! O2 khuếch tán từ phế nang vào máu và CO2 khuếch tán từ máu ra phế nang nhờ chênh lệch phân áp.',
  },
  {
    q: 'Câu 2/3 (Sinh học 8 - Bài 20): Cấu tạo nào của phổi làm tăng diện tích bề mặt trao đổi khí lên tới 70 – 80 m²?',
    options: [
      'A. Nhờ các vòng sụn khí quản xếp chồng lên nhau',
      'B. Nhờ có tới 700 – 800 triệu phế nang (túi phổi nhỏ) bao quanh bởi mạng mao mạch dày đặc',
      'C. Nhờ cơ hoành ngăn cách khoang ngực và khoang bụng',
    ],
    correct: 1,
    hint: 'Gợi ý: Đơn vị cấu tạo nhỏ nhất dạng túi ở tận cùng phế quản.',
    explanation: 'Hoàn toàn chính xác! Hàng trăm triệu phế nang giúp diện tích trao đổi khí của phổi gấp hơn 40 lần diện tích da cơ thể.',
  },
  {
    q: 'Câu 3/3 (Sinh học 8 - Bài 21): Khi cử động hít vào bình thường, cơ liên sườn ngoài và cơ hoành phối hợp hoạt động như thế nào?',
    options: [
      'A. Cơ liên sườn ngoài co, cơ hoành co làm thể tích lồng ngực tăng lên',
      'B. Cơ liên sườn ngoài dãn, cơ hoành dãn làm thể tích lồng ngực giảm xuống',
      'C. Cơ hoành ngừng hoạt động hoàn toàn',
    ],
    correct: 0,
    hint: 'Gợi ý: Khi cơ hoành co sẽ hạ thấp xuống phía bụng, kéo đáy phổi xuống.',
    explanation: 'Đúng rồi! Sự co của cơ liên sườn ngoài và cơ hoành làm lồng ngực nở rộng theo cả 3 chiều, kéo không khí tràn vào phổi.',
  },
];

const NERVOUS_QUIZ = [
  {
    q: 'Câu 1/3 (Sinh học 8 - Bài 43): Đơn vị cấu tạo và chức năng cơ bản của hệ thần kinh người là gì?',
    options: [
      'A. Tế bào Nơ-ron gồm thân chứa nhân, sợi nhánh và một sợi trục',
      'B. Tế bào cơ trơn có khả năng co rút tự động',
      'C. Tế bào biểu bì màng nhầy',
    ],
    correct: 0,
    hint: 'Gợi ý: Tế bào có bao Myelin bao bọc và các eo Ranvier dẫn truyền xung điện cực nhanh.',
    explanation: 'Chính xác! Nơ-ron là đơn vị cấu tạo của hệ thần kinh, có chức năng cảm ứng và dẫn truyền xung thần kinh.',
  },
  {
    q: 'Câu 2/3 (Sinh học 8 - Bài 6): Một cung phản xạ hoàn chỉnh gồm bao nhiêu thành phần theo thứ tự?',
    options: [
      'A. 3 thành phần: Cơ quan thụ cảm → Não bộ → Cơ quan phản ứng',
      'B. 5 thành phần: Cơ quan thụ cảm → Nơ-ron hướng tâm → Nơ-ron trung gian → Nơ-ron li tâm → Cơ quan phản ứng',
      'C. 2 thành phần: Dây thần kinh và Bắp cơ',
    ],
    correct: 1,
    hint: 'Gợi ý: Xung thần kinh đi từ thụ cảm qua hướng tâm vào trung ương rồi theo li tâm ra cơ quan thực hiện.',
    explanation: 'Hoàn toàn chính xác! Cung phản xạ gồm đủ 5 mắt xích dẫn truyền xung thần kinh khép kín.',
  },
  {
    q: 'Câu 3/3 (Sinh học 8 - Bài 44): Vỏ não người có các vùng cảm giác và vận động, cùng các vùng chức năng bậc cao chỉ có ở người là?',
    options: [
      'A. Vùng hiểu tiếng nói và vùng hiểu chữ viết',
      'B. Vùng thị giác và vùng thính giác',
      'C. Vùng vận động ăn uống',
    ],
    correct: 0,
    hint: 'Gợi ý: Vùng chức năng liên quan đến ngôn ngữ, tư duy trừu tượng và chữ viết.',
    explanation: 'Xuất sắc! Vùng vận động ngôn ngữ, hiểu tiếng nói và hiểu chữ viết là đặc trưng tiến hóa chỉ có ở con người.',
  },
];

const MUSCULOSKELETAL_QUIZ = [
  {
    q: 'Câu 1/3 (Sinh học 8 - Bài 9): Xương dài của người phát triển to ra về bề ngang và dài ra về chiều dài nhờ cơ chế nào?',
    options: [
      'A. To ra nhờ tế bào màng xương phân chia; Dài ra nhờ sự phân chia tế bào sụn tăng trưởng',
      'B. To ra nhờ tủy đỏ; Dài ra nhờ bao khớp',
      'C. Xương chỉ to ra chứ không thể dài thêm sau khi sinh',
    ],
    correct: 0,
    hint: 'Gợi ý: Màng xương ở ngoài cùng phân chia tạo lớp xương mới; sụn đầu xương hóa xương để tăng chiều cao.',
    explanation: 'Chính xác! Tế bào màng xương giúp xương dày lên, còn lớp sụn tăng trưởng ở hai đầu xương giúp xương dài ra.',
  },
  {
    q: 'Câu 2/3 (Sinh học 8 - Bài 9): Thành phần hóa học nào giúp xương người vừa có tính mềm dẻo đàn hồi, vừa có tính bền chắc chịu lực?',
    options: [
      'A. Chất hữu cơ (cốt giao) tạo tính mềm dẻo; Chất vô cơ (muối Canxi, Photpho) tạo tính bền chắc',
      'B. 100% là tinh thể Canxi nguyên chất',
      'C. Chỉ có chất béo và dịch tủy xương',
    ],
    correct: 0,
    hint: 'Gợi ý: Tỉ lệ cốt giao và muối khoáng thay đổi theo độ tuổi (người trẻ xương dẻo dai hơn người già).',
    explanation: 'Rất chính xác! Sự kết hợp hoàn hảo giữa chất hữu cơ dẻo dai và muối khoáng cứng cáp giúp xương chịu được lực nén lớn.',
  },
  {
    q: 'Câu 3/3 (Sinh học 8 - Bài 11): Khi bắp cơ co, tơ cơ mảnh trượt sâu vào vùng tơ cơ dày làm bắp cơ ngắn lại và phình to là nhờ năng lượng từ đâu?',
    options: [
      'A. Năng lượng ATP sinh ra từ quá trình oxy hóa chất dinh dưỡng (hô hấp tế bào)',
      'B. Chỉ nhờ dòng máu đẩy trực tiếp vào tế bào cơ',
      'C. Do áp suất không khí bên ngoài ép vào',
    ],
    correct: 0,
    hint: 'Gợi ý: Đồng tiền năng lượng của tế bào được ty thể tổng hợp liên tục.',
    explanation: 'Tuyệt vời! ATP cung cấp năng lượng cho các cầu nối Actomyosin trượt lên nhau, tạo nên lực co cơ kỳ diệu.',
  },
];

const EXCRETORY_QUIZ = [
  {
    q: 'Câu 1/3 (Sinh học 8 - Bài 38, 39): Nơi nào trong đơn vị chức năng Nephron thực hiện quá trình lọc máu để tạo ra nước tiểu đầu?',
    options: [
      'A. Nang cầu thận và búi mao mạch Cầu thận',
      'B. Ống góp nước tiểu',
      'C. Bóng đái (Bàng quang)',
    ],
    correct: 0,
    hint: 'Gợi ý: Áp lực máu cao trong quản cầu Malpighi đẩy nước và chất hòa tan qua màng lọc.',
    explanation: 'Chính xác! Cầu thận là nơi diễn ra quá trình lọc máu, tạo ra khoảng 170 lít nước tiểu đầu mỗi ngày.',
  },
  {
    q: 'Câu 2/3 (Sinh học 8 - Bài 39): Nhờ quá trình nào tại ống thận mà cơ thể không bị mất hết nước và chất dinh dưỡng quý giá?',
    options: [
      'A. Quá trình hấp thụ lại (hấp thụ lại hơn 99% nước, toàn bộ glucozơ và ion khoáng cần thiết)',
      'B. Quá trình lọc máu lần thứ hai',
      'C. Quá trình lên men vi sinh vật',
    ],
    correct: 0,
    hint: 'Gợi ý: Các tế bào biểu mô ống thận có nhiều vi nhung mao và ty thể để vận chuyển chủ động.',
    explanation: 'Tuyệt vời! Quá trình hấp thụ lại đưa nước, glucozơ và ion có ích trở lại mao mạch quanh ống thận.',
  },
  {
    q: 'Câu 3/3 (Sinh học 8 - Bài 39): Mỗi ngày ở người trưởng thành khỏe mạnh tạo ra khoảng bao nhiêu lít nước tiểu chính thức?',
    options: [
      'A. Khoảng 1,5 lít nước tiểu chính thức',
      'B. Khoảng 170 lít',
      'C. Khoảng 50 lít',
    ],
    correct: 0,
    hint: 'Gợi ý: Lượng dịch sau khi đã được hấp thụ lại 99% lượng nước.',
    explanation: 'Hoàn hảo! Từ 170 lít nước tiểu đầu, sau khi qua ống thận chỉ còn lại khoảng 1.5 lít nước tiểu chính thức đậm đặc chứa chất thải.',
  },
];

const ENDOCRINE_QUIZ = [
  {
    q: 'Câu 1/3 (Sinh học 8 - Bài 55): Tuyến nội tiết khác với tuyến ngoại tiết ở đặc điểm giải phẫu và sinh lý nào?',
    options: [
      'A. Tuyến nội tiết không có ống dẫn, sản phẩm tiết (hormone) ngấm thẳng vào dòng máu',
      'B. Tuyến nội tiết có ống dẫn rất dài dẫn ra ngoài da',
      'C. Tuyến nội tiết chỉ tiết chất bôi trơn',
    ],
    correct: 0,
    hint: 'Gợi ý: Các tế bào tuyến nằm bao quanh mạng lưới mao mạch máu dày đặc.',
    explanation: 'Chính xác! Tuyến nội tiết không có ống dẫn; chất tiết là các hormone ngấm thẳng vào máu để vận chuyển đi khắp cơ thể.',
  },
  {
    q: 'Câu 2/3 (Sinh học 8 - Bài 56): Tuyến nội tiết nào giữ vai trò "nhạc trưởng" chỉ huy và điều hòa hoạt động của hầu hết các tuyến nội tiết khác?',
    options: [
      'A. Tuyến Yên (nằm ở nền sọ)',
      'B. Tuyến Mồ hôi',
      'C. Tuyến Nước bọt',
    ],
    correct: 0,
    hint: 'Gợi ý: Tuyến này tiết các hormone kích thích tuyến giáp (TSH), tuyến trên thận (ACTH), tuyến sinh dục (FSH, LH).',
    explanation: 'Rất chính xác! Tuyến Yên là tuyến quan trọng nhất, tiết các hormone kích thích điều khiển các tuyến nội tiết khác.',
  },
  {
    q: 'Câu 3/3 (Sinh học 8 - Bài 57): Hai loại hormone nào do các tế bào đảo tụy Langerhans tiết ra để cùng điều hòa lượng đường huyết luôn ổn định quanh 0,12%?',
    options: [
      'A. Insulin (hạ đường huyết) và Glucagon (nâng đường huyết)',
      'B. Adrenalin và Pepsin',
      'C. Amylase và Mucin',
    ],
    correct: 0,
    hint: 'Gợi ý: Một chất kích thích chuyển glucozơ thành glicôgen, chất kia phân giải glicôgen thành glucozơ.',
    explanation: 'Xuất sắc! Insulin từ tế bào beta làm hạ đường huyết, còn Glucagon từ tế bào alpha nâng đường huyết khi đói.',
  },
];

const REPRODUCTIVE_QUIZ = [
  {
    q: 'Câu 1/3 (Sinh học 8 - Bài 60, 62): Số lượng nhiễm sắc thể trong mỗi tế bào sinh dục (giao tử: trứng hoặc tinh trùng) của người là bao nhiêu?',
    options: [
      'A. Bộ đơn bội n = 23 nhiễm sắc thể',
      'B. Bộ lưỡng bội 2n = 46 nhiễm sắc thể',
      'C. Không có nhiễm sắc thể nào',
    ],
    correct: 0,
    hint: 'Gợi ý: Qua giảm phân, số lượng NST giảm đi một nửa so với tế bào sinh dưỡng.',
    explanation: 'Chính xác! Giao tử chỉ mang bộ đơn bội n = 23 chiếc. Khi thụ tinh kết hợp sẽ tạo thành hợp tử 2n = 46.',
  },
  {
    q: 'Câu 2/3 (Sinh học 8 - Bài 62): Ở người, sự thụ tinh khoa học bình thường diễn ra tại vị trí nào trong cơ quan sinh dục nữ?',
    options: [
      'A. Tại 1/3 phía ngoài của ống dẫn trứng (vòi trứng)',
      'B. Trong lòng dạ dày',
      'C. Trong buồng tim',
    ],
    correct: 0,
    hint: 'Gợi ý: Tinh trùng bơi qua tử cung lên gặp trứng tại đoạn vòi trứng.',
    explanation: 'Tuyệt vời! Sự thụ tinh diễn ra ở 1/3 phía ngoài của ống dẫn trứng khi tinh trùng khỏe nhất gặp noãn bào.',
  },
  {
    q: 'Câu 3/3 (Sinh học 8 - Bài 62): Sau khi thụ tinh tạo thành hợp tử (2n = 46), phôi sẽ di chuyển về đâu để làm tổ và phát triển suốt thai kỳ?',
    options: [
      'A. Di chuyển về buồng Tử Cung để làm tổ trong lớp niêm mạc dày xốp',
      'B. Di chuyển về Bàng quang',
      'C. Di chuyển về Phổi',
    ],
    correct: 0,
    hint: 'Gợi ý: Cơ quan có lớp cơ trơn đàn hồi dày và niêm mạc giàu mạch máu nuôi thai.',
    explanation: 'Hoàn hảo! Phôi di chuyển về làm tổ an toàn trong lớp niêm mạc tử cung đã được chuẩn bị sẵn sàng.',
  },
];

export const JourneyMapScreen: React.FC<JourneyMapScreenProps> = ({
  onPlayCutscene,
  onPlayStage2D,
  onOpenNotebook,
  onNavigateQuests,
  diamonds,
  exp,
  unlockedStageIds,
  completedStageIds,
  stageProgress,
  unlockedSpecimens,
  onCompleteStageQuiz,
  onOpenAssetShowcase,
}) => {
  const [selectedStageId, setSelectedStageId] = useState<string>('tuan-hoan');
  const [activeRegion, setActiveRegion] = useState<'all' | 'region1' | 'region2'>('all');
  const [showTheoryModal, setShowTheoryModal] = useState<boolean>(false);
  const [filterUnlockedOnly, setFilterUnlockedOnly] = useState<boolean>(false);
  const [activeBottomModal, setActiveBottomModal] = useState<
    null | 'badges' | 'specimens' | 'leaderboard'
  >(null);
  const [lockNotice, setLockNotice] = useState<string | null>(null);

  // Interactive Stage Challenge Modal for Stages 2 & 3
  const [activeQuizStageId, setActiveQuizStageId] = useState<string | null>(null);
  const [quizStep, setQuizStep] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);

  const explorerLevel = calculateExplorerLevel(exp).level;
  const currentStage = STAGES[selectedStageId] || STAGES['tuan-hoan'];
  const isCurrentStageUnlocked =
    unlockedStageIds.includes(selectedStageId) &&
    (!currentStage.requiredLevel || explorerLevel >= currentStage.requiredLevel);

  // Calculate region progress dynamically from stageProgress
  const totalRegionProgress = Math.round(
    Object.values(stageProgress).reduce((acc, v) => acc + v, 0) / 5
  );

  const handleEnterGame = () => {
    setLockNotice(null);
    if (!isCurrentStageUnlocked) {
      if (currentStage.requiredStageId && !completedStageIds.includes(currentStage.requiredStageId)) {
        const reqStage = STAGES[currentStage.requiredStageId];
        setLockNotice(
          `Chặng này đang khóa! Bạn cần hoàn thành 100% "${reqStage?.name || 'Màn trước'}" trước khi vào màn này.`
        );
      } else if (currentStage.requiredLevel && explorerLevel < currentStage.requiredLevel) {
        setLockNotice(
          `Chặng này yêu cầu Nhà Thám Hiểm đạt Cấp ${currentStage.requiredLevel} (Hiện tại: Cấp ${explorerLevel}). Hãy làm Nhiệm vụ tuần hoặc khám phá các trạm để tăng EXP!`
        );
      }
      return;
    }

    onPlayStage2D(selectedStageId);
  };

  const activeQuizData =
    activeQuizStageId === 'ho-hap'
      ? RESPIRATORY_QUIZ
      : activeQuizStageId === 'than-kinh'
      ? NERVOUS_QUIZ
      : activeQuizStageId === 'van-dong'
      ? MUSCULOSKELETAL_QUIZ
      : activeQuizStageId === 'bai-tiet'
      ? EXCRETORY_QUIZ
      : activeQuizStageId === 'noi-tiet'
      ? ENDOCRINE_QUIZ
      : activeQuizStageId === 'sinh-duc'
      ? REPRODUCTIVE_QUIZ
      : CIRCULATORY_QUIZ;

  const handleNextQuizQuestion = () => {
    if (!activeQuizStageId) return;
    if (selectedOpt !== activeQuizData[quizStep].correct) return;
    if (quizStep < activeQuizData.length - 1) {
      setQuizStep((s) => s + 1);
      setSelectedOpt(null);
      setShowHint(false);
    } else {
      const st = STAGES[activeQuizStageId];
      onCompleteStageQuiz(activeQuizStageId, st.exp, st.diamonds);
      setActiveQuizStageId(null);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full overflow-hidden px-margin pb-space-xl">
        {/* Top Heading Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md py-space-md">
          <div className="flex items-center gap-space-md">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-primary text-3xl">map</span>
            </div>
            <div>
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-bold">
                  Thế Giới Vi Mô
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Khu Vực II
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface">
                Bản Đồ Hành Trình: Cỗ Máy Cơ Thể Người
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-space-sm bg-surface-container-low px-space-md py-2 rounded-full shadow-sm">
            <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
              <span className="material-symbols-outlined text-primary text-lg">flag</span>
              <span>Tiến Độ Vùng:</span>
              <span className="font-headline-sm text-headline-sm text-primary">
                {Math.max(42, totalRegionProgress)}%
              </span>
            </div>
            <div className="w-24 h-2.5 bg-secondary-container rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.max(42, totalRegionProgress)}%` }}
              ></div>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container-high px-2 py-1 rounded-full text-xs">
              <button
                onClick={() => setActiveRegion('all')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  activeRegion === 'all' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Tất cả (8 Màn)
              </button>
              <button
                onClick={() => setActiveRegion('region1')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  activeRegion === 'region1' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Khu 1 (Màn 1-5)
              </button>
              <button
                onClick={() => setActiveRegion('region2')}
                className={`px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                  activeRegion === 'region2' ? 'bg-purple-600 text-white shadow-xs' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Khu 2 (Màn 6-8 Mới) ✨
              </button>
            </div>

            {onOpenAssetShowcase && (
              <button
                onClick={onOpenAssetShowcase}
                title="Xem Studio Thiết Kế Thị Giác 3 Màn Mới"
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white font-label-sm text-label-sm font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">palette</span>
                <span className="hidden sm:inline">Asset Studio 3 Màn Mới</span>
              </button>
            )}

            <button
              onClick={() => setFilterUnlockedOnly(!filterUnlockedOnly)}
              title={filterUnlockedOnly ? 'Hiện tất cả các màn' : 'Chỉ hiện màn đã mở khóa'}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                filterUnlockedOnly
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container-highest text-primary hover:bg-primary hover:text-on-primary'
              }`}
            >
              <span className="material-symbols-outlined text-sm">filter_alt</span>
            </button>
          </div>
        </div>

        {/* 16:9 Interactive Map Container */}
        <div className="relative w-full aspect-[16/9] min-h-[580px] max-h-[820px] rounded-[3rem] overflow-hidden shadow-2xl bg-surface-container-highest">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-100"
            style={{ backgroundImage: `url('${IMAGES.mapBg}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-inverse-surface/30 to-inverse-surface/50 backdrop-blur-[0.5px]"></div>
          </div>

          {/* Glowing SVG Path */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
            preserveAspectRatio="none"
            viewBox="0 0 1600 900"
          >
            <defs>
              <linearGradient id="pathGlow" x1="0%" x2="100%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#f9bc4e" stopOpacity="0.9"></stop>
                <stop offset="45%" stopColor="#f7b5c3" stopOpacity="1"></stop>
                <stop offset="100%" stopColor="#dfbfc2" stopOpacity="0.3"></stop>
              </linearGradient>
              <filter height="140%" id="neonBlur" width="140%" x="-20%" y="-20%">
                <feGaussianBlur result="blur" stdDeviation="6"></feGaussianBlur>
                <feComposite in="SourceGraphic" in2="blur" operator="over"></feComposite>
              </filter>
            </defs>
            <path
              className="animate-pulse"
              d="M 240 680 Q 420 720 540 520 T 780 340 T 1060 260 T 1320 480"
              fill="none"
              filter="url(#neonBlur)"
              stroke="url(#pathGlow)"
              strokeDasharray="8 14"
              strokeLinecap="round"
              strokeWidth="12"
            ></path>
            <circle cx="380" cy="620" fill="#ffd9ab" r="4"></circle>
            <circle cx="660" cy="420" fill="#fcdade" r="5"></circle>
            <circle cx="920" cy="290" fill="#ffd9e0" r="4"></circle>
          </svg>

          {/* Top-Left Chapter Floating Pill */}
          <div className="absolute top-6 left-6 z-20 flex items-center gap-space-sm bg-surface/90 backdrop-blur-md px-space-md py-2 rounded-full shadow-md">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-label-md text-label-md text-on-surface">
              Khám phá theo chương: Cơ thể người kỳ thú
            </span>
            <span className="px-space-xs py-0.5 rounded-full bg-tertiary-fixed text-tertiary font-label-sm text-label-sm">
              Học kỳ 1
            </span>
          </div>

          {/* Interactive Map Nodes */}
          <div className="absolute inset-0 z-10">
            {/* Stage 1: Hệ Tiêu Hóa */}
            <div
              onClick={() => {
                setLockNotice(null);
                setSelectedStageId('tieu-hoa');
              }}
              className={`absolute left-[12%] bottom-[16%] flex flex-col items-center group cursor-pointer transition-transform ${
                selectedStageId === 'tieu-hoa' ? 'scale-105' : ''
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute -top-12 px-3 py-1 bg-surface rounded-full shadow-lg font-label-sm text-label-sm text-on-surface flex items-center gap-1 scale-95 group-hover:scale-105 transition-all whitespace-nowrap">
                  <span className="material-symbols-outlined text-xs text-amber-500">star</span>{' '}
                  {stageProgress['tieu-hoa'] || 75}% Hoàn thành
                </span>
                <div
                  className={`w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center shadow-lg ring-4 ${
                    selectedStageId === 'tieu-hoa'
                      ? 'ring-amber-400 scale-110'
                      : 'ring-tertiary-fixed-dim/70'
                  } group-hover:scale-110 transition-transform`}
                >
                  <span className="material-symbols-outlined text-primary text-3xl">
                    soup_kitchen
                  </span>
                </div>
                <div className="absolute -top-4 -right-3 w-9 h-9 rounded-full overflow-hidden bg-surface-container shadow-md border-2 border-surface">
                  <img
                    alt="Potabi"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    src={IMAGES.potabiBlueAvatar}
                  />
                </div>
              </div>
              <div
                className={`mt-2 text-center bg-inverse-surface/85 backdrop-blur-sm px-3 py-1 rounded-xl border ${
                  selectedStageId === 'tieu-hoa' ? 'border-tertiary-fixed' : 'border-transparent'
                }`}
              >
                <p className="font-label-md text-label-md text-inverse-on-surface">
                  Màn 1: Hệ Tiêu Hóa
                </p>
                <p className="font-label-sm text-label-sm text-secondary-fixed">
                  Dạ Dày &amp; Ruột Non
                </p>
              </div>
            </div>

            {/* Stage 2: Hệ Tuần Hoàn */}
            <div
              onClick={() => {
                setLockNotice(null);
                setSelectedStageId('tuan-hoan');
              }}
              className={`absolute left-[38%] top-[34%] flex flex-col items-center group cursor-pointer transition-transform ${
                selectedStageId === 'tuan-hoan' ? 'scale-105' : ''
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute -top-10 px-3 py-1 bg-amber-400 text-on-tertiary-fixed rounded-full shadow-md font-label-sm text-label-sm font-bold animate-bounce flex items-center gap-1 whitespace-nowrap">
                  <span className="material-symbols-outlined text-sm">
                    {unlockedStageIds.includes('tuan-hoan') ? 'lock_open' : 'lock'}
                  </span>{' '}
                  {completedStageIds.includes('tuan-hoan') ? 'ĐÃ HOÀN THÀNH' : 'MỚI MỞ KHÓA'}
                </span>
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center shadow-xl ring-8 ring-amber-300/40 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-on-primary text-4xl animate-pulse">
                    favorite
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-2 bg-primary-fixed-dim text-on-primary-fixed px-2 py-0.5 rounded-full font-label-sm text-label-sm shadow-sm">
                  Màn 2
                </div>
              </div>
              <div
                className={`mt-3 text-center bg-inverse-surface/90 backdrop-blur-md px-4 py-1.5 rounded-2xl shadow-lg border-2 ${
                  selectedStageId === 'tuan-hoan'
                    ? 'border-tertiary-fixed'
                    : 'border-tertiary-fixed/50'
                }`}
              >
                <p className="font-headline-sm text-headline-sm text-tertiary-fixed font-bold">
                  Hệ Tuần Hoàn
                </p>
                <p className="font-label-sm text-label-sm text-inverse-on-surface">
                  Buồng Tim &amp; Dòng Máu
                </p>
              </div>
            </div>

            {/* Stage 3: Hệ Hô Hấp */}
            {(!filterUnlockedOnly || unlockedStageIds.includes('ho-hap')) && (
              <div
                onClick={() => {
                  setLockNotice(null);
                  setSelectedStageId('ho-hap');
                }}
                className={`absolute left-[54%] top-[18%] flex flex-col items-center group cursor-pointer transition-transform ${
                  selectedStageId === 'ho-hap' ? 'scale-105' : ''
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <span
                    className={`absolute -top-10 px-3 py-1 rounded-full shadow-md font-label-sm text-label-sm font-bold flex items-center gap-1 whitespace-nowrap ${
                      completedStageIds.includes('ho-hap')
                        ? 'bg-emerald-500 text-white'
                        : unlockedStageIds.includes('ho-hap')
                        ? 'bg-sky-400 text-on-tertiary-fixed'
                        : 'bg-surface-dim text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {completedStageIds.includes('ho-hap')
                        ? 'verified'
                        : unlockedStageIds.includes('ho-hap')
                        ? 'lock_open'
                        : 'lock'}
                    </span>{' '}
                    {completedStageIds.includes('ho-hap')
                      ? 'ĐÃ HOÀN THÀNH'
                      : unlockedStageIds.includes('ho-hap')
                      ? 'MỚI MỞ KHÓA'
                      : 'Đang khóa'}
                  </span>
                  <div
                    className={`w-[76px] h-[76px] rounded-full flex items-center justify-center shadow-lg transition-all group-hover:scale-110 ${
                      unlockedStageIds.includes('ho-hap')
                        ? 'bg-gradient-to-tr from-sky-500 to-cyan-300 ring-4 ring-sky-300/60 text-white'
                        : 'bg-surface-container-high text-primary opacity-90'
                    }`}
                  >
                    <span className="material-symbols-outlined text-3xl">air</span>
                  </div>
                  <div className="absolute -bottom-1 -right-2 bg-primary-fixed-dim text-on-primary-fixed px-2 py-0.5 rounded-full font-label-sm text-label-sm shadow-sm">
                    Màn 3
                  </div>
                </div>
                <div
                  className={`mt-2 text-center bg-inverse-surface/85 backdrop-blur-sm px-3 py-1 rounded-xl border ${
                    selectedStageId === 'ho-hap' ? 'border-tertiary-fixed' : 'border-transparent'
                  }`}
                >
                  <p className="font-label-md text-label-md text-inverse-on-surface font-semibold">
                    Hệ Hô Hấp
                  </p>
                  <p className="font-label-sm text-label-sm text-secondary-fixed">
                    Phế Nang &amp; Oxy
                  </p>
                </div>
              </div>
            )}

            {/* Stage 4: Hệ Thần Kinh */}
            {(!filterUnlockedOnly || unlockedStageIds.includes('than-kinh')) && (
              <div
                onClick={() => {
                  setLockNotice(null);
                  setSelectedStageId('than-kinh');
                }}
                className={`absolute left-[70%] top-[40%] flex flex-col items-center group cursor-pointer transition-transform ${
                  selectedStageId === 'than-kinh' ? 'scale-105' : ''
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <span
                    className={`absolute -top-10 px-3 py-1 rounded-full shadow-md font-label-sm text-label-sm font-bold flex items-center gap-1 whitespace-nowrap ${
                      completedStageIds.includes('than-kinh')
                        ? 'bg-emerald-500 text-white'
                        : unlockedStageIds.includes('than-kinh')
                        ? 'bg-indigo-500 text-white'
                        : 'bg-surface-dim text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {completedStageIds.includes('than-kinh')
                        ? 'verified'
                        : unlockedStageIds.includes('than-kinh')
                        ? 'lock_open'
                        : 'lock'}
                    </span>{' '}
                    {completedStageIds.includes('than-kinh')
                      ? 'ĐÃ HOÀN THÀNH'
                      : unlockedStageIds.includes('than-kinh')
                      ? 'MỚI MỞ KHÓA'
                      : 'Cấp 15'}
                  </span>
                  <div
                    className={`w-[76px] h-[76px] rounded-full flex items-center justify-center shadow-lg transition-all group-hover:scale-110 ${
                      unlockedStageIds.includes('than-kinh')
                        ? 'bg-gradient-to-tr from-indigo-600 to-purple-400 ring-4 ring-indigo-300/60 text-white'
                        : 'bg-surface-container-highest text-outline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-3xl">
                      {unlockedStageIds.includes('than-kinh') ? 'psychology' : 'lock'}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-2 bg-primary-fixed-dim text-on-primary-fixed px-2 py-0.5 rounded-full font-label-sm text-label-sm shadow-sm">
                    Màn 4
                  </div>
                </div>
                <div
                  className={`mt-2 text-center bg-inverse-surface/85 backdrop-blur-sm px-3 py-1 rounded-xl border ${
                    selectedStageId === 'than-kinh'
                      ? 'border-tertiary-fixed'
                      : 'border-transparent'
                  }`}
                >
                  <p className="font-label-md text-label-md text-inverse-on-surface font-semibold">
                    Màn 4: Hệ Thần Kinh
                  </p>
                  <p className="font-label-sm text-label-sm text-secondary-fixed">
                    Xung Điện Não Bộ
                  </p>
                </div>
              </div>
            )}

            {/* Stage 5: Hệ Vận Động */}
            {(!filterUnlockedOnly || unlockedStageIds.includes('van-dong')) && (
              <div
                onClick={() => {
                  setLockNotice(null);
                  setSelectedStageId('van-dong');
                }}
                className={`absolute left-[84%] bottom-[24%] flex flex-col items-center group cursor-pointer transition-transform ${
                  selectedStageId === 'van-dong' ? 'scale-105' : ''
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <span
                    className={`absolute -top-10 px-3 py-1 rounded-full shadow-md font-label-sm text-label-sm font-bold flex items-center gap-1 whitespace-nowrap ${
                      completedStageIds.includes('van-dong')
                        ? 'bg-emerald-500 text-white'
                        : unlockedStageIds.includes('van-dong')
                        ? 'bg-amber-500 text-white'
                        : 'bg-surface-dim text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {completedStageIds.includes('van-dong')
                        ? 'verified'
                        : unlockedStageIds.includes('van-dong')
                        ? 'lock_open'
                        : 'lock'}
                    </span>{' '}
                    {completedStageIds.includes('van-dong')
                      ? 'ĐÃ HOÀN THÀNH'
                      : unlockedStageIds.includes('van-dong')
                      ? 'MỚI MỞ KHÓA'
                      : 'Cấp 18'}
                  </span>
                  <div
                    className={`w-[76px] h-[76px] rounded-full flex items-center justify-center shadow-lg transition-all group-hover:scale-110 ${
                      unlockedStageIds.includes('van-dong')
                        ? 'bg-gradient-to-tr from-amber-500 to-rose-400 ring-4 ring-amber-300/60 text-white'
                        : 'bg-surface-container-highest text-outline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-3xl">
                      {unlockedStageIds.includes('van-dong') ? 'accessibility_new' : 'lock'}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-2 bg-primary-fixed-dim text-on-primary-fixed px-2 py-0.5 rounded-full font-label-sm text-label-sm shadow-sm">
                    Màn 5
                  </div>
                </div>
                <div
                  className={`mt-2 text-center bg-inverse-surface/85 backdrop-blur-sm px-3 py-1 rounded-xl border ${
                    selectedStageId === 'van-dong' ? 'border-tertiary-fixed' : 'border-transparent'
                  }`}
                >
                  <p className="font-label-md text-label-md text-inverse-on-surface font-semibold">
                    Màn 5: Hệ Vận Động
                  </p>
                  <p className="font-label-sm text-label-sm text-secondary-fixed">
                    Khung Xương &amp; Cơ
                  </p>
                </div>
              </div>
            )}

            {/* Stage 6: Hệ Bài Tiết */}
            {(activeRegion === 'all' || activeRegion === 'region2') &&
              (!filterUnlockedOnly || unlockedStageIds.includes('bai-tiet')) && (
                <div
                  onClick={() => {
                    setLockNotice(null);
                    setSelectedStageId('bai-tiet');
                  }}
                  className={`absolute left-[24%] bottom-[20%] flex flex-col items-center group cursor-pointer transition-transform ${
                    selectedStageId === 'bai-tiet' ? 'scale-105' : ''
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`absolute -top-10 px-3 py-1 rounded-full shadow-md font-label-sm text-label-sm font-bold flex items-center gap-1 whitespace-nowrap ${
                        completedStageIds.includes('bai-tiet')
                          ? 'bg-emerald-500 text-white'
                          : unlockedStageIds.includes('bai-tiet')
                          ? 'bg-purple-600 text-white'
                          : 'bg-surface-dim text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {completedStageIds.includes('bai-tiet')
                          ? 'verified'
                          : unlockedStageIds.includes('bai-tiet')
                          ? 'lock_open'
                          : 'lock'}
                      </span>{' '}
                      {completedStageIds.includes('bai-tiet')
                        ? 'ĐÃ HOÀN THÀNH'
                        : unlockedStageIds.includes('bai-tiet')
                        ? 'MỚI MỞ KHÓA'
                        : 'Cấp 20'}
                    </span>
                    <div
                      className={`w-[76px] h-[76px] rounded-full flex items-center justify-center shadow-lg transition-all group-hover:scale-110 ${
                        unlockedStageIds.includes('bai-tiet')
                          ? 'bg-gradient-to-tr from-purple-600 via-pink-500 to-sky-400 ring-4 ring-purple-300/60 text-white'
                          : 'bg-surface-container-highest text-outline'
                      }`}
                    >
                      <span className="material-symbols-outlined text-3xl">water_drop</span>
                    </div>
                    <div className="absolute -bottom-1 -right-2 bg-purple-700 text-white px-2 py-0.5 rounded-full font-label-sm text-label-sm shadow-sm font-bold">
                      Màn 6
                    </div>
                  </div>
                  <div
                    className={`mt-2 text-center bg-inverse-surface/85 backdrop-blur-sm px-3 py-1 rounded-xl border ${
                      selectedStageId === 'bai-tiet' ? 'border-purple-400' : 'border-transparent'
                    }`}
                  >
                    <p className="font-label-md text-label-md text-inverse-on-surface font-semibold">
                      Màn 6: Hệ Bài Tiết
                    </p>
                    <p className="font-label-sm text-label-sm text-purple-300">
                      Cầu Thận &amp; Ống Thận
                    </p>
                  </div>
                </div>
              )}

            {/* Stage 7: Hệ Nội Tiết */}
            {(activeRegion === 'all' || activeRegion === 'region2') &&
              (!filterUnlockedOnly || unlockedStageIds.includes('noi-tiet')) && (
                <div
                  onClick={() => {
                    setLockNotice(null);
                    setSelectedStageId('noi-tiet');
                  }}
                  className={`absolute left-[52%] bottom-[22%] flex flex-col items-center group cursor-pointer transition-transform ${
                    selectedStageId === 'noi-tiet' ? 'scale-105' : ''
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`absolute -top-10 px-3 py-1 rounded-full shadow-md font-label-sm text-label-sm font-bold flex items-center gap-1 whitespace-nowrap ${
                        completedStageIds.includes('noi-tiet')
                          ? 'bg-emerald-500 text-white'
                          : unlockedStageIds.includes('noi-tiet')
                          ? 'bg-emerald-600 text-white'
                          : 'bg-surface-dim text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {completedStageIds.includes('noi-tiet')
                          ? 'verified'
                          : unlockedStageIds.includes('noi-tiet')
                          ? 'lock_open'
                          : 'lock'}
                      </span>{' '}
                      {completedStageIds.includes('noi-tiet')
                        ? 'ĐÃ HOÀN THÀNH'
                        : unlockedStageIds.includes('noi-tiet')
                        ? 'MỚI MỞ KHÓA'
                        : 'Cấp 22'}
                    </span>
                    <div
                      className={`w-[76px] h-[76px] rounded-full flex items-center justify-center shadow-lg transition-all group-hover:scale-110 ${
                        unlockedStageIds.includes('noi-tiet')
                          ? 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-yellow-400 ring-4 ring-emerald-300/60 text-white'
                          : 'bg-surface-container-highest text-outline'
                      }`}
                    >
                      <span className="material-symbols-outlined text-3xl">alt_route</span>
                    </div>
                    <div className="absolute -bottom-1 -right-2 bg-emerald-700 text-white px-2 py-0.5 rounded-full font-label-sm text-label-sm shadow-sm font-bold">
                      Màn 7
                    </div>
                  </div>
                  <div
                    className={`mt-2 text-center bg-inverse-surface/85 backdrop-blur-sm px-3 py-1 rounded-xl border ${
                      selectedStageId === 'noi-tiet' ? 'border-emerald-400' : 'border-transparent'
                    }`}
                  >
                    <p className="font-label-md text-label-md text-inverse-on-surface font-semibold">
                      Màn 7: Hệ Nội Tiết
                    </p>
                    <p className="font-label-sm text-label-sm text-emerald-300">
                      Tuyến Yên &amp; Đảo Tụy
                    </p>
                  </div>
                </div>
              )}

            {/* Stage 8: Hệ Sinh Dục */}
            {(activeRegion === 'all' || activeRegion === 'region2') &&
              (!filterUnlockedOnly || unlockedStageIds.includes('sinh-duc')) && (
                <div
                  onClick={() => {
                    setLockNotice(null);
                    setSelectedStageId('sinh-duc');
                  }}
                  className={`absolute left-[82%] bottom-[25%] flex flex-col items-center group cursor-pointer transition-transform ${
                    selectedStageId === 'sinh-duc' ? 'scale-105' : ''
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`absolute -top-10 px-3 py-1 rounded-full shadow-md font-label-sm text-label-sm font-bold flex items-center gap-1 whitespace-nowrap ${
                        completedStageIds.includes('sinh-duc')
                          ? 'bg-emerald-500 text-white'
                          : unlockedStageIds.includes('sinh-duc')
                          ? 'bg-rose-600 text-white'
                          : 'bg-surface-dim text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {completedStageIds.includes('sinh-duc')
                          ? 'verified'
                          : unlockedStageIds.includes('sinh-duc')
                          ? 'lock_open'
                          : 'lock'}
                      </span>{' '}
                      {completedStageIds.includes('sinh-duc')
                        ? 'ĐÃ HOÀN THÀNH'
                        : unlockedStageIds.includes('sinh-duc')
                        ? 'MỚI MỞ KHÓA'
                        : 'Cấp 25'}
                    </span>
                    <div
                      className={`w-[76px] h-[76px] rounded-full flex items-center justify-center shadow-lg transition-all group-hover:scale-110 ${
                        unlockedStageIds.includes('sinh-duc')
                          ? 'bg-gradient-to-tr from-rose-500 via-pink-400 to-purple-400 ring-4 ring-rose-300/60 text-white'
                          : 'bg-surface-container-highest text-outline'
                      }`}
                    >
                      <span className="material-symbols-outlined text-3xl">spa</span>
                    </div>
                    <div className="absolute -bottom-1 -right-2 bg-rose-700 text-white px-2 py-0.5 rounded-full font-label-sm text-label-sm shadow-sm font-bold">
                      Màn 8
                    </div>
                  </div>
                  <div
                    className={`mt-2 text-center bg-inverse-surface/85 backdrop-blur-sm px-3 py-1 rounded-xl border ${
                      selectedStageId === 'sinh-duc' ? 'border-rose-400' : 'border-transparent'
                    }`}
                  >
                    <p className="font-label-md text-label-md text-inverse-on-surface font-semibold">
                      Màn 8: Hệ Sinh Dục
                    </p>
                    <p className="font-label-sm text-label-sm text-rose-300">
                      Giao Tử &amp; Thụ Tinh
                    </p>
                  </div>
                </div>
              )}
          </div>

          {/* Bottom-Left Potabi Tip Card */}
          <div className="absolute bottom-6 left-6 z-20 max-w-sm hidden md:flex items-center gap-space-sm bg-surface/95 backdrop-blur-md p-space-sm rounded-2xl shadow-xl">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-primary-fixed shrink-0 border-2 border-surface-container">
              <img
                alt="Potabi Mascot"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                src={IMAGES.potabiBlueAvatar}
              />
            </div>
            <div className="flex flex-col pr-1">
              <div className="flex items-center gap-1 text-primary font-label-sm text-label-sm font-bold">
                <span className="material-symbols-outlined text-xs">chat</span>
                <span>Lời khuyên của Potabi:</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-snug">
                Cậu nhớ trang bị Áo Blouse hoặc Giọt Nước trước khi lặn vào dòng máu nhé!
              </p>
            </div>
          </div>

          {/* Right Floating Stage Information Card */}
          <div className="absolute top-6 right-6 bottom-6 z-30 w-full sm:w-[410px] bg-surface/95 backdrop-blur-xl rounded-2xl shadow-2xl p-space-md flex flex-col justify-between overflow-y-auto">
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between pb-space-xs border-b border-surface-container-high">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
                  <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
                    Thông Tin Chặng Điểm
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded-full text-primary font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-xs">timer</span>
                  <span>{currentStage.duration}</span>
                </div>
              </div>

              {/* Quick stage selector pill row for all 8 stages */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {Object.keys(STAGES).map((stId, index) => (
                  <button
                    key={stId}
                    onClick={() => {
                      setLockNotice(null);
                      setSelectedStageId(stId);
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      selectedStageId === stId
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    Màn {index + 1}
                  </button>
                ))}
              </div>

              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface leading-tight">
                  {currentStage.title}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2.5 py-0.5 bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-label-sm font-semibold">
                    {currentStage.levelRange}
                  </span>
                  <span className="px-2.5 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed rounded-full font-label-sm text-label-sm font-semibold">
                    {currentStage.difficulty}
                  </span>
                </div>
              </div>

              <div className="relative w-full h-36 rounded-xl overflow-hidden shadow-inner group">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${currentStage.thumbnail}')` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="font-label-sm text-label-sm text-inverse-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-amber-300">
                      visibility
                    </span>
                    {currentStage.caption}
                  </span>
                </div>
              </div>

              <div className="bg-surface-container-low rounded-xl p-space-sm flex flex-col gap-1.5">
                <span className="font-label-md text-label-md text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-base">target</span>{' '}
                  Mục Tiêu Khám Phá:
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {currentStage.goal}
                </p>
              </div>

              {lockNotice && (
                <div className="bg-error-container text-on-error-container p-2.5 rounded-xl font-label-sm text-label-sm flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-base shrink-0">lock</span>
                  <span>{lockNotice}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-space-sm">
                <div className="bg-surface-container rounded-xl p-2.5 flex items-center gap-space-xs">
                  <div className="w-9 h-9 rounded-lg bg-amber-400/20 text-tertiary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">bolt</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Kinh Nghiệm
                    </span>
                    <span className="font-headline-sm text-headline-sm text-tertiary font-bold">
                      +{currentStage.exp} EXP
                    </span>
                  </div>
                </div>
                <div className="bg-surface-container rounded-xl p-2.5 flex items-center gap-space-xs">
                  <div className="w-9 h-9 rounded-lg bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">diamond</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      Phần Thưởng
                    </span>
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">
                      +{currentStage.diamonds} KC
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-2 text-on-surface-variant font-label-sm text-label-sm">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-emerald-600">
                    verified
                  </span>{' '}
                  {currentStage.quizzesCount} Câu đố phản xạ
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-primary">science</span>{' '}
                  {currentStage.specimensCount} Tiêu bản tế bào
                </span>
              </div>
            </div>

            <div className="pt-space-sm flex flex-col gap-2">
              <button
                onClick={handleEnterGame}
                className={`w-full py-3.5 px-space-md rounded-full font-label-lg text-label-lg shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer ${
                  isCurrentStageUnlocked
                    ? 'bg-primary hover:bg-primary-container text-on-primary'
                    : 'bg-surface-container-highest text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {isCurrentStageUnlocked ? 'swords' : 'lock'}
                </span>
                <span>
                  {isCurrentStageUnlocked
                    ? 'VÀO MÀN CHƠI [KHÁM PHÁ NGAY]'
                    : 'CHẶNG ĐANG KHÓA (XEM ĐIỀU KIỆN)'}
                </span>
              </button>
              <button
                onClick={() => setShowTheoryModal(true)}
                className="w-full py-2 px-space-md rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-md text-label-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">auto_stories</span>
                <span>Xem trước lý thuyết &amp; ghi chép</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom 4 Quick Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mt-space-lg">
          <button
            onClick={onOpenNotebook}
            className="bg-surface-container-low rounded-2xl p-space-md flex items-center gap-space-sm shadow-sm hover:shadow-md transition-shadow text-left cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-2xl">menu_book</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Sổ Tay Sinh Học
              </span>
              <span className="font-label-lg text-label-lg text-on-surface truncate">
                {15 + unlockedSpecimens.length}/45 Đã mở khóa
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveBottomModal('badges')}
            className="bg-surface-container-low rounded-2xl p-space-md flex items-center gap-space-sm shadow-sm hover:shadow-md transition-shadow text-left cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
              <span className="material-symbols-outlined text-2xl">trophy</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Huy Hiệu Nhà Sinh Học
              </span>
              <span className="font-label-lg text-label-lg text-on-surface truncate">
                Bác Sĩ Tí Hon
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveBottomModal('specimens')}
            className="bg-surface-container-low rounded-2xl p-space-md flex items-center gap-space-sm shadow-sm hover:shadow-md transition-shadow text-left cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-2xl">microbiology</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Mẫu Vật Thu Thập
              </span>
              <span className="font-label-lg text-label-lg text-on-surface truncate">
                Hồng cầu, Bạch cầu ({unlockedSpecimens.length})
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveBottomModal('leaderboard')}
            className="bg-surface-container-low rounded-2xl p-space-md flex items-center gap-space-sm shadow-sm hover:shadow-md transition-shadow text-left cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-2xl">leaderboard</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Bảng Xếp Hạng Lớp
              </span>
              <span className="font-label-lg text-label-lg text-on-surface truncate">
                {exp >= 2900
                  ? 'Hạng 1 Tuần Này'
                  : exp >= 2650
                  ? 'Hạng 2 Tuần Này'
                  : exp >= 2520
                  ? 'Hạng 3 Tuần Này'
                  : 'Hạng 4 Tuần Này'}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Stage 2 / Stage 3 Interactive Challenge Modal */}
      {activeQuizStageId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/75 backdrop-blur-md p-space-md">
          <div className="bg-surface-container-lowest rounded-3xl max-w-xl w-full p-space-lg shadow-2xl border-4 border-primary flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-space-sm">
              <div>
                <span className="font-label-sm text-label-sm text-primary uppercase font-bold">
                  Thử Thách Khám Phá Chặng • {STAGES[activeQuizStageId].stageNumber}
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  {STAGES[activeQuizStageId].title}
                </h3>
              </div>
              <button
                onClick={() => setActiveQuizStageId(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <p className="font-label-lg text-label-lg text-primary">
                {activeQuizData[quizStep].q}
              </p>
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold cursor-pointer shrink-0"
              >
                Gợi ý
              </button>
            </div>

            {showHint && (
              <div className="bg-tertiary-fixed/40 border border-tertiary-fixed-dim p-3 rounded-2xl font-body-sm text-body-sm text-on-tertiary-fixed">
                {activeQuizData[quizStep].hint}
              </div>
            )}

            <div className="flex flex-col gap-space-xs">
              {activeQuizData[quizStep].options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrect = idx === activeQuizData[quizStep].correct;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedOpt(idx)}
                    className={`p-3.5 rounded-2xl text-left font-body-sm text-body-sm border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? isCorrect
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                          : 'bg-error-container/50 border-error text-on-error-container'
                        : 'bg-surface-container-low border-outline-variant/40 hover:border-primary'
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

            {selectedOpt !== null && (
              <div
                className={`p-3 rounded-2xl font-body-sm text-body-sm ${
                  selectedOpt === activeQuizData[quizStep].correct
                    ? 'bg-emerald-100 text-emerald-950'
                    : 'bg-error-container text-on-error-container'
                }`}
              >
                {selectedOpt === activeQuizData[quizStep].correct
                  ? activeQuizData[quizStep].explanation
                  : 'Chưa chính xác! Hãy xem gợi ý Sinh học 8 và thử lại nhé.'}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  const targetStage = activeQuizStageId || selectedStageId;
                  setActiveQuizStageId(null);
                  onPlayStage2D(targetStage);
                }}
                className="px-space-md py-2 rounded-full bg-surface-container text-primary font-label-sm text-label-sm cursor-pointer"
              >
                Vào Màn 2D Thực Hành
              </button>
              <button
                disabled={selectedOpt !== activeQuizData[quizStep].correct}
                onClick={handleNextQuizQuestion}
                className={`px-space-lg py-2 rounded-full font-label-md text-label-md ${
                  selectedOpt === activeQuizData[quizStep].correct
                    ? 'bg-primary text-on-primary shadow-md cursor-pointer'
                    : 'bg-surface-container-highest text-outline cursor-not-allowed'
                }`}
              >
                {quizStep < activeQuizData.length - 1
                  ? 'Câu tiếp theo ➔'
                  : 'Hoàn thành Chặng & Mở khóa Màn kế tiếp'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Theory & Notes Modal */}
      {showTheoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/70 backdrop-blur-md p-space-md">
          <div className="bg-surface-container-lowest rounded-3xl max-w-2xl w-full p-space-lg shadow-2xl border-4 border-primary flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-space-sm">
              <div className="flex items-center gap-space-sm">
                <div className="w-11 h-11 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">auto_stories</span>
                </div>
                <div>
                  <span className="font-label-sm text-label-sm text-primary uppercase font-bold">
                    Tóm Tắt Lý Thuyết Trọng Tâm • {currentStage.stageNumber}
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    {currentStage.theoryNotes.heading}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowTheoryModal(false)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-space-sm">
              {currentStage.theoryNotes.points.map((pt, idx) => (
                <div
                  key={idx}
                  className="bg-surface-container-low p-space-md rounded-2xl flex items-start gap-space-sm"
                >
                  <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-label-sm text-label-sm flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">{pt}</p>
                </div>
              ))}
            </div>

            <div className="bg-tertiary-fixed/50 border-2 border-tertiary-fixed-dim rounded-2xl p-space-md flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-tertiary text-2xl">lightbulb</span>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-tertiary font-bold uppercase">
                  Công thức / Quy tắc Ghi nhớ nhanh
                </span>
                <span className="font-label-md text-label-md text-on-tertiary-fixed">
                  {currentStage.theoryNotes.formulaOrKey}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-space-sm pt-space-xs">
              <button
                onClick={() => setShowTheoryModal(false)}
                className="px-space-lg py-2.5 rounded-full bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high cursor-pointer"
              >
                Đóng ghi chép
              </button>
              <button
                onClick={() => {
                  setShowTheoryModal(false);
                  handleEnterGame();
                }}
                className="px-space-lg py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">play_arrow</span>
                <span>Bắt đầu thực hành ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Detail Modals for Bottom Summary Cards */}
      {activeBottomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/70 backdrop-blur-md p-space-md">
          <div className="bg-surface-container-lowest rounded-3xl max-w-xl w-full p-space-lg shadow-2xl border-4 border-primary flex flex-col gap-space-md">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-space-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                {activeBottomModal === 'badges' && 'Bộ Sưu Tập Huy Hiệu Nhà Sinh Học'}
                {activeBottomModal === 'specimens' && 'Tiêu Bản Tế Bào Đã Thu Thập'}
                {activeBottomModal === 'leaderboard' && 'Bảng Xếp Hạng Học Viện Sinh Học Tuần 42'}
              </h3>
              <button
                onClick={() => setActiveBottomModal(null)}
                className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {activeBottomModal === 'badges' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <div className="bg-surface-container-low p-space-md rounded-2xl flex items-center gap-space-sm border-2 border-tertiary-fixed-dim">
                  <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">trophy</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg text-on-surface">Bác Sĩ Tí Hon</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Hoàn thành khám phá Dạ dày &amp; Vòng tuần hoàn.
                    </p>
                  </div>
                </div>
                <div className="bg-surface-container-low p-space-md rounded-2xl flex items-center gap-space-sm border-2 border-primary-fixed-dim">
                  <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">biotech</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg text-on-surface">Chuyên Gia Kính Soi</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Nhuộm mẫu Iốt chuẩn xác trên tiêu bản biểu bì.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeBottomModal === 'specimens' && (
              <div className="flex flex-col gap-space-sm max-h-80 overflow-y-auto">
                {NOTEBOOK_ENTRIES.filter((e) => unlockedSpecimens.includes(e.id)).map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-surface-container-low p-space-md rounded-2xl flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-label-lg text-label-lg text-primary">{entry.title}</span>
                      <span className="font-label-sm text-label-sm bg-secondary-container text-on-secondary-container px-2.5 py-0.5 rounded-full">
                        {entry.category}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {entry.summary}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeBottomModal === 'leaderboard' && (
              <div className="flex flex-col gap-space-xs">
                {[
                  { name: 'Minh Anh • Lớp 8A1', expVal: 2850 },
                  { name: 'Hoàng Nam • Lớp 8A3', expVal: 2640 },
                  { name: 'Thảo Nguyên • Lớp 8B2', expVal: 2510 },
                  {
                    name: `Bạn (Nhà Thám Hiểm Cấp ${explorerLevel})`,
                    expVal: exp,
                    highlight: true,
                  },
                  { name: 'Đức Phúc • Lớp 8A1', expVal: 2190 },
                ]
                  .sort((a, b) => b.expVal - a.expVal)
                  .map((item, idx) => (
                    <div
                      key={item.name}
                      className={`flex items-center justify-between p-3 rounded-2xl ${
                        item.highlight
                          ? 'bg-primary-fixed text-on-primary-fixed font-bold border-2 border-primary'
                          : 'bg-surface-container-low text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-space-sm">
                        <span className="w-7 h-7 rounded-full bg-surface-container-highest flex items-center justify-center font-label-md text-label-md text-primary">
                          #{idx + 1}
                        </span>
                        <span className="font-body-md text-body-md">{item.name}</span>
                      </div>
                      <span className="font-label-md text-label-md text-tertiary">
                        {item.expVal.toLocaleString('vi-VN')} EXP
                      </span>
                    </div>
                  ))}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setActiveBottomModal(null)}
                className="px-space-lg py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
