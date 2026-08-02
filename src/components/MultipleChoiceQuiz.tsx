import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RefreshCcw, Check, X } from 'lucide-react';
import { Vocabulary, KanjiWord } from '../types';
import { Card } from './ui/Card';
import { useLearning } from '../contexts/LearningContext';
// Trigger HMR

interface MultipleChoiceQuizProps {
  title: string;
  words: Vocabulary[];
  kanjis: KanjiWord[];
  onBack: () => void;
}

type Question = {
  id: string;
  text: string;
  furigana?: string;
  options: string[];
  correctAnswer: string;
};

export default function MultipleChoiceQuiz({ title, words, kanjis, onBack }: MultipleChoiceQuizProps) {
  const { recordExerciseResult } = useLearning();
  const [quizGeneration, setQuizGeneration] = useState(0);

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

  const questions = useMemo(() => {
    const allItems = [...words, ...kanjis];
    if (allItems.length < 4) return [];

    return allItems.map(item => {
      const text = 'word' in item ? item.word : item.character;
      const furigana = 'furigana' in item ? item.furigana : undefined;
      const correctAnswer = item.meaning;

      const otherItems = allItems.filter(i => i.id !== item.id);
      const shuffledOthers = otherItems.sort(() => 0.5 - Math.random()).slice(0, 3);
      const wrongAnswers = shuffledOthers.map(i => i.meaning);

      const options = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());

      return {
        id: item.id,
        text,
        furigana,
        options,
        correctAnswer,
      };
    }).sort(() => 0.5 - Math.random());
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only regenerate when item set or user restarts
  }, [itemsKey, quizGeneration]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 pt-12">
        <h2 className="text-2xl font-bold text-slate-800">Không đủ dữ liệu để tạo trắc nghiệm (Cần ít nhất 4 từ/Kanji).</h2>
        <button onClick={onBack} className="px-6 py-3 bg-pink-500 text-white rounded-xl font-bold">Quay lại</button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleSelect = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    
    const isCorrect = option === currentQuestion.correctAnswer;
    const itemType = itemTypeById.get(currentQuestion.id) ?? 'vocab';
    recordExerciseResult(currentQuestion.id, itemType, isCorrect);

    if (isCorrect) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
        setSelectedOption(null);
      } else {
        setFinished(true);
      }
    }, 1500);
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-500 pt-12">
        <div className="bg-white p-12 rounded-3xl shadow-xl border border-pink-100">
          <h2 className="text-4xl font-bold text-slate-800 mb-2">Hoàn thành bài trắc nghiệm!</h2>
          <p className="text-xl text-slate-500 mb-8">{title}</p>
          
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-pink-600 mb-8">
            {score} / {questions.length}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
                setSelectedOption(null);
                setFinished(false);
                setQuizGeneration(g => g + 1);
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
              Quay lại bài học
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-pink-600 transition-colors py-2 px-4 rounded-xl hover:bg-pink-50 font-medium"
        >
          <ArrowLeft size={18} /> Quay lại
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

      <Card className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center shadow-lg relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-xl mx-auto space-y-8"
          >
            <div className="space-y-4">
              {currentQuestion.furigana && (
                <p className="text-xl text-pink-500 font-medium tracking-widest">{currentQuestion.furigana}</p>
              )}
              <h2 className="text-6xl md:text-7xl font-serif text-slate-800">
                {currentQuestion.text}
              </h2>
              <p className="text-slate-500 font-medium text-lg">Chọn nghĩa tiếng Việt đúng nhất:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrect = option === currentQuestion.correctAnswer;
                let btnStyle = "bg-slate-50 text-slate-700 border-slate-200 hover:border-pink-300 hover:bg-pink-50";
                
                if (selectedOption) {
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
                    disabled={selectedOption !== null}
                    onClick={() => handleSelect(option)}
                    className={`w-full p-6 rounded-2xl border-2 font-semibold text-lg text-left transition-all duration-300 relative flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {selectedOption && isCorrect && <Check className="text-emerald-600 shrink-0 ml-2" />}
                    {selectedOption && isSelected && !isCorrect && <X className="text-rose-600 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
