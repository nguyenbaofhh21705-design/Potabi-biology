/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TopDownWorldView.tsx
 * Pure SVG & CSS Top-Down 2D Exploration Viewport (Classic Pokémon inspired)
 * Renders chambers, muscular walls, animated valve obstacles, NPCs, items, and Potabi.
 */

import React from 'react';
import { IMAGES } from '../../data/biologyData';
import {
  Direction,
  TopDownCollectible,
  TopDownMapData,
  TopDownNPC,
  TopDownObstacle,
} from './TopDownTypes';

interface TopDownWorldViewProps {
  mapData: TopDownMapData;
  playerPos: { x: number; y: number };
  playerDirection: Direction;
  isWalking: boolean;
  cameraPos: { x: number; y: number };
  activeObstacles: TopDownObstacle[];
  activeCollectibles: TopDownCollectible[];
  nearbyInteractable:
    | { type: 'npc'; data: TopDownNPC }
    | { type: 'obstacle'; data: TopDownObstacle }
    | { type: 'gateway' }
    | null;
  onInteract: () => void;
}

export const TopDownWorldView: React.FC<TopDownWorldViewProps> = ({
  mapData,
  playerPos,
  playerDirection,
  isWalking,
  cameraPos,
  activeObstacles,
  activeCollectibles,
  nearbyInteractable,
  onInteract,
}) => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-950 select-none">
      {/* ============================================================== */}
      {/* SCROLLING WORLD CONTAINER (OFFSET BY CAMERA POSITION)          */}
      {/* ============================================================== */}
      <div
        className="absolute top-0 left-0 transition-transform duration-75 ease-out will-change-transform"
        style={{
          width: `${mapData.worldWidth}px`,
          height: `${mapData.worldHeight}px`,
          transform: `translate3d(${-cameraPos.x}px, ${-cameraPos.y}px, 0)`,
        }}
      >
        {/* 1. Chamber Floor Grids & Tissues */}
        {mapData.chambers.map((chamber) => (
          <div
            key={chamber.id}
            className="absolute rounded-3xl border-2 border-white/10 shadow-inner flex flex-col justify-between p-6 pointer-events-none"
            style={{
              left: `${chamber.x}px`,
              top: `${chamber.y}px`,
              width: `${chamber.width}px`,
              height: `${chamber.height}px`,
              backgroundColor: chamber.color,
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08) 0%, transparent 80%), repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.04) 0px, rgba(0, 0, 0, 0.04) 16px, transparent 16px, transparent 32px)`,
            }}
          >
            {/* Chamber Label on Ground */}
            <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 max-w-sm">
              <span className="text-xs font-bold text-white block">
                {chamber.name}
              </span>
              <span className="text-[11px] text-white/80 font-medium">
                {chamber.subtitle}
              </span>
            </div>

            <div className="self-end bg-black/30 backdrop-blur-xs px-3 py-1 rounded-xl text-[10px] text-white/70 max-w-xs text-right">
              {chamber.fact}
            </div>
          </div>
        ))}

        {/* 2. Blood Circulation Flow Vectors (Animated Organic Flow) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Deoxygenated Flow: Vena Cava -> RA -> RV */}
          <path
            d="M 1220 180 Q 1380 260 1380 480 T 1380 720 T 1420 1100"
            stroke="#38bdf8"
            strokeWidth="24"
            strokeDasharray="16 12"
            fill="none"
            strokeLinecap="round"
          />
          {/* Oxygenated Flow: LA -> LV -> Aorta */}
          <path
            d="M 480 320 Q 480 540 480 780 T 480 1120 Q 720 1120 720 780 T 480 180"
            stroke="#f43f5e"
            strokeWidth="24"
            strokeDasharray="16 12"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* 3. Solid Muscular Walls & Septum Barriers */}
        {mapData.walls.map((wall) => (
          <div
            key={wall.id}
            className="absolute rounded-xl shadow-lg border border-red-950/60 pointer-events-none"
            style={{
              left: `${wall.x}px`,
              top: `${wall.y}px`,
              width: `${wall.width}px`,
              height: `${wall.height}px`,
              background: 'linear-gradient(145deg, #380313 0%, #1e020a 100%)',
              boxShadow: 'inset 0 4px 6px rgba(255,255,255,0.15), 0 8px 16px rgba(0,0,0,0.6)',
            }}
          >
            {/* Cellular Wall Muscle Striations */}
            <div className="w-full h-full opacity-20 bg-[radial-gradient(#fda4af_1px,transparent_1px)] [background-size:12px_12px]" />
          </div>
        ))}

        {/* 4. Interactive Obstacles (Van 3 Lá, Fibrin Clot, Aorta Gate) */}
        {activeObstacles.map((obs) => {
          return (
            <div
              key={obs.id}
              onClick={onInteract}
              className={`absolute transition-all duration-500 rounded-2xl flex items-center justify-center cursor-pointer ${
                obs.isBlocked
                  ? 'shadow-2xl border-4'
                  : 'opacity-40 border-2 border-dashed'
              }`}
              style={{
                left: `${obs.x}px`,
                top: `${obs.y}px`,
                width: `${obs.width}px`,
                height: `${obs.height}px`,
                backgroundColor: obs.isBlocked ? obs.color : 'rgba(255,255,255,0.08)',
                borderColor: obs.isBlocked ? '#ffffff' : 'rgba(255,255,255,0.3)',
              }}
            >
              {obs.isBlocked ? (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-black/70 rounded-xl text-white text-xs font-bold shadow-md">
                  <span className="material-symbols-outlined text-base animate-pulse">
                    {obs.type === 'valve-gate' ? 'valve' : obs.type === 'fibrin-clot' ? 'coronavirus' : 'lock'}
                  </span>
                  <span className="whitespace-nowrap">{obs.name}</span>
                </div>
              ) : (
                <span className="text-[10px] font-bold text-emerald-400 bg-black/60 px-2 py-0.5 rounded-md">
                  ĐÃ THÔNG SUỐT ✓
                </span>
              )}
            </div>
          );
        })}

        {/* 5. Collectible Items (Phân Tử Oxy O₂) */}
        {activeCollectibles.map((item) => {
          if (item.isCollected) return null;
          return (
            <div
              key={item.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center animate-bounce"
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(56,189,248,0.8)] border-2 border-white ring-4 ring-cyan-400/40"
                style={{ backgroundColor: item.color }}
              >
                <span className="material-symbols-outlined text-xl">bubble_chart</span>
              </div>
              <span className="text-[9px] font-bold text-white bg-black/80 px-1.5 py-0.5 rounded mt-1 shadow-sm whitespace-nowrap border border-white/20">
                {item.label}
              </span>
            </div>
          );
        })}

        {/* 6. NPCs (Bác Sĩ Erythro, SA Node, Terminal, v.v.) */}
        {mapData.npcs.map((npc) => (
          <div
            key={npc.id}
            onClick={onInteract}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group z-20"
            style={{
              left: `${npc.x}px`,
              top: `${npc.y}px`,
            }}
          >
            {/* NPC Exclamation / Speech Bubble indicator */}
            <div className="mb-1 px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-bold shadow-lg border border-white flex items-center gap-1 animate-bounce">
              <span className="material-symbols-outlined text-xs">chat</span>
              <span>NÓI CHUYỆN</span>
            </div>

            {/* NPC Avatar Icon Frame */}
            <div
              className="w-13 h-13 rounded-2xl flex items-center justify-center text-white shadow-xl border-3 border-white group-hover:scale-110 transition-transform"
              style={{ backgroundColor: npc.color }}
            >
              <span className="material-symbols-outlined text-3xl">{npc.icon}</span>
            </div>

            {/* Name Tag */}
            <span className="text-[10px] font-bold text-white bg-black/80 px-2 py-0.5 rounded-md mt-1 border border-white/20 whitespace-nowrap shadow-md">
              {npc.name}
            </span>
          </div>
        ))}

        {/* 7. Exit Gateway (Cổng Động Mạch Chủ) */}
        <div
          className="absolute -translate-x-1/2 flex flex-col items-center cursor-pointer group z-10"
          style={{
            left: `${mapData.exitGateway.x + mapData.exitGateway.width / 2}px`,
            top: `${mapData.exitGateway.y}px`,
          }}
        >
          <div className="px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-bold shadow-xl border-2 border-white flex items-center gap-1 animate-pulse">
            <span className="material-symbols-outlined text-sm">door_open</span>
            <span>{mapData.exitGateway.label}</span>
          </div>
          <div className="w-40 h-20 rounded-t-full bg-gradient-to-t from-amber-600 via-rose-500 to-amber-300 border-4 border-white shadow-[0_0_40px_rgba(245,158,11,0.8)] flex items-center justify-center text-white font-bold text-sm mt-1">
            <span className="material-symbols-outlined text-4xl animate-spin-slow">
              celebration
            </span>
          </div>
        </div>

        {/* 8. POTABI CHARACTER SPRITE IN TOP-DOWN WORLD */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 transition-transform duration-75 ease-out"
          style={{
            left: `${playerPos.x}px`,
            top: `${playerPos.y}px`,
          }}
        >
          {/* Proximity Interaction Bubble Prompt above Potabi */}
          {nearbyInteractable && (
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-bold text-xs shadow-2xl border-2 border-white flex items-center gap-1.5 animate-bounce whitespace-nowrap z-40">
              <span className="material-symbols-outlined text-sm font-bold">touch_app</span>
              <span>
                {nearbyInteractable.type === 'npc'
                  ? `[E] Nói chuyện với ${nearbyInteractable.data.name}`
                  : nearbyInteractable.type === 'obstacle'
                  ? `[E] Kiểm tra ${nearbyInteractable.data.name}`
                  : '[E] Bước qua Cổng Đích'}
              </span>
            </div>
          )}

          {/* Potabi Blue Avatar Image */}
          <div
            className={`relative flex flex-col items-center ${
              isWalking ? 'animate-bounce' : 'animate-potabi-idle'
            }`}
            style={{
              transform: `scaleX(${playerDirection === 'left' ? -1 : 1})`,
            }}
          >
            <img
              src={IMAGES.potabiBlueAvatar}
              alt="Potabi Player"
              className="w-14 sm:w-16 h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
              draggable={false}
            />
            {/* Ground Shadow under Potabi */}
            <div className="w-10 h-2 bg-black/60 rounded-full blur-[2px] -mt-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
