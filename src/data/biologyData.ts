export const IMAGES = {
  potabiAvatar: '/potabi-yellow.svg',
  potabiBlueAvatar: '/potabi-blue.svg',
  mapBg:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC3kHFNTAVlydnTL6Q8iueM7V9-m2c3mpOxiATDYxDGk_PXFo4NnERyt-Bzy6cWXjVhEANUTdX4Ew_fNqSwztATpzT4Iku7DB9QzY3eyx740WFNI3lLUd09Se38XOfWeWZaCaIniHU3QcqzRmaC63X1GV8JEH4DEubD4W9TjAiC1-QV1awFfw19jknJjaTzmfNadIX3m4vDHDTOaLhnXMY5MW9XPE03QgdG9--GoCSDsJtaP5IM33_z',
  heartThumbnail:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB6twxe_0Y6jt1jDt6rwQSpkLZm498WIOAZsjzJsek-xWMU9sN1Ol9KWGU-JUOefgen8r549jd5nQHzMnilq-00aoTVtwg7I5hg1wF_3zO_faJFWGhl8Nbe4my6if6VuoXeZc7vL-1ZHQSy9kuTIh40xGknwenAPMnDPA7Qd2OV8oCRz0W0CGLRu0IP3a75EfwQaaAbFlnRmbafuOCtodGQsDMcQefPupCSSCyemVNJ9Z4srud6eo3B',
  cutsceneToastBg:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBJMMb9r7eFpL9d1DqL85npJVdVpfYaJZD6eQTOV2qCyhi-MTBk23EZRIezrNZYAr8yC_OevAWS0uEq2_XR4yqwsSdgZiGIybQNpwBwMopR9fqatZHq2IXPHNJRNvFVcgpEBGMn7GuQnd63dLGR83nocCgIU7FZhCV91-HKZcM8BjD47IKWCPybZJIxXE2C9fAj9rhCeSRtFqq7BTXrWy7D-AUd9KwNlPbesU0xnO1rXaPqiA4aFjDp',
  stomachStageBg:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAhonOBI57jyRkdq49KDH2QVG5KNdxPAgV_KfYyT_jqmU5i_AslmCfdRHmVM_a8SKKBkss0nlDWPKQAB80jaqSKShQk5ijoujL4WsbdD0aTSxeGgYyWYO0L5hoNxC1BVOZodqOJH0dlMXRzaOGHDjvVnnm-gkL3GtmdJc6Ff7tbO9_x12Zoraod_Pei7Fnkuv_Wpq736D94VB473WYLHatTw59N_VSC_6u0ToJZU92a99L-id2zDSs0',
};

export interface StageInfo {
  id: string;
  stageNumber: string;
  name: string;
  subtitle: string;
  title: string;
  levelRange: string;
  difficulty: string;
  duration: string;
  caption: string;
  goal: string;
  exp: number;
  diamonds: number;
  quizzesCount: number;
  specimensCount: number;
  thumbnail: string;
  unlocked: boolean;
  requiredStageId?: string;
  requiredLevel?: number;
  progress?: number;
  newlyUnlocked?: boolean;
  theoryNotes: {
    heading: string;
    points: string[];
    formulaOrKey: string;
  };
}

