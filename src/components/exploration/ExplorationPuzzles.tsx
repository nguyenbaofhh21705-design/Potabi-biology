/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Interactive Biological Puzzles for 2D Side-Scrolling Exploration
 * High tactile quality, responsive, pure SVG/CSS, educational (Sinh học THCS)
 */

import React, { useState } from 'react';
import { PuzzleType } from './ExplorationTypes';

interface PuzzleModalProps {
  puzzleType: PuzzleType;
  title: string;
  onClose: () => void;
  onSolve: (rewardExp: number, rewardDiamonds: number) => void;
}

export const ExplorationPuzzleModal: React.FC<PuzzleModalProps> = ({
  puzzleType,
  title,
  onClose,
  onSolve,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-3xl shadow-2xl border-4 border-primary/80 p-4 sm:p-6 my-auto flex flex-col gap-4 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-primary to-primary-container text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-2xl sm:text-3xl">extension</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                CÂU ĐỐ SINH HỌC TƯƠNG TÁC
              </span>
              <h3 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface">
                {title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Puzzle Content Body */}
        {puzzleType === 'oxygen-load' && (
          <OxygenLoadingPuzzle onSolve={onSolve} onClose={onClose} />
        )}
        {puzzleType === 'blood-flow' && (
          <BloodFlowPathwayPuzzle onSolve={onSolve} onClose={onClose} />
        )}
        {puzzleType === 'valve-timing' && (
          <ValveTimingPuzzle onSolve={onSolve} onClose={onClose} />
        )}
        {puzzleType === 'digestive-enzyme' && (
          <DigestiveEnzymePuzzle onSolve={onSolve} onClose={onClose} />
        )}
        {puzzleType !== 'oxygen-load' &&
          puzzleType !== 'blood-flow' &&
          puzzleType !== 'valve-timing' &&
          puzzleType !== 'digestive-enzyme' && (
            <GenericBiologyPuzzle puzzleType={puzzleType} onSolve={onSolve} onClose={onClose} />
          )}
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 1. OXYGEN LOADING PUZZLE (HỆ TUẦN HOÀN - NẠP OXY CHO HỒNG CẦU)            */
/* ========================================================================= */
const OxygenLoadingPuzzle: React.FC<{
  onSolve: (exp: number, diamonds: number) => void;
  onClose: () => void;
}> = ({ onSolve, onClose }) => {
  const [boundOxygens, setBoundOxygens] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const pockets = [0, 1, 2, 3]; // 4 Heme pockets

  const handleBindOxygen = (pocketId: number) => {
    if (boundOxygens.includes(pocketId)) return;
    const next = [...boundOxygens, pocketId];
    setBoundOxygens(next);
    if (next.length === 4) {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setBoundOxygens([]);
    setIsCompleted(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 sm:p-4 text-xs sm:text-sm text-rose-950 leading-relaxed">
        <p className="font-bold text-rose-900 mb-1">
          Nhiệm vụ: Gắn 4 phân tử Oxy ($O_2$) vào 4 vị trí nhân Heme của phân tử Hemoglobin (Hb)!
        </p>
        <p className="text-rose-800">
          Mỗi phân tử Hemoglobin trong hồng cầu có thể liên kết thuận nghịch với 4 phân tử $O_2$.
          Khi nhận đủ 4 $O_2$ tại mao mạch phổi, hồng cầu chuyển từ màu đỏ thẫm thành màu đỏ tươi rực rỡ!
        </p>
        <div className="mt-2 inline-block bg-white/80 px-2.5 py-1 rounded-lg font-mono font-bold text-rose-700 text-xs shadow-xs">
          Hb (Đỏ sẫm) + 4 O₂ ⇄ Hb(O₂)₄ (Oxyhemoglobin - Đỏ tươi)
        </div>
      </div>

      {/* Interactive RBC with 4 Heme binding sites */}
      <div className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-b from-rose-950/10 via-rose-50/50 to-white rounded-3xl border border-rose-200">
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
          {/* Erythrocyte Body */}
          <div
            className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full transition-all duration-700 shadow-2xl flex items-center justify-center ${
              boundOxygens.length === 4
                ? 'bg-gradient-to-tr from-rose-600 via-red-500 to-rose-400 ring-8 ring-rose-300 shadow-[0_0_40px_rgba(244,63,94,0.6)] animate-pulse'
                : boundOxygens.length > 0
                ? 'bg-gradient-to-tr from-rose-800 via-rose-700 to-rose-600 ring-4 ring-rose-200'
                : 'bg-gradient-to-tr from-rose-950 via-rose-900 to-rose-800 ring-4 ring-rose-300/40'
            }`}
          >
            {/* RBC Biconcave Center Indentation */}
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full transition-colors duration-700 flex flex-col items-center justify-center text-center p-2 shadow-inner ${
                boundOxygens.length === 4 ? 'bg-red-700/80' : 'bg-rose-950/90'
              }`}
            >
              <span className="text-[11px] font-bold text-rose-200">
                {boundOxygens.length === 4 ? 'Hb(O₂)₄' : `Hb (${boundOxygens.length}/4 O₂)`}
              </span>
              <span className="text-[9px] text-white/80">
                {boundOxygens.length === 4 ? 'Đỏ tươi rực rỡ' : 'Đỏ thẫm'}
              </span>
            </div>
          </div>

          {/* 4 Heme Pockets around the perimeter */}
          {pockets.map((idx) => {
            const isBound = boundOxygens.includes(idx);
            // Positions for 4 corners
            const positions = [
              'top-2 left-2',
              'top-2 right-2',
              'bottom-2 left-2',
              'bottom-2 right-2',
            ];
            return (
              <button
                key={idx}
                onClick={() => handleBindOxygen(idx)}
                className={`absolute ${positions[idx]} w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg border-2 ${
                  isBound
                    ? 'bg-cyan-500 border-white text-white scale-105 shadow-cyan-300/50'
                    : 'bg-white/90 border-rose-300 text-rose-800 hover:scale-110 hover:border-cyan-400'
                }`}
              >
                {isBound ? (
                  <>
                    <span className="material-symbols-outlined text-lg animate-spin-slow">
                      bubble_chart
                    </span>
                    <span className="text-[10px] font-bold">O₂ Đã Gắn</span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-bold text-rose-600">Vị trí {idx + 1}</span>
                    <span className="text-[9px] text-cyan-600 font-bold">+ Chạm nạp</span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 text-xs font-semibold text-rose-800 text-center">
          Đã gắn: <span className="font-bold text-rose-600">{boundOxygens.length}/4</span> phân tử Oxy.
          {boundOxygens.length < 4 ? ' Hãy chạm vào các vị trí Heme còn trống để nạp đủ Oxy!' : ''}
        </div>
      </div>

      {/* Reward & Confirmation */}
      {isCompleted ? (
        <div className="bg-emerald-50 border-2 border-emerald-400 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-3xl text-emerald-600">check_circle</span>
            <div>
              <p className="text-xs sm:text-sm font-bold text-emerald-950">
                Tuyệt vời! Hồng cầu đã bão hòa Oxy sẵn sàng nuôi các mô tế bào!
              </p>
              <p className="text-[11px] text-emerald-700">
                Nhận thưởng: +60 EXP • Mở khóa Tiêu bản Hồng Cầu Giàu Oxy
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onSolve(60, 10);
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer whitespace-nowrap"
          >
            Thu nhận phần thưởng ✓
          </button>
        </div>
      ) : (
        <div className="flex justify-end gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold cursor-pointer"
          >
            Làm lại
          </button>
        </div>
      )}
    </div>
  );
};

/* ========================================================================= */
/* 2. BLOOD FLOW PATHWAY PUZZLE (HỆ TUẦN HOÀN - HƯỚNG LƯU THÔNG CỦA MÁU)     */
/* ========================================================================= */
const BloodFlowPathwayPuzzle: React.FC<{
  onSolve: (exp: number, diamonds: number) => void;
  onClose: () => void;
}> = ({ onSolve, onClose }) => {
  // Correct order for systemic circulation (Vòng tuần hoàn lớn)
  const CORRECT_ORDER = [
    'Tâm thất trái (Máu đỏ tươi giàu O₂)',
    'Động mạch chủ (Áp lực cao)',
    'Mao mạch các cơ quan (Trao đổi khí O₂ lấy CO₂)',
    'Tĩnh mạch chủ (Máu đỏ thẫm)',
    'Tâm nhĩ phải (Hoàn thành vòng lớn)',
  ];

  const INITIAL_OPTIONS = [
    'Tĩnh mạch chủ (Máu đỏ thẫm)',
    'Mao mạch các cơ quan (Trao đổi khí O₂ lấy CO₂)',
    'Tâm thất trái (Máu đỏ tươi giàu O₂)',
    'Tâm nhĩ phải (Hoàn thành vòng lớn)',
    'Động mạch chủ (Áp lực cao)',
  ];

  const [selectedSequence, setSelectedSequence] = useState<string[]>([]);
  const [availableItems, setAvailableItems] = useState<string[]>(INITIAL_OPTIONS);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectItem = (item: string) => {
    setErrorMessage(null);
    setSelectedSequence((prev) => [...prev, item]);
    setAvailableItems((prev) => prev.filter((i) => i !== item));
  };

  const handleRemoveItem = (index: number) => {
    setErrorMessage(null);
    const itemToRemove = selectedSequence[index];
    setSelectedSequence((prev) => prev.filter((_, i) => i !== index));
    setAvailableItems((prev) => [...prev, itemToRemove]);
  };

  const handleCheckOrder = () => {
    if (selectedSequence.length !== CORRECT_ORDER.length) {
      setErrorMessage('Hãy xếp đủ cả 5 chặng đường lưu thông của dòng máu!');
      return;
    }

    const matches = selectedSequence.every((val, idx) => val === CORRECT_ORDER[idx]);
    if (matches) {
      setIsSuccess(true);
      setErrorMessage(null);
    } else {
      setErrorMessage('Thứ tự chưa chính xác! Hãy nhớ: Máu bắt đầu từ Tâm thất trái phóng vào Động mạch chủ, đi qua các cơ quan rồi trở về Tâm nhĩ phải qua Tĩnh mạch chủ.');
    }
  };

  const handleReset = () => {
    setSelectedSequence([]);
    setAvailableItems(INITIAL_OPTIONS);
    setIsSuccess(false);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 sm:p-4 text-xs sm:text-sm text-sky-950 leading-relaxed">
        <p className="font-bold text-sky-900 mb-1">
          Nhiệm vụ: Sắp xếp các chặng đường theo đúng thứ tự của Vòng Tuần Hoàn Lớn (Sinh học 8)!
        </p>
        <p className="text-sky-800">
          Chạm vào từng ô để đưa vào sơ đồ theo chiều di chuyển của dòng máu từ buồng tim đi nuôi toàn cơ thể.
        </p>
      </div>

      {/* Selected Sequence (Slots) */}
      <div className="flex flex-col gap-2 bg-surface-container-low p-3 sm:p-4 rounded-2xl border border-surface-container-high">
        <span className="text-xs font-bold text-primary flex items-center gap-1.5">
          <span className="material-symbols-outlined text-base">alt_route</span>
          SƠ ĐỒ BẠN ĐANG SẮP XẾP ({selectedSequence.length}/5 chặng):
        </span>

        {selectedSequence.length === 0 ? (
          <div className="text-center py-6 text-on-surface-variant text-xs italic">
            Chưa có chặng nào được chọn. Hãy chạm vào các ô bên dưới để bắt đầu sắp xếp!
          </div>
        ) : (
          <div className="flex flex-col gap-1.5">
            {selectedSequence.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-primary/30 shadow-xs text-xs font-medium text-on-surface"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
                {!isSuccess && (
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="text-rose-500 hover:text-rose-700 text-xs font-bold cursor-pointer px-1.5 py-0.5 rounded-md hover:bg-rose-50"
                  >
                    Bỏ chọn ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Items Pool */}
      {!isSuccess && availableItems.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-on-surface-variant">
            Chạm để chọn chặng tiếp theo:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectItem(item)}
                className="p-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high border border-surface-container-highest text-left text-xs font-medium text-on-surface cursor-pointer transition-all hover:scale-[1.01] active:scale-95"
              >
                + {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error feedback */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      {/* Success banner or Controls */}
      {isSuccess ? (
        <div className="bg-emerald-50 border-2 border-emerald-400 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-3xl text-emerald-600">verified</span>
            <div>
              <p className="text-xs sm:text-sm font-bold text-emerald-950">
                Hoàn toàn chính xác! Vòng tuần hoàn lớn đã thông suốt!
              </p>
              <p className="text-[11px] text-emerald-700">
                Nhận thưởng: +80 EXP • Mở khóa kiến thức Tuần Hoàn Toàn Thân
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onSolve(80, 15);
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer whitespace-nowrap"
          >
            Nhận thưởng & Tiếp tục ✓
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold cursor-pointer"
          >
            Đặt lại từ đầu
          </button>
          <button
            onClick={handleCheckOrder}
            disabled={selectedSequence.length === 0}
            className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer"
          >
            Kiểm tra sơ đồ ➔
          </button>
        </div>
      )}
    </div>
  );
};

/* ========================================================================= */
/* 3. VALVE TIMING & MECHANISM PUZZLE (CƠ CHẾ ĐÓNG MỞ VAN TIM)              */
/* ========================================================================= */
const ValveTimingPuzzle: React.FC<{
  onSolve: (exp: number, diamonds: number) => void;
  onClose: () => void;
}> = ({ onSolve, onClose }) => {
  const [selectedPhase, setSelectedPhase] = useState<'systole-atria' | 'systole-ventricles' | 'diastole'>('systole-ventricles');
  const [selectedQuestionAnswer, setSelectedQuestionAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSolved, setIsSolved] = useState(false);

  const phaseData = {
    'systole-atria': {
      title: 'Pha co tâm nhĩ (0.1 giây)',
      atriaState: 'Co bóp (Đẩy máu xuống thất)',
      ventriclesState: 'Giãn (Tiếp nhận máu)',
      avValves: 'MỞ (Dòng máu chảy xuôi)',
      slValves: 'ĐÓNG (Tránh trào ngược từ động mạch)',
      bloodDirection: 'Tâm nhĩ ➔ Tâm thất',
    },
    'systole-ventricles': {
      title: 'Pha co tâm thất (0.3 giây)',
      atriaState: 'Giãn',
      ventriclesState: 'Co bóp cực mạnh (Tống máu vào động mạch)',
      avValves: 'ĐÓNG CHẶT (Ngăn máu trào ngược về tâm nhĩ!)',
      slValves: 'MỞ BẬT RA (Máu phóng mạnh vào Động mạch chủ & Động mạch phổi)',
      bloodDirection: 'Tâm thất ➔ Động mạch chủ & Động mạch phổi',
    },
    'diastole': {
      title: 'Pha giãn chung (0.4 giây)',
      atriaState: 'Giãn hoàn toàn (Hút máu về từ tĩnh mạch)',
      ventriclesState: 'Giãn hoàn toàn',
      avValves: 'Mở hờ',
      slValves: 'ĐÓNG KÍN (Ngăn máu từ động mạch dội về buồng thất)',
      bloodDirection: 'Tĩnh mạch ➔ Tâm nhĩ',
    },
  };

  const handleVerify = () => {
    if (selectedQuestionAnswer === 1) {
      setIsSolved(true);
      setFeedback('Chính xác! Khi tâm thất co bóp, van nhĩ thất (van 2 lá & 3 lá) đóng chặt ngăn không cho máu chảy ngược về tâm nhĩ, đồng thời van bán nguyệt mở đẩy máu vào động mạch!');
    } else {
      setFeedback('Chưa chính xác! Hãy quan sát mô phỏng pha Co Tâm Thất và chọn lại nhé.');
    }
  };

  const current = phaseData[selectedPhase];

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 sm:p-4 text-xs sm:text-sm text-amber-950 leading-relaxed">
        <p className="font-bold text-amber-900 mb-1">
          Nhiệm vụ: Khám phá cơ chế đóng/mở van tim và giải thích vì sao máu chỉ chảy theo 1 chiều!
        </p>
        <p className="text-amber-800">
          Chuyển đổi giữa 3 pha của chu kỳ tim (0.8 giây) để quan sát sự phối hợp giữa thành cơ tim và các lá van.
        </p>
      </div>

      {/* Phase Selector Tabs */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setSelectedPhase('systole-atria')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            selectedPhase === 'systole-atria'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          1. Co tâm nhĩ (0.1s)
        </button>
        <button
          onClick={() => setSelectedPhase('systole-ventricles')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            selectedPhase === 'systole-ventricles'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          2. Co tâm thất (0.3s)
        </button>
        <button
          onClick={() => setSelectedPhase('diastole')}
          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
            selectedPhase === 'diastole'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
          }`}
        >
          3. Giãn chung (0.4s)
        </button>
      </div>

      {/* Dynamic Simulation Card */}
      <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-high flex flex-col gap-2.5">
        <div className="flex items-center justify-between border-b border-surface-container pb-2">
          <span className="font-bold text-sm text-primary">{current.title}</span>
          <span className="text-[11px] font-mono font-bold bg-white px-2 py-0.5 rounded-md text-on-surface">
            Hướng dòng máu: {current.bloodDirection}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-white p-2.5 rounded-xl border border-surface-container-high">
            <span className="font-bold text-rose-800 block mb-1">Van Nhĩ - Thất (3 lá & 2 lá):</span>
            <span className={`font-bold ${current.avValves.includes('ĐÓNG') ? 'text-rose-600' : 'text-emerald-600'}`}>
              {current.avValves}
            </span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-surface-container-high">
            <span className="font-bold text-sky-800 block mb-1">Van Động Mạch (Bán nguyệt):</span>
            <span className={`font-bold ${current.slValves.includes('MỞ') ? 'text-emerald-600' : 'text-rose-600'}`}>
              {current.slValves}
            </span>
          </div>
        </div>
      </div>

      {/* Question section */}
      <div className="flex flex-col gap-2">
        <p className="text-xs sm:text-sm font-bold text-on-surface">
          Câu hỏi: Khi tâm thất co bóp mạnh để tống máu, van tim nào đóng lại để ngăn máu chảy ngược về tâm nhĩ?
        </p>
        <div className="flex flex-col gap-1.5">
          {[
            'A. Van bán nguyệt (van động mạch) đóng chặt',
            'B. Van nhĩ - thất (van 3 lá và van 2 lá) đóng chặt',
            'C. Cả tất cả các van tim đều đồng loạt mở toang',
          ].map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedQuestionAnswer(idx)}
              className={`p-2.5 rounded-xl border text-left text-xs font-medium cursor-pointer transition-all ${
                selectedQuestionAnswer === idx
                  ? 'bg-primary-fixed text-primary font-bold border-primary'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div className={`p-3 rounded-xl text-xs font-medium ${isSolved ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-rose-100 text-rose-950 border border-rose-300'}`}>
          {feedback}
        </div>
      )}

      {isSolved ? (
        <div className="flex justify-end">
          <button
            onClick={() => {
              onSolve(75, 10);
              onClose();
            }}
            className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer"
          >
            Nhận thưởng +75 EXP ✓
          </button>
        </div>
      ) : (
        <div className="flex justify-end">
          <button
            onClick={handleVerify}
            disabled={selectedQuestionAnswer === null}
            className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer"
          >
            Xác nhận câu trả lời
          </button>
        </div>
      )}
    </div>
  );
};

/* ========================================================================= */
/* 4. DIGESTIVE ENZYME PUZZLE (HỆ TIÊU HÓA)                                  */
/* ========================================================================= */
const DigestiveEnzymePuzzle: React.FC<{
  onSolve: (exp: number, diamonds: number) => void;
  onClose: () => void;
}> = ({ onSolve, onClose }) => {
  const [selectedEnzyme, setSelectedEnzyme] = useState<number | null>(null);
  const [isSolved, setIsSolved] = useState(false);

  return (
    <div className="flex flex-col gap-4 text-xs sm:text-sm">
      <div className="bg-fuchsia-50 border border-fuchsia-200 rounded-2xl p-3 sm:p-4 text-fuchsia-950">
        <p className="font-bold mb-1">Khám phá hoạt tính Enzyme Pepsin trong dịch vị dạ dày:</p>
        <p>Enzym Pepsin cần môi trường pH như thế nào do axit HCl tạo ra để hoạt động tối ưu?</p>
      </div>

      <div className="flex flex-col gap-2">
        {[
          'A. Môi trường kiềm mạnh (pH 8.0 - 9.0)',
          'B. Môi trường axit mạnh (pH 1.5 - 2.5)',
          'C. Môi trường trung tính (pH 7.0)',
        ].map((opt, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedEnzyme(idx)}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              selectedEnzyme === idx
                ? 'bg-primary-fixed text-primary font-bold border-primary'
                : 'bg-surface-container hover:bg-surface-container-high'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        {isSolved ? (
          <button
            onClick={() => {
              onSolve(60, 10);
              onClose();
            }}
            className="px-6 py-2.5 rounded-full bg-emerald-600 text-white font-bold cursor-pointer"
          >
            Nhận thưởng ✓
          </button>
        ) : (
          <button
            onClick={() => {
              if (selectedEnzyme === 1) {
                setIsSolved(true);
              }
            }}
            disabled={selectedEnzyme === null}
            className="px-6 py-2.5 rounded-full bg-primary text-white font-bold disabled:opacity-50 cursor-pointer"
          >
            Kiểm tra
          </button>
        )}
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 5. GENERIC BIOLOGY PUZZLE (CHO CÁC HỆ CƠ QUAN CÒN LẠI)                    */
/* ========================================================================= */
const GenericBiologyPuzzle: React.FC<{
  puzzleType: PuzzleType;
  onSolve: (exp: number, diamonds: number) => void;
  onClose: () => void;
}> = ({ puzzleType, onSolve, onClose }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);

  const puzzleDataMap: Record<string, { q: string; options: string[]; correct: number; exp: number }> = {
    'gas-exchange': {
      q: 'Tại phế nang phổi, khí Oxy (O2) và Cacbonic (CO2) được trao đổi theo cơ chế nào (Sinh học 8)?',
      options: [
        'A. Vận chuyển chủ động tiêu tốn ATP',
        'B. Khuếch tán từ nơi có nồng độ (phân áp) cao đến nơi có nồng độ thấp',
        'C. Lực hút từ tính của hồng cầu',
      ],
      correct: 1,
      exp: 70,
    },
    'synapse-signal': {
      q: 'Xung thần kinh được truyền qua khe Synapse hóa học bằng phương thức nào?',
      options: [
        'A. Dòng điện cao thế phóng trực tiếp qua khe',
        'B. Hạt chất dẫn truyền trung gian hóa học (như Axêtilcôlin) gắn vào thụ thể màng sau',
        'C. Nhờ các phân tử enzym tiêu hóa',
      ],
      correct: 1,
      exp: 75,
    },
    'nephron-filter': {
      q: 'Quá trình lọc máu ở nang cầu thận tạo ra sản phẩm gì đầu tiên?',
      options: [
        'A. Nước tiểu chính thức đậm đặc',
        'B. Nước tiểu đầu (chứa nhiều nước, glucozơ, không có tế bào máu)',
        'C. Dòng máu chứa đầy chất cặn bã Ure',
      ],
      correct: 1,
      exp: 75,
    },
    'hormone-lock': {
      q: 'Đặc điểm nào giúp Hormone tác động chính xác lên tế bào đích mà không tác động bừa bãi?',
      options: [
        'A. Tính đặc hiệu: Hormone như chìa khóa khớp đúng ổ khóa thụ thể trên màng tế bào đích',
        'B. Hormone có tốc độ di chuyển nhanh gấp 100 lần dòng máu',
        'C. Do hệ tiêu hóa phân loại hormone trước',
      ],
      correct: 0,
      exp: 75,
    },
    'fertilization': {
      q: 'Bộ nhiễm sắc thể của hợp tử sau khi thụ tinh giữa trứng (n=23) và tinh trùng (n=23) là:',
      options: [
        'A. Đơn bội n = 23 chiếc',
        'B. Lưỡng bội 2n = 46 chiếc',
        'C. Tam bội 3n = 69 chiếc',
      ],
      correct: 1,
      exp: 80,
    },
    'bone-lever': {
      q: 'Khung xương và bắp cơ phối hợp tạo thành hệ thống gì trong cơ thể người?',
      options: [
        'A. Hệ thống đòn bẩy cơ học giúp cơ thể cử động nhịp nhàng',
        'B. Hệ thống ống dẫn nước khép kín',
        'C. Hệ thống lọc dịch thể',
      ],
      correct: 0,
      exp: 70,
    },
  };

  const current = puzzleDataMap[puzzleType] || {
    q: 'Kiểm tra kiến thức sinh học ứng dụng cơ thể người:',
    options: ['A. Khám phá đúng', 'B. Phương án khác'],
    correct: 0,
    exp: 50,
  };

  return (
    <div className="flex flex-col gap-4 text-xs sm:text-sm">
      <p className="font-bold text-on-surface">{current.q}</p>
      <div className="flex flex-col gap-2">
        {current.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => setSelected(idx)}
            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
              selected === idx
                ? 'bg-primary-fixed text-primary font-bold border-primary'
                : 'bg-surface-container hover:bg-surface-container-high'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="flex justify-end">
        {solved ? (
          <button
            onClick={() => {
              onSolve(current.exp, 10);
              onClose();
            }}
            className="px-6 py-2.5 rounded-full bg-emerald-600 text-white font-bold cursor-pointer"
          >
            Nhận thưởng ✓
          </button>
        ) : (
          <button
            onClick={() => {
              if (selected === current.correct) setSolved(true);
            }}
            disabled={selected === null}
            className="px-6 py-2.5 rounded-full bg-primary text-white font-bold disabled:opacity-50 cursor-pointer"
          >
            Kiểm tra câu trả lời
          </button>
        )}
      </div>
    </div>
  );
};
