/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TopDownCirculatoryMap.ts
 * Flagship Top-Down 2D Exploration Map for Hệ Tuần Hoàn (Buồng Tim & Dòng Máu)
 * Biologically accurate, Pokémon-inspired layout with 4 chambers, solid walls,
 * interactive NPCs, obstacles, collectibles, and quests.
 */

import { TopDownMapData } from './TopDownTypes';

export const CIRCULATORY_MAP_DATA: TopDownMapData = {
  id: 'tuan-hoan',
  name: 'Màn 2: Hệ Tuần Hoàn • Buồng Tim & Dòng Máu',
  organBadge: 'Hệ Tuần Hoàn (Sinh học 8 - Bài 16, 17)',
  worldWidth: 1920,
  worldHeight: 1440,
  spawnPos: { x: 1220, y: 320, direction: 'down' },

  chambers: [
    {
      id: 'ra',
      name: 'Buồng 1: Tâm Nhĩ Phải',
      subtitle: 'Nơi tiếp nhận máu nghèo oxy từ tĩnh mạch chủ',
      color: '#881337',
      x: 980,
      y: 120,
      width: 860,
      height: 520,
      fact: 'Máu ở tĩnh mạch chủ có màu đỏ thẫm vì chứa nhiều CO₂ và rất ít dưỡng khí Oxy.',
    },
    {
      id: 'rv',
      name: 'Buồng 2: Tâm Thất Phải',
      subtitle: 'Bơm máu nghèo oxy lên phổi qua động mạch phổi',
      color: '#4c0519',
      x: 980,
      y: 690,
      width: 860,
      height: 670,
      fact: 'Tâm thất phải co bóp tạo áp lực đẩy máu vào động mạch phổi để bắt đầu vòng tuần hoàn nhỏ.',
    },
    {
      id: 'lv',
      name: 'Buồng 3: Tâm Thất Trái',
      subtitle: 'Thành cơ tim dày nhất, bơm máu giàu O₂ nuôi toàn bộ cơ thể',
      color: '#9f1239',
      x: 80,
      y: 690,
      width: 880,
      height: 670,
      fact: 'Thành cơ tâm thất trái dày gấp 3 lần tâm thất phải để thắng sức cản cực lớn của vòng tuần hoàn lớn.',
    },
    {
      id: 'la',
      name: 'Buồng 4: Tâm Nhĩ Trái & Cung Động Mạch Chủ',
      subtitle: 'Tiếp nhận máu đỏ tươi từ phổi và xuất phát vòng tuần hoàn lớn',
      color: '#be123c',
      x: 80,
      y: 120,
      width: 880,
      height: 520,
      fact: 'Từ tâm thất trái, máu giàu Oxy phóng thẳng vào Cung Động Mạch Chủ với vận tốc lên tới 50 cm/giây!',
    },
  ],

  // Solid Collision Boundaries & Walls
  walls: [
    // Outer World Border Walls
    { id: 'w-top', x: 0, y: 0, width: 1920, height: 100 },
    { id: 'w-bottom', x: 0, y: 1380, width: 1920, height: 80 },
    { id: 'w-left', x: 0, y: 0, width: 70, height: 1440 },
    { id: 'w-right', x: 1850, y: 0, width: 70, height: 1440 },

    // Central Vertical Septum (Vách Ngăn Giữa 2 Nửa Trái - Phải của Tim)
    // Upper Central Septum (Between Right Atrium and Left Atrium)
    { id: 'w-septum-upper', x: 920, y: 100, width: 70, height: 550 },
    // Lower Central Septum (Vách Liên Thất dày chắc) with passage at bottom
    { id: 'w-septum-mid', x: 920, y: 650, width: 70, height: 350 },
    { id: 'w-septum-lower', x: 920, y: 1200, width: 70, height: 200 },

    // Horizontal Divider Wall (Between Right Atrium and Right Ventricle)
    { id: 'w-hr-1', x: 990, y: 640, width: 310, height: 50 },
    { id: 'w-hr-2', x: 1500, y: 640, width: 350, height: 50 },

    // Horizontal Divider Wall (Between Left Atrium and Left Ventricle)
    { id: 'w-hl-1', x: 70, y: 640, width: 350, height: 50 },
    { id: 'w-hl-2', x: 580, y: 640, width: 340, height: 50 },

    // Anatomical Chamber Columns / Muscle Pillars (Pyloric Pillars)
    { id: 'w-pillar-ra1', x: 1150, y: 440, width: 60, height: 60 },
    { id: 'w-pillar-ra2', x: 1600, y: 380, width: 60, height: 60 },
    { id: 'w-pillar-rv1', x: 1220, y: 840, width: 70, height: 70 },
    { id: 'w-pillar-rv2', x: 1640, y: 1080, width: 70, height: 70 },
    { id: 'w-pillar-lv1', x: 280, y: 920, width: 80, height: 80 },
    { id: 'w-pillar-lv2', x: 700, y: 1120, width: 80, height: 80 },
    { id: 'w-pillar-la1', x: 260, y: 380, width: 60, height: 60 },
    { id: 'w-pillar-la2', x: 720, y: 380, width: 60, height: 60 },
  ],

  // Interactive NPCs
  npcs: [
    // NPC 1: Bác sĩ Erythro (Hồng Cầu Trưởng) in Right Atrium
    {
      id: 'npc-erythro',
      name: 'Bác Sĩ Erythro',
      title: 'Trưởng Nhóm Hồng Cầu Tuần Hoàn',
      x: 1380,
      y: 320,
      width: 50,
      height: 50,
      facing: 'down',
      icon: 'favorite',
      color: '#e11d48',
      questId: 'quest-1-oxygen',
      dialogue: [
        'BS. Erythro: "Chào mừng nhà thám hiểm Potabi đến với Buồng Tim & Dòng Máu!"',
        'BS. Erythro: "Bạn đang đứng ở Tâm Nhĩ Phải. Máu từ khắp cơ thể vừa đổ về đây đang rất kiệt sức vì thiếu Oxy (O₂)!"',
        'BS. Erythro: "Cửa van 3 lá dẫn xuống buồng dưới đang bị khóa chặt để ngăn dòng trào ngược."',
        'BS. Erythro: "Nhiệm vụ của bạn: Hãy tìm 4 phân tử Oxy (O₂) đang lơ lửng xung quanh buồng tim này và đem về đây nạp cho chúng tôi!"',
      ],
    },

    // NPC 2: Nút Xoang Nhĩ (SA Node Pacemaker) in Right Ventricle
    {
      id: 'npc-sa-node',
      name: 'Nút Xoang Nhĩ (SA Node)',
      title: 'Máy Tạo Nhịp Tự Động Của Tim',
      x: 1400,
      y: 980,
      width: 50,
      height: 50,
      facing: 'left',
      icon: 'bolt',
      color: '#f59e0b',
      questId: 'quest-2-pacemaker',
      dialogue: [
        'Nút Xoang Nhĩ: "Tách... tách! Tôi là Nút Xoang Nhĩ, hệ thống thần kinh tự động phát xung điện cho tim!"',
        'Nút Xoang Nhĩ: "Mỗi chu kỳ co bóp tim kéo dài 0.8 giây: Tâm nhĩ co 0.1s, Tâm thất co 0.3s, và Pha giãn chung 0.4s!"',
        'Nút Xoang Nhĩ: "Hãy giải câu hỏi Sinh học 8 bên dưới để tôi phóng xung kích hoạt cơ tim, làm tan cục máu đông Fibrin đang chắn đường sang nửa tim bên trái!"',
      ],
      question: {
        q: 'Trong mỗi chu kỳ tim 0.8 giây ở người bình thường, pha giãn chung (tim được nghỉ ngơi) kéo dài bao lâu (Sinh học 8)?',
        options: [
          'A. 0.1 giây',
          'B. 0.3 giây',
          'C. 0.4 giây (bằng một nửa chu kỳ giúp tim không kiệt sức)',
        ],
        correct: 2,
        explanation: 'Chính xác! Pha giãn chung kéo dài 0.4 giây giúp cơ tim được hồi phục năng lượng hoàn toàn sau mỗi nhịp đập!',
      },
    },

    // NPC 3: Bảng Điều Phối Tuần Hoàn (Circulation Terminal) in Left Ventricle
    {
      id: 'npc-terminal',
      name: 'Bảng Điều Phối Tuần Hoàn',
      title: 'Trung Tâm Điều Hướng Vòng Tuần Hoàn Lớn',
      x: 480,
      y: 1020,
      width: 50,
      height: 50,
      facing: 'up',
      icon: 'alt_route',
      color: '#0284c7',
      questId: 'quest-3-circulation',
      dialogue: [
        'Bảng Điều Phối: "Chào Potabi! Bạn đang đứng tại Tâm Thất Trái - buồng tim có thành cơ dày nhất và lực bơm mạnh nhất!"',
        'Bảng Điều Phối: "Từ đây, máu giàu Oxy đỏ tươi sẽ được bơm vào Cung Động Mạch Chủ để bắt đầu Vòng Tuần Hoàn Lớn đi nuôi cơ thể."',
        'Bảng Điều Phối: "Hãy kiểm tra kiến thức về đúng trật tự 5 chặng đường của Vòng Tuần Hoàn Lớn để mở Cổng Động Mạch Chủ nhé!"',
      ],
      question: {
        q: 'Đường đi của máu trong Vòng Tuần Hoàn Lớn theo đúng thứ tự là (Sinh học 8)?',
        options: [
          'A. Tâm thất trái ➔ Động mạch chủ ➔ Mao mạch cơ quan ➔ Tĩnh mạch chủ ➔ Tâm nhĩ phải',
          'B. Tâm thất phải ➔ Động mạch phổi ➔ Mao mạch phổi ➔ Tĩnh mạch phổi ➔ Tâm nhĩ trái',
          'C. Tâm nhĩ trái ➔ Động mạch phổi ➔ Mao mạch cơ quan ➔ Tĩnh mạch phổi',
        ],
        correct: 0,
        explanation: 'Xuất sắc! Máu xuất phát từ tâm thất trái theo động mạch chủ đi khắp cơ thể, trao đổi chất rồi trở về tâm nhĩ phải theo tĩnh mạch chủ!',
      },
    },

    // NPC 4: Bạch Cầu Đại Thực Bào in Left Atrium
    {
      id: 'npc-macrophage',
      name: 'Đại Thực Bào Canh Gác',
      title: 'Chiến Binh Miễn Dịch Tuần Hoàn',
      x: 420,
      y: 380,
      width: 50,
      height: 50,
      facing: 'down',
      icon: 'shield',
      color: '#10b981',
      dialogue: [
        'Đại Thực Bào: "Máu đỏ tươi vừa từ phổi trở về Tâm Nhĩ Trái qua 4 tĩnh mạch phổi rất sạch sẽ và giàu dinh dưỡng!"',
        'Đại Thực Bào: "Cổng Động Mạch Chủ ở ngay phía trên. Khi hoàn thành đủ các nhiệm vụ, cổng sẽ mở đưa bạn đến hệ cơ quan tiếp theo!"',
      ],
    },
  ],

  // Obstacles blocking paths
  obstacles: [
    // Obstacle 1: Van 3 Lá (Tricuspid Valve Gate)
    {
      id: 'obs-valve-3la',
      name: 'Van 3 Lá (Tricuspid Valve)',
      x: 1300,
      y: 640,
      width: 200,
      height: 50,
      type: 'valve-gate',
      isBlocked: true,
      requiredQuestId: 'quest-1-oxygen',
      clearMessage: 'Van 3 lá đã mở! Máu có thể chảy tự do từ Tâm Nhĩ Phải xuống Tâm Thất Phải.',
      hint: 'Van tim bị khóa chặt! Hãy thu thập đủ 4 phân tử Oxy và báo cáo với BS. Erythro.',
      color: '#f43f5e',
    },

    // Obstacle 2: Mảng Huyết Khối Fibrin (Fibrin Clot)
    {
      id: 'obs-fibrin-clot',
      name: 'Mảng Huyết Khối Fibrin Tắc Nghẽn',
      x: 920,
      y: 1000,
      width: 70,
      height: 200,
      type: 'fibrin-clot',
      isBlocked: true,
      requiredQuestId: 'quest-2-pacemaker',
      clearMessage: 'Xung điện co bóp nhịp tim đã làm tan mảng Fibrin, thông suốt lối sang Tâm Thất Trái!',
      hint: 'Lối đi bị nghẽn bởi sợi Fibrin! Hãy gặp Nút Xoang Nhĩ (SA Node) để kích hoạt xung nhịp tim.',
      color: '#713f12',
    },

    // Obstacle 3: Cổng Động Mạch Chủ (Aorta Gateway Valve)
    {
      id: 'obs-aorta-gate',
      name: 'Cổng Động Mạch Chủ (Aorta Arch)',
      x: 420,
      y: 100,
      width: 200,
      height: 50,
      type: 'aorta-gate',
      isBlocked: true,
      requiredQuestId: 'quest-3-circulation',
      clearMessage: 'Cổng Động Mạch Chủ đã mở rực rỡ! Tiến vào để hoàn thành màn chơi.',
      hint: 'Cổng xuất phát vòng tuần hoàn lớn đang khép kín! Hãy giải câu đố tại Bảng Điều Phối.',
      color: '#eab308',
    },
  ],

  // Collectible items in the world
  collectibles: [
    {
      id: 'item-o2-1',
      name: 'Phân tử Oxy O₂ (Vị trí 1)',
      label: 'Phân Tử Oxy O₂',
      x: 1100,
      y: 220,
      width: 36,
      height: 36,
      type: 'oxygen',
      isCollected: false,
      icon: 'bubble_chart',
      color: '#38bdf8',
    },
    {
      id: 'item-o2-2',
      name: 'Phân tử Oxy O₂ (Vị trí 2)',
      label: 'Phân Tử Oxy O₂',
      x: 1560,
      y: 260,
      width: 36,
      height: 36,
      type: 'oxygen',
      isCollected: false,
      icon: 'bubble_chart',
      color: '#38bdf8',
    },
    {
      id: 'item-o2-3',
      name: 'Phân tử Oxy O₂ (Vị trí 3)',
      label: 'Phân Tử Oxy O₂',
      x: 1680,
      y: 480,
      width: 36,
      height: 36,
      type: 'oxygen',
      isCollected: false,
      icon: 'bubble_chart',
      color: '#38bdf8',
    },
    {
      id: 'item-o2-4',
      name: 'Phân tử Oxy O₂ (Vị trí 4)',
      label: 'Phân Tử Oxy O₂',
      x: 1240,
      y: 520,
      width: 36,
      height: 36,
      type: 'oxygen',
      isCollected: false,
      icon: 'bubble_chart',
      color: '#38bdf8',
    },
  ],

  // Quests
  quests: [
    {
      id: 'quest-1-oxygen',
      title: 'Nhiệm Vụ 1: Nạp Oxy Cho Hồng Cầu & Mở Van 3 Lá',
      description: 'Thu thập đủ 4 phân tử Oxy (O₂) trong Tâm Nhĩ Phải và nói chuyện với BS. Erythro.',
      giverNpcId: 'npc-erythro',
      targetCount: 4,
      currentCount: 0,
      isCompleted: false,
      expReward: 80,
      diamondReward: 10,
      rewardClaimed: false,
    },
    {
      id: 'quest-2-pacemaker',
      title: 'Nhiệm Vụ 2: Kích Hoạt Nhịp Đập Cùng Nút Xoang Nhĩ',
      description: 'Gặp Nút Xoang Nhĩ tại Tâm Thất Phải và trả lời câu hỏi về chu kỳ co bóp tim.',
      giverNpcId: 'npc-sa-node',
      isCompleted: false,
      expReward: 80,
      diamondReward: 10,
      rewardClaimed: false,
    },
    {
      id: 'quest-3-circulation',
      title: 'Nhiệm Vụ 3: Định Hướng Vòng Tuần Hoàn Lớn',
      description: 'Tương tác với Bảng Điều Phối tại Tâm Thất Trái để sắp xếp thứ tự vòng tuần hoàn.',
      giverNpcId: 'npc-terminal',
      isCompleted: false,
      expReward: 90,
      diamondReward: 10,
      rewardClaimed: false,
    },
  ],

  // Final Gateway
  exitGateway: {
    x: 430,
    y: 80,
    width: 180,
    height: 70,
    label: 'Cổng Động Mạch Chủ (Tiến Tới Hệ Hô Hấp)',
    targetStageId: 'ho-hap',
  },
};
