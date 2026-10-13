import React, { useEffect, useRef, useState } from 'react';
import { IMAGES } from '../data/biologyData';

interface StomachStageScreenProps {
  onExitToMap: () => void;
  onOpenMicroscope: () => void;
  onOpenStain: () => void;
  onOpenNotebook: () => void;
  completedStations: string[];
  onStationCompleted: (stationId: string, specimenId: string, exp: number, diamonds: number) => void;
  equippedOutfitId: string;
  onStageVictory: () => void;
  amylaseInspected?: boolean;
  onAmylaseInspected?: () => void;
  stationProgressMap?: Record<string, StationSavedProgress>;
  onUpdateStationProgressMap?: (nextMap: Record<string, StationSavedProgress>) => void;
}

interface QuestionItem {
  question: string;
  options: string[];
  correctIdx: number;
  hint: string;
  correctExplanation: string;
  wrongExplanation: string;
}

interface StationDetail {
  id: string;
  stationId: string;
  specimenId: string;
  title: string;
  subtitle: string;
  image: string;
  imageCropStyle: React.CSSProperties;
  imageOverlayStyle: React.CSSProperties;
  organBadge: string;
  pH: string;
  enzyme: string;
  description: string;
  experiencePreview: string;
  gameplayTarget: 'station-dialogue-quiz';
  xPercent: number;
  yPercent: number;
  npcDialogue: string[];
  questions: QuestionItem[];
}

interface StationSavedProgress {
  phase: 'dialogue' | 'quiz';
  dialogueIdx: number;
  questionIdx: number;
}

interface PlatformBox {
  id: string;
  left: number; // %
  right: number; // %
  surfaceY: number; // % from top (where player's feet stand)
  label: string;
}

// Platforms matching the visual ledges in stomachStageBg (Image 9 / Image 5)
const PLATFORMS: PlatformBox[] = [
  { id: 'left-upper', left: 2, right: 27, surfaceY: 31, label: 'Bờ Niêm Mạc Tâm Vị' },
  { id: 'left-main', left: 4, right: 31, surfaceY: 66, label: 'Thềm Cơ Dọc & Cơ Vòng' },
  { id: 'center-ledge', left: 32, right: 55, surfaceY: 67, label: 'Cầu Nối Tuyến Vị' },
  { id: 'right-bridge', left: 53, right: 86, surfaceY: 50, label: 'Dốc Co Bóp Hang Vị' },
  { id: 'right-upper', left: 78, right: 97, surfaceY: 39, label: 'Đỉnh Tuyến Tiết Amylase' },
  { id: 'right-lower', left: 72, right: 96, surfaceY: 79, label: 'Thềm Chất Nhầy Môn Vị' },
];

const STATIONS: Record<string, StationDetail> = {
  'tram-1': {
    id: 'tram-1',
    stationId: 'tram-1',
    specimenId: 'co-da-day',
    title: 'Trạm 1: Biến Đổi Lý Học (Nghiền Cơ Học)',
    subtitle: 'Khám phá sức mạnh nhào trộn thức ăn của ba lớp cơ trơn thành dạ dày.',
    image: IMAGES.stomachStageBg,
    imageCropStyle: {
      backgroundPosition: '18% 58%',
      backgroundSize: '185%',
      filter: 'saturate(1.18) contrast(1.06)',
    },
    imageOverlayStyle: {
      background:
        'linear-gradient(135deg, rgba(162, 60, 91, 0.35) 0%, rgba(49, 16, 30, 0.72) 100%)',
    },
    organBadge: 'Hệ Tiêu Hóa • Vùng Thân Dạ Dày',
    pH: 'pH 3.0 - 4.0',
    enzyme: 'Co bóp cơ học thành dạ dày',
    xPercent: 22,
    yPercent: 58,
    description:
      'Khu vực thân dạ dày là nơi tiếp nhận và nhào trộn thức ăn vừa trượt xuống từ thực quản. Thành dạ dày tại đây có cấu tạo đặc biệt gồm 3 lớp cơ trơn dày khỏe: cơ dọc (ngoài), cơ vòng (giữa) và cơ chéo (trong). Khi bước vào trạm, bạn sẽ tìm hiểu cách các lớp cơ này phối hợp co rút để nghiền nhỏ thức ăn và làm thức ăn thấm đều dịch vị.',
    experiencePreview:
      'Quan sát nhịp co bóp cơ học trên các thềm niêm mạc, trao đổi thông tin thực địa cùng Potabi và hoàn thành bài thu hoạch kiến thức để thu thập tiêu bản Cơ Dạ Dày.',
    gameplayTarget: 'station-dialogue-quiz',
    npcDialogue: [
      'Potabi: "Cậu thấy mặt đất dưới chân mình đang rung chuyển nhịp nhàng không? Đó là nhờ 3 lớp cơ trơn của thành dạ dày đấy!"',
      'Potabi: "Khác với ruột non chỉ có 2 lớp cơ, dạ dày có thêm lớp cơ chéo ở trong cùng giúp vắt và nghiền thức ăn cực khỏe."',
      'Potabi: "Hãy trả lời 2 câu hỏi Sinh học 8 dưới đây để thu thập Tiêu bản Cơ Dạ Dày nhé!"',
    ],
    questions: [
      {
        question: 'Câu 1/2: Thành cơ của dạ dày người được cấu tạo gồm những lớp cơ nào (Sinh học 8)?',
        options: [
          'A. Chỉ gồm 2 lớp: cơ dọc và cơ vòng',
          'B. Gồm 3 lớp cơ trơn: cơ dọc, cơ vòng và cơ chéo',
          'C. Gồm các bó cơ vân hoạt động theo ý muốn',
        ],
        correctIdx: 1,
        hint: 'Gợi ý: Dạ dày có khả năng co bóp khỏe hơn thực quản nhờ có thêm một lớp cơ thứ 3 nằm ở phía trong cùng.',
        correctExplanation:
          'Chính xác! Thành dạ dày có 3 lớp cơ trơn (cơ dọc, cơ vòng, cơ chéo) giúp nhào trộn thức ăn thấm đều dịch vị.',
        wrongExplanation:
          'Chưa đúng! Hãy nhớ dạ dày là cơ quan rỗng có thành cơ dày nhất ống tiêu hóa với đủ 3 lớp: dọc, vòng, chéo.',
      },
      {
        question: 'Câu 2/2: Hoạt động co bóp của thành dạ dày thuộc loại biến đổi nào trong quá trình tiêu hóa?',
        options: [
          'A. Biến đổi lý học (làm nhỏ và đảo trộn thức ăn với dịch vị)',
          'B. Biến đổi hóa học (cắt đứt liên kết peptide trong protein)',
          'C. Hấp thu trực tiếp glucose qua lông ruột vào máu',
        ],
        correctIdx: 0,
        hint: 'Gợi ý: Sự co bóp chỉ làm thay đổi kích thước và trạng thái vật lý của khối thức ăn, chưa làm thay đổi bản chất hóa học.',
        correctExplanation:
          'Tuyệt vời! Co bóp nghiền thức ăn là biến đổi lý học, tạo điều kiện thuận lợi cho enzym dịch vị tiếp xúc với thức ăn.',
        wrongExplanation:
          'Chưa chính xác! Biến đổi hóa học là do enzym thực hiện, còn sự co bóp của cơ thành dạ dày là biến đổi lý học.',
      },
    ],
  },
  'tram-2': {
    id: 'tram-2',
    stationId: 'tram-2',
    specimenId: 'pepsin',
    title: 'Trạm 2: Axit HCl & Enzym Pepsin (Biến Đổi Hóa Học)',
    subtitle: 'Giải mã phản ứng hóa học phân cắt chuỗi Protein trong môi trường dịch vị.',
    image: IMAGES.cutsceneToastBg,
    imageCropStyle: {
      backgroundPosition: '52% 48%',
      backgroundSize: '165%',
      filter: 'saturate(1.22) contrast(1.08)',
    },
    imageOverlayStyle: {
      background:
        'linear-gradient(135deg, rgba(249, 188, 78, 0.28) 0%, rgba(74, 36, 51, 0.78) 100%)',
    },
    organBadge: 'Hệ Tiêu Hóa • Cầu Nối Tuyến Vị',
    pH: 'pH 1.5 - 2.5',
    enzyme: 'Pepsinogen + HCl → Pepsin hoạt động',
    xPercent: 44,
    yPercent: 63,
    description:
      'Đây là khu vực tập trung các tuyến vị nằm sâu trong lớp niêm mạc dạ dày, nơi diễn ra sự biến đổi hóa học quan trọng đối với chất đạm (Protein). Tại đây, tế bào viền tiết ra axit Clohiđric (HCl) tạo môi trường axit mạnh để kích hoạt Pepsinogen thành enzym Pepsin hoạt động. Người chơi sẽ tìm hiểu vai trò phối hợp giữa HCl và Pepsin trong việc phân cắt các phân tử protein.',
    experiencePreview:
      'Tiếp cận vùng tuyến tiết dịch vị, phân tích điều kiện độ pH của môi trường dạ dày và vận dụng kiến thức Sinh học 8 để mở khóa tiêu bản Enzym Pepsin & Axit HCl.',
    gameplayTarget: 'station-dialogue-quiz',
    npcDialogue: [
      'Potabi: "Cẩn thận nhé! Những giọt sương lấp lánh ở Trạm 2 chính là dịch vị chứa axit HCl có độ pH từ 1.5 đến 2.5 đấy!"',
      'Potabi: "Nhờ có HCl kích hoạt, enzym Pepsin mới thức giấc để cắt những sợi dây Protein dài ngoằng thành các đoạn ngắn từ 3 đến 10 axit amin."',
      'Potabi: "Cùng vượt qua thử thách Hóa học Dạ dày để mở khóa Tiêu bản Pepsin & HCl nào!"',
    ],
    questions: [
      {
        question: 'Câu 1/2: Vai trò sinh học của axit HCl trong dịch vị dạ dày là gì?',
        options: [
          'A. Hoạt hóa Pepsinogen thành Pepsin, tạo môi trường pH 1.5-2.5 và diệt khuẩn',
          'B. Biến đổi toàn bộ tinh bột sống thành đường đơn Glucose',
          'C. Tạo môi trường kiềm nhẹ (pH 8.0) cho enzym Trypsin hoạt động',
        ],
        correctIdx: 0,
        hint: 'Gợi ý: Pepsin khi mới tiết ra ở dạng chưa hoạt động (Pepsinogen) và cần môi trường axit mạnh để cắt bỏ đoạn ức chế.',
        correctExplanation:
          'Hoàn toàn chính xác! HCl vừa khử trùng thức ăn, làm trương nở protein, vừa hoạt hóa Pepsinogen thành Pepsin.',
        wrongExplanation:
          'Sai rồi! Dịch vị dạ dày có tính axit rất mạnh (pH 1.5 - 2.5) chứ không phải môi trường kiềm hay phân giải tinh bột.',
      },
      {
        question: 'Câu 2/2: Ở dạ dày, loại chất dinh dưỡng nào được biến đổi về mặt hóa học dưới tác dụng của enzym Pepsin?',
        options: [
          'A. Lipit (mỡ) được phân giải thành glixerin và axit béo',
          'B. Protein chuỗi dài được phân cắt thành các chuỗi ngắn (3 - 10 axit amin)',
          'C. Axit nucleic được phân giải thành các nucleotit tự do',
        ],
        correctIdx: 1,
        hint: 'Gợi ý: Tên gọi Pepsin gắn liền với liên kết Peptide cấu tạo nên chất đạm (Protein).',
        correctExplanation:
          'Xuất sắc! Tại dạ dày, chỉ có Protein (chất đạm) được Pepsin phân cắt thành các chuỗi polypeptide ngắn.',
        wrongExplanation:
          'Chưa đúng! Ở dạ dày hầu như chưa có sự tiêu hóa hóa học đối với Lipit hay Axit nucleic.',
      },
    ],
  },
  'tram-3': {
    id: 'tram-3',
    stationId: 'tram-3',
    specimenId: 'chat-nhay-mucin',
    title: 'Trạm 3: Dịch Vị & Hàng Rào Chất Nhầy Bảo Vệ',
    subtitle: 'Tìm hiểu lá chắn sinh học bảo vệ niêm mạc dạ dày và lộ trình xuống ruột non.',
    image: IMAGES.mapBg,
    imageCropStyle: {
      backgroundPosition: '50% 62%',
      backgroundSize: '175%',
      filter: 'saturate(1.15) contrast(1.05)',
    },
    imageOverlayStyle: {
      background:
        'linear-gradient(135deg, rgba(16, 185, 129, 0.28) 0%, rgba(49, 16, 30, 0.78) 100%)',
    },
    organBadge: 'Hệ Tiêu Hóa • Thềm Chất Nhầy Môn Vị',
    pH: 'pH sát niêm mạc ~ 7.0',
    enzyme: 'Chất nhầy Mucin phủ bề mặt',
    xPercent: 82,
    yPercent: 72,
    description:
      'Nằm ở phía cuối hang động dạ dày sát cửa môn vị, khu vực này được bao phủ bởi lớp chất nhầy (Mucin) dày và sánh do các tế bào tiết chất nhầy tạo ra. Dù thành dạ dày cũng cấu tạo từ Protein, chính hàng rào chất nhầy này đã ngăn cách HCl và Pepsin tiếp xúc trực tiếp với niêm mạc. Tại đây, bạn sẽ khám phá cơ chế tự bảo vệ kỳ diệu của dạ dày trước khi thức ăn chuyển sang tá tràng.',
    experiencePreview:
      'Khảo sát lớp màng bảo vệ niêm mạc vùng môn vị, trao đổi kiến thức sinh học thực tế và hoàn tất chặng khám phá Hệ Tiêu Hóa tại Dạ Dày.',
    gameplayTarget: 'station-dialogue-quiz',
    npcDialogue: [
      'Potabi: "Chúng ta đã đi tới vùng môn vị ở bên phải hang động rồi! Bạn có thắc mắc vì sao dạ dày làm bằng thịt (Protein) mà không bị Pepsin tiêu hóa mất không?"',
      'Potabi: "Bí mật nằm ở lớp thảm chất nhầy trắng ngà dưới chân tụi mình! Nó ngăn cách HCl và Pepsin không chạm trực tiếp vào thành dạ dày."',
      'Potabi: "Hoàn thành trạm cuối cùng này để đạt 100% tiến độ Hệ Tiêu Hóa và mở khóa Hệ Tuần Hoàn nhé!"',
    ],
    questions: [
      {
        question: 'Câu 1/2: Vì sao protein trong thức ăn bị dịch vị phân hủy nhưng protein của chính thành dạ dày lại được bảo vệ?',
        options: [
          'A. Vì thành dạ dày được phủ lớp chất nhầy ngăn cách với HCl và Pepsin',
          'B. Vì enzym Pepsin biết tự phân biệt thức ăn với tế bào người',
          'C. Vì nhiệt độ trong dạ dày quá thấp nên Pepsin không chạm vào thành cơ',
        ],
        correctIdx: 0,
        hint: 'Gợi ý: Quan sát lớp dịch sánh màu trắng ngà phủ trên các mỏm đá niêm mạc ở Trạm 3.',
        correctExplanation:
          'Chính xác! Lớp chất nhầy được tiết ra liên tục phủ lên niêm mạc, trung hòa axit và ngăn Pepsin tiếp xúc với thành dạ dày.',
        wrongExplanation:
          'Chưa đúng! Nếu lớp chất nhầy này bị tổn thương (do vi khuẩn HP hoặc căng thẳng), HCl và Pepsin sẽ gây viêm loét dạ dày.',
      },
      {
        question: 'Câu 2/2: Thức ăn sau khi được nhào trộn và biến đổi một phần ở dạ dày từ 3 - 6 giờ sẽ được đẩy qua cơ vòng môn vị để xuống bộ phận nào tiếp theo?',
        options: [
          'A. Quay ngược lại Thực quản',
          'B. Đi vào Tá tràng (đoạn đầu của Ruột non)',
          'C. Đi thẳng vào Ruột già (Đại tràng)',
        ],
        correctIdx: 1,
        hint: 'Gợi ý: Bộ phận tiếp theo của ống tiêu hóa nối liền sau môn vị dạ dày, nơi nhận dịch tụy và dịch mật.',
        correctExplanation:
          'Chính xác 100%! Cửa môn vị mở ra từng đợt để đẩy vị trấp sang Tá tràng (đoạn đầu của Ruột non) tiếp tục tiêu hóa triệt để.',
        wrongExplanation:
          'Sai rồi! Thức ăn từ dạ dày phải đi qua Ruột non (bắt đầu từ Tá tràng) để tiêu hóa và hấp thu chất dinh dưỡng trước khi tới ruột già.',
      },
    ],
  },
};

