/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TopDownDialogueBox.tsx
 * Classic Pokémon-style dialogue and question interface for Top-Down exploration
 * Clean typography, tactile borders, Vietnamese text, keyboard & touch support.
 */

import React, { useEffect, useState } from 'react';
import { TopDownNPC } from './TopDownTypes';

interface TopDownDialogueBoxProps {
  npc: TopDownNPC;
  onClose: () => void;
  onCompleteQuestion?: (isCorrect: boolean) => void;
  customDialogue?: string[];
  isQuestCompletable?: boolean;
  onCompleteQuestAction?: () => void;
}

export const TopDownDialogueBox: React.FC<TopDownDialogueBoxProps> = ({
  npc,
  onClose,
  onCompleteQuestion,
  customDialogue,
  isQuestCompletable,
  onCompleteQuestAction,
}) => {
  const dialogueLines = customDialogue || npc.dialogue;
  const [currentLineIdx, setCurrentLineIdx] = useState<number>(0);
  const [phase, setPhase] = useState<'text' | 'quiz' | 'feedback'>('text');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false);

  // Advance dialogue with keyboard (E, Enter, Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (phase === 'text') {
        if (e.key === 'e' || e.key === 'E' || e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentLineIdx, phase, dialogueLines.length]);

  const handleNext = () => {
    if (currentLineIdx < dialogueLines.length - 1) {
      setCurrentLineIdx((prev) => prev + 1);
    } else {
      if (npc.question) {
        setPhase('quiz');
      } else if (isQuestCompletable && onCompleteQuestAction) {
        onCompleteQuestAction();
        onClose();
      } else {
        onClose();
      }
    }
  };

  const handleAnswerSubmit = () => {
    if (selectedOption === null || !npc.question) return;

    const correct = selectedOption === npc.question.correct;
    setIsAnswerCorrect(correct);
    if (correct) {
      setFeedbackText(`Chính xác! ${npc.question.explanation}`);
    } else {
      setFeedbackText('Chưa chính xác! Hãy đọc kỹ kiến thức Sinh học 8 và thử lại nhé.');
    }
    setPhase('feedback');
    if (onCompleteQuestion) {
      onCompleteQuestion(correct);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-3 sm:px-6 pointer-events-none animate-slide-up">
      <div className="w-full max-w-3xl bg-surface-container-lowest/95 backdrop-blur-xl border-4 border-primary rounded-3xl shadow-2xl p-4 sm:p-6 pointer-events-auto flex flex-col gap-3">
        {/* Header Tag with Speaker Name & Title */}
        <div className="flex items-center justify-between border-b border-surface-container-high pb-2">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md font-bold"
              style={{ backgroundColor: npc.color }}
            >
              <span className="material-symbols-outlined text-2xl">{npc.icon}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {npc.title}
              </span>
              <h3 className="font-headline-sm text-base sm:text-lg font-bold text-on-surface leading-tight">
                {npc.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface cursor-pointer text-sm font-bold"
            title="Đóng [Esc]"
          >
            ✕
          </button>
        </div>

        {/* Phase 1: Dialogue Text */}
        {phase === 'text' && (
          <div className="flex flex-col gap-4">
            <div className="min-h-[64px] flex items-center text-xs sm:text-sm md:text-base font-medium text-on-surface leading-relaxed">
              {dialogueLines[currentLineIdx]}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-on-surface-variant font-semibold">
                Đoạn {currentLineIdx + 1}/{dialogueLines.length} • Phím [E] để tiếp tục
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface cursor-pointer"
                >
                  Đóng ✕
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-2 rounded-full bg-primary hover:bg-primary-container text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer flex items-center gap-1"
                >
                  {currentLineIdx < dialogueLines.length - 1 ? (
                    <>
                      <span>Tiếp tục</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </>
                  ) : npc.question ? (
                    <>
                      <span>Trả lời câu hỏi</span>
                      <span className="material-symbols-outlined text-sm">edit_note</span>
                    </>
                  ) : isQuestCompletable ? (
                    <>
                      <span>Hoàn thành nhiệm vụ</span>
                      <span className="material-symbols-outlined text-sm">check</span>
                    </>
                  ) : (
                    <>
                      <span>Xong</span>
                      <span className="material-symbols-outlined text-sm">check</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Phase 2: Biological Question */}
        {phase === 'quiz' && npc.question && (
          <div className="flex flex-col gap-3">
            <p className="text-xs sm:text-sm font-bold text-primary">
              {npc.question.q}
            </p>

            <div className="flex flex-col gap-2">
              {npc.question.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  className={`p-3 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    selectedOption === idx
                      ? 'bg-primary-fixed text-primary font-bold border-primary shadow-sm'
                      : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-surface-container-highest'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface cursor-pointer"
              >
                Đóng ✕
              </button>
              <button
                onClick={handleAnswerSubmit}
                disabled={selectedOption === null}
                className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer"
              >
                Xác nhận câu trả lời
              </button>
            </div>
          </div>
        )}

        {/* Phase 3: Feedback */}
        {phase === 'feedback' && (
          <div className="flex flex-col gap-4">
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm font-medium border ${
                isAnswerCorrect
                  ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
                  : 'bg-rose-50 text-rose-950 border-rose-300'
              }`}
            >
              {feedbackText}
            </div>

            <div className="flex items-center justify-end gap-2">
              {!isAnswerCorrect ? (
                <button
                  onClick={() => setPhase('quiz')}
                  className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Thử lại ↺
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Tiếp tục thám hiểm ✓
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
