import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/punjabDistricts';
import { HelpCircle, CheckCircle, XCircle, RotateCcw, Award, ChevronRight } from 'lucide-react';

export const PunjabQuiz: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIndex];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsComplete(false);
  };

  if (isComplete) {
    const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    return (
      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
          <Award className="w-9 h-9" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">Quiz Complete!</h2>
          <p className="text-xs text-slate-400 mt-1">Punjab Cartography & Geography Knowledge</p>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div className="text-4xl font-extrabold text-amber-400">{percentage}%</div>
          <div className="text-sm font-semibold text-white mt-1">
            You scored {score} out of {QUIZ_QUESTIONS.length} correct
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {percentage >= 80
              ? '🌟 Panj-Aab Scholar! Outstanding mastery of Punjab’s geography and heritage.'
              : percentage >= 50
              ? '👍 Good knowledge! Explore the interactive map to brush up on all 64 districts.'
              : '📚 Great effort! Check the 5 Rivers & Doabs guide and try again!'}
          </p>
        </div>

        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm transition-all shadow-lg shadow-amber-600/20"
        >
          <RotateCcw className="w-4 h-4" />
          Play Quiz Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Quiz Progress Header */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-xl flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800 uppercase tracking-wider">
            {currentQ.category}
          </span>
          <div className="text-xs text-slate-400 mt-1 font-medium">
            Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-400">Score</div>
          <div className="text-base font-bold text-amber-400">{score} pts</div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
          {currentQ.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700';

            if (isAnswered) {
              if (idx === currentQ.correctIndex) {
                btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
              } else if (idx === selectedOption) {
                btnStyle = 'bg-red-950/80 border-red-500 text-red-200';
              } else {
                btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-50';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(idx)}
                className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between gap-3 ${btnStyle}`}
              >
                <span>{opt}</span>
                {isAnswered && idx === currentQ.correctIndex && (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Card (shows after answer) */}
        {isAnswered && (
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 animate-in fade-in duration-150">
            <div className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              {selectedOption === currentQ.correctIndex ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Correct Answer!
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> Not Quite Correct:
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentQ.explanation}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-md transition-colors"
              >
                <span>{currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Results'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