export const STAGES: Record<string, StageInfo> = {
  'tieu-hoa': {
    id: 'tieu-hoa',
    stageNumber: 'Màn 1',
    name: 'Màn 1: Hệ Tiêu Hóa',
    subtitle: 'Dạ Dày & Ruột Non',
    title: 'Hệ Tiêu Hóa: Cỗ Máy Xử Lý Năng Lượng (Sinh học 8)',
    levelRange: 'Cấp độ 10-12',
    difficulty: 'Độ khó: Dễ',
    duration: '12 phút',
    caption: 'Hang động Dạ dày & Thung lũng Nhung mao',
    goal: 'Khám phá sự biến đổi lý học và hóa học của thức ăn tại Khoang miệng, Thực quản, Dạ dày và Ruột non theo chương trình Sinh học 8.',
    exp: 250,
    diamonds: 15,
    quizzesCount: 3,
    specimensCount: 4,
    thumbnail: IMAGES.stomachStageBg,
    unlocked: true,
    progress: 75,
    theoryNotes: {
      heading: 'Tiêu Hóa Ở Khoang Miệng & Dạ Dày (Sinh học 8)',
      points: [
        'Khoang miệng: Biến đổi lý học (răng nhai, lưỡi đảo trộn) và hóa học (enzym Amylase trong nước bọt biến đổi một phần tinh bột chín thành đường đôi Maltose ở pH ~ 7.2, 37°C).',
        'Dạ dày: Cấu tạo 3 lớp cơ trơn (cơ dọc, cơ vòng, cơ chéo) co bóp nghiền thức ăn; tuyến vị tiết HCl (pH 1.5 - 2.5) hoạt hóa Pepsinogen thành Pepsin cắt chuỗi Protein dài thành chuỗi ngắn (3 - 10 axit amin).',
        'Bảo vệ niêm mạc: Chất nhầy (Mucin) phủ kín bề mặt niêm mạc dạ dày ngăn HCl và Pepsin tự phân hủy thành dạ dày.',
      ],
      formulaOrKey:
        'Tinh bột chín --(Amylase, pH 7.2)--> Đường Maltose | Protein --(Pepsin + HCl, pH 1.5-2.5)--> Polypeptide ngắn',
    },
  },
  'tuan-hoan': {
    id: 'tuan-hoan',
    stageNumber: 'Màn 2',
    name: 'Hệ Tuần Hoàn',
    subtitle: 'Buồng Tim & Dòng Máu',
    title: 'Hệ Tuần Hoàn Diệu Kỳ (Vòng Tuần Hoàn Máu)',
    levelRange: 'Cấp độ 12-14',
    difficulty: 'Độ khó: Vừa',
    duration: '15 phút',
    caption: 'Cao tốc Mao mạch & Buồng tim co bóp',
    goal: 'Tìm hiểu cách tâm thất và tâm nhĩ phối hợp co bóp để đẩy máu giàu Oxy đi khắp 60 nghìn tỷ tế bào của cơ thể!',
    exp: 300,
    diamonds: 20,
    quizzesCount: 3,
    specimensCount: 1,
    thumbnail: IMAGES.heartThumbnail,
    unlocked: false,
    requiredStageId: 'tieu-hoa',
    newlyUnlocked: true,
    theoryNotes: {
      heading: 'Cấu tạo Tim & Vòng Tuần Hoàn Kép (Sinh học 8)',
      points: [
        'Tim người có 4 ngăn: Tâm nhĩ phải, Tâm thất phải (chứa máu đỏ thẫm giàu CO2) và Tâm nhĩ trái, Tâm thất trái (chứa máu đỏ tươi giàu O2). Van nhĩ-thất và van tổ chim giúp máu chảy một chiều.',
        'Vòng tuần hoàn nhỏ: Tâm thất phải → Động mạch phổi → Mao mạch phổi (trao đổi khí) → Tĩnh mạch phổi → Tâm nhĩ trái.',
        'Vòng tuần hoàn lớn: Tâm thất trái → Động mạch chủ → Mao mạch các cơ quan (trao đổi chất & khí) → Tĩnh mạch chủ → Tâm nhĩ phải.',
      ],
      formulaOrKey:
        'Chu kỳ tim = 0.8s (Pha nhĩ co 0.1s → Pha thất co 0.3s → Pha dãn chung 0.4s, nhịp tim ~ 75 lần/phút)',
    },
  },
  'ho-hap': {
    id: 'ho-hap',
    stageNumber: 'Màn 3',
    name: 'Hệ Hô Hấp',
    subtitle: 'Phế Nang & Oxy',
    title: 'Hệ Hô Hấp: Lá Phổi & Sự Trao Đổi Khí',
    levelRange: 'Cấp độ 13-15',
    difficulty: 'Độ khó: Vừa',
    duration: '15 phút',
    caption: 'Mạng lưới Phế nang & Khuếch tán Oxy',
    goal: 'Theo dõi hành trình của phân tử Oxy qua khí quản đến phế nang và đi vào hồng cầu.',
    exp: 320,
    diamonds: 25,
    quizzesCount: 3,
    specimensCount: 1,
    thumbnail: IMAGES.cutsceneToastBg,
    unlocked: false,
    requiredStageId: 'tuan-hoan',
    theoryNotes: {
      heading: 'Sự Khuếch Tán Khí tại Phế Nang & Tế Bào (Sinh học 8)',
      points: [
        'Phổi có khoảng 700 - 800 triệu phế nang tạo diện tích bề mặt trao đổi khí lên tới 70 - 80 m².',
        'Tại phổi: O2 khuếch tán từ phế nang vào máu mao mạch; CO2 khuếch tán từ máu ra phế nang.',
        'Tại tế bào: O2 khuếch tán từ máu vào dịch mô và tế bào để thực hiện hô hấp tế bào tạo năng lượng ATP; CO2 đi từ tế bào vào máu.',
      ],
      formulaOrKey:
        'Hb + O2 ⇄ HbO2 (Máu đỏ tươi ở động mạch phổi về tim) | Hb + CO2 ⇄ HbCO2 (Máu đỏ thẫm)',
    },
  },
  'than-kinh': {
    id: 'than-kinh',
    stageNumber: 'Màn 4',
    name: 'Màn 4: Hệ Thần Kinh',
    subtitle: 'Xung Điện Não Bộ',
    title: 'Hệ Thần Kinh: Mạng Lưới Xung Điện & Phản Xạ',
    levelRange: 'Cấp độ 15',
    difficulty: 'Độ khó: Khó',
    duration: '20 phút',
    caption: 'Cung phản xạ & Synapse thần kinh',
    goal: 'Mở khóa ở Cấp độ 15 (sau khi hoàn thành Màn 3) để khám phá cách nơ-ron truyền tín hiệu điện hóa.',
    exp: 400,
    diamonds: 35,
    quizzesCount: 5,
    specimensCount: 2,
    thumbnail: IMAGES.mapBg,
    unlocked: false,
    requiredStageId: 'ho-hap',
    requiredLevel: 15,
    theoryNotes: {
      heading: 'Cấu tạo Nơ-ron & Cung Phản Xạ (Sinh học 8)',
      points: [
        'Đơn vị cấu tạo của hệ thần kinh là Nơ-ron gồm: Thân chứa nhân, các sợi nhánh (hướng tâm) và 1 sợi trục (ly tâm, thường có bao Myelin).',
        'Cung phản xạ gồm 5 thành phần: Cơ quan thụ cảm → Nơ-ron hướng tâm → Nơ-ron trung gian (Trung ương TK) → Nơ-ron li tâm → Cơ quan phản ứng.',
      ],
      formulaOrKey: 'Chức năng cơ bản của Nơ-ron: Cảm ứng (phát sinh xung thần kinh) và Dẫn truyền xung thần kinh.',
    },
  },
  'van-dong': {
    id: 'van-dong',
    stageNumber: 'Màn 5',
    name: 'Màn 5: Hệ Vận Động',
    subtitle: 'Khung Xương & Cơ',
    title: 'Hệ Vận Động: Đòn Bẩy Cơ Học Sinh Học',
    levelRange: 'Cấp độ 18',
    difficulty: 'Độ khó: Khó',
    duration: '18 phút',
    caption: 'Cấu trúc Xương xốp & Sự co cơ vân',
    goal: 'Mở khóa ở Cấp độ 18 để tìm hiểu sự phối hợp giữa xương, khớp và bắp cơ.',
    exp: 450,
    diamonds: 40,
    quizzesCount: 4,
    specimensCount: 2,
    thumbnail: IMAGES.mapBg,
    unlocked: false,
    requiredStageId: 'than-kinh',
    requiredLevel: 18,
    theoryNotes: {
      heading: 'Hệ Cơ - Xương - Khớp (Sinh học 8)',
      points: [
        'Thành phần hóa học của xương: Chất hữu cơ (cốt giao) đảm bảo tính đàn hồi/mềm dẻo; Chất vô cơ (muối canxi) đảm bảo tính bền chắc.',
        'Xương to ra về bề ngang nhờ các tế bào màng xương phân chia; xương dài ra nhờ sự phân chia của các tế bào ở sụn tăng trưởng.',
      ],
      formulaOrKey: 'Chất cốt giao (mềm dẻo) + Muối khoáng Canxi (rắn chắc) = Khung xương chịu lực tối ưu',
    },
  },
};

