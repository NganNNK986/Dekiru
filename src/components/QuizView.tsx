import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCcw, CheckCircle, XCircle, ArrowRight, Check, X } from 'lucide-react';
import { vocabularyData, kanjiData } from '../data';
import { Card } from './ui/Card';
import { Vocabulary, KanjiWord } from '../types';
import { useQuizSession } from '../hooks/useQuizSession';

interface QuizViewProps {
  lessonIds: string[];
  testType: 'vocab' | 'kanji' | 'mixed';
  onBack: () => void;
  onMarkStarred: (id: string, type: 'vocab' | 'kanji') => void;
}

type QuizViewState = {
  quizItems: Array<Vocabulary | KanjiWord>;
  currentIndex: number;
  userResults: Record<string, boolean>;
  isFinished: boolean;
};

export default function QuizView({ lessonIds, testType, onBack, onMarkStarred }: QuizViewProps) {
  const itemsKey = useMemo(() => `${testType}-${lessonIds.join('-')}`, [testType, lessonIds]);
  
  const [session, setSession, clearSession] = useQuizSession<QuizViewState>(
    `flashcard-quiz-${itemsKey}`,
    () => {
      let items: Array<Vocabulary | KanjiWord> = [];
      if (testType === 'vocab' || testType === 'mixed') {
        items = [...items, ...vocabularyData.filter((w) => lessonIds.includes(w.lessonId))];
      }
      if (testType === 'kanji' || testType === 'mixed') {
        items = [...items, ...kanjiData.filter((k) => lessonIds.includes(k.lessonId))];
      }
      return {
        quizItems: items.sort(() => Math.random() - 0.5),
        currentIndex: 0,
        userResults: {},
        isFinished: false
      };
    }
  );

  const { quizItems, currentIndex, userResults, isFinished } = session;
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setShowAnswer(false);
  }, [currentIndex]);

  if (quizItems.length === 0) return <div className="text-center pt-12">Không có mục nào cho bài học này.</div>;

  const currentItem = quizItems[currentIndex];
  const isAnswered = userResults[currentItem.id] !== undefined;
  const isShowAnswer = showAnswer || isAnswered;
  
  const score = Object.values(userResults).filter(Boolean).length;

  const handleReveal = () => {
    setShowAnswer(true);
  };

  const handleSelect = (correct: boolean) => {
    if (isAnswered) return;

    if (!correct) {
      const type = 'word' in currentItem ? 'vocab' : 'kanji';
      onMarkStarred(currentItem.id, type);
    }

    setSession(prev => ({
      ...prev,
      userResults: { ...prev.userResults, [currentItem.id]: correct }
    }));
    
    // Auto go next after short delay
    setTimeout(() => {
      if (currentIndex < quizItems.length - 1) {
        setSession(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
      } else {
        setSession(prev => ({ ...prev, isFinished: true }));
      }
    }, 400);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSession(prev => ({ ...prev, currentIndex: prev.currentIndex - 1 }));
    }
  };

  const handleNext = () => {
    if (currentIndex < quizItems.length - 1) {
      setSession(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
    } else {
      setSession(prev => ({ ...prev, isFinished: true }));
    }
  };

  if (isFinished) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500 pt-8 pb-12">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-pink-100 text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-2">Hoàn thành Thẻ nhớ!</h2>
          <p className="text-xl text-slate-500 mb-8">Bạn đã ôn tập xong toàn bộ danh sách.</p>
          
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-pink-600 mb-8">
            {score} / {quizItems.length}
          </div>

          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => clearSession()}
              className="px-6 py-3 bg-pink-50 text-pink-600 font-semibold rounded-xl hover:bg-pink-100 transition-colors flex items-center gap-2"
            >
              <RefreshCcw size={20} />
              Học lại
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              Quay lại bài học
            </button>
          </div>

          <div className="text-left space-y-4">
            <h3 className="text-2xl font-bold text-slate-800 border-b pb-2 mb-6">Kết quả chi tiết</h3>
            {quizItems.map((item, idx) => {
              const isCorrect = userResults[item.id];
              return (
                <div key={item.id} className={`p-4 rounded-2xl flex items-center justify-between border-2 ${isCorrect ? 'border-emerald-100 bg-emerald-50/50' : 'border-rose-100 bg-rose-50/50'}`}>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800">
                      {'word' in item ? item.word : item.character}
                    </h4>
                    <p className="text-slate-600 font-medium">
                      {'furigana' in item ? item.furigana : `${item.onyomi} / ${item.kunyomi}`}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">{item.meaning}</p>
                  </div>
                  <div className="shrink-0 ml-4">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-100 px-3 py-1 rounded-full text-sm">
                        <Check size={16} /> Nhớ
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-600 font-bold bg-rose-100 px-3 py-1 rounded-full text-sm">
                        <X size={16} /> Quên
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-pink-600 transition-colors py-2 px-4 rounded-xl hover:bg-pink-50 font-medium"
        >
          <ArrowLeft size={18} /> Thoát
        </button>
        <div className="flex items-center gap-4">
          <span className="text-pink-600 font-bold bg-pink-100 px-3 py-1 rounded-full text-sm">
            Thuộc: {score}
          </span>
          <span className="text-slate-400 text-sm font-medium">
            {currentIndex + 1} / {quizItems.length}
          </span>
        </div>
      </div>

      <div className="w-full bg-pink-100 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-pink-500 h-full transition-all duration-500 ease-out" 
          style={{ width: `${(currentIndex / quizItems.length) * 100}%` }}
        />
      </div>

      <Card className="min-h-[400px] flex flex-col p-6 shadow-lg relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex flex-col items-center justify-center flex-1"
          >
            <h2 className="text-7xl md:text-8xl font-serif text-slate-800 mb-8 mt-auto text-center">
              {'word' in currentItem ? currentItem.word : currentItem.character}
            </h2>
            
            <AnimatePresence mode="wait">
              {!isShowAnswer ? (
                <motion.div
                  key="question"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-8 mb-auto"
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
                  className="w-full space-y-6 mb-auto"
                >
                  <div className="space-y-4 bg-pink-50 p-6 rounded-2xl border border-pink-100 text-center">
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
                      disabled={isAnswered}
                      onClick={() => handleSelect(false)}
                      className={`py-4 flex items-center justify-center gap-2 font-bold rounded-xl border transition-colors ${
                        isAnswered 
                          ? (userResults[currentItem.id] === false ? 'bg-rose-500 text-white border-rose-600' : 'bg-slate-50 text-slate-400 border-slate-200 opacity-50')
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200 active:scale-95'
                      }`}
                    >
                      <XCircle size={24} />
                      Quên
                    </button>
                    <button
                      disabled={isAnswered}
                      onClick={() => handleSelect(true)}
                      className={`py-4 flex items-center justify-center gap-2 font-bold rounded-xl transition-colors ${
                        isAnswered 
                          ? (userResults[currentItem.id] === true ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-50 text-slate-400 opacity-50 border border-slate-200')
                          : 'bg-pink-500 text-white hover:bg-pink-600 shadow-md shadow-pink-200 active:scale-95'
                      }`}
                    >
                      <CheckCircle size={24} />
                      Đã thuộc
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </Card>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
            currentIndex === 0 
            ? 'opacity-0 pointer-events-none' 
            : 'bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 shadow-sm'
          }`}
        >
          <ArrowLeft size={20} /> Thẻ trước
        </button>
        
        {isAnswered && (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-pink-500 text-white rounded-xl font-bold shadow-md hover:bg-pink-600 hover:shadow-lg transition-all animate-in slide-in-from-right-4"
          >
            {currentIndex < quizItems.length - 1 ? 'Thẻ tiếp' : 'Hoàn thành'} <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
