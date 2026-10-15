/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 2D Side-Scrolling Exploration & Puzzle Engine Types
 * Potabi Biology • Bio Blossom Tactile Design System
 */

export type PuzzleType = 
  | 'blood-flow'        // Sắp xếp thứ tự vòng tuần hoàn máu (Hệ tuần hoàn)
  | 'oxygen-load'       // Gắn phân tử Oxy vào Hemoglobin của hồng cầu (Hệ tuần hoàn)
  | 'valve-timing'      // Cơ chế đóng mở van tim 1 chiều (Hệ tuần hoàn)
  | 'digestive-enzyme'  // Phối hợp enzyme & pH tiêu hóa (Hệ tiêu hóa)
  | 'gas-exchange'      // Khuếch tán khí phế nang O2/CO2 (Hệ hô hấp)
  | 'synapse-signal'    // Dẫn truyền xung thần kinh qua khe synapse (Hệ thần kinh)
  | 'bone-lever'        // Cấu trúc đòn bẩy xương và cơ (Hệ vận động)
  | 'nephron-filter'    // Lọc và tái hấp thu nước/glucose (Hệ bài tiết)
  | 'hormone-lock'      // Khóa - chìa hormone và thụ thể tế bào đích (Hệ nội tiết)
  | 'fertilization';    // Thụ tinh n=23 tạo hợp tử 2n=46 (Hệ sinh dục)

export interface BiologicalZone {
  id: string;
  name: string;
  subtitle: string;
  startX: number; // percentage in world coords (0..worldWidthPercent)
  endX: number;
  themeColor: string;
  bgColor: string;
  description: string;
  organFact: string;
}

export interface InteractableEntity {
  id: string;
  x: number; // percentage in world coords (0..worldWidthPercent)
  y: number; // percentage from top (standing/floating Y)
  name: string;
  label: string;
  type: 'puzzle' | 'npc' | 'specimen' | 'lore-station' | 'checkpoint' | 'goal';
  icon: string;
  puzzleId?: PuzzleType;
  puzzleTitle?: string;
  npcDialogue?: string[];
  npcQuestion?: {
    q: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  rewardExp?: number;
  rewardDiamonds?: number;
  specimenId?: string;
  isCompleted?: boolean;
}

export interface ExplorationStageConfig {
  id: string;
  name: string;
  organBadge: string;
  themeColor: string;
  accentBg: string;
  worldWidthPercent: number; // typically 320% for deep exploration
  walkingGroundY: number;    // % from top (e.g. 66%)
  respawnX: number;
  zones: BiologicalZone[];
  interactables: InteractableEntity[];
  questObjectives: {
    id: string;
    label: string;
    description: string;
    required: boolean;
  }[];
}
