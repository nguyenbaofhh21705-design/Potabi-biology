/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Stage2DRunner.tsx
 * Top-Down 2D Exploration Adventure Engine (Pokémon-inspired) for Potabi Biology
 * 
 * - 4-Way Smooth Movement (WASD / Arrow Keys / Mobile D-Pad)
 * - Solid Wall & Obstacle Collision Detection with Wall Sliding
 * - Smooth Camera Follow
 * - Interactive NPCs with Dialogue in Vietnamese & Biology Quests
 * - Real Biological Obstacles (Van 3 Lá, Huyết Khối Fibrin, Cổng Động Mạch Chủ)
 * - Quest Tracker HUD & Reward System (Guaranteed No Duplicate Rewards)
 * - Pure SVG & CSS World Design (Zero External Broken Image Dependencies)
 * - Seamless Integration with Supabase, Profile, and Journey Map
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { STAGES } from '../data/biologyData';
import { CIRCULATORY_MAP_DATA } from './topdown/TopDownCirculatoryMap';
import { TopDownWorldView } from './topdown/TopDownWorldView';
import { TopDownDialogueBox } from './topdown/TopDownDialogueBox';
import { TopDownHUD } from './topdown/TopDownHUD';
import {
  BoundingBox,
  Direction,
  HeartChamberZone,
  TopDownCollectible,
  TopDownMapData,
  TopDownNPC,
  TopDownObstacle,
  TopDownQuest,
} from './topdown/TopDownTypes';

export interface Stage2DRunnerProps {
  stageId: string;
  equippedOutfitId: string;
  onExitToMap: () => void;
  onStageVictory: (stageId: string, expReward: number, diamondReward: number) => void;
  onOpenNotebook: () => void;
}

