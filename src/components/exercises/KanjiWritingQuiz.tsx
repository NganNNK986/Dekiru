import React, { useState } from 'react';
import { ArrowLeft, Check, X, Eye, RefreshCcw } from 'lucide-react';
import { KanjiWord } from '../../types';
import { Card } from '../ui/Card';
import { useLearning } from '../../contexts/LearningContext';

interface KanjiWritingQuizProps {
  kanjis: KanjiWord[];
  onBack: () => void;
}

export default function KanjiWritingQuiz({ kanjis, onBack }: KanjiWritingQuizProps) {
  const { recordExerciseResult } = useLearning();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [selfAssessment, setSelfAssessment] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (kanjis.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <p className="text-slate-600 mb-4">Không có Kanji nào để luyện viết.</p>
        <button onClick={onBack} className="px-6 py-2 bg-pink-500 text-white rounded-xl">Quay lại</button>
      </div>
    );
  }

  const currentItem = kanjis[currentIndex];

  const handleNext = (correct: boolean) => {
    setSelfAssessment(correct);
    recordExerciseResult(currentItem.id, 'kanji', correct);
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      if (currentIndex < kanjis.length - 1) {
        setCurrentIndex(i => i + 1);
        setIsRevealed(false);
        setSelfAssessment(null);
      } else {
        setFinished(true);
      }
    }, 800);
  };

  if (finished) {
    return (
      <Card className="max-w-xl mx-auto p-8 text-center space-y-6">
        <h2 className="text-3xl font-bold text-slate-800">Hoàn thành luyện tự viết Kanji!</h2>
        <p className="text-5xl font-black text-emerald-600">{score} / {kanjis.length}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setScore(0);
              setIsRevealed(false);
              setSelfAssessment(null);
              setFinished(false);
            }}
            className="px-6 py-3 bg-slate-100 rounded-xl font-bold flex items-center gap-2"
          >
            <RefreshCcw size={18} /> Luyện lại
          </button>
          <button onClick={onBack} className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold">Quay lại</button>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-medium">
          <ArrowLeft size={18} /> Thoát
        </button>
        <span className="text-sm font-bold text-slate-400">{currentIndex + 1} / {kanjis.length}</span>
      </div>

      <Card className="p-8 text-center space-y-8">
        <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full">
          Active Recall (Luyện viết Kanji)
        </span>

        <div className="space-y-2">
          <p className="text-3xl font-bold text-emerald-700">{currentItem.meaning}</p>
          <p className="text-slate-500">
            {currentItem.onyomi ? `Onyomi: ${currentItem.onyomi}` : ''} 
            {currentItem.kunyomi ? ` | Kunyomi: ${currentItem.kunyomi}` : ''}
          </p>
        </div>

        <div className="h-48 border-2 border-dashed border-emerald-200 rounded-3xl flex items-center justify-center bg-emerald-50/30 relative">
          {!isRevealed ? (
            <button
              onClick={() => setIsRevealed(true)}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
            >
              <Eye size={20} /> Hiện nét chữ
            </button>
          ) : (
            <span className="text-8xl font-serif text-slate-800 animate-in zoom-in">{currentItem.character}</span>
          )}
        </div>

        {isRevealed && selfAssessment === null && (
          <div className="space-y-3 animate-in fade-in">
            <p className="text-sm text-slate-500">Bạn có viết đúng chữ này ra giấy hoặc nhớ đúng không?</p>
            <div className="flex gap-4">
              <button
                onClick={() => handleNext(false)}
                className="flex-1 py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl border border-rose-200 flex items-center justify-center gap-2"
              >
                <X size={20} /> Viết sai / Quên
              </button>
              <button
                onClick={() => handleNext(true)}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md"
              >
                <Check size={20} /> Viết chính xác
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