const AMYLASE_NPC_DIALOGUE = [
  {
    speaker: 'Túi Tiết Amylase (Từ Khoang Miệng trôi xuống)',
    text: '“Ối dồi ôi! Ở trên Khoang miệng độ pH khoảng 7.2 ấm áp dễ chịu biết bao, mình đã biến đổi được bao nhiêu là tinh bột chín thành đường đôi Maltose!”',
  },
  {
    speaker: 'Túi Tiết Amylase',
    text: '“Vậy mà vừa trượt qua Thực quản rơi xuống Dạ dày này, axit HCl làm độ pH tụt xuống còn 1.5 - 2.5! Môi trường axit mạnh làm enzym Amylase như mình bị bất hoạt hoàn toàn rồi!”',
  },
  {
    speaker: 'Potabi giải thích (Sinh học 8)',
    text: '“Đúng vậy đấy! Mỗi loại enzym tiêu hóa chỉ hoạt động tối ưu ở một khoảng độ pH nhất định: Amylase cần pH gần trung tính (~7.2) ở khoang miệng, còn ở dạ dày là sân chơi của Pepsin (pH 1.5 - 2.5)!”',
  },
];

export const StomachStageScreen: React.FC<StomachStageScreenProps> = ({
  onExitToMap,
  onOpenMicroscope,
  onOpenStain,
  onOpenNotebook,
  completedStations,
  onStationCompleted,
  equippedOutfitId,
  onStageVictory,
  amylaseInspected: propAmylaseInspected = false,
  onAmylaseInspected,
  stationProgressMap: propStationProgressMap = {},
  onUpdateStationProgressMap,
}) => {
  // Real-time 2D physics state
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 17, y: 66 });
  const [facingRight, setFacingRight] = useState<boolean>(true);
  const [isGrounded, setIsGrounded] = useState<boolean>(true);
  const [currentPlatformLabel, setCurrentPlatformLabel] = useState<string>('Thềm Cơ Dọc & Cơ Vòng');
  const [health, setHealth] = useState<number>(88);
  const [acidWarning, setAcidWarning] = useState<boolean>(false);

  // Proximity & Interaction states
  const [nearbyTarget, setNearbyTarget] = useState<
    null | 'tram-1' | 'tram-2' | 'tram-3' | 'amylase-npc'
  >(null);

  // Companion & NPC Modals
  const [showPotabiModal, setShowPotabiModal] = useState<boolean>(false);
  const [potabiDialogueIdx, setPotabiDialogueIdx] = useState<number>(0);
  const [amylaseModalStep, setAmylaseModalStep] = useState<number | null>(null);
  const [amylaseInspected, setAmylaseInspected] = useState<boolean>(propAmylaseInspected);

  // Station Introduction Menu (opened first when pressing E near a station)
  const [introStation, setIntroStation] = useState<StationDetail | null>(null);
  const [stationProgressMap, setStationProgressMap] = useState<Record<string, StationSavedProgress>>(
    propStationProgressMap
  );

  useEffect(() => {
    setAmylaseInspected(propAmylaseInspected);
  }, [propAmylaseInspected]);

  useEffect(() => {
    setStationProgressMap(propStationProgressMap);
  }, [propStationProgressMap]);

  const updateStationProgressMapBoth = (
    updater: (prev: Record<string, StationSavedProgress>) => Record<string, StationSavedProgress>
  ) => {
    setStationProgressMap((prev) => {
      const next = updater(prev);
      onUpdateStationProgressMap?.(next);
      return next;
    });
  };

  // Station interactive flow (Dialogue phase -> Quiz phase)
  const [activeStation, setActiveStation] = useState<StationDetail | null>(null);
  const [stationPhase, setStationPhase] = useState<'dialogue' | 'quiz' | 'completed'>('dialogue');
  const [stationDialogueIdx, setStationDialogueIdx] = useState<number>(0);
  const [questionIdx, setQuestionIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showVictoryBanner, setShowVictoryBanner] = useState<boolean>(false);

  // Pause Menu & Modal States
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [pauseTab, setPauseTab] = useState<'objectives' | 'settings' | 'controls'>('objectives');
  const [showRestartConfirm, setShowRestartConfirm] = useState<boolean>(false);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Transparent Auto-Fading HUD States
  const [isHudExpanded, setIsHudExpanded] = useState<boolean>(true);
  const [hudFading, setHudFading] = useState<boolean>(false);
  const hudTimeoutRef = useRef<number | null>(null);

  // In-Game Configurable Settings (Persisted in localStorage)
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(() => {
    return localStorage.getItem('potabi_bgm') !== 'false';
  });
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(() => {
    return localStorage.getItem('potabi_sfx') !== 'false';
  });
  const [ambientEffects, setAmbientEffects] = useState<boolean>(() => {
    return localStorage.getItem('potabi_ambient') !== 'false';
  });
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return localStorage.getItem('potabi_reduced_motion') === 'true';
  });
  const [virtualControls, setVirtualControls] = useState<boolean>(() => {
    return localStorage.getItem('potabi_virtual_controls') !== 'false';
  });

  const handleToggleBgm = () => {
    setBgmEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('potabi_bgm', String(next));
      return next;
    });
  };

  const handleToggleSfx = () => {
    setSfxEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('potabi_sfx', String(next));
      return next;
    });
  };

  const handleToggleAmbient = () => {
    setAmbientEffects((prev) => {
      const next = !prev;
      localStorage.setItem('potabi_ambient', String(next));
      return next;
    });
  };

  const handleToggleReducedMotion = () => {
    setReducedMotion((prev) => {
      const next = !prev;
      localStorage.setItem('potabi_reduced_motion', String(next));
      return next;
    });
  };

  const handleToggleVirtualControls = () => {
    setVirtualControls((prev) => {
      const next = !prev;
      localStorage.setItem('potabi_virtual_controls', String(next));
      return next;
    });
  };

  // Helper to schedule HUD auto-fade out
  const scheduleHudFadeOut = (delayMs: number = 4000) => {
    if (hudTimeoutRef.current) {
      window.clearTimeout(hudTimeoutRef.current);
    }
    hudTimeoutRef.current = window.setTimeout(() => {
      setHudFading(true);
      hudTimeoutRef.current = window.setTimeout(() => {
        setIsHudExpanded(false);
        setHudFading(false);
      }, 800);
    }, delayMs);
  };

  // Initial HUD Auto-fade after 4 seconds on screen mount
  useEffect(() => {
    scheduleHudFadeOut(4000);
    return () => {
      if (hudTimeoutRef.current) {
        window.clearTimeout(hudTimeoutRef.current);
      }
    };
  }, []);

  // Re-open HUD handler
  const handleOpenHud = () => {
    if (hudTimeoutRef.current) {
      window.clearTimeout(hudTimeoutRef.current);
    }
    setHudFading(false);
    setIsHudExpanded(true);
    scheduleHudFadeOut(5000);
  };

  // Close HUD manually
  const handleCloseHud = () => {
    if (hudTimeoutRef.current) {
      window.clearTimeout(hudTimeoutRef.current);
    }
    setHudFading(false);
    setIsHudExpanded(false);
  };

  // Refs for smooth 60fps physics loop
  const posRef = useRef({ x: 17, y: 66 });
  const velRef = useRef({ vx: 0, vy: 0 });
  const keysRef = useRef<{
    KeyA: boolean;
    ArrowLeft: boolean;
    KeyD: boolean;
    ArrowRight: boolean;
    jumpQueued: boolean;
    jumpLock: boolean;
  }>({
    KeyA: false,
    ArrowLeft: false,
    KeyD: false,
    ArrowRight: false,
    jumpQueued: false,
    jumpLock: false,
  });
  const groundedRef = useRef<boolean>(true);

  const speedMultiplier = equippedOutfitId === 'giot-nuoc-nano' ? 1.25 : 1.0;
  const jumpPower = equippedOutfitId === 'giot-nuoc-nano' ? -1.45 : -1.28;

  const stopPlayerMovementAndPhysics = () => {
    keysRef.current.KeyA = false;
    keysRef.current.ArrowLeft = false;
    keysRef.current.KeyD = false;
    keysRef.current.ArrowRight = false;
    keysRef.current.jumpQueued = false;
    velRef.current.vx = 0;
    velRef.current.vy = 0;
  };

  // Restart Stage to initial platform position
  const handleRestartStage = () => {
    stopPlayerMovementAndPhysics();
    posRef.current = { x: 17, y: 66 };
    setPlayerPos({ x: 17, y: 66 });
    groundedRef.current = true;
    setIsGrounded(true);
    setCurrentPlatformLabel('Thềm Cơ Dọc & Cơ Vòng');
    setHealth(100);
    setAcidWarning(false);
    setIsPaused(false);
    setShowRestartConfirm(false);
    // Briefly display HUD again so player has fresh orientation
    handleOpenHud();
  };

  // Step 1: Open the Station Introduction Menu (does not immediately start station gameplay)
  const openStationIntroMenu = (stationId: string) => {
    const st = STATIONS[stationId];
    if (!st) return;
    // Prevent duplicate stacking if a station intro or active gameplay is already open
    if (introStation || activeStation) return;
    stopPlayerMovementAndPhysics();
    setIntroStation(st);
  };

  // Step 2: Launch actual station gameplay when clicking "TIẾP TỤC KHÁM PHÁ" in the intro menu
  const startStationGameplayFromIntro = (station: StationDetail) => {
    stopPlayerMovementAndPhysics();
    setIntroStation(null);
    const saved = stationProgressMap[station.id];
    setActiveStation(station);
    setStationPhase(saved ? saved.phase : 'dialogue');
    setStationDialogueIdx(saved ? saved.dialogueIdx : 0);
    setQuestionIdx(saved ? saved.questionIdx : 0);
    setSelectedAnswer(null);
    setShowHint(false);
    setFeedbackState('idle');
  };

  // Save in-progress station state when closing gameplay modal early so reopening doesn't lose progress
  const closeActiveStationGameplay = () => {
    if (activeStation && (stationPhase === 'dialogue' || stationPhase === 'quiz')) {
      updateStationProgressMapBoth((prev) => ({
        ...prev,
        [activeStation.id]: {
          phase: stationPhase,
          dialogueIdx: stationDialogueIdx,
          questionIdx: questionIdx,
        },
      }));
    }
    setActiveStation(null);
  };

  // Physics & Platform Collision Loop
  useEffect(() => {
    let animId: number;

    const updatePhysics = () => {
      // Pause physics when game is paused or any menu or modal is open
      if (
        isPaused ||
        introStation ||
        activeStation ||
        showPotabiModal ||
        amylaseModalStep !== null ||
        showVictoryBanner
      ) {
        animId = requestAnimationFrame(updatePhysics);
        return;
      }

      const moveSpeed = 0.42 * speedMultiplier;
      const movingLeft = keysRef.current.KeyA || keysRef.current.ArrowLeft;
      const movingRight = keysRef.current.KeyD || keysRef.current.ArrowRight;

      if (movingLeft && !movingRight) {
        velRef.current.vx = -moveSpeed;
        setFacingRight(false);
      } else if (movingRight && !movingLeft) {
        velRef.current.vx = moveSpeed;
        setFacingRight(true);
      } else {
        velRef.current.vx = 0;
      }

      if (keysRef.current.jumpQueued) {
        if (groundedRef.current) {
          velRef.current.vy = jumpPower;
          groundedRef.current = false;
          setIsGrounded(false);
        }
        // Always consume jumpQueued so holding W/↑ never triggers continuous jumping
        keysRef.current.jumpQueued = false;
      }

      // Gravity
      velRef.current.vy += 0.065;
      if (velRef.current.vy > 1.3) velRef.current.vy = 1.3;

      const prevY = posRef.current.y;
      let nextX = Math.max(4, Math.min(95, posRef.current.x + velRef.current.vx));
      let nextY = posRef.current.y + velRef.current.vy;

      let landedPlatform: PlatformBox | null = null;

      // Check platform top collisions when falling or walking
      if (velRef.current.vy >= 0) {
        for (const plat of PLATFORMS) {
          if (nextX >= plat.left && nextX <= plat.right) {
            if (prevY <= plat.surfaceY + 2.2 && nextY >= plat.surfaceY) {
              nextY = plat.surfaceY;
              velRef.current.vy = 0;
              landedPlatform = plat;
              break;
            }
          }
        }
      }

      if (landedPlatform) {
        groundedRef.current = true;
        setIsGrounded(true);
        setCurrentPlatformLabel(landedPlatform.label);
      } else {
        groundedRef.current = false;
        setIsGrounded(false);
      }

      // Gastric Acid Pool Hazard at the bottom (y > 86%)
      if (nextY >= 88) {
        setAcidWarning(true);
        const dmg = equippedOutfitId === 'blouse-bac-si' ? 4 : 8;
        setHealth((h) => Math.max(20, h - dmg));
        // Bounce back onto the nearest safe ledge
        nextX = nextX < 50 ? 20 : 82;
        nextY = nextX < 50 ? 66 : 79;
        velRef.current.vy = 0;
        groundedRef.current = true;
        setIsGrounded(true);
        setTimeout(() => setAcidWarning(false), 1200);
      }

      posRef.current = { x: nextX, y: nextY };
      setPlayerPos({ x: nextX, y: nextY });

      // Check proximity to Stations & NPCs
      const dist = (x1: number, y1: number, x2: number, y2: number) =>
        Math.hypot(x1 - x2, y1 - y2);

      if (dist(nextX, nextY, STATIONS['tram-1'].xPercent, 66) < 9) {
        setNearbyTarget('tram-1');
      } else if (dist(nextX, nextY, STATIONS['tram-2'].xPercent, 67) < 9) {
        setNearbyTarget('tram-2');
      } else if (dist(nextX, nextY, STATIONS['tram-3'].xPercent, 79) < 10) {
        setNearbyTarget('tram-3');
      } else if (dist(nextX, nextY, 68, 45) < 12) {
        setNearbyTarget('amylase-npc');
      } else {
        setNearbyTarget(null);
      }

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, [
    isPaused,
    introStation,
    activeStation,
    showPotabiModal,
    amylaseModalStep,
    showVictoryBanner,
    speedMultiplier,
    jumpPower,
    equippedOutfitId,
  ]);

  // Keyboard Listeners using event.code (KeyA/ArrowLeft, KeyD/ArrowRight, KeyW/ArrowUp, KeyE, Escape, Tab)
  useEffect(() => {
    const isTypingInInput = (target: EventTarget | null): boolean => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target.isContentEditable
      );
    };

    const isModalOpen =
      isPaused ||
      Boolean(introStation) ||
      Boolean(activeStation) ||
      showPotabiModal ||
      amylaseModalStep !== null ||
      showVictoryBanner;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not process game controls when typing in an input field
      if (isTypingInInput(e.target)) return;

      // Prevent browser scrolling when pressing arrow keys inside the 2D stage
      if (
        e.code === 'ArrowLeft' ||
        e.code === 'ArrowRight' ||
        e.code === 'ArrowUp' ||
        e.code === 'ArrowDown'
      ) {
        e.preventDefault();
      }

      if (e.code === 'Escape') {
        e.preventDefault();
        if (showRestartConfirm) {
          setShowRestartConfirm(false);
          return;
        }
        if (showExitConfirm) {
          setShowExitConfirm(false);
          return;
        }
        if (introStation) {
          setIntroStation(null);
          return;
        }
        if (activeStation) {
          closeActiveStationGameplay();
          return;
        }
        if (showPotabiModal) {
          setShowPotabiModal(false);
          return;
        }
        if (amylaseModalStep !== null) {
          setAmylaseModalStep(null);
          return;
        }
        // Toggle Pause Menu on/off
        setIsPaused((prev) => {
          const next = !prev;
          if (next) {
            stopPlayerMovementAndPhysics();
          }
          return next;
        });
        return;
      }

      // Allow Spacebar to advance NPC Amylase dialogue when its modal is open
      if (e.code === 'Space' && amylaseModalStep !== null) {
        e.preventDefault();
        if (e.repeat) return;
        if (amylaseModalStep < AMYLASE_NPC_DIALOGUE.length - 1) {
          setAmylaseModalStep(amylaseModalStep + 1);
        } else {
          setAmylaseInspected(true);
          onAmylaseInspected?.();
          setAmylaseModalStep(null);
        }
        return;
      }

      // Do not process character movement/interaction keys when a dialog/modal/pause is open
      if (isModalOpen) {
        keysRef.current.KeyA = false;
        keysRef.current.ArrowLeft = false;
        keysRef.current.KeyD = false;
        keysRef.current.ArrowRight = false;
        keysRef.current.jumpQueued = false;
        return;
      }

      if (e.code === 'KeyA') {
        keysRef.current.KeyA = true;
      } else if (e.code === 'ArrowLeft') {
        keysRef.current.ArrowLeft = true;
      } else if (e.code === 'KeyD') {
        keysRef.current.KeyD = true;
      } else if (e.code === 'ArrowRight') {
        keysRef.current.ArrowRight = true;
      } else if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        // Ignore auto-repeat and lock until key release so holding W/↑ does not jump repeatedly
        if (!e.repeat && !keysRef.current.jumpLock && groundedRef.current) {
          keysRef.current.jumpQueued = true;
          keysRef.current.jumpLock = true;
        }
      } else if (e.code === 'KeyE') {
        if (e.repeat) return;
        if (nearbyTarget === 'tram-1' || nearbyTarget === 'tram-2' || nearbyTarget === 'tram-3') {
          openStationIntroMenu(nearbyTarget);
        } else if (nearbyTarget === 'amylase-npc') {
          stopPlayerMovementAndPhysics();
          setAmylaseModalStep(0);
        } else {
          stopPlayerMovementAndPhysics();
          setPotabiDialogueIdx(0);
          setShowPotabiModal(true);
        }
      } else if (e.code === 'Tab') {
        e.preventDefault();
        onOpenNotebook();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyA') {
        keysRef.current.KeyA = false;
      } else if (e.code === 'ArrowLeft') {
        keysRef.current.ArrowLeft = false;
      } else if (e.code === 'KeyD') {
        keysRef.current.KeyD = false;
      } else if (e.code === 'ArrowRight') {
        keysRef.current.ArrowRight = false;
      } else if (e.code === 'KeyW' || e.code === 'ArrowUp') {
        keysRef.current.jumpLock = false;
        keysRef.current.jumpQueued = false;
      }
    };

    const handleWindowBlur = () => {
      keysRef.current.KeyA = false;
      keysRef.current.ArrowLeft = false;
      keysRef.current.KeyD = false;
      keysRef.current.ArrowRight = false;
      keysRef.current.jumpQueued = false;
      keysRef.current.jumpLock = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [
    isPaused,
    showRestartConfirm,
    showExitConfirm,
    nearbyTarget,
    introStation,
    activeStation,
    stationPhase,
    stationDialogueIdx,
    questionIdx,
    showPotabiModal,
    amylaseModalStep,
    showVictoryBanner,
    onOpenNotebook,
  ]);

  const handleSelectOption = (idx: number) => {
    if (!activeStation) return;
    setSelectedAnswer(idx);
    const currentQ = activeStation.questions[questionIdx];
    if (idx === currentQ.correctIdx) {
      setFeedbackState('correct');
    } else {
      setFeedbackState('wrong');
    }
  };

  const handleAdvanceQuestionOrComplete = () => {
    if (!activeStation) return;
    const currentQ = activeStation.questions[questionIdx];
    if (selectedAnswer !== currentQ.correctIdx) return;

    if (questionIdx < activeStation.questions.length - 1) {
      const nextQIdx = questionIdx + 1;
      setQuestionIdx(nextQIdx);
      updateStationProgressMapBoth((prev) => ({
        ...prev,
        [activeStation.id]: {
          phase: 'quiz',
          dialogueIdx: stationDialogueIdx,
          questionIdx: nextQIdx,
        },
      }));
      setSelectedAnswer(null);
      setFeedbackState('idle');
      setShowHint(false);
    } else {
      // Completed all questions in this station
      const willHaveAllThree =
        completedStations.includes(activeStation.id)
          ? completedStations.length >= 3
          : completedStations.length + 1 >= 3;

      updateStationProgressMapBoth((prev) => {
        const next = { ...prev };
        delete next[activeStation.id];
        return next;
      });
      onStationCompleted(activeStation.id, activeStation.specimenId, 250, 15);
      setActiveStation(null);
      setSelectedAnswer(null);
      setFeedbackState('idle');

      if (willHaveAllThree) {
        setShowVictoryBanner(true);
      }
    }
  };

  const POTABI_COMPANION_LINES = [
    `"Chào cậu! Hiện tại tụi mình đang đứng ở ${currentPlatformLabel}. Hãy dùng phím A / ← hoặc D / → để chạy dọc theo các nếp gấp niêm mạc và nhấn W / ↑ để nhảy qua khe dịch vị nhé!"`,
    '"Ở màn Dạ dày này có 3 Trạm kiến thức Sinh học 8: Trạm 1 (3 lớp cơ nghiền thức ăn), Trạm 2 (Axit HCl & Enzym Pepsin), và Trạm 3 (Màng chất nhầy bảo vệ)."',
    '"Khi lại gần một Trạm hoặc Túi tiết Amylase, cậu chỉ cần nhấn phím [E] để bắt đầu thu thập mẫu vật! Hoàn thành đủ 3 Trạm sẽ mở khóa Màn 2: Hệ Tuần Hoàn!"',
  ];

  const totalSpecimensCount = completedStations.length + (amylaseInspected ? 1 : 0);

  return (
    <div className="bg-inverse-surface font-body-md text-body-md text-inverse-on-surface overflow-hidden select-none relative w-full h-screen">


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

            {/* Subtle Visual Platform Guides when wearing Kính Soi Quang Phổ or jumping */}
            {PLATFORMS.map((plat) => (
              <div
                key={plat.id}
                style={{
                  left: `${plat.left}%`,
                  width: `${plat.right - plat.left}%`,
                  top: `${plat.surfaceY}%`,
                }}
                className={`absolute h-1.5 rounded-full pointer-events-none transition-opacity ${
                  equippedOutfitId === 'kinh-hien-vi-quang' || !isGrounded
                    ? 'bg-tertiary-fixed/50 opacity-80'
                    : 'opacity-0'
                }`}
              />
            ))}

            {/* Acid Hazard Warning Toast */}
            {acidWarning && (
              <div className="absolute bottom-44 left-1/2 -translate-x-1/2 z-30 bg-error text-on-error px-space-md py-1.5 rounded-full font-label-md text-label-md shadow-lg animate-bounce flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">warning</span>
                <span>
                  Cẩn thận! Hồ dịch vị HCl (pH 1.5) làm giảm năng lượng sinh học!
                </span>
              </div>
            )}

            {/* Interactive In-World Checkpoint 1: Nghiền Cơ Học */}
            <div
              onClick={() => openStationIntroMenu('tram-1')}
              className="absolute top-[58%] left-[22%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
            >
              <div className="relative flex flex-col items-center">
                <div
                  className={`mb-2 px-space-sm py-1 backdrop-blur-md rounded-full shadow-lg flex items-center gap-1.5 transform transition-transform group-hover:scale-110 ${
                    nearbyTarget === 'tram-1'
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed ring-2 ring-primary scale-110'
                      : 'bg-surface-container-lowest/90 text-on-surface'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      completedStations.includes('tram-1')
                        ? 'bg-emerald-600'
                        : 'bg-tertiary-fixed-dim animate-ping'
                    }`}
                  ></span>
                  <span className="font-label-sm text-label-sm">
                    {nearbyTarget === 'tram-1' ? '[E] ' : ''}Trạm 1: Nghiền cơ học
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary-fixed/40 flex items-center justify-center animate-bounce shadow-md">
                  <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-sm">
                      {completedStations.includes('tram-1') ? 'check' : 'compress'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive In-World Checkpoint 2: Axit HCl & Pepsin */}
            <div
              onClick={() => openStationIntroMenu('tram-2')}
              className="absolute top-[63%] left-[44%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
            >
              <div className="relative flex flex-col items-center">
                <div
                  className={`mb-2 px-space-sm py-1 backdrop-blur-md rounded-full shadow-lg flex items-center gap-1.5 transform transition-transform group-hover:scale-110 ${
                    nearbyTarget === 'tram-2'
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed ring-2 ring-primary scale-110'
                      : 'bg-surface-container-lowest/90 text-on-surface'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      completedStations.includes('tram-2')
                        ? 'bg-emerald-600'
                        : 'bg-primary animate-pulse'
                    }`}
                  ></span>
                  <span className="font-label-sm text-label-sm">
                    {nearbyTarget === 'tram-2' ? '[E] ' : ''}Trạm 2: Axit HCl &amp; Pepsin
                  </span>
                </div>
                <div
                  className="w-10 h-10 rounded-full bg-primary-fixed/50 flex items-center justify-center animate-bounce shadow-md"
                  style={{ animationDelay: '0.3s' }}
                >
                  <div className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">
                      {completedStations.includes('tram-2') ? 'check' : 'science'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive In-World Checkpoint 3: Dịch vị & Tuyến nhầy */}
            <div
              onClick={() => openStationIntroMenu('tram-3')}
              className="absolute top-[72%] right-[18%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
            >
              <div className="relative flex flex-col items-center">
                <div
                  className={`mb-2 px-space-sm py-1 backdrop-blur-md rounded-full shadow-lg flex items-center gap-1.5 transform transition-transform group-hover:scale-110 ${
                    nearbyTarget === 'tram-3'
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed ring-2 ring-primary scale-110'
                      : 'bg-surface-container-lowest/90 text-secondary'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs text-tertiary-fixed-dim">
                    {completedStations.includes('tram-3') ? 'check_circle' : 'science'}
                  </span>
                  <span className="font-label-sm text-label-sm">
                    {nearbyTarget === 'tram-3' ? '[E] ' : ''}Trạm 3: Dịch vị
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-variant/40 flex items-center justify-center animate-bounce">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      completedStations.includes('tram-3')
                        ? 'bg-emerald-600 text-white'
                        : 'bg-surface-container-high text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {completedStations.includes('tram-3') ? 'check' : 'water_drop'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Active 2D Game Companion: Potabi Sprite Controlled by Player */}
            <div
              onClick={() => {
                if (nearbyTarget === 'tram-1' || nearbyTarget === 'tram-2' || nearbyTarget === 'tram-3') {
                  openStationIntroMenu(nearbyTarget);
                } else if (nearbyTarget === 'amylase-npc') {
                  stopPlayerMovementAndPhysics();
                  setAmylaseModalStep(0);
                } else {
                  stopPlayerMovementAndPhysics();
                  setPotabiDialogueIdx(0);
                  setShowPotabiModal(true);
                }
              }}
              style={{
                left: `${playerPos.x}%`,
                top: `${playerPos.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-full z-20 flex flex-col items-center cursor-pointer group select-none"
            >
              <div className="mb-2 px-space-md py-1 bg-surface-container-lowest/95 backdrop-blur-md rounded-full shadow-xl flex items-center gap-1.5 transform transition-transform group-hover:scale-105 whitespace-nowrap">
                <span className="font-label-sm text-label-sm text-primary font-bold px-1.5 py-0.5 bg-secondary-fixed rounded-md">
                  [E]
                </span>
                <span className="font-label-sm text-label-sm text-on-surface">
                  {nearbyTarget === 'tram-1'
                    ? 'Khám phá Trạm 1: Cơ dạ dày'
                    : nearbyTarget === 'tram-2'
                    ? 'Khám phá Trạm 2: HCl & Pepsin'
                    : nearbyTarget === 'tram-3'
                    ? 'Khám phá Trạm 3: Chất nhầy'
                    : nearbyTarget === 'amylase-npc'
                    ? 'Trò chuyện với Túi Amylase'
                    : 'Nói chuyện với Potabi'}
                </span>
              </div>
              <div
                className={`w-24 h-24 relative flex items-center justify-center transition-transform duration-150 filter drop-shadow-[0_10px_12px_rgba(49,16,30,0.55)] ${
                  facingRight ? 'scale-x-100' : '-scale-x-100'
                }`}
              >
                <img
                  alt="Potabi Mascot 2D Companion"
                  className="w-full h-full object-contain pointer-events-none"
                  referrerPolicy="no-referrer"
                  src={IMAGES.potabiBlueAvatar}
                />
                <div className="absolute -bottom-1 w-16 h-3 bg-inverse-surface/35 rounded-full blur-[2px]"></div>
              </div>
            </div>

            {/* Friendly NPC: Enzyme Amylase in Protective Vesicle Bubble */}
            <div
              onClick={() => {
                stopPlayerMovementAndPhysics();
                setAmylaseModalStep(0);
              }}
              className="absolute top-[32%] right-[32%] z-20 flex flex-col items-center cursor-pointer group"
            >
              <div
                className={`mb-2 px-space-md py-1 backdrop-blur-md rounded-full shadow-xl flex items-center gap-1.5 opacity-95 group-hover:opacity-100 transform transition-transform group-hover:scale-105 ${
                  nearbyTarget === 'amylase-npc'
                    ? 'bg-tertiary-fixed text-on-tertiary-fixed ring-2 ring-primary'
                    : 'bg-surface-container-lowest/95 text-on-surface'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim animate-ping"></span>
                <span className="font-label-sm text-label-sm font-semibold">
                  {nearbyTarget === 'amylase-npc' ? '[E] ' : ''}Túi Tiết Amylase: "Độ pH ở đây thấp
                  quá!"
                </span>
              </div>
              <div className="w-16 h-16 rounded-full bg-tertiary-fixed/30 backdrop-blur-sm p-1.5 flex items-center justify-center shadow-lg animate-pulse">
                <div className="w-full h-full rounded-full bg-surface-container-lowest/80 flex items-center justify-center text-tertiary">
                  <span className="material-symbols-outlined text-2xl">bubble_chart</span>
                </div>
              </div>
            </div>
          </div>

          {/* UNIFIED STREAMLINED TOP HUD DOCK (Transparent, Auto-Fading, Compact) */}
          <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 z-30 pointer-events-none flex items-start justify-between gap-2 safe-p-top">
            {/* Top-Left: Return to Map & Health/pH Badge */}
            <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
              <button
                onClick={() => setShowExitConfirm(true)}
                title="Trở về Bản Đồ Hành Trình"
                className="h-10 px-3 bg-surface-container-lowest/90 hover:bg-surface-container backdrop-blur-md rounded-full shadow-md flex items-center gap-1.5 text-on-surface transition-colors cursor-pointer border border-primary/20 text-xs sm:text-sm font-label-sm font-bold"
              >
                <span className="material-symbols-outlined text-base sm:text-lg text-primary">eco</span>
                <span className="hidden sm:inline">Bản đồ</span>
              </button>

              <div className="h-10 px-3 bg-surface-container-lowest/90 backdrop-blur-md rounded-full shadow-md flex items-center gap-2 border border-primary/20">
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] sm:text-xs font-bold text-primary">pH 1.5 - 2.5</span>
                    <span className="text-outline-variant text-[10px]">•</span>
                    <span className="text-[10px] sm:text-xs text-on-surface-variant font-semibold">
                      Sinh lực {health}%
                    </span>
                  </div>
                  <div className="w-16 sm:w-20 h-1.5 bg-secondary-fixed rounded-full overflow-hidden mt-0.5">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${health}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Top-Center: Transparent Auto-Fading HUD or Collapsed Pill */}
            <div className="flex flex-col items-center">
              {isHudExpanded ? (
                <div
                  className={`bg-surface-container-lowest/90 backdrop-blur-md rounded-2xl border border-primary/20 shadow-lg p-3 sm:p-3.5 max-w-md w-full transition-all duration-700 pointer-events-auto flex flex-col gap-1.5 ${
                    hudFading ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-primary/10 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-base">biotech</span>
                      <span className="font-headline-sm text-xs sm:text-sm text-primary font-bold">
                        Màn 1: Dạ Dày • Học Viện Sinh Học 8
                      </span>
                    </div>
                    <button
                      onClick={handleCloseHud}
                      title="Thu gọn khung thông tin"
                      className="w-6 h-6 rounded-full hover:bg-surface-container text-on-surface-variant flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>

                  <p className="font-body-sm text-xs text-on-surface leading-snug">
                    <strong className="text-primary">Mục tiêu:</strong> Khám phá 3 Trạm Sinh học (3 lớp cơ nghiền, Axit HCl &amp; Pepsin, Màng chất nhầy).
                  </p>

                  <div className="flex items-center justify-between gap-1 flex-wrap pt-0.5">
                    <div className="flex items-center gap-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          completedStations.includes('tram-1')
                            ? 'bg-emerald-600 text-white'
                            : 'bg-surface-container text-on-surface'
                        }`}
                      >
                        Trạm 1: Cơ
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          completedStations.includes('tram-2')
                            ? 'bg-emerald-600 text-white'
                            : 'bg-surface-container text-on-surface'
                        }`}
                      >
                        Trạm 2: HCl
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          completedStations.includes('tram-3')
                            ? 'bg-emerald-600 text-white'
                            : 'bg-surface-container text-on-surface'
                        }`}
                      >
                        Trạm 3: Dịch vị
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-tertiary">
                      Mẫu vật: {totalSpecimensCount}/4
                    </span>
                  </div>

                  <div className="text-[10px] text-on-surface-variant/80 border-t border-primary/10 pt-1 flex items-center justify-between">
                    <span>Phím: A/D/←/→ di chuyển • W/↑ nhảy • E tương tác</span>
                    <span className="font-bold text-primary">[ESC] Tạm dừng</span>
                  </div>
                </div>
              ) : (
                <div className="bg-surface-container-lowest/85 backdrop-blur-md border border-primary/20 px-3 py-1.5 rounded-full shadow-md text-xs font-label-sm text-primary flex items-center gap-2 pointer-events-auto transition-all hover:bg-surface-container-lowest">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold">
                    Dạ Dày: {completedStations.length}/3 Trạm • {totalSpecimensCount}/4 Tiêu bản
                  </span>
                  <button
                    onClick={handleOpenHud}
                    title="Mở lại hướng dẫn & nhiệm vụ"
                    className="w-6 h-6 rounded-full bg-primary/10 hover:bg-primary/20 text-primary flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">info</span>
                  </button>
                </div>
              )}
            </div>

            {/* Top-Right: Quick Lab Tools & Interactive Pause Menu Button */}
            <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
              <button
                onClick={isHudExpanded ? handleCloseHud : handleOpenHud}
                title={isHudExpanded ? 'Thu gọn thông tin' : 'Mở thông tin nhiệm vụ'}
                className="w-10 h-10 rounded-full bg-surface-container-lowest/90 hover:bg-surface-container backdrop-blur-md shadow-md text-primary flex items-center justify-center transition-colors cursor-pointer border border-primary/20"
              >
                <span className="material-symbols-outlined text-lg">info</span>
              </button>

              <button
                onClick={onOpenMicroscope}
                title="Kính hiển vi quang học"
                className="w-10 h-10 rounded-full bg-surface-container-lowest/90 hover:bg-surface-container backdrop-blur-md shadow-md text-primary flex items-center justify-center transition-colors cursor-pointer border border-primary/20"
              >
                <span className="material-symbols-outlined text-lg">zoom_in</span>
              </button>

              <button
                onClick={onOpenNotebook}
                title="Sổ tay Sinh học 8"
                className="w-10 h-10 rounded-full bg-surface-container-lowest/90 hover:bg-surface-container backdrop-blur-md shadow-md text-primary flex items-center justify-center transition-colors cursor-pointer border border-primary/20"
              >
                <span className="material-symbols-outlined text-lg">menu_book</span>
              </button>

              {/* REAL PAUSE MENU BUTTON */}
              <button
                onClick={() => {
                  stopPlayerMovementAndPhysics();
                  setIsPaused(true);
                }}
                title="Tạm dừng trò chơi [ESC]"
                className="h-10 px-3 bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim backdrop-blur-md rounded-full shadow-md flex items-center gap-1 font-label-sm font-bold transition-all cursor-pointer border border-tertiary/20 active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">pause</span>
                <span className="hidden sm:inline">Tạm dừng</span>
              </button>
            </div>
          </div>

          {/* TOUCH VIRTUAL CONTROLS (Rendered at bottom when virtualControls is active) */}
          {virtualControls && !isPaused && (
            <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex items-end justify-between select-none">
              {/* Bottom-Left Directional D-Pad */}
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onMouseDown={() => (keysRef.current.KeyA = true)}
                  onMouseUp={() => (keysRef.current.KeyA = false)}
                  onMouseLeave={() => (keysRef.current.KeyA = false)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    keysRef.current.KeyA = true;
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    keysRef.current.KeyA = false;
                  }}
                  title="Đi sang trái"
                  className="w-13 h-13 rounded-full bg-surface-container-lowest/85 backdrop-blur-md text-primary font-bold shadow-xl ring-2 ring-primary/20 active:scale-90 active:bg-primary active:text-on-primary flex items-center justify-center transition-transform touch-control"
                >
                  <span className="material-symbols-outlined text-2xl">arrow_back</span>
                </button>

                <button
                  onMouseDown={() => (keysRef.current.KeyD = true)}
                  onMouseUp={() => (keysRef.current.KeyD = false)}
                  onMouseLeave={() => (keysRef.current.KeyD = false)}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    keysRef.current.KeyD = true;
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    keysRef.current.KeyD = false;
                  }}
                  title="Đi sang phải"
                  className="w-13 h-13 rounded-full bg-surface-container-lowest/85 backdrop-blur-md text-primary font-bold shadow-xl ring-2 ring-primary/20 active:scale-90 active:bg-primary active:text-on-primary flex items-center justify-center transition-transform touch-control"
                >
                  <span className="material-symbols-outlined text-2xl">arrow_forward</span>
                </button>
              </div>

              {/* Bottom-Right Jump & Interact Buttons */}
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={() => {
                    if (groundedRef.current) {
                      keysRef.current.jumpQueued = true;
                    }
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    if (groundedRef.current) {
                      keysRef.current.jumpQueued = true;
                    }
                  }}
                  title="Nhảy [W / ↑]"
                  className="w-13 h-13 rounded-full bg-surface-container-lowest/85 backdrop-blur-md text-primary font-bold shadow-xl ring-2 ring-primary/20 active:scale-90 active:bg-primary active:text-on-primary flex items-center justify-center transition-transform touch-control"
                >
                  <span className="material-symbols-outlined text-2xl">arrow_upward</span>
                </button>

                <button
                  onClick={() => {
                    if (
                      nearbyTarget === 'tram-1' ||
                      nearbyTarget === 'tram-2' ||
                      nearbyTarget === 'tram-3'
                    ) {
                      openStationIntroMenu(nearbyTarget);
                    } else if (nearbyTarget === 'amylase-npc') {
                      stopPlayerMovementAndPhysics();
                      setAmylaseModalStep(0);
                    } else {
                      stopPlayerMovementAndPhysics();
                      setPotabiDialogueIdx(0);
                      setShowPotabiModal(true);
                    }
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault();
                    if (
                      nearbyTarget === 'tram-1' ||
                      nearbyTarget === 'tram-2' ||
                      nearbyTarget === 'tram-3'
                    ) {
                      openStationIntroMenu(nearbyTarget);
                    } else if (nearbyTarget === 'amylase-npc') {
                      stopPlayerMovementAndPhysics();
                      setAmylaseModalStep(0);
                    } else {
                      stopPlayerMovementAndPhysics();
                      setPotabiDialogueIdx(0);
                      setShowPotabiModal(true);
                    }
                  }}
                  title="Tương tác [E]"
                  className={`w-14 h-14 rounded-full shadow-xl flex flex-col items-center justify-center transition-transform touch-control ${
                    nearbyTarget
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed ring-4 ring-primary animate-bounce active:scale-90'
                      : 'bg-surface-container-lowest/85 backdrop-blur-md text-primary ring-2 ring-primary/20 active:scale-90'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {nearbyTarget ? 'search' : 'touch_app'}
                  </span>
                  <span className="text-[10px] font-bold leading-none">[E]</span>
                </button>
              </div>
            </div>
          )}

          {/* FULL PAUSE MENU MODAL (Bio Blossom Tactile Style) */}
          {isPaused && (
            <div className="fixed inset-0 z-50 bg-inverse-surface/65 backdrop-blur-md flex items-center justify-center p-4 select-none safe-p-top safe-p-bottom">
              <div className="bg-surface-container-lowest max-w-lg w-full rounded-3xl shadow-2xl border-4 border-primary flex flex-col overflow-hidden max-h-[90vh]">
                {/* Pause Header */}
                <div className="p-4 sm:p-5 bg-surface-container-high/60 border-b border-primary/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-xl">pause</span>
                    </div>
                    <div>
                      <h2 className="font-headline-sm text-base sm:text-lg text-primary font-bold">
                        TẠM DỪNG TRÒ CHƠI
                      </h2>
                      <p className="font-label-sm text-xs text-on-surface-variant">
                        Màn 1: Dạ Dày • Cơ chế Tiêu hóa
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsPaused(false)}
                    title="Tiếp tục trò chơi"
                    className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>

                {/* Pause Tabs */}
                <div className="grid grid-cols-3 bg-surface-container p-1 border-b border-primary/10">
                  <button
                    onClick={() => setPauseTab('objectives')}
                    className={`py-2 rounded-2xl font-label-md text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      pauseTab === 'objectives'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Nhiệm vụ
                  </button>
                  <button
                    onClick={() => setPauseTab('settings')}
                    className={`py-2 rounded-2xl font-label-md text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      pauseTab === 'settings'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Cài đặt
                  </button>
                  <button
                    onClick={() => setPauseTab('controls')}
                    className={`py-2 rounded-2xl font-label-md text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      pauseTab === 'controls'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Điều khiển
                  </button>
                </div>

                {/* Tab Content */}
                <div className="p-4 sm:p-5 overflow-y-auto flex-1 flex flex-col gap-3">
                  {/* TAB 1: OBJECTIVES */}
                  {pauseTab === 'objectives' && (
                    <div className="flex flex-col gap-3">
                      <div className="bg-surface-container-low p-3.5 rounded-2xl border border-primary/15">
                        <span className="font-label-sm text-xs uppercase text-primary font-bold block mb-1">
                          Mục Tiêu Màn Chơi:
                        </span>
                        <p className="font-body-sm text-xs text-on-surface leading-relaxed">
                          Khám phá trọn vẹn 3 Trạm Sinh học 8 trong dạ dày để thu thập đủ 3 mẫu vật tiêu bản và mở khóa Màn 2 (Hệ Tuần Hoàn).
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <span className="font-label-sm text-xs font-bold text-on-surface">
                          Tiến Độ Các Trạm ({completedStations.length}/3 Trạm):
                        </span>

                        <div className="flex items-center justify-between p-2.5 bg-surface-container rounded-xl">
                          <div className="flex items-center gap-2">
                            <span
                              className={`material-symbols-outlined text-lg ${
                                completedStations.includes('tram-1')
                                  ? 'text-emerald-600'
                                  : 'text-outline'
                              }`}
                            >
                              {completedStations.includes('tram-1')
                                ? 'check_circle'
                                : 'radio_button_unchecked'}
                            </span>
                            <div>
                              <span className="font-label-sm text-xs text-on-surface block font-bold">
                                Trạm 1: 3 Lớp cơ dạ dày
                              </span>
                              <span className="text-[11px] text-on-surface-variant">
                                Nghiền đảo thức ăn thành vị trấp
                              </span>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              completedStations.includes('tram-1')
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {completedStations.includes('tram-1') ? 'Đã xong' : 'Chưa xong'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2.5 bg-surface-container rounded-xl">
                          <div className="flex items-center gap-2">
                            <span
                              className={`material-symbols-outlined text-lg ${
                                completedStations.includes('tram-2')
                                  ? 'text-emerald-600'
                                  : 'text-outline'
                              }`}
                            >
                              {completedStations.includes('tram-2')
                                ? 'check_circle'
                                : 'radio_button_unchecked'}
                            </span>
                            <div>
                              <span className="font-label-sm text-xs text-on-surface block font-bold">
                                Trạm 2: Axit HCl &amp; Pepsin
                              </span>
                              <span className="text-[11px] text-on-surface-variant">
                                Phân cắt Protein thành chuỗi ngắn
                              </span>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              completedStations.includes('tram-2')
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {completedStations.includes('tram-2') ? 'Đã xong' : 'Chưa xong'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2.5 bg-surface-container rounded-xl">
                          <div className="flex items-center gap-2">
                            <span
                              className={`material-symbols-outlined text-lg ${
                                completedStations.includes('tram-3')
                                  ? 'text-emerald-600'
                                  : 'text-outline'
                              }`}
                            >
                              {completedStations.includes('tram-3')
                                ? 'check_circle'
                                : 'radio_button_unchecked'}
                            </span>
                            <div>
                              <span className="font-label-sm text-xs text-on-surface block font-bold">
                                Trạm 3: Dịch vị &amp; Màng chất nhầy
                              </span>
                              <span className="text-[11px] text-on-surface-variant">
                                Bảo vệ thành dạ dày khỏi axit
                              </span>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              completedStations.includes('tram-3')
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {completedStations.includes('tram-3') ? 'Đã xong' : 'Chưa xong'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2.5 bg-surface-container rounded-xl">
                          <div className="flex items-center gap-2">
                            <span
                              className={`material-symbols-outlined text-lg ${
                                amylaseInspected ? 'text-emerald-600' : 'text-outline'
                              }`}
                            >
                              {amylaseInspected ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                            <div>
                              <span className="font-label-sm text-xs text-on-surface block font-bold">
                                NPC Túi tiết Amylase
                              </span>
                              <span className="text-[11px] text-on-surface-variant">
                                Bất hoạt bởi pH axit dạ dày
                              </span>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              amylaseInspected
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {amylaseInspected ? 'Đã gặp' : 'Chưa gặp'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: REAL SETTINGS */}
                  {pauseTab === 'settings' && (
                    <div className="flex flex-col gap-3">
                      {/* Audio Group */}
                      <div className="bg-surface-container-low p-3.5 rounded-2xl border border-primary/15 flex flex-col gap-2.5">
                        <span className="font-label-sm text-xs text-primary font-bold uppercase">
                          Âm Thanh:
                        </span>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-on-surface">
                              music_note
                            </span>
                            <span className="font-body-sm text-xs text-on-surface">Nhạc nền (BGM)</span>
                          </div>
                          <button
                            onClick={handleToggleBgm}
                            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                              bgmEnabled ? 'bg-primary' : 'bg-outline-variant'
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                                bgmEnabled ? 'right-0.5' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-on-surface">
                              volume_up
                            </span>
                            <span className="font-body-sm text-xs text-on-surface">
                              Hiệu ứng âm thanh (SFX)
                            </span>
                          </div>
                          <button
                            onClick={handleToggleSfx}
                            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                              sfxEnabled ? 'bg-primary' : 'bg-outline-variant'
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                                sfxEnabled ? 'right-0.5' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Display & Effects Group */}
                      <div className="bg-surface-container-low p-3.5 rounded-2xl border border-primary/15 flex flex-col gap-2.5">
                        <span className="font-label-sm text-xs text-primary font-bold uppercase">
                          Hiển Thị &amp; Đồ Họa:
                        </span>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-on-surface">
                              air
                            </span>
                            <span className="font-body-sm text-xs text-on-surface">
                              Sương mù dịch vị &amp; Hiệu ứng động
                            </span>
                          </div>
                          <button
                            onClick={handleToggleAmbient}
                            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                              ambientEffects ? 'bg-primary' : 'bg-outline-variant'
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                                ambientEffects ? 'right-0.5' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-on-surface">
                              motion_photos_off
                            </span>
                            <span className="font-body-sm text-xs text-on-surface">
                              Giảm hiệu ứng chuyển động
                            </span>
                          </div>
                          <button
                            onClick={handleToggleReducedMotion}
                            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                              reducedMotion ? 'bg-primary' : 'bg-outline-variant'
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                                reducedMotion ? 'right-0.5' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Controls Group */}
                      <div className="bg-surface-container-low p-3.5 rounded-2xl border border-primary/15 flex flex-col gap-2.5">
                        <span className="font-label-sm text-xs text-primary font-bold uppercase">
                          Điều Khiển Cảm Ứng:
                        </span>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-base text-on-surface">
                              touch_app
                            </span>
                            <span className="font-body-sm text-xs text-on-surface">
                              Hiển thị phím ảo cảm ứng trên màn hình
                            </span>
                          </div>
                          <button
                            onClick={handleToggleVirtualControls}
                            className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                              virtualControls ? 'bg-primary' : 'bg-outline-variant'
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                                virtualControls ? 'right-0.5' : 'left-0.5'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CONTROLS CHEATSHEET */}
                  {pauseTab === 'controls' && (
                    <div className="flex flex-col gap-3">
                      <div className="bg-surface-container-low p-3.5 rounded-2xl border border-primary/15 flex flex-col gap-2">
                        <span className="font-label-sm text-xs text-primary font-bold uppercase">
                          Hướng Dẫn Bàn Phím (Máy Tính):
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-surface-container rounded-xl flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-surface font-bold text-primary rounded shadow-xs">
                              A / ←
                            </kbd>
                            <span>Sang trái</span>
                          </div>
                          <div className="p-2 bg-surface-container rounded-xl flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-surface font-bold text-primary rounded shadow-xs">
                              D / →
                            </kbd>
                            <span>Sang phải</span>
                          </div>
                          <div className="p-2 bg-surface-container rounded-xl flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-surface font-bold text-primary rounded shadow-xs">
                              W / ↑
                            </kbd>
                            <span>Nhảy lên</span>
                          </div>
                          <div className="p-2 bg-surface-container rounded-xl flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-surface font-bold text-primary rounded shadow-xs">
                              E
                            </kbd>
                            <span>Tương tác trạm</span>
                          </div>
                          <div className="p-2 bg-surface-container rounded-xl flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-surface font-bold text-primary rounded shadow-xs">
                              ESC
                            </kbd>
                            <span>Tạm dừng / Đóng</span>
                          </div>
                          <div className="p-2 bg-surface-container rounded-xl flex items-center gap-2">
                            <kbd className="px-2 py-1 bg-surface font-bold text-primary rounded shadow-xs">
                              Tab
                            </kbd>
                            <span>Mở Sổ tay</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-surface-container-low p-3.5 rounded-2xl border border-primary/15 flex flex-col gap-1.5">
                        <span className="font-label-sm text-xs text-primary font-bold uppercase">
                          Thiết Bị Cảm Ứng (Điện Thoại &amp; Tablet):
                        </span>
                        <p className="font-body-sm text-xs text-on-surface leading-relaxed">
                          Sử dụng cụm phím ◀ ▶ ở góc dưới bên trái để di chuyển, và phím ⬆ (Nhảy), [E] (Tương tác) ở góc dưới bên phải.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pause Action Buttons */}
                <div className="p-4 bg-surface-container-high/60 border-t border-primary/20 flex flex-col sm:flex-row items-center gap-2">
                  <button
                    onClick={() => setIsPaused(false)}
                    className="w-full sm:flex-1 py-2.5 px-4 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-sm font-bold shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">play_arrow</span>
                    <span>TIẾP TỤC CHƠI</span>
                  </button>

                  <button
                    onClick={() => setShowRestartConfirm(true)}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface font-label-md text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-lg">restart_alt</span>
                    <span>Chơi lại</span>
                  </button>

                  <button
                    onClick={() => setShowExitConfirm(true)}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-full bg-surface-container hover:bg-surface-container-highest text-primary font-label-md text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-lg">map</span>
                    <span>Về bản đồ</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* RESTART CONFIRMATION MODAL */}
          {showRestartConfirm && (
            <div className="fixed inset-0 z-50 bg-inverse-surface/75 backdrop-blur-md flex items-center justify-center p-4 select-none safe-p-top safe-p-bottom">
              <div className="bg-surface-container-lowest max-w-sm w-full rounded-3xl p-5 shadow-2xl border-2 border-primary flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-2xl">restart_alt</span>
                </div>
                <h3 className="font-headline-sm text-base text-on-surface font-bold">
                  Bắt đầu lại màn Dạ Dày?
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  Nhân vật Potabi sẽ được đưa về vị trí xuất phát ban đầu. Tiến trình tài khoản, EXP và kim cương của bạn sẽ được giữ nguyên an toàn.
                </p>
                <div className="grid grid-cols-2 gap-2 w-full pt-1">
                  <button
                    onClick={() => setShowRestartConfirm(false)}
                    className="py-2 px-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs font-bold transition-colors cursor-pointer"
                  >
                    HỦY BỎ
                  </button>
                  <button
                    onClick={handleRestartStage}
                    className="py-2 px-3 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    ĐỒNG Ý CHƠI LẠI
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EXIT TO MAP CONFIRMATION MODAL */}
          {showExitConfirm && (
            <div className="fixed inset-0 z-50 bg-inverse-surface/75 backdrop-blur-md flex items-center justify-center p-4 select-none safe-p-top safe-p-bottom">
              <div className="bg-surface-container-lowest max-w-sm w-full rounded-3xl p-5 shadow-2xl border-2 border-primary flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 rounded-full bg-surface-container text-primary flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-2xl">map</span>
                </div>
                <h3 className="font-headline-sm text-base text-on-surface font-bold">
                  Trở về Bản Đồ Hành Trình?
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  Mọi tiến trình câu đố và trạm đã hoàn thành đều được lưu tự động lên hệ thống. Bạn có thể quay lại tiếp tục bất cứ lúc nào!
                </p>
                <div className="grid grid-cols-2 gap-2 w-full pt-1">
                  <button
                    onClick={() => setShowExitConfirm(false)}
                    className="py-2 px-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs font-bold transition-colors cursor-pointer"
                  >
                    Ở LẠI CHƠI TIẾP
                  </button>
                  <button
                    onClick={() => {
                      setShowExitConfirm(false);
                      setIsPaused(false);
                      onExitToMap();
                    }}
                    className="py-2 px-3 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold transition-colors cursor-pointer shadow-sm"
                  >
                    VỀ BẢN ĐỒ
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Multi-Step Dialogue Modal for Potabi Companion */}
          {showPotabiModal && (
            <div className="fixed inset-0 z-50 bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-space-md">
              <div className="bg-surface-container-lowest max-w-lg w-full rounded-3xl p-space-lg shadow-2xl flex flex-col gap-space-md transform transition-all border-4 border-primary">
                <div className="flex items-start gap-space-md">
                  <div className="w-16 h-16 rounded-full bg-secondary-fixed p-1.5 flex-shrink-0">
                    <img
                      alt="Potabi Dialogue Portrait"
                      className="w-full h-full object-contain rounded-full"
                      referrerPolicy="no-referrer"
                      src={IMAGES.potabiBlueAvatar}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-headline-sm text-headline-sm text-primary">
                        Potabi đồng hành
                      </h3>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        Đoạn {potabiDialogueIdx + 1}/{POTABI_COMPANION_LINES.length}
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface mt-2 leading-relaxed">
                      {POTABI_COMPANION_LINES[potabiDialogueIdx]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-space-xs">
                  <button
                    onClick={() => setShowPotabiModal(false)}
                    className="px-space-md py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm cursor-pointer"
                  >
                    Đóng [ESC]
                  </button>
                  <button
                    onClick={() => {
                      if (potabiDialogueIdx < POTABI_COMPANION_LINES.length - 1) {
                        setPotabiDialogueIdx((i) => i + 1);
                      } else {
                        setShowPotabiModal(false);
                      }
                    }}
                    className="px-space-lg py-space-xs bg-primary text-on-primary rounded-full font-label-md text-label-md hover:bg-primary-container shadow-md cursor-pointer"
                  >
                    {potabiDialogueIdx < POTABI_COMPANION_LINES.length - 1
                      ? 'Tiếp theo ➔'
                      : 'Đã hiểu, thám hiểm tiếp!'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Multi-Step Dialogue Modal for NPC Enzyme Amylase */}
          {amylaseModalStep !== null && (
            <div className="fixed inset-0 z-50 bg-inverse-surface/65 backdrop-blur-sm flex items-center justify-center p-space-md">
              <div className="bg-surface-container-lowest max-w-lg w-full rounded-3xl p-space-lg shadow-2xl flex flex-col gap-space-md border-4 border-tertiary">
                <div className="flex items-start gap-space-md">
                  <div className="w-14 h-14 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-3xl">bubble_chart</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-headline-sm text-headline-sm text-tertiary">
                        {AMYLASE_NPC_DIALOGUE[amylaseModalStep].speaker}
                      </span>
                      <span className="font-label-sm text-label-sm bg-tertiary-fixed px-2 py-0.5 rounded-full text-on-tertiary-fixed">
                        {amylaseModalStep + 1}/{AMYLASE_NPC_DIALOGUE.length}
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface mt-2 leading-relaxed">
                      {AMYLASE_NPC_DIALOGUE[amylaseModalStep].text}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-space-sm">
                  <button
                    onClick={() => setAmylaseModalStep(null)}
                    className="px-space-md py-1.5 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm cursor-pointer"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => {
                      if (amylaseModalStep < AMYLASE_NPC_DIALOGUE.length - 1) {
                        setAmylaseModalStep(amylaseModalStep + 1);
                      } else {
                        setAmylaseInspected(true);
                        onAmylaseInspected?.();
                        setAmylaseModalStep(null);
                      }
                    }}
                    className="px-space-lg py-2 rounded-full bg-tertiary text-on-tertiary font-label-md text-label-md cursor-pointer shadow-md"
                  >
                    {amylaseModalStep < AMYLASE_NPC_DIALOGUE.length - 1
                      ? 'Nghe tiếp [Space]'
                      : 'Ghi vào Sổ tay Sinh học ✔'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Station Introduction Menu (Opened when pressing [E] near a station) */}
          {introStation && (
            <div className="fixed inset-0 z-50 bg-inverse-surface/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-space-md overflow-y-auto safe-p-top safe-p-bottom">
              <div className="bg-surface-container-lowest max-w-xl w-full rounded-3xl shadow-2xl border-4 border-primary overflow-hidden flex flex-col max-h-[90vh]">
                {/* A. Station Representative Artwork Banner (Optimized height for compact viewing) */}
                <div className="relative h-32 sm:h-40 w-full overflow-hidden bg-inverse-surface shrink-0">
                  <div
                    className="absolute inset-0 bg-no-repeat bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${introStation.image}')`,
                      ...introStation.imageCropStyle,
                    }}
                  ></div>
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={introStation.imageOverlayStyle}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/25 to-transparent pointer-events-none"></div>

                  {/* Top Badges inside Illustration */}
                  <div className="relative z-10 p-3 sm:p-space-md flex items-center justify-between gap-space-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-inverse-surface/85 backdrop-blur-md text-tertiary-fixed font-label-sm text-xs font-bold flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-sm">biotech</span>
                      <span>{introStation.organBadge}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      {completedStations.includes(introStation.id) ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-label-sm text-xs font-bold flex items-center gap-1 shadow-sm">
                          <span className="material-symbols-outlined text-xs">check_circle</span>
                          <span>Đã hoàn thành</span>
                        </span>
                      ) : stationProgressMap[introStation.id] ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-xs font-bold flex items-center gap-1 shadow-sm">
                          <span className="material-symbols-outlined text-xs">pending</span>
                          <span>Đang khám phá</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-xs font-bold flex items-center gap-1 shadow-sm">
                          <span className="material-symbols-outlined text-xs">explore</span>
                          <span>Trạm mới</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Potabi Explorer Emblem & Biological Parameters */}
                  <div className="absolute bottom-2 left-3 right-3 sm:left-space-md sm:right-space-md z-10 flex items-end justify-between gap-space-sm">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[11px] font-bold shadow-sm">
                        {introStation.pH}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-surface-container-lowest/90 text-on-surface font-label-sm text-[11px] font-semibold shadow-sm">
                        {introStation.enzyme}
                      </span>
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md p-1 shadow-md flex items-center justify-center shrink-0">
                      <img
                        alt="Potabi Station Guide"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                        src={IMAGES.potabiBlueAvatar}
                      />
                    </div>
                  </div>
                </div>

                {/* B, C, D. Station Title, Subtitle, Introduction & Experience Preview */}
                <div className="p-4 sm:p-5 flex flex-col gap-3 overflow-y-auto">
                  <div>
                    <h2 className="font-headline-md text-headline-md text-on-surface">
                      {introStation.title}
                    </h2>
                    <p className="font-body-md text-body-md text-primary font-semibold mt-0.5">
                      {introStation.subtitle}
                    </p>
                  </div>

                  {/* C. Station Biological Introduction */}
                  <div className="bg-surface-container-low rounded-2xl p-space-md border border-outline-variant/30">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="material-symbols-outlined text-primary text-base">
                        menu_book
                      </span>
                      <span className="font-label-md text-label-md text-primary uppercase tracking-wide">
                        Giới thiệu khu vực sinh học (Sinh học 8)
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">
                      {introStation.description}
                    </p>
                  </div>

                  {/* D. Experience Preview */}
                  <div className="bg-secondary-fixed/40 rounded-2xl p-space-md flex items-start gap-space-sm">
                    <div className="w-9 h-9 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-lg">compass_calibration</span>
                    </div>
                    <div className="flex-1">
                      <span className="font-label-md text-label-md text-on-secondary-fixed block">
                        Gợi mở trải nghiệm tại trạm
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed">
                        {introStation.experiencePreview}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons: QUAY LẠI & TIẾP TỤC KHÁM PHÁ */}
                  <div className="pt-space-xs flex flex-col-reverse sm:flex-row items-center justify-between gap-space-sm">
                    <button
                      onClick={() => setIntroStation(null)}
                      className="w-full sm:w-auto px-space-lg py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">arrow_back</span>
                      <span>QUAY LẠI</span>
                      <span className="text-xs text-on-surface-variant ml-1">[ESC]</span>
                    </button>

                    <button
                      onClick={() => startStationGameplayFromIntro(introStation)}
                      className="w-full sm:w-auto px-space-xl py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>TIẾP TỤC KHÁM PHÁ</span>
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Station Modal: Step-by-step NPC Dialogue -> Sinh học 8 Quiz with Hints & Feedback */}
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
                    onClick={closeActiveStationGameplay}
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">close</span>
                  </button>
                </div>

                {stationPhase === 'dialogue' ? (
                  <div className="flex flex-col gap-space-md">
                    <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-low p-space-md rounded-2xl">
                      {activeStation.description}
                    </p>

                    <div className="bg-surface-container p-space-md rounded-2xl flex items-start gap-space-md border-2 border-primary/20">
                      <img
                        alt="Potabi"
                        className="w-14 h-14 rounded-full object-contain bg-surface-container-lowest p-1 shrink-0"
                        referrerPolicy="no-referrer"
                        src={IMAGES.potabiBlueAvatar}
                      />
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-label-md text-label-md text-primary">
                            Hội thoại dẫn nhập Trạm ({stationDialogueIdx + 1}/
                            {activeStation.npcDialogue.length})
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            Bước {stationDialogueIdx + 1}
                          </span>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                          {activeStation.npcDialogue[stationDialogueIdx]}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-space-xs">
                      <button
                        onClick={() => setStationPhase('quiz')}
                        className="px-space-md py-2 rounded-full bg-surface-container text-primary font-label-md text-label-md cursor-pointer"
                      >
                        Vào thẳng câu hỏi
                      </button>
                      <button
                        onClick={() => {
                          if (stationDialogueIdx < activeStation.npcDialogue.length - 1) {
                            setStationDialogueIdx((i) => i + 1);
                          } else {
                            setStationPhase('quiz');
                          }
                        }}
                        className="px-space-lg py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-md cursor-pointer"
                      >
                        {stationDialogueIdx < activeStation.npcDialogue.length - 1
                          ? 'Đoạn tiếp theo ➔'
                          : 'Bắt đầu Câu hỏi Sinh học 8 ➔'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-space-sm">
                    <div className="flex items-center justify-between">
                      <p className="font-label-md text-label-md text-on-surface">
                        {activeStation.questions[questionIdx].question}
                      </p>
                      <button
                        onClick={() => setShowHint(!showHint)}
                        className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        <span className="material-symbols-outlined text-xs">lightbulb</span>
                        <span>{showHint ? 'Ẩn gợi ý' : 'Gợi ý'}</span>
                      </button>
                    </div>

                    {showHint && (
                      <div className="bg-tertiary-fixed/40 border border-tertiary-fixed-dim text-on-tertiary-fixed px-3.5 py-2 rounded-2xl font-body-sm text-body-sm">
                        {activeStation.questions[questionIdx].hint}
                      </div>
                    )}

                    <div className="flex flex-col gap-space-xs">
                      {activeStation.questions[questionIdx].options.map((opt, idx) => {
                        const isSelected = selectedAnswer === idx;
                        const isCorrect =
                          idx === activeStation.questions[questionIdx].correctIdx;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectOption(idx)}
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

                    {feedbackState !== 'idle' && (
                      <div
                        className={`p-3 rounded-2xl font-body-sm text-body-sm flex items-start gap-2 ${
                          feedbackState === 'correct'
                            ? 'bg-emerald-100/80 text-emerald-950 border border-emerald-500'
                            : 'bg-error-container text-on-error-container border border-error'
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg shrink-0">
                          {feedbackState === 'correct' ? 'verified' : 'help'}
                        </span>
                        <span>
                          {feedbackState === 'correct'
                            ? activeStation.questions[questionIdx].correctExplanation
                            : activeStation.questions[questionIdx].wrongExplanation}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-space-sm pt-space-xs">
                      <button
                        onClick={closeActiveStationGameplay}
                        className="px-space-md py-2 rounded-full bg-surface-container text-on-surface font-label-md text-label-md cursor-pointer"
                      >
                        Để sau
                      </button>
                      <button
                        disabled={feedbackState !== 'correct'}
                        onClick={handleAdvanceQuestionOrComplete}
                        className={`px-space-lg py-2 rounded-full font-label-md text-label-md transition-all ${
                          feedbackState === 'correct'
                            ? 'bg-primary text-on-primary shadow-md cursor-pointer'
                            : 'bg-surface-container-highest text-outline cursor-not-allowed'
                        }`}
                      >
                        {questionIdx < activeStation.questions.length - 1
                          ? 'Câu hỏi tiếp theo ➔'
                          : 'Thu thập Tiêu bản (+250 EXP, +15 KC)'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stage Victory Modal when all 3 Stations are Completed */}
          {showVictoryBanner && (
            <div className="fixed inset-0 z-50 bg-inverse-surface/75 backdrop-blur-md flex items-center justify-center p-space-md">
              <div className="bg-surface-container-lowest max-w-md w-full rounded-3xl p-space-lg shadow-2xl border-4 border-tertiary-fixed-dim text-center flex flex-col items-center gap-space-md">
                <div className="w-16 h-16 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-4xl">emoji_events</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">
                  Hoàn Thành Màn 1: Hệ Tiêu Hóa!
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Chúc mừng Nhà Thám Hiểm! Bạn đã chinh phục đủ 3 Trạm kiến thức Dạ Dày (Sinh học 8)
                  và mở khóa chính thức <strong className="text-primary">Màn 2: Hệ Tuần Hoàn</strong>{' '}
                  trên Bản Đồ Hành Trình!
                </p>
                <div className="flex gap-space-sm w-full">
                  <button
                    onClick={() => setShowVictoryBanner(false)}
                    className="flex-1 py-2.5 rounded-full bg-surface-container text-on-surface font-label-md text-label-md cursor-pointer"
                  >
                    Ở lại khám phá
                  </button>
                  <button
                    onClick={() => {
                      setShowVictoryBanner(false);
                      onStageVictory();
                    }}
                    className="flex-1 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md shadow-md cursor-pointer"
                  >
                    Về Bản Đồ ➔
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