// AABB collision helper
function boxesIntersect(a: BoundingBox, b: BoundingBox): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export const Stage2DRunner: React.FC<Stage2DRunnerProps> = ({
  stageId,
  equippedOutfitId,
  onExitToMap,
  onStageVictory,
  onOpenNotebook,
}) => {
  // Flagship Top-Down Map Data (Currently Hệ Tuần Hoàn)
  const mapData: TopDownMapData = useMemo(() => {
    return CIRCULATORY_MAP_DATA;
  }, [stageId]);

  const stageMeta = STAGES[stageId] || STAGES['tuan-hoan'];

  // Player State
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>(mapData.spawnPos);
  const [playerDirection, setPlayerDirection] = useState<Direction>(mapData.spawnPos.direction);
  const [isWalking, setIsWalking] = useState<boolean>(false);

  // Dynamic World State
  const [obstacles, setObstacles] = useState<TopDownObstacle[]>(mapData.obstacles);
  const [collectibles, setCollectibles] = useState<TopDownCollectible[]>(mapData.collectibles);
  const [quests, setQuests] = useState<TopDownQuest[]>(mapData.quests);

  // Dialogue & Interaction State
  const [activeDialogueNpc, setActiveDialogueNpc] = useState<TopDownNPC | null>(null);
  const [customDialogueText, setCustomDialogueText] = useState<string[] | undefined>(undefined);
  const [isQuestActionReady, setIsQuestActionReady] = useState<boolean>(false);

  // Modals & HUD State
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [showVictoryBanner, setShowVictoryBanner] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Audio Synthesis
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Movement & Camera References
  const keysRef = useRef<{ up: boolean; down: boolean; left: boolean; right: boolean }>({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const playerPosRef = useRef<{ x: number; y: number }>(mapData.spawnPos);
  const animFrameRef = useRef<number | null>(null);

  // Speed multiplier from wardrobe outfits
  const speedBonus = equippedOutfitId === 'giot-nuoc-nano' ? 1.25 : 1.0;
  const PLAYER_SPEED = 210 * speedBonus; // px/sec

  // Viewport dimensions state for camera tracking
  const [viewportSize, setViewportSize] = useState<{ w: number; h: number }>({
    w: typeof window !== 'undefined' ? window.innerWidth : 1000,
    h: typeof window !== 'undefined' ? window.innerHeight : 700,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({ w: window.innerWidth, h: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute Camera Position (clamped to map boundaries)
  const cameraPos = useMemo(() => {
    const targetX = playerPos.x - viewportSize.w / 2;
    const targetY = playerPos.y - viewportSize.h / 2;

    const maxCamX = Math.max(0, mapData.worldWidth - viewportSize.w);
    const maxCamY = Math.max(0, mapData.worldHeight - viewportSize.h);

    return {
      x: Math.max(0, Math.min(maxCamX, targetX)),
      y: Math.max(0, Math.min(maxCamY, targetY)),
    };
  }, [playerPos, viewportSize, mapData.worldWidth, mapData.worldHeight]);

  // Determine current heart chamber based on player position
  const currentChamber: HeartChamberZone | null = useMemo(() => {
    for (const ch of mapData.chambers) {
      if (
        playerPos.x >= ch.x &&
        playerPos.x <= ch.x + ch.width &&
        playerPos.y >= ch.y &&
        playerPos.y <= ch.y + ch.height
      ) {
        return ch;
      }
    }
    return null;
  }, [playerPos, mapData.chambers]);

  // Audio helper
  const playSound = (freq = 440, type: OscillatorType = 'sine', duration = 0.1) => {
    if (isAudioMuted) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      if (audioCtxRef.current) {
        const osc = audioCtxRef.current.createOscillator();
        const gain = audioCtxRef.current.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtxRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtxRef.current.destination);
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + duration);
      }
    } catch {
      // Audio not supported
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // =========================================================================
  // PROXIMITY DETECTION TO NPCS, OBSTACLES, GATEWAY
  // =========================================================================
  const nearbyInteractable = useMemo(() => {
    const px = playerPos.x;
    const py = playerPos.y;

    // Check NPCs within 70px
    for (const npc of mapData.npcs) {
      const dist = Math.hypot(px - npc.x, py - npc.y);
      if (dist <= 75) {
        return { type: 'npc' as const, data: npc };
      }
    }

    // Check Obstacles within 80px
    for (const obs of obstacles) {
      if (obs.isBlocked) {
        const centerX = obs.x + obs.width / 2;
        const centerY = obs.y + obs.height / 2;
        const dist = Math.hypot(px - centerX, py - centerY);
        if (dist <= 95) {
          return { type: 'obstacle' as const, data: obs };
        }
      }
    }

    // Check Exit Gateway within 100px
    const gateCenterX = mapData.exitGateway.x + mapData.exitGateway.width / 2;
    const gateCenterY = mapData.exitGateway.y + mapData.exitGateway.height / 2;
    const gateDist = Math.hypot(px - gateCenterX, py - gateCenterY);
    if (gateDist <= 110) {
      return { type: 'gateway' as const };
    }

    return null;
  }, [playerPos, mapData.npcs, obstacles, mapData.exitGateway]);

  // Context-aware interaction trigger
  const handleTriggerInteraction = () => {
    if (!nearbyInteractable) return;

    if (nearbyInteractable.type === 'npc') {
      const npc = nearbyInteractable.data;
      playSound(520, 'sine', 0.1);

      // Check if Dr. Erythro and player has collected 4 O2
      if (npc.id === 'npc-erythro') {
        const quest1 = quests.find((q) => q.id === 'quest-1-oxygen');
        const collectedO2Count = collectibles.filter((c) => c.isCollected).length;

        if (quest1 && !quest1.isCompleted && collectedO2Count >= 4) {
          // Player ready to complete quest 1!
          setCustomDialogueText([
            'BS. Erythro: "Xuất sắc lắm Potabi! Bạn đã đem đủ 4 phân tử Oxy (O₂) để nạp đầy cho Hemoglobin của hồng cầu!"',
            'BS. Erythro: "Hồng cầu đã chuyển sang màu đỏ tươi và tràn đầy năng lượng nuôi cơ thể!"',
            'BS. Erythro: "Tôi đã gửi tín hiệu mở khóa Cửa Van 3 Lá. Bây giờ bạn có thể đi xuống Tâm Thất Phải rồi đấy!"',
          ]);
          setIsQuestActionReady(true);
          setActiveDialogueNpc(npc);
          return;
        } else if (quest1 && quest1.isCompleted) {
          setCustomDialogueText([
            'BS. Erythro: "Cảm ơn bạn! Máu ở Tâm Nhĩ Phải đã sẵn sàng chảy xuống Tâm Thất Phải qua Van 3 Lá."',
            'BS. Erythro: "Hãy tiếp tục hành trình xuống phía dưới gặp Nút Xoang Nhĩ nhé!"',
          ]);
          setIsQuestActionReady(false);
          setActiveDialogueNpc(npc);
          return;
        }
      }

      // Check if SA Node and player has solved quiz
      if (npc.id === 'npc-sa-node') {
        const quest2 = quests.find((q) => q.id === 'quest-2-pacemaker');
        if (quest2 && quest2.isCompleted) {
          setCustomDialogueText([
            'Nút Xoang Nhĩ: "Xung điện đang lan truyền đều đặn 75 lần/phút! Cục máu đông Fibrin đã tan hoàn toàn."',
            'Nút Xoang Nhĩ: "Lối đi thông sang Tâm Thất Trái ở bên trái đã mở rộng cho bạn rồi!"',
          ]);
          setIsQuestActionReady(false);
          setActiveDialogueNpc(npc);
          return;
        }
      }

      // Check if Terminal and player has solved quest 3
      if (npc.id === 'npc-terminal') {
        const quest3 = quests.find((q) => q.id === 'quest-3-circulation');
        if (quest3 && quest3.isCompleted) {
          setCustomDialogueText([
            'Bảng Điều Phối: "Sơ đồ Vòng Tuần Hoàn Lớn đã được định vị chính xác!"',
            'Bảng Điều Phối: "Cổng Động Mạch Chủ ở phía trên đã mở rộng sẵn sàng đón bạn tiến bước!"',
          ]);
          setIsQuestActionReady(false);
          setActiveDialogueNpc(npc);
          return;
        }
      }

      // Standard NPC Dialogue
      setCustomDialogueText(undefined);
      setIsQuestActionReady(false);
      setActiveDialogueNpc(npc);
      return;
    }

    if (nearbyInteractable.type === 'obstacle') {
      const obs = nearbyInteractable.data;
      playSound(220, 'sawtooth', 0.2);
      showToast(`${obs.name}: ${obs.hint}`);
      return;
    }

    if (nearbyInteractable.type === 'gateway') {
      const allDone = quests.every((q) => q.isCompleted);
      if (!allDone) {
        playSound(220, 'sawtooth', 0.25);
        showToast('Cổng chưa kích hoạt! Hãy hoàn thành cả 3 nhiệm vụ Sinh học để mở Cổng Động Mạch Chủ.');
        return;
      }

      // Complete Level Victory!
      playSound(523, 'sine', 0.2);
      setTimeout(() => playSound(659, 'sine', 0.2), 120);
      setTimeout(() => playSound(784, 'sine', 0.3), 240);
      setShowVictoryBanner(true);
      onStageVictory(mapData.id, stageMeta.exp, stageMeta.diamonds);
    }
  };

  // =========================================================================
  // KEYBOARD EVENT LISTENERS (WASD / ARROW KEYS / E INTERACTION)
  // =========================================================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsPaused((p) => !p);
        return;
      }

      // Freeze movement when dialogue or victory modal is open
      if (activeDialogueNpc || isPaused || showVictoryBanner) return;

      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        keysRef.current.up = true;
        setPlayerDirection('up');
      }
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        keysRef.current.down = true;
        setPlayerDirection('down');
      }
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        keysRef.current.left = true;
        setPlayerDirection('left');
      }
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        keysRef.current.right = true;
        setPlayerDirection('right');
      }

      if (e.key === 'e' || e.key === 'E' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleTriggerInteraction();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') keysRef.current.up = false;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') keysRef.current.down = false;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keysRef.current.left = false;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keysRef.current.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeDialogueNpc, isPaused, showVictoryBanner, nearbyInteractable]);

  // Touch Direction Helpers for Mobile Virtual D-Pad
  const handleTouchDirStart = (dir: 'up' | 'down' | 'left' | 'right') => {
    keysRef.current[dir] = true;
    setPlayerDirection(dir);
  };

  const handleTouchDirEnd = (dir: 'up' | 'down' | 'left' | 'right') => {
    keysRef.current[dir] = false;
  };

  // =========================================================================
  // MAIN TOP-DOWN MOVEMENT LOOP (60 FPS WITH COLLISION & WALL SLIDING)
  // =========================================================================
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05); // cap at 50ms
      lastTime = time;

      const modalOpen = activeDialogueNpc !== null || isPaused || showVictoryBanner;

      if (!modalOpen) {
        let vx = 0;
        let vy = 0;

        if (keysRef.current.up) vy -= 1;
        if (keysRef.current.down) vy += 1;
        if (keysRef.current.left) vx -= 1;
        if (keysRef.current.right) vx += 1;

        if (vx !== 0 || vy !== 0) {
          setIsWalking(true);

          // Normalize diagonal movement speed
          const len = Math.hypot(vx, vy);
          const moveDist = (PLAYER_SPEED / len) * dt;
          const stepX = vx * moveDist;
          const stepY = vy * moveDist;

          let currentX = playerPosRef.current.x;
          let currentY = playerPosRef.current.y;

          // Player collision bounding box (32x28 px centered near feet)
          const PLAYER_BOX_W = 32;
          const PLAYER_BOX_H = 28;

          // Solid obstacles list (walls + currently blocked obstacles)
          const solidObstacles: BoundingBox[] = [
            ...mapData.walls,
            ...obstacles.filter((obs) => obs.isBlocked),
          ];

          // 1. Try Horizontal Movement
          let nextX = currentX + stepX;
          const boxTestX: BoundingBox = {
            x: nextX - PLAYER_BOX_W / 2,
            y: currentY - PLAYER_BOX_H / 2,
            width: PLAYER_BOX_W,
            height: PLAYER_BOX_H,
          };

          let collideX = false;
          for (const wall of solidObstacles) {
            if (boxesIntersect(boxTestX, wall)) {
              collideX = true;
              break;
            }
          }
          if (!collideX) {
            currentX = Math.max(50, Math.min(mapData.worldWidth - 50, nextX));
          }

          // 2. Try Vertical Movement (Enables smooth wall sliding)
          let nextY = currentY + stepY;
          const boxTestY: BoundingBox = {
            x: currentX - PLAYER_BOX_W / 2,
            y: nextY - PLAYER_BOX_H / 2,
            width: PLAYER_BOX_W,
            height: PLAYER_BOX_H,
          };

          let collideY = false;
          for (const wall of solidObstacles) {
            if (boxesIntersect(boxTestY, wall)) {
              collideY = true;
              break;
            }
          }
          if (!collideY) {
            currentY = Math.max(50, Math.min(mapData.worldHeight - 50, nextY));
          }

          playerPosRef.current = { x: currentX, y: currentY };
          setPlayerPos({ x: currentX, y: currentY });

          // 3. Collectible Pickup Check (Walk within 40px of O2)
          collectibles.forEach((item) => {
            if (!item.isCollected) {
              const d = Math.hypot(currentX - item.x, currentY - item.y);
              if (d <= 42) {
                // Collect item!
                playSound(880, 'sine', 0.12);
                setCollectibles((prev) =>
                  prev.map((c) => (c.id === item.id ? { ...c, isCollected: true } : c))
                );

                // Update Quest 1
                setQuests((prev) =>
                  prev.map((q) => {
                    if (q.id === 'quest-1-oxygen') {
                      const nextCount = Math.min(4, (q.currentCount || 0) + 1);
                      if (nextCount === 4) {
                        showToast('Đã gom đủ 4 phân tử O₂! Hãy quay lại gặp Bác Sĩ Erythro.');
                      } else {
                        showToast(`Đã thu thập Phân Tử Oxy O₂! (${nextCount}/4)`);
                      }
                      return { ...q, currentCount: nextCount };
                    }
                    return q;
                  })
                );
              }
            }
          });
        } else {
          setIsWalking(false);
        }
      } else {
        setIsWalking(false);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [mapData, obstacles, collectibles, isPaused, activeDialogueNpc, showVictoryBanner, PLAYER_SPEED]);

  // =========================================================================
  // QUEST COMPLETION HANDLERS (GUARANTEED PREVENT DUPLICATE REWARDS)
  // =========================================================================

  // Quest 1 Action Complete (Erythro O2 Hand-in)
  const handleCompleteQuest1 = () => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === 'quest-1-oxygen' && !q.rewardClaimed) {
          playSound(784, 'sine', 0.25);
          showToast(`Hoàn thành Nhiệm Vụ 1: Nạp Oxy! Nhận +${q.expReward} EXP!`);
          // Unblock Obstacle 1 (Van 3 lá)
          setObstacles((obsList) =>
            obsList.map((obs) =>
              obs.id === 'obs-valve-3la' ? { ...obs, isBlocked: false } : obs
            )
          );
          return { ...q, isCompleted: true, rewardClaimed: true };
        }
        return q;
      })
    );
  };

  // Question Answer from Dialogue Box Handler
  const handleQuestionAnswer = (isCorrect: boolean) => {
    if (!isCorrect || !activeDialogueNpc) return;

    const npcId = activeDialogueNpc.id;

    // SA Node Question -> Completes Quest 2 & Dissolves Fibrin Clot
    if (npcId === 'npc-sa-node') {
      setQuests((prev) =>
        prev.map((q) => {
          if (q.id === 'quest-2-pacemaker' && !q.rewardClaimed) {
            playSound(784, 'sine', 0.25);
            showToast(`Hoàn thành Nhiệm Vụ 2: Nhịp Đập Tim! Nhận +${q.expReward} EXP!`);
            // Unblock Obstacle 2 (Fibrin Clot)
            setObstacles((obsList) =>
              obsList.map((obs) =>
                obs.id === 'obs-fibrin-clot' ? { ...obs, isBlocked: false } : obs
              )
            );
            return { ...q, isCompleted: true, rewardClaimed: true };
          }
          return q;
        })
      );
    }

    // Terminal Question -> Completes Quest 3 & Unlocks Aorta Gate
    if (npcId === 'npc-terminal') {
      setQuests((prev) =>
        prev.map((q) => {
          if (q.id === 'quest-3-circulation' && !q.rewardClaimed) {
            playSound(784, 'sine', 0.25);
            showToast(`Hoàn thành Nhiệm Vụ 3: Vòng Tuần Hoàn! Nhận +${q.expReward} EXP!`);
            // Unblock Obstacle 3 (Aorta Gate)
            setObstacles((obsList) =>
              obsList.map((obs) =>
                obs.id === 'obs-aorta-gate' ? { ...obs, isBlocked: false } : obs
              )
            );
            return { ...q, isCompleted: true, rewardClaimed: true };
          }
          return q;
        })
      );
    }
  };

  // Reset Exploration to Initial State
  const handleRestart = () => {
    playerPosRef.current = mapData.spawnPos;
    setPlayerPos(mapData.spawnPos);
    setPlayerDirection(mapData.spawnPos.direction);
    setObstacles(mapData.obstacles);
    setCollectibles(mapData.collectibles);
    setQuests(mapData.quests);
    setActiveDialogueNpc(null);
    setIsPaused(false);
    setShowVictoryBanner(false);
    setToastMessage(null);
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden select-none font-body-md text-on-surface">
      {/* ============================================================== */}
      {/* TOP-DOWN 2D WORLD RENDERER VIEWPORT                            */}
      {/* ============================================================== */}
      <TopDownWorldView
        mapData={mapData}
        playerPos={playerPos}
        playerDirection={playerDirection}
        isWalking={isWalking}
        cameraPos={cameraPos}
        activeObstacles={obstacles}
        activeCollectibles={collectibles}
        nearbyInteractable={nearbyInteractable}
        onInteract={handleTriggerInteraction}
      />

      {/* ============================================================== */}
      {/* TOP HUD & TOUCH CONTROLS                                       */}
      {/* ============================================================== */}
      <TopDownHUD
        stageName={mapData.name}
        organBadge={mapData.organBadge}
        currentChamber={currentChamber}
        quests={quests}
        isAudioMuted={isAudioMuted}
        onToggleAudio={() => setIsAudioMuted((m) => !m)}
        onOpenNotebook={onOpenNotebook}
        onPause={() => setIsPaused(true)}
        toastMessage={toastMessage}
        nearbyInteractableLabel={
          nearbyInteractable
            ? nearbyInteractable.type === 'npc'
              ? nearbyInteractable.data.name
              : nearbyInteractable.type === 'obstacle'
              ? nearbyInteractable.data.name
              : 'Vào Cổng Đích'
            : null
        }
        onInteract={handleTriggerInteraction}
        onDirectionInputStart={handleTouchDirStart}
        onDirectionInputEnd={handleTouchDirEnd}
      />

      {/* ============================================================== */}
      {/* CLASSIC POKÉMON-STYLE NPC DIALOGUE BOX                         */}
      {/* ============================================================== */}
      {activeDialogueNpc && (
        <TopDownDialogueBox
          npc={activeDialogueNpc}
          customDialogue={customDialogueText}
          isQuestCompletable={isQuestActionReady}
          onCompleteQuestAction={handleCompleteQuest1}
          onCompleteQuestion={handleQuestionAnswer}
          onClose={() => {
            setActiveDialogueNpc(null);
            setCustomDialogueText(undefined);
            setIsQuestActionReady(false);
          }}
        />
      )}

      {/* ============================================================== */}
      {/* PAUSE MENU MODAL                                               */}
      {/* ============================================================== */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-3xl p-6 shadow-2xl border-4 border-primary flex flex-col gap-4 text-center animate-scale-up">
            <h2 className="font-headline-md text-xl font-bold text-on-surface">
              TẠM DỪNG THÁM HIỂM
            </h2>
            <p className="text-body-sm text-on-surface-variant font-medium">
              Thế giới 2D Top-Down Buồng Tim đang được đóng băng an toàn.
            </p>

            <div className="bg-surface-container-low p-3.5 rounded-2xl text-left text-xs text-on-surface space-y-1.5 border border-surface-container-high">
              <span className="font-bold text-primary block">Tiến độ nhiệm vụ:</span>
              {quests.map((q) => (
                <p key={q.id}>
                  • {q.title}:{' '}
                  <span className={q.isCompleted ? 'text-emerald-600 font-bold' : 'text-amber-600'}>
                    {q.isCompleted ? 'Đã hoàn thành ✓' : 'Chưa xong'}
                  </span>
                </p>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => setIsPaused(false)}
                className="w-full py-3 rounded-full bg-primary text-white font-bold text-sm cursor-pointer shadow-md hover:bg-primary-container"
              >
                Tiếp tục chơi [Resume]
              </button>
              <button
                onClick={handleRestart}
                className="w-full py-2.5 rounded-full bg-surface-container text-on-surface hover:bg-surface-container-high font-bold text-sm cursor-pointer"
              >
                Khám phá lại từ đầu [Restart]
              </button>
              <button
                onClick={onExitToMap}
                className="w-full py-2.5 rounded-full bg-error-container text-on-error-container font-bold text-sm cursor-pointer"
              >
                Trở về Bản Đồ Hành Trình [Exit]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VICTORY CELEBRATION MODAL                                      */}
      {/* ============================================================== */}
      {showVictoryBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-400 flex flex-col items-center text-center gap-4 animate-scale-up">
            <div className="w-20 h-20 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-xl ring-8 ring-amber-300/50">
              <span className="material-symbols-outlined text-5xl">trophy</span>
            </div>

            <h2 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface">
              CHINH PHỤC THÀNH CÔNG!
            </h2>
            <p className="text-body-md text-primary font-bold">{mapData.name}</p>

            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-surface-container p-3 rounded-2xl flex flex-col items-center">
                <span className="text-xs text-on-surface-variant font-bold">Kinh nghiệm</span>
                <span className="text-lg font-bold text-amber-600">+{stageMeta.exp} EXP</span>
              </div>
              <div className="bg-surface-container p-3 rounded-2xl flex flex-col items-center">
                <span className="text-xs text-on-surface-variant font-bold">Kim cương</span>
                <span className="text-lg font-bold text-primary">+{stageMeta.diamonds} KC</span>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant">
              Tất cả các câu đố sinh học và dòng lưu thông máu đã được khai thông! Màn tiếp theo đã được mở khóa trên Bản Đồ.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs sm:text-sm cursor-pointer"
              >
                Khám phá lại
              </button>
              <button
                onClick={onExitToMap}
                className="flex-1 py-3 rounded-full bg-primary hover:bg-primary-container text-white font-bold text-xs sm:text-sm cursor-pointer shadow-lg"
              >
                Trở về Bản Đồ Hành Trình ▶
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
