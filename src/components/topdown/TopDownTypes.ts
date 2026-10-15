/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TopDownTypes.ts
 * Type definitions for Top-Down 2D Exploration Adventure (Pokémon-inspired)
 * Potabi Biology • Bio Blossom Tactile Design System
 */

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  id?: string;
}

export interface DialogueNode {
  speaker: string;
  speakerTitle: string;
  avatarIcon: string;
  text: string[];
  question?: {
    q: string;
    options: string[];
    correctIdx: number;
    explanation: string;
  };
}

export interface TopDownNPC {
  id: string;
  name: string;
  title: string;
  x: number; // world px
  y: number; // world px
  width: number;
  height: number;
  facing: Direction;
  dialogue: string[];
  questId?: string;
  question?: {
    q: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  icon: string;
  color: string;
}

export interface TopDownObstacle {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'valve-gate' | 'fibrin-clot' | 'septum-wall' | 'aorta-gate';
  isBlocked: boolean;
  requiredQuestId?: string;
  clearMessage: string;
  hint: string;
  color: string;
}

export interface TopDownCollectible {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'oxygen' | 'atp' | 'specimen' | 'key';
  isCollected: boolean;
  icon: string;
  label: string;
  color: string;
}

export interface TopDownQuest {
  id: string;
  title: string;
  description: string;
  giverNpcId: string;
  targetCount?: number;
  currentCount?: number;
  isCompleted: boolean;
  expReward: number;
  diamondReward: number;
  rewardClaimed: boolean;
}

export interface HeartChamberZone {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fact: string;
}

export interface TopDownMapData {
  id: string;
  name: string;
  organBadge: string;
  worldWidth: number; // px
  worldHeight: number; // px
  spawnPos: { x: number; y: number; direction: Direction };
  chambers: HeartChamberZone[];
  walls: BoundingBox[];
  npcs: TopDownNPC[];
  obstacles: TopDownObstacle[];
  collectibles: TopDownCollectible[];
  quests: TopDownQuest[];
  exitGateway: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
    targetStageId: string;
  };
}
