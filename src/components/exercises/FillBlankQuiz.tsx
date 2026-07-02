import React, { useState, useMemo } from 'react';
import { ArrowLeft, RefreshCcw } from 'lucide-react';
import { Vocabulary } from '../../types';
import { Card } from '../ui/Card';
import { useLearning } from '../../contexts/LearningContext';

interface FillBlankQuizProps {
  words: Vocabulary[];
  onBack: () => void;
}

export default function FillBlankQuiz({ words, onBack }: FillBlankQuizProps) {
  const { recordExerciseResult } = useLearning();
  const [quizGeneration, setQuizGeneration] = useState(0);

  const validWords = useMemo(() => {
    return words.filter(w => w.collocation && w.collocation.includes(w.word));
  }, [words]);

  const validWordsKey = useMemo(
    () => validWords.map(w => w.id).join(','),
    [validWords]
  );

  const questions = useMemo(() => {
    return validWords.map(target => {
      const maskedCollocation = target.collocation.replace(target.word, '____');
      const others = words.filter(w => w.id !== target.id);
      const shuffledOthers = [...others].sort(() => 0.5 - Math.random()).slice(0, 3);
      const options = [target.word, ...shuffledOthers.map(o => o.word)].sort(() => 0.5 - Math.random());

      return {
        id: target.id,
        collocation: maskedCollocation,
        meaning: target.collocationMeaning,
        correctWord: target.word,
        options,
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only regenerate when item set or user restarts
  }, [validWordsKey, quizGeneration]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQuestion = questions[currentIndex] ?? null;

  if (validWords.length < 3) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 space-y-4">
        <p className="text-slate-600">Không đủ câu ngữ cảnh (collocation) để tạo bài luyện điền từ.</p>
        <button onClick={onBack} className="px-6 py-2 bg-pink-500 text-white rounded-xl font-bold">Quay lại</button>
      </div>
    );
  }

  const handleSelect = (option: string) => {
    if (selectedOption || !currentQuestion) return;
    setSelectedOption(option);

    const isCorrect = option === currentQuestion.correctWord;
    recordExerciseResult(currentQuestion.id, 'vocab', isCorrect);
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
      <Card className="max-w-xl mx-auto p-8 text-center space-y-6">
        <h2 className="text-3xl font-bold text-slate-800">Hoàn thành bài điền từ!</h2>
        <p className="text-5xl font-black text-pink-600">{score} / {questions.length}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setScore(0);
              setSelectedOption(null);
              setFinished(false);
              setQuizGeneration(g => g + 1);
            }}
            className="px-6 py-3 bg-slate-100 rounded-xl font-bold flex items-center gap-2"
          >
            <RefreshCcw size={18} /> Làm lại
          </button>
          <button onClick={onBack} className="px-6 py-3 bg-pink-500 text-white rounded-xl font-bold">Quay lại</button>
        </div>
      </Card>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-medium">
          <ArrowLeft size={18} /> Thoát
        </button>
        <span className="text-sm font-bold text-slate-400">{currentIndex + 1} / {questions.length}</span>
      </div>

      <Card className="p-8 space-y-8 text-center">
        <span className="text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
          Luyện điền từ vào ngữ cảnh
        </span>

        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-slate-800 leading-relaxed">
            {currentQuestion.collocation}
          </h2>
          <p className="text-slate-500 text-lg italic">{currentQuestion.meaning}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const isCorrect = opt === currentQuestion.correctWord;
            let btnClass = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-pink-50 hover:border-pink-300";

            if (selectedOption) {
              if (isCorrect) btnClass = "bg-emerald-100 border-emerald-500 text-emerald-800";
              else if (isSelected) btnClass = "bg-rose-100 border-rose-500 text-rose-800";
              else btnClass = "bg-slate-50 border-slate-100 text-slate-300 opacity-50";
            }

            return (
              <button
                key={idx}
                disabled={selectedOption !== null}
                onClick={() => handleSelect(opt)}
                className={`p-4 rounded-2xl border-2 font-bold text-xl transition-all ${btnClass}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
