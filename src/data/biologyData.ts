export const IMAGES = {
  potabiAvatar: '/potabi-blue.svg',
  potabiBlueAvatar: '/potabi-blue.svg',
  mapBg:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC3kHFNTAVlydnTL6Q8iueM7V9-m2c3mpOxiATDYxDGk_PXFo4NnERyt-Bzy6cWXjVhEANUTdX4Ew_fNqSwztATpzT4Iku7DB9QzY3eyx740WFNI3lLUd09Se38XOfWeWZaCaIniHU3QcqzRmaC63X1GV8JEH4DEubD4W9TjAiC1-QV1awFfw19jknJjaTzmfNadIX3m4vDHDTOaLhnXMY5MW9XPE03QgdG9--GoCSDsJtaP5IM33_z',
  heartThumbnail: '/stages/tuan-hoan-bg.jpg',
  cutsceneToastBg: '/stages/ho-hap-bg.jpg',
  stomachStageBg: '/stages/tieu-hoa-bg.jpg',
  circulatoryStageBg: '/stages/tuan-hoan-bg.jpg',
  respiratoryStageBg: '/stages/ho-hap-bg.jpg',
  nervousStageBg: '/stages/than-kinh-bg.jpg',
  musculoskeletalStageBg: '/stages/van-dong-bg.jpg',
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
    progress: 100,
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
    unlocked: true,
    progress: 100,
    requiredStageId: 'tieu-hoa',
    newlyUnlocked: false,
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
    unlocked: true,
    progress: 100,
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
    goal: 'Khám phá cách nơ-ron truyền tín hiệu điện hóa và cung phản xạ 5 thành phần.',
    exp: 400,
    diamonds: 35,
    quizzesCount: 5,
    specimensCount: 2,
    thumbnail: IMAGES.nervousStageBg,
    unlocked: true,
    progress: 100,
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
    goal: 'Tìm hiểu sự phối hợp giữa xương, sụn tăng trưởng, khớp và bắp cơ.',
    exp: 450,
    diamonds: 40,
    quizzesCount: 4,
    specimensCount: 2,
    thumbnail: IMAGES.musculoskeletalStageBg,
    unlocked: true,
    progress: 100,
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
  'bai-tiet': {
    id: 'bai-tiet',
    stageNumber: 'Màn 6',
    name: 'Màn 6: Hệ Bài Tiết',
    subtitle: 'Cầu Thận & Ống Thận',
    title: 'Hệ Bài Tiết: Nhà Máy Lọc Máu & Cân Bằng Thể Dịch (Sinh học 8)',
    levelRange: 'Cấp độ 20',
    difficulty: 'Độ khó: Thử thách',
    duration: '15 phút',
    caption: 'Búi mao mạch Cầu thận & Quai Henle',
    goal: 'Tìm hiểu quá trình lọc máu ở cầu thận, tái hấp thu nước & glucozơ ở ống thận và bài tiết nước tiểu chính thức.',
    exp: 500,
    diamonds: 50,
    quizzesCount: 3,
    specimensCount: 3,
    thumbnail: IMAGES.mapBg,
    unlocked: true,
    progress: 100,
    requiredStageId: 'van-dong',
    requiredLevel: 20,
    theoryNotes: {
      heading: 'Cấu tạo Nephron & Quá trình tạo nước tiểu (Sinh học 8 - Bài 38, 39)',
      points: [
        'Thận gồm khoảng 1 triệu đơn vị chức năng (Nephron). Mỗi Nephron gồm Cầu thận, Nang cầu thận và Ống thận.',
        'Quá trình tạo nước tiểu gồm: Lọc máu ở cầu thận (tạo ~170L nước tiểu đầu/ngày) → Hấp thụ lại ở ống thận (nước, glucozơ, Na+) → Bài tiết tiếp (chất cặn bã, ure) tạo ~1.5L nước tiểu chính thức.',
      ],
      formulaOrKey: 'Máu qua cầu thận = Dịch lọc nước tiểu đầu; Ống thận tái hấp thu 99% H2O = Nước tiểu chính thức.',
    },
  },
  'noi-tiet': {
    id: 'noi-tiet',
    stageNumber: 'Màn 7',
    name: 'Màn 7: Hệ Nội Tiết',
    subtitle: 'Tuyến Yên, Giáp & Đảo Tụy',
    title: 'Hệ Nội Tiết: Mạng Lưới Tín Hiệu Thể Dịch & Thụ Thể (Sinh học 8)',
    levelRange: 'Cấp độ 22',
    difficulty: 'Độ khó: Nâng cao',
    duration: '16 phút',
    caption: 'Hormone trong Dòng máu & Thụ thể Tế bào đích',
    goal: 'Khám phá các tuyến nội tiết chính, sự vận chuyển hormone qua máu và tính đặc hiệu thụ thể chìa - khóa.',
    exp: 550,
    diamonds: 55,
    quizzesCount: 3,
    specimensCount: 3,
    thumbnail: IMAGES.heartThumbnail,
    unlocked: true,
    progress: 100,
    requiredStageId: 'bai-tiet',
    requiredLevel: 22,
    theoryNotes: {
      heading: 'Đặc điểm Tuyến Nội Tiết & Cơ chế Thụ thể (Sinh học 8 - Bài 55, 56, 57)',
      points: [
        'Tuyến nội tiết không có ống dẫn, sản phẩm tiết (hormone) ngấm thẳng vào máu. Có tính đặc hiệu cao (tác động lên tế bào đích có thụ thể phù hợp).',
        'Tuyến Yên là tuyến chỉ huy quan trọng nhất; Tuyến Giáp tiết Thyroxin (chứa I-ốt); Tuyến Tụy tiết Insulin hạ đường huyết và Glucagon nâng đường huyết.',
      ],
      formulaOrKey: 'Hormone + Thụ thể tế bào đích (Khóa & Chìa) = Điều hòa chuyển hóa & Cân bằng nội môi.',
    },
  },
  'sinh-duc': {
    id: 'sinh-duc',
    stageNumber: 'Màn 8',
    name: 'Màn 8: Hệ Sinh Dục & Thụ Tinh',
    subtitle: 'Giao Tử & Khởi Nguồn Sự Sống',
    title: 'Hệ Sinh Dục: Khoa Học Tế Bào Giao Tử & Sự Thụ Tinh (Sinh học 8)',
    levelRange: 'Cấp độ 25',
    difficulty: 'Độ khó: Chuyên sâu',
    duration: '18 phút',
    caption: 'Bộ NST n=23 & Sự kết hợp tạo Hợp tử 2n=46',
    goal: 'Tìm hiểu khoa học tế bào giao tử đơn bội, sự thụ tinh tại 1/3 ngoài vòi trứng và quá trình phát triển phôi thai lành mạnh.',
    exp: 600,
    diamonds: 60,
    quizzesCount: 3,
    specimensCount: 3,
    thumbnail: IMAGES.stomachStageBg,
    unlocked: true,
    progress: 100,
    requiredStageId: 'noi-tiet',
    requiredLevel: 25,
    theoryNotes: {
      heading: 'Khoa học Giao Tử & Thụ tinh Thụ thai (Sinh học 8 - Bài 60, 61, 62)',
      points: [
        'Giao tử đực (tinh trùng) và giao tử cái (trứng) đều mang bộ nhiễm sắc thể đơn bội n = 23 chiếc.',
        'Sự thụ tinh là sự kết hợp giữa 1 tinh trùng và 1 trứng tại 1/3 phía ngoài của ống dẫn trứng tạo thành Hợp tử lưỡng bội 2n = 46 chiếc, sau đó phân chia làm tổ trong niêm mạc tử cung.',
      ],
      formulaOrKey: 'Tinh trùng (n=23) + Trứng (n=23) = Hợp tử (2n=46) → Khởi đầu một sự sống mới kỳ diệu.',
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
    unlocked: true,
    specimenKey: 'tram-2',
    summary: 'Cặp đôi dịch vị dạ dày giúp cắt nhỏ chuỗi protein dài thành các chuỗi ngắn 3 - 10 axit amin.',
    detail:
      'Axit HCl (pH 1.5 - 2.5) do tế bào viền tiết ra giúp tiêu diệt vi khuẩn và hoạt hóa Pepsinogen (do tế bào chính tiết ra) thành enzym Pepsin hoạt động.',
  },
  {
    id: 'co-da-day',
    title: 'Ba Lớp Cơ Trơn Thành Dạ Dày',
    category: 'Hệ Cơ Quan',
    unlocked: true,
    specimenKey: 'tram-1',
    summary: 'Gồm cơ dọc (ngoài), cơ vòng (giữa) và cơ chéo (trong) tạo lực co bóp cực khỏe.',
    detail:
      'Sự phối hợp co rút của 3 lớp cơ trơn giúp dạ dày nhào trộn kỹ thức ăn với dịch vị, biến thức ăn thành khối nhuyễn gọi là vị trấp trước khi đẩy xuống tá tràng.',
  },
  {
    id: 'chat-nhay-mucin',
    title: 'Màng Chất Nhầy Mucin Niêm Mạc',
    category: 'Enzym & Hoạt Chất',
    unlocked: true,
    specimenKey: 'tram-3',
    summary: 'Lớp chất nhầy kiềm tính phủ kín niêm mạc giúp dạ dày không bị tự tiêu hủy.',
    detail:
      'Nhờ lớp chất nhầy dày khoảng 1mm bao phủ bề mặt niêm mạc, các tế bào protein của chính thành dạ dày được bảo vệ hoàn toàn khỏi sự ăn mòn của HCl và Pepsin.',
  },
  {
    id: 'nephron-podocyte',
    title: 'Tế Bào Có Chân Podocyte Cầu Thận',
    category: 'Tế Bào',
    unlocked: true,
    summary: 'Tế bào có chân bám quanh búi mao mạch cầu thận tạo màng lọc siêu vi.',
    detail:
      'Các tua chân đan xen tạo thành các khe lọc kích thước 25-30 nm cho phép nước, muối khoáng và glucozơ đi qua nhưng giữ lại toàn bộ tế bào máu và protein huyết tương.',
  },
  {
    id: 'insulin-hormone',
    title: 'Hormone Insulin Đảo Tụy',
    category: 'Enzym & Hoạt Chất',
    unlocked: true,
    summary: 'Hormone do tế bào beta đảo Langerhans tiết ra giúp hạ đường huyết về mức ổn định.',
    detail:
      'Insulin kích hoạt các thụ thể màng tế bào gan và cơ, mở kênh vận chuyển đưa glucozơ từ máu vào tế bào để tổng hợp thành glicôgen dự trữ.',
  },
  {
    id: 'giao-tu-haploid',
    title: 'Bộ NST Đơn Bội Giao Tử (n = 23)',
    category: 'Tế Bào',
    unlocked: true,
    summary: 'Bộ nhiễm sắc thể giảm một nửa ở tế bào sinh dục đảm bảo tính ổn định loài qua thụ tinh.',
    detail:
      'Nhờ quá trình giảm phân, mỗi giao tử chỉ mang 23 chiếc NST. Khi tinh trùng và trứng kết hợp trong thụ tinh, bộ NST lưỡng bội 2n = 46 đặc trưng của loài người được phục hồi nguyên vẹn.',
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
    owned: true,
    badgeIcon: 'biotech',
    accentColor: '#059669',
  },
];
