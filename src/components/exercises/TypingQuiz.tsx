import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, X, HelpCircle, RefreshCcw } from 'lucide-react';
import { Vocabulary, KanjiWord } from '../../types';
import { Card } from '../ui/Card';

interface TypingQuizProps {
  items: Array<Vocabulary | KanjiWord>;
  onBack: () => void;
  onFinish?: (results: Array<{ itemId: string; correct: boolean }>) => void;
}

export default function TypingQuiz({ items, onBack, onFinish }: TypingQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [hintLevel, setHintLevel] = useState(0);
  const [results, setResults] = useState<Array<{ itemId: string; correct: boolean }>>([]);
  const [finished, setFinished] = useState(false);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <p className="text-slate-600 mb-4">Không có mục nào để kiểm tra.</p>
        <button onClick={onBack} className="px-6 py-2 bg-pink-500 text-white rounded-xl">Quay lại</button>
      </div>
    );
  }

  const currentItem = items[currentIndex];
  const isVocab = 'word' in currentItem;

  // Expected answers
  const expectedText = isVocab ? (currentItem as Vocabulary).word : (currentItem as KanjiWord).character;
  const expectedReading = isVocab 
    ? (currentItem as Vocabulary).furigana 
    : (currentItem as KanjiWord).onyomi.split('、')[0] || (currentItem as KanjiWord).kunyomi.split('、')[0];

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'idle' || !input.trim()) return;

    const cleanInput = input.trim().toLowerCase();
    const cleanReading = expectedReading?.replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF]/g, '') || '';
    
    const isCorrect = cleanInput === cleanReading || cleanInput === expectedText;
    
    setStatus(isCorrect ? 'correct' : 'incorrect');
    setResults(prev => [...prev, { itemId: currentItem.id, correct: isCorrect }]);

    setTimeout(() => {
      if (currentIndex < items.length - 1) {
        setCurrentIndex(i => i + 1);
        setInput('');
        setStatus('idle');
        setHintLevel(0);
      } else {
        setFinished(true);
        if (onFinish) onFinish([...results, { itemId: currentItem.id, correct: isCorrect }]);
      }
    }, 1500);
  };

  const showHint = () => {
    setHintLevel(h => Math.min(h + 1, 2));
  };

  const getHintText = () => {
    if (hintLevel === 0) return null;
    if (hintLevel === 1) return `Chữ cái đầu: ${expectedReading?.[0] || expectedText[0]}`;
    return `Cách đọc: ${expectedReading}`;
  };

  if (finished) {
    const correctCount = results.filter(r => r.correct).length;
    return (
      <Card className="max-w-xl mx-auto p-8 text-center space-y-6">
        <h2 className="text-3xl font-bold text-slate-800">Hoàn thành bài luyện gõ!</h2>
        <p className="text-5xl font-black text-pink-600">{correctCount} / {items.length}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setCurrentIndex(0);
              setResults([]);
              setFinished(false);
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

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-medium">
          <ArrowLeft size={18} /> Thoát
        </button>
        <span className="text-sm font-bold text-slate-400">{currentIndex + 1} / {items.length}</span>
      </div>

      <Card className="p-8 text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-wider bg-pink-100 text-pink-600 px-3 py-1 rounded-full">
          Active Recall (Gõ đáp án)
        </span>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-800">{currentItem.meaning}</h2>
          <p className="text-sm text-slate-400">Hãy gõ từ tiếng Nhật hoặc cách đọc Hiragana tương ứng</p>
        </div>

        {hintLevel > 0 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-sm font-medium animate-in fade-in">
            Gợi ý: {getHintText()}
          </div>
        )}

        <form onSubmit={handleCheck} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={status !== 'idle'}
              placeholder="Nhập từ hoặc hiragana..."
              className={`w-full px-6 py-4 text-center text-2xl font-bold rounded-2xl border-2 outline-none transition-all ${
                status === 'idle' 
                  ? 'border-slate-200 focus:border-pink-500' 
                  : status === 'correct' 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                    : 'border-rose-500 bg-rose-50 text-rose-800'
              }`}
              autoFocus
            />
            {status === 'correct' && <Check className="absolute right-4 top-4 text-emerald-600" size={32} />}
            {status === 'incorrect' && <X className="absolute right-4 top-4 text-rose-600" size={32} />}
          </div>

          {status === 'incorrect' && (
            <div className="text-rose-600 font-medium text-sm">
              Đáp án đúng: <span className="font-bold">{expectedText} ({expectedReading})</span>
            </div>
          )}

          <div className="flex gap-3">
            {status === 'idle' && hintLevel < 2 && (
              <button
                type="button"
                onClick={showHint}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl flex items-center gap-2 text-sm transition-colors"
              >
                <HelpCircle size={18} /> Gợi ý
              </button>
            )}
            <button
              type="submit"
              disabled={status !== 'idle' || !input.trim()}
              className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md active:scale-95"
            >
              Kiểm tra
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
