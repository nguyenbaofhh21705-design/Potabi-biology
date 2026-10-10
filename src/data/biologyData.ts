export const IMAGES = {
  potabiAvatar:
    'https://lh3.googleusercontent.com/aida/AEtjO1UrqF9CCRYVdWfHu7_nV2o9aWg9beVhKOr--eZb5U0D5gZ8htnrH6WNY7CNpfmmq-VU5v9h3S_4ZvFhoJNS5370S0ZjAz_h-qVcI558BtvXXtPinAsPgU2zYKjMubi8q4L_WabhPPOTAK9oMRuSTc6DMMzv_AlYzR2NgG_4pCzHzSScdNKjjelQveTCgEP0eAdtF38Ys-ZFUTl063mGkYKzAHeP7EhyexTx2kQs_Gc4GdJ1bBahW5izBqM',
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
    title: 'Hệ Tiêu Hóa: Cỗ Máy Xử Lý Năng Lượng',
    levelRange: 'Cấp độ 10-12',
    difficulty: 'Độ khó: Dễ',
    duration: '12 phút',
    caption: 'Hang động Dạ dày & Thung lũng Nhung mao',
    goal: 'Khám phá sự phân giải thức ăn từ dạ dày qua ruột non và cơ chế hấp thu chất dinh dưỡng vào máu.',
    exp: 250,
    diamonds: 15,
    quizzesCount: 3,
    specimensCount: 2,
    thumbnail: IMAGES.stomachStageBg,
    unlocked: true,
    progress: 75,
    theoryNotes: {
      heading: 'Cơ chế Tiêu hóa Cơ học & Hóa học',
      points: [
        'Khoang miệng: Tuyến nước bọt tiết enzym Amylase biến đổi một phần tinh bột chín thành đường maltose (pH ~ 7.2).',
        'Dạ dày: Cơ thành dạ dày co bóp nghiền nhuyễn thức ăn; dịch vị chứa HCl (pH 1.5 - 2.5) hoạt hóa Pepsinogen thành Pepsin phân giải chuỗi Protein.',
        'Ruột non: Hệ thống lông ruột và vi nhung mao tăng diện tích hấp thu chất dinh dưỡng gấp hàng trăm lần.',
      ],
      formulaOrKey: 'Tinh bột + Amylase → Đường Maltose | Protein + Pepsin (HCl) → Chuỗi Polypeptide ngắn',
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
    unlocked: true,
    newlyUnlocked: true,
    theoryNotes: {
      heading: 'Cấu tạo Tim & Vòng Tuần Hoàn Kép',
      points: [
        'Tim người có 4 ngăn: Tâm nhĩ phải, Tâm thất phải (chứa máu đỏ thẫm giàu CO2) và Tâm nhĩ trái, Tâm thất trái (chứa máu đỏ tươi giàu O2).',
        'Vòng tuần hoàn nhỏ: Đưa máu từ Tâm thất phải lên Phổi để thải CO2 và nhận O2, rồi trở về Tâm nhĩ trái.',
        'Vòng tuần hoàn lớn: Đưa máu giàu O2 từ Tâm thất trái qua Động mạch chủ đi nuôi khắp các mô và tế bào.',
      ],
      formulaOrKey: 'Chu kỳ tim = 0.8s (Pha nhĩ co 0.1s → Pha thất co 0.3s → Pha dãn chung 0.4s)',
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
    quizzesCount: 4,
    specimensCount: 1,
    thumbnail: IMAGES.cutsceneToastBg,
    unlocked: true,
    theoryNotes: {
      heading: 'Sự Khuếch Tán Khí tại Phế Nang',
      points: [
        'Phổi được cấu tạo từ khoảng 700 - 800 triệu phế nang bao bọc bởi mạng lưới mao mạch máu dày đặc.',
        'Trao đổi khí diễn ra theo cơ chế khuếch tán từ nơi có phân áp cao sang nơi có phân áp thấp.',
        'Hemoglobin (Hb) trong hồng cầu kết hợp thuận nghịch với O2 tạo thành Oxyhemoglobin (HbO2) có màu đỏ tươi.',
      ],
      formulaOrKey: 'Hb + O2 ⇄ HbO2 (Tại phổi: chiều thuận; Tại mô tế bào: chiều nghịch)',
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
    goal: 'Mở khóa ở Cấp độ 15 để khám phá cách nơ-ron truyền tín hiệu điện hóa siêu tốc.',
    exp: 400,
    diamonds: 35,
    quizzesCount: 5,
    specimensCount: 2,
    thumbnail: IMAGES.mapBg,
    unlocked: false,
    theoryNotes: {
      heading: 'Cấu tạo Nơ-ron & Cung Phản Xạ',
      points: [
        'Mỗi nơ-ron gồm thân chứa nhân, các sợi nhánh tiếp nhận kích thích và sợi trục truyền xung thần kinh.',
        'Một cung phản xạ gồm 5 khâu: Cơ quan thụ cảm → Nơ-ron hướng tâm → Trung ương thần kinh → Nơ-ron ly tâm → Cơ quan phản ứng.',
      ],
      formulaOrKey: 'Tốc độ dẫn truyền xung thần kinh trên sợi có bao Myelin đạt tới 100 - 120 m/s',
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
    theoryNotes: {
      heading: 'Hệ Cơ - Xương - Khớp',
      points: [
        'Xương có tính bền chắc nhờ muối khoáng (Canxi) và tính đàn hồi nhờ chất cốt giao (Collagen).',
        'Tế bào cơ vân co rút khi các tơ cơ mảnh (Actin) trượt sâu vào vùng phân bố của tơ cơ dày (Myosin) dưới tác dụng của năng lượng ATP.',
      ],
      formulaOrKey: 'Chất cốt giao (mềm dẻo) + Muối khoáng Canxi (vững chắc) = Độ bền khung xương',
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
  stainColor?: string;
}

export const NOTEBOOK_ENTRIES: NotebookEntry[] = [
  {
    id: 'hong-cau',
    title: 'Hồng Cầu (Erythrocyte)',
    category: 'Tế Bào',
    unlocked: true,
    summary: 'Tế bào máu hình đĩa lõm hai mặt, không có nhân, chuyên chở O2 và CO2.',
    detail: 'Hình dạng đĩa lõm hai mặt giúp tăng diện tích tiếp xúc với khí O2 và giúp hồng cầu dễ dàng uốn biến dạng khi đi qua các mao mạch siêu nhỏ.',
  },
  {
    id: 'bach-cau',
    title: 'Bạch Cầu (Leukocyte)',
    category: 'Tế Bào',
    unlocked: true,
    summary: 'Chiến binh bảo vệ cơ thể thông qua thực bào và tiết kháng thể.',
    detail: 'Bạch cầu có khả năng xuyên mạch và tạo chân giả bắt nuốt vi khuẩn xâm nhập (thực bào), đồng thời tế bào Lympho B tiết kháng thể vô hiệu hóa kháng nguyên.',
  },
  {
    id: 'tieu-cau',
    title: 'Tiểu Cầu (Thrombocyte)',
    category: 'Tế Bào',
    unlocked: true,
    summary: 'Mảnh tế bào chất tham gia giải phóng enzym giúp đông máu bảo vệ vết thương.',
    detail: 'Khi chạm vào vết rách thành mạch, tiểu cầu vỡ ra giải phóng enzym tạo tơ máu (fibrin) ôm giữ các tế bào máu thành cục máu đông.',
  },
  {
    id: 'vay-hanh',
    title: 'Tế Bào Biểu Bì Vảy Hành',
    category: 'Tế Bào',
    unlocked: true,
    summary: 'Các khoang tế bào thực vật xếp sát nhau như viên gạch với thành xenlulozơ rõ nét.',
    detail: 'Khi nhuộm bằng dung dịch Iốt (Lugol) hoặc Xanh Methylene, nhân tế bào và vách tế bào hiện lên rất rõ dưới kính hiển vi quang học ở độ phóng đại 40x - 100x.',
  },
  {
    id: 'amylase',
    title: 'Enzym Amylase Nước Bọt',
    category: 'Enzym & Hoạt Chất',
    unlocked: true,
    summary: 'Xúc tác phân giải tinh bột chín thành đường đôi Maltose ngay tại khoang miệng.',
    detail: 'Hoạt động tốt nhất ở nhiệt độ 37°C và môi trường pH gần trung tính (pH ~ 6.8 - 7.2). Bị bất hoạt khi xuống môi trường axit mạnh của dạ dày.',
  },
  {
    id: 'pepsin',
    title: 'Enzym Pepsin & Axit HCl',
    category: 'Enzym & Hoạt Chất',
    unlocked: true,
    summary: 'Cặp đôi dịch vị dạ dày giúp cắt nhỏ chuỗi protein dài thành các đoạn ngắn.',
    detail: 'Axit HCl (pH 1.5 - 2.5) vừa tiêu diệt vi khuẩn theo thức ăn, vừa kích hoạt Pepsinogen thành Pepsin hoạt động.',
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
    roleBonus: '+15% Kháng axit dạ dày & Mở khóa góc nhìn Y khoa',
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
    roleBonus: '+20% Tốc độ di chuyển trong Mao mạch',
    description: 'Lớp màng sinh học trong suốt giúp Potabi trượt êm qua các van tim và thành mao mạch hẹp.',
    rarity: 'Hiếm',
    priceDiamonds: 90,
    owned: true,
    badgeIcon: 'water_drop',
    accentColor: '#0284c7',
  },
  {
    id: 'kinh-hien-vi-quang',
    name: 'Kính Soi Quang Phổ Lục Lạp',
    roleBonus: 'Tự động phát hiện Mẫu vật ẩn trên bản đồ',
    description: 'Thấu kính sinh học lấy cảm hứng từ tế bào thực vật giúp nhận diện nhanh cấu trúc bào quan.',
    rarity: 'Vàng',
    priceDiamonds: 150,
    owned: false,
    badgeIcon: 'biotech',
    accentColor: '#059669',
  },
];
