import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCcw, CheckCircle, XCircle } from 'lucide-react';
import { vocabularyData, kanjiData } from '../data';
import { Card, CardContent } from './ui/Card';
import { Vocabulary, KanjiWord } from '../types';

interface QuizViewProps {
  lessonIds: string[];
  testType: 'vocab' | 'kanji' | 'mixed';
  onBack: () => void;
  onMarkStarred: (id: string, type: 'vocab' | 'kanji') => void;
}

export default function QuizView({ lessonIds, testType, onBack, onMarkStarred }: QuizViewProps) {
  const quizItems = useMemo(() => {
    let items: Array<Vocabulary | KanjiWord> = [];
    if (testType === 'vocab' || testType === 'mixed') {
      items = [...items, ...vocabularyData.filter((w) => lessonIds.includes(w.lessonId))];
    }
    if (testType === 'kanji' || testType === 'mixed') {
      items = [...items, ...kanjiData.filter((k) => lessonIds.includes(k.lessonId))];
    }
    return items.sort(() => Math.random() - 0.5);
  }, [lessonIds, testType]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (quizItems.length === 0) return <div>Không có mục nào cho bài học này.</div>;

  const currentItem = quizItems[currentIndex];

  const handleReveal = () => {
    setShowAnswer(true);
  };

  const handleNext = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    
    if (currentIndex < quizItems.length - 1) {
      setCurrentIndex((i) => i + 1);
      setShowAnswer(false);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-500 pt-12">
        <div className="bg-white p-12 rounded-3xl shadow-xl border border-pink-100">
          <h2 className="text-4xl font-bold text-slate-800 mb-2">Hoàn thành Bài kiểm tra!</h2>
          <p className="text-xl text-slate-500 mb-8">Bạn đã hoàn thành bài kiểm tra tổng hợp.</p>
          
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-pink-600 mb-8">
            {score} / {quizItems.length}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
                setShowAnswer(false);
                setFinished(false);
              }}
              className="px-6 py-3 bg-pink-50 text-pink-600 font-semibold rounded-xl hover:bg-pink-100 transition-colors flex items-center gap-2"
            >
              <RefreshCcw size={20} />
              Làm lại
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              Quay lại Trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-pink-600 transition-colors py-2 px-4 rounded-xl hover:bg-pink-50 font-medium"
        >
          <ArrowLeft size={18} /> Thoát
        </button>
        <div className="flex items-center gap-4">
          <span className="text-pink-600 font-bold bg-pink-100 px-3 py-1 rounded-full text-sm">
            Điểm: {score}
          </span>
          <span className="text-slate-400 text-sm font-medium">
            {currentIndex + 1} / {quizItems.length}
          </span>
        </div>
      </div>

      <div className="w-full bg-pink-100 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-pink-500 h-full transition-all duration-500 ease-out" 
          style={{ width: `${((currentIndex) / quizItems.length) * 100}%` }}
        />
      </div>

      <Card className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center shadow-lg relative overflow-hidden">
        
        <h2 className="text-8xl font-serif text-slate-800 mb-8">
          {'word' in currentItem ? currentItem.word : currentItem.character}
        </h2>
        
        <AnimatePresence mode="wait">
          {!showAnswer ? (
             <motion.div
               key="question"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="mt-8"
             >
               <button
                 onClick={handleReveal}
                 className="px-8 py-3 bg-slate-800 text-white font-semibold rounded-full hover:bg-slate-700 transition-colors shadow-md active:scale-95"
               >
                 Hiển thị đáp án
               </button>
             </motion.div>
          ) : (
             <motion.div
               key="answer"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="w-full space-y-6"
             >
                <div className="space-y-4 bg-pink-50 p-6 rounded-2xl border border-pink-100">
                  {'furigana' in currentItem ? (
                     <p className="text-2xl text-pink-600 font-medium tracking-widest">{currentItem.furigana}</p>
                  ) : (
                     <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-pink-600 font-medium">
                       <span className="bg-white/60 px-4 py-2 rounded-full border border-pink-100">
                         <span className="text-pink-400 text-sm mr-2">音</span>{currentItem.onyomi || '-'}
                       </span>
                       <span className="bg-white/60 px-4 py-2 rounded-full border border-pink-100">
                         <span className="text-pink-400 text-sm mr-2">訓</span>{currentItem.kunyomi || '-'}
                       </span>
                     </div>
                  )}
                  <p className="text-2xl text-slate-700 font-bold">{currentItem.meaning}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <button
                    onClick={() => {
                      const type = 'word' in currentItem ? 'vocab' : 'kanji';
                      onMarkStarred(currentItem.id, type);
                      handleNext(false);
                    }}
                    className="py-4 flex items-center justify-center gap-2 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors active:scale-95"
                  >
                    <XCircle size={24} />
                    Quên
                  </button>
                  <button
                    onClick={() => handleNext(true)}
                    className="py-4 flex items-center justify-center gap-2 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 shadow-md shadow-pink-200 transition-colors active:scale-95"
                  >
                    <CheckCircle size={24} />
                    Đã thuộc
                  </button>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </Card>

    </div>
  );
}
