import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, X, AlertCircle, RefreshCcw, ArrowRight, CheckCircle2 } from 'lucide-react';
import { GrammarQuestion } from '../grammarQuizData';
import { Card } from './ui/Card';

interface GrammarQuizViewProps {
  questions: GrammarQuestion[];
  onBack: () => void;
}

export default function GrammarQuizView({ questions, onBack }: GrammarQuizViewProps) {
  const [quizQuestions] = useState(() => {
    return [...questions].sort(() => 0.5 - Math.random());
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQuestion = quizQuestions[currentIndex];

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);

    if (idx === currentQuestion.correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOption(null);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-500 pt-12">
        <div className="bg-white p-12 rounded-3xl shadow-xl border border-indigo-100">
          <h2 className="text-4xl font-bold text-slate-800 mb-2">Hoàn thành bài trắc nghiệm!</h2>
          <p className="text-xl text-slate-500 mb-8">Ứng dụng Ngữ pháp JPD326</p>

          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-blue-600 mb-8">
            {score} / {quizQuestions.length}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setCurrentIndex(0);
                setScore(0);
                setSelectedOption(null);
                setFinished(false);
              }}
              className="px-6 py-3 bg-indigo-50 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-2"
            >
              <RefreshCcw size={20} />
              Làm lại
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-600 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              Về trang Ngữ pháp
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between sticky top-16 z-40 bg-sakura-50/95 backdrop-blur py-4 border-b border-indigo-100 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors py-2 px-4 rounded-xl hover:bg-indigo-50 font-medium"
        >
          <ArrowLeft size={18} /> Quay lại
        </button>
        <div className="flex items-center gap-4">
          <span className="text-indigo-600 font-bold bg-indigo-100 px-3 py-1 rounded-full text-sm">
            Điểm: {score}
          </span>
          <span className="text-slate-400 text-sm font-medium">
            {currentIndex + 1} / {quizQuestions.length}
          </span>
        </div>
      </div>

      <div className="w-full bg-indigo-100 h-2 rounded-full overflow-hidden mb-8">
        <div
          className="bg-indigo-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${(currentIndex / quizQuestions.length) * 100}%` }}
        />
      </div>

      <Card className="min-h-[400px] flex flex-col items-center justify-center p-8 shadow-lg relative overflow-hidden border-slate-200">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl mx-auto space-y-8"
          >
            <div className="space-y-4 text-center">
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 leading-tight">
                {currentQuestion.question}
              </h2>
              <p className="text-slate-500 font-medium text-lg">Chọn đáp án đúng điền vào chỗ trống:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctAnswerIndex;
                let btnStyle = "bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50";

                if (selectedOption !== null) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-100 border-emerald-500 text-emerald-800 font-bold";
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
                    onClick={() => handleSelect(idx)}
                    className={`w-full p-6 rounded-2xl border-2 font-semibold text-lg text-left transition-all duration-300 relative flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {selectedOption !== null && isCorrect && <Check className="text-emerald-600 shrink-0 ml-2" />}
                    {selectedOption !== null && isSelected && !isCorrect && <X className="text-rose-600 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <div className={`p-6 rounded-2xl border ${selectedOption === currentQuestion.correctAnswerIndex ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                  <h3 className={`font-bold flex items-center gap-2 mb-2 ${selectedOption === currentQuestion.correctAnswerIndex ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {selectedOption === currentQuestion.correctAnswerIndex ? (
                      <><CheckCircle2 size={20} /> Chính xác!</>
                    ) : (
                      <><AlertCircle size={20} /> Chưa chính xác</>
                    )}
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    Tiếp theo <ArrowRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
