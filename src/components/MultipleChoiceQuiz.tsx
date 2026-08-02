import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, RefreshCcw, Check, X, BookOpen } from 'lucide-react';
import { Vocabulary, KanjiWord } from '../types';
import { Card } from './ui/Card';
import { useLearning } from '../contexts/LearningContext';
import { useQuizSession } from '../hooks/useQuizSession';

interface MultipleChoiceQuizProps {
  title: string;
  words: Vocabulary[];
  kanjis: KanjiWord[];
  onBack: () => void;
}

type Question = {
  id: string;
  text: string;
  hint?: string;
  subText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

type QuizState = {
  questions: Question[];
  currentIndex: number;
  userAnswers: Record<number, string>;
  isFinished: boolean;
};

export default function MultipleChoiceQuiz({ title, words, kanjis, onBack }: MultipleChoiceQuizProps) {
  const { recordExerciseResult } = useLearning();

  const itemTypeById = useMemo(() => {
    const map = new Map<string, 'vocab' | 'kanji'>();
    for (const w of words) map.set(w.id, 'vocab');
    for (const k of kanjis) map.set(k.id, 'kanji');
    return map;
  }, [words, kanjis]);

  const itemsKey = useMemo(
    () => [...words.map(w => w.id), ...kanjis.map(k => k.id)].join(','),
    [words, kanjis]
  );

  const generateQuestions = () => {
    const allItems = [...words, ...kanjis];
    if (allItems.length < 4) return [];

    return allItems.map(item => {
      const kanjiText = 'word' in item ? item.word : item.character;
      const hiraganaText = 'word' in item 
        ? (item.reading || item.furigana || '') 
        : `${item.onyomi} / ${item.kunyomi}`;
      const meaningText = item.meaning;

      const askKanji = Math.random() > 0.5;

      const text = askKanji ? kanjiText : hiraganaText;
      const correctAnswer = askKanji ? hiraganaText : kanjiText;
      const subText = askKanji ? 'Chọn cách đọc đúng:' : 'Chọn Hán tự/Từ vựng đúng:';
      const hint = meaningText;

      const explParts = [];
      if ('logicalAnchor' in item && item.logicalAnchor) explParts.push(`Giải thích: ${item.logicalAnchor}`);
      if ('visualClue' in item && item.visualClue) explParts.push(`Mẹo: ${item.visualClue}`);
      if ('soundMnemonic' in item && item.soundMnemonic) explParts.push(`Mẹo âm: ${item.soundMnemonic}`);
      if ('wackyStory' in item && item.wackyStory) explParts.push(`Câu chuyện: ${item.wackyStory}`);
      if ('examples' in item && item.examples && item.examples.length > 0) {
        explParts.push(`Ví dụ: ${item.examples.slice(0, 2).map(e => `${e.word} - ${e.meaning}`).join(' | ')}`);
      }
      if (explParts.length === 0) explParts.push(`Nghĩa: ${item.meaning}`);
      const explanation = explParts.join('\n');

      const otherItems = allItems.filter(i => i.id !== item.id);
      const shuffledOthers = otherItems.sort(() => 0.5 - Math.random()).slice(0, 3);
      
      const wrongAnswers = shuffledOthers.map(i => {
        const iKanji = 'word' in i ? i.word : i.character;
        const iHira = 'word' in i ? (i.reading || i.furigana || '') : `${i.onyomi} / ${i.kunyomi}`;
        return askKanji ? iHira : iKanji;
      });

      const uniqueWrongAnswers = Array.from(new Set(wrongAnswers));
      const options = [correctAnswer, ...uniqueWrongAnswers].sort(() => 0.5 - Math.random());

      return {
        id: item.id,
        text,
        hint,
        subText,
        options,
        correctAnswer,
        explanation
      };
    }).sort(() => 0.5 - Math.random());
  };

  const [session, setSession, clearSession] = useQuizSession<QuizState>(
    `mcq-quiz-${itemsKey}`,
    () => ({
      questions: generateQuestions(),
      currentIndex: 0,
      userAnswers: {},
      isFinished: false
    })
  );

  const { questions, currentIndex, userAnswers, isFinished } = session;

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 pt-12">
        <h2 className="text-2xl font-bold text-slate-800">Không đủ dữ liệu để tạo trắc nghiệm (Cần ít nhất 4 từ/Kanji).</h2>
        <button onClick={onBack} className="px-6 py-3 bg-pink-500 text-white rounded-xl font-bold">Quay lại</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const selectedOption = userAnswers[currentIndex];
  const isAnswered = selectedOption !== undefined;
  
  const score = Object.entries(userAnswers).reduce((acc, [idx, ans]) => {
    return acc + (ans === questions[Number(idx)].correctAnswer ? 1 : 0);
  }, 0);

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    
    const isCorrect = option === currentQuestion.correctAnswer;
    const itemType = itemTypeById.get(currentQuestion.id) ?? 'vocab';
    recordExerciseResult(currentQuestion.id, itemType, isCorrect);

    setSession(prev => ({
      ...prev,
      userAnswers: { ...prev.userAnswers, [currentIndex]: option }
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setSession(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
    } else {
      setSession(prev => ({ ...prev, isFinished: true }));
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSession(prev => ({ ...prev, currentIndex: prev.currentIndex - 1 }));
    }
  };

  if (isFinished) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500 pt-8 pb-12">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-pink-100 text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-2">Hoàn thành bài trắc nghiệm!</h2>
          <p className="text-xl text-slate-500 mb-8">{title}</p>
          
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-pink-600 mb-8">
            {score} / {questions.length}
          </div>

          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => clearSession()}
              className="px-6 py-3 bg-pink-50 text-pink-600 font-semibold rounded-xl hover:bg-pink-100 transition-colors flex items-center gap-2"
            >
              <RefreshCcw size={20} />
              Làm lại
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              Quay lại bài học
            </button>
          </div>

          <div className="text-left space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 border-b pb-2 mb-6">Chi tiết kết quả</h3>
            {questions.map((q, idx) => {
              const uAns = userAnswers[idx];
              const isCorrect = uAns === q.correctAnswer;
              return (
                <div key={idx} className={`p-6 rounded-2xl border-2 ${isCorrect ? 'border-emerald-100 bg-emerald-50/30' : 'border-rose-100 bg-rose-50/30'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-sm font-bold text-slate-400 mb-1">Câu {idx + 1}</div>
                      <h4 className="text-2xl font-bold text-slate-800">{q.text}</h4>
                    </div>
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-100 px-3 py-1 rounded-full text-sm">
                        <Check size={16} /> Đúng
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-rose-600 font-bold bg-rose-100 px-3 py-1 rounded-full text-sm">
                        <X size={16} /> Sai
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded-xl border border-slate-100">
                      <div className="text-xs text-slate-400 uppercase font-bold mb-1">Bạn chọn</div>
                      <div className={`font-semibold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>{uAns || 'Chưa chọn'}</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-100">
                      <div className="text-xs text-slate-400 uppercase font-bold mb-1">Đáp án đúng</div>
                      <div className="font-semibold text-emerald-700">{q.correctAnswer}</div>
                    </div>
                  </div>
                  
                  {q.explanation && (
                    <div className="mt-4 text-slate-600 bg-white/60 p-4 rounded-xl text-sm whitespace-pre-line leading-relaxed">
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-pink-600 transition-colors py-2 px-4 rounded-xl hover:bg-pink-50 font-medium"
        >
          <ArrowLeft size={18} /> Quay lại bài học
        </button>
        <div className="flex items-center gap-4">
          <span className="text-pink-600 font-bold bg-pink-100 px-3 py-1 rounded-full text-sm">
            Điểm: {score}
          </span>
          <span className="text-slate-400 text-sm font-medium">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      <div className="w-full bg-pink-100 h-2 rounded-full overflow-hidden">
        <div 
          className="bg-pink-500 h-full transition-all duration-500 ease-out" 
          style={{ width: `${(currentIndex / questions.length) * 100}%` }}
        />
      </div>

      <Card className="min-h-[400px] flex flex-col p-6 md:p-8 shadow-lg relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-xl mx-auto flex-1 flex flex-col"
          >
            <div className="space-y-4 text-center mb-8">
              {currentQuestion.hint && (
                <p className="text-xl text-pink-500 font-medium tracking-widest">{currentQuestion.hint}</p>
              )}
              <h2 className="text-6xl md:text-7xl font-serif text-slate-800">
                {currentQuestion.text}
              </h2>
              <p className="text-slate-500 font-medium text-lg">{currentQuestion.subText}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                let btnStyle = "bg-slate-50 text-slate-700 border-slate-200 hover:border-pink-300 hover:bg-pink-50";
                
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-100 border-emerald-500 text-emerald-800";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-100 border-rose-500 text-rose-800";
                  } else {
                    btnStyle = "bg-slate-50 text-slate-400 border-slate-100 opacity-50";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelect(option)}
                    className={`w-full p-6 rounded-2xl border-2 font-semibold text-lg text-left transition-all duration-300 relative flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrect && <Check className="text-emerald-600 shrink-0 ml-2" />}
                    {isAnswered && isSelected && !isCorrect && <X className="text-rose-600 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: 10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                className="mt-8 pt-6 border-t border-slate-100"
              >
                <div className="flex items-start gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100 mb-6">
                  <BookOpen className="text-blue-500 shrink-0 mt-1" size={20} />
                  <div className="text-slate-700 whitespace-pre-line leading-relaxed text-sm md:text-base">
                    {currentQuestion.explanation}
                  </div>
                </div>
              </motion.div>
            )}
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
          <ArrowLeft size={20} /> Câu trước
        </button>
        
        {isAnswered && (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-pink-500 text-white rounded-xl font-bold shadow-md hover:bg-pink-600 hover:shadow-lg transition-all animate-in slide-in-from-right-4"
          >
            {currentIndex < questions.length - 1 ? 'Tiếp theo' : 'Hoàn thành'} <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
