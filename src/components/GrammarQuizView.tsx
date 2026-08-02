import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, X, AlertCircle, RefreshCcw, ArrowRight, CheckCircle2 } from 'lucide-react';
import { GrammarQuestion } from '../grammarQuizData';
import { Card } from './ui/Card';
import { useQuizSession } from '../hooks/useQuizSession';

interface GrammarQuizViewProps {
  questions: GrammarQuestion[];
  onBack: () => void;
}

type GrammarQuizState = {
  quizQuestions: GrammarQuestion[];
  currentIndex: number;
  userAnswers: Record<number, number>;
  isFinished: boolean;
};

export default function GrammarQuizView({ questions, onBack }: GrammarQuizViewProps) {
  const itemsKey = useMemo(() => questions.map(q => q.id).join(','), [questions]);

  const [session, setSession, clearSession] = useQuizSession<GrammarQuizState>(
    `grammar-quiz-${itemsKey}`,
    () => ({
      quizQuestions: [...questions].sort(() => 0.5 - Math.random()),
      currentIndex: 0,
      userAnswers: {},
      isFinished: false
    })
  );

  const { quizQuestions, currentIndex, userAnswers, isFinished } = session;

  const currentQuestion = quizQuestions[currentIndex];
  const selectedOption = userAnswers[currentIndex];
  const isAnswered = selectedOption !== undefined;

  const score = Object.entries(userAnswers).reduce((acc, [idx, ans]) => {
    return acc + (ans === quizQuestions[Number(idx)].correctAnswerIndex ? 1 : 0);
  }, 0);

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSession(prev => ({
      ...prev,
      userAnswers: { ...prev.userAnswers, [currentIndex]: idx }
    }));
  };

  const handleNext = () => {
    if (currentIndex < quizQuestions.length - 1) {
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
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-indigo-100 text-center">
          <h2 className="text-4xl font-bold text-slate-800 mb-2">Hoàn thành bài trắc nghiệm!</h2>
          <p className="text-xl text-slate-500 mb-8">Ứng dụng Ngữ pháp JPD326</p>
          
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-blue-600 mb-8">
            {score} / {quizQuestions.length}
          </div>

          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => clearSession()}
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

          <div className="text-left space-y-6">
            <h3 className="text-2xl font-bold text-slate-800 border-b pb-2 mb-6">Chi tiết kết quả</h3>
            {quizQuestions.map((q, idx) => {
              const uAnsIdx = userAnswers[idx];
              const isCorrect = uAnsIdx === q.correctAnswerIndex;
              return (
                <div key={idx} className={`p-6 rounded-2xl border-2 ${isCorrect ? 'border-emerald-100 bg-emerald-50/30' : 'border-rose-100 bg-rose-50/30'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-sm font-bold text-slate-400 mb-1">Câu {idx + 1}</div>
                      <h4 className="text-2xl font-bold text-slate-800">{q.question}</h4>
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
                      <div className={`font-semibold ${isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                        {uAnsIdx !== undefined ? q.options[uAnsIdx] : 'Chưa chọn'}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-slate-100">
                      <div className="text-xs text-slate-400 uppercase font-bold mb-1">Đáp án đúng</div>
                      <div className="font-semibold text-emerald-700">{q.options[q.correctAnswerIndex]}</div>
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
      <div className="flex items-center justify-between sticky top-16 z-40 bg-sakura-50/95 backdrop-blur py-4 border-b border-indigo-100 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors py-2 px-4 rounded-xl hover:bg-indigo-50 font-medium"
        >
          <ArrowLeft size={18} /> Về trang Ngữ pháp
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

      <Card className="min-h-[400px] flex flex-col p-6 md:p-8 shadow-lg relative overflow-hidden border-slate-200">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl mx-auto flex-1 flex flex-col"
          >
            <div className="space-y-4 text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 leading-tight">
                {currentQuestion.question}
              </h2>
              <p className="text-slate-500 font-medium text-lg">Chọn đáp án đúng điền vào chỗ trống:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctAnswerIndex;
                let btnStyle = "bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50";

                if (isAnswered) {
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
                    disabled={isAnswered}
                    onClick={() => handleSelect(idx)}
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
                <div className={`p-6 rounded-2xl border ${selectedOption === currentQuestion.correctAnswerIndex ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
                  <h3 className={`font-bold flex items-center gap-2 mb-2 ${selectedOption === currentQuestion.correctAnswerIndex ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {selectedOption === currentQuestion.correctAnswerIndex ? (
                      <><CheckCircle2 size={20} /> Chính xác!</>
                    ) : (
                      <><AlertCircle size={20} /> Chưa chính xác</>
                    )}
                  </h3>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                    {currentQuestion.explanation}
                  </p>
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
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all animate-in slide-in-from-right-4"
          >
            {currentIndex < quizQuestions.length - 1 ? 'Tiếp theo' : 'Hoàn thành'} <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