export interface NotebookEntry {
  id: string;
  title: string;
  category: 'Tế Bào' | 'Hệ Cơ Quan' | 'Enzym & Hoạt Chất';
  unlocked: boolean;
  summary: string;
  detail: string;
  specimenKey?: string;
}

export const NOTEBOOK_ENTRIES: NotebookEntry[] = [
  {
    id: 'hong-cau',
    title: 'Hồng Cầu (Erythrocyte)',
    category: 'Tế Bào',
    unlocked: true,
    summary: 'Tế bào máu hình đĩa lõm hai mặt, không có nhân, chuyên chở O2 và CO2.',
    detail:
      'Hình dạng đĩa lõm hai mặt giúp tăng diện tích tiếp xúc với khí O2 và giúp hồng cầu dễ dàng uốn biến dạng khi đi qua các mao mạch siêu nhỏ. Mỗi ml máu chứa khoảng 4,2 - 4,5 triệu hồng cầu.',
  },
  {
    id: 'bach-cau',
    title: 'Bạch Cầu (Leukocyte)',
    category: 'Tế Bào',
    unlocked: true,
    summary: 'Chiến binh bảo vệ cơ thể thông qua 3 hàng rào: thực bào, tiết kháng thể và phá hủy tế bào nhiễm.',
    detail:
      'Bạch cầu trung tính và đại thực bào bắt nuốt vi khuẩn; Tế bào B tiết kháng thể vô hiệu hóa kháng nguyên; Tế bào T tiết protein đặc hiệu phá hủy tế bào đã nhiễm bệnh.',
  },
  {
    id: 'tieu-cau',
    title: 'Tiểu Cầu (Thrombocyte)',
    category: 'Tế Bào',
    unlocked: true,
    summary: 'Mảnh tế bào chất tham gia giải phóng enzym giúp đông máu bảo vệ vết thương.',
    detail:
      'Khi chạm vào vết rách thành mạch, tiểu cầu vỡ ra giải phóng enzym biến chất sinh tơ máu (Fibrinogen) trong huyết tương thành mạng lưới tơ máu (Fibrin) giữ tế bào máu tạo cục máu đông.',
  },
  {
    id: 'vay-hanh',
    title: 'Tế Bào Biểu Bì Vảy Hành',
    category: 'Tế Bào',
    unlocked: true,
    summary: 'Các khoang tế bào xếp sát nhau với vách tế bào, màng sinh chất, chất tế bào và nhân rõ nét.',
    detail:
      'Khi nhuộm bằng dung dịch Iốt (Lugol) hoặc Xanh Methylene, nhân tế bào và cấu trúc màng hiện lên rõ rệt dưới kính hiển vi quang học ở độ phóng đại 40x - 100x.',
  },
  {
    id: 'amylase',
    title: 'Enzym Amylase Nước Bọt',
    category: 'Enzym & Hoạt Chất',
    unlocked: true,
    summary: 'Xúc tác biến đổi một phần tinh bột chín thành đường đôi Maltose ngay tại khoang miệng.',
    detail:
      'Hoạt động tốt nhất ở nhiệt độ 37°C và môi trường pH gần trung tính (pH ~ 7.2). Khi nuốt xuống dạ dày (pH 1.5 - 2.5), Amylase bị bất hoạt bởi môi trường axit mạnh.',
  },
  {
    id: 'pepsin',
    title: 'Enzym Pepsin & Axit HCl',
    category: 'Enzym & Hoạt Chất',
    unlocked: false,
    specimenKey: 'tram-2',
    summary: 'Cặp đôi dịch vị dạ dày giúp cắt nhỏ chuỗi protein dài thành các chuỗi ngắn 3 - 10 axit amin.',
    detail:
      'Axit HCl (pH 1.5 - 2.5) do tế bào viền tiết ra giúp tiêu diệt vi khuẩn và hoạt hóa Pepsinogen (do tế bào chính tiết ra) thành enzym Pepsin hoạt động.',
  },
  {
    id: 'co-da-day',
    title: 'Ba Lớp Cơ Trơn Thành Dạ Dày',
    category: 'Hệ Cơ Quan',
    unlocked: false,
    specimenKey: 'tram-1',
    summary: 'Gồm cơ dọc (ngoài), cơ vòng (giữa) và cơ chéo (trong) tạo lực co bóp cực khỏe.',
    detail:
      'Sự phối hợp co rút của 3 lớp cơ trơn giúp dạ dày nhào trộn kỹ thức ăn với dịch vị, biến thức ăn thành khối nhuyễn gọi là vị trấp trước khi đẩy xuống tá tràng.',
  },
  {
    id: 'chat-nhay-mucin',
    title: 'Màng Chất Nhầy Mucin Niêm Mạc',
    category: 'Enzym & Hoạt Chất',
    unlocked: false,
    specimenKey: 'tram-3',
    summary: 'Lớp chất nhầy kiềm tính phủ kín niêm mạc giúp dạ dày không bị tự tiêu hủy.',
    detail:
      'Nhờ lớp chất nhầy dày khoảng 1mm bao phủ bề mặt niêm mạc, các tế bào protein của chính thành dạ dày được bảo vệ hoàn toàn khỏi sự ăn mòn của HCl và Pepsin.',
  },
];

export interface OutfitItem {
  id: string;
  name: string;
  roleBonus: string;
  description: string;
  rarity: 'Cơ bản' | 'Hiếm' | 'Vàng';
  priceDiamonds: number;
  owned: boolean;
  badgeIcon: string;
  accentColor: string;
}

export const OUTFITS: OutfitItem[] = [
  {
    id: 'crown-default',
    name: 'Vương Miện Nhà Thám Hiểm Nhí',
    roleBonus: '+5% EXP Màn chơi Cốt truyện',
    description: 'Trang phục mặc định của Potabi khi mới bước chân vào Học viện Sinh học 2D.',
    rarity: 'Cơ bản',
    priceDiamonds: 0,
    owned: true,
    badgeIcon: 'workspace_premium',
    accentColor: '#f9bc4e',
  },
  {
    id: 'blouse-bac-si',
    name: 'Áo Blouse Bác Sĩ Vi Sinh',
    roleBonus: 'Kháng 50% sát thương axit dạ dày & Mở khóa gợi ý Y khoa',
    description: 'Áo choàng trắng vô trùng giúp Potabi an toàn khi lặn vào dịch vị dạ dày và dòng máu.',
    rarity: 'Vàng',
    priceDiamonds: 120,
    owned: true,
    badgeIcon: 'medical_services',
    accentColor: '#804d59',
  },
  {
    id: 'giot-nuoc-nano',
    name: 'Giáp Giọt Nước Thẩm Thấu',
    roleBonus: '+25% Tốc độ di chuyển & Nhảy cao hơn trong màn 2D',
    description: 'Lớp màng sinh học trong suốt giúp Potabi trượt êm qua các thành niêm mạc và mao mạch hẹp.',
    rarity: 'Hiếm',
    priceDiamonds: 90,
    owned: true,
    badgeIcon: 'water_drop',
    accentColor: '#0284c7',
  },
  {
    id: 'kinh-hien-vi-quang',
    name: 'Kính Soi Quang Phổ Lục Lạp',
    roleBonus: 'Hiển thị phạm vi tương tác Trạm & Gợi ý Sinh học 8',
    description: 'Thấu kính sinh học lấy cảm hứng từ tế bào thực vật giúp nhận diện nhanh cấu trúc cơ quan.',
    rarity: 'Vàng',
    priceDiamonds: 150,
    owned: false,
    badgeIcon: 'biotech',
    accentColor: '#059669',
  },
];
