/**
 * SRS Review Session — Spaced repetition review interface.
 * 
 * Shows items due for review with 4-grade rating buttons.
 * Replaces the simple "Đã thuộc/Quên" with nuanced feedback.
 */
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCcw, Brain, Zap, Check, AlertTriangle, Sparkles, Trophy } from 'lucide-react';
import { Card, CardContent } from './ui/Card';
import { useLearning } from '../contexts/LearningContext';
import { vocabularyData, kanjiData } from '../data';
import { Vocabulary, KanjiWord, ReviewRating, MASTERY_EMOJI, MASTERY_LABELS, ItemProgress } from '../types';
import { fsrsPreview } from '../engine/fsrsEngine';

interface SRSReviewSessionProps {
  onBack: () => void;
}

export default function SRSReviewSession({ onBack }: SRSReviewSessionProps) {
  const { getReviewQueue, recordReview, settings } = useLearning();
  
  const queue = useMemo(() => getReviewQueue(30), []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionResults, setSessionResults] = useState<Array<{ itemId: string; rating: ReviewRating }>>([]);
  const [finished, setFinished] = useState(false);
  const [reviewStartTime, setReviewStartTime] = useState<number>(Date.now());

  const currentItem = queue[currentIndex];

  // Find the actual vocabulary/kanji data for display
  const getItemData = useCallback((progress: ItemProgress): Vocabulary | KanjiWord | null => {
    if (progress.itemType === 'vocab') {
      return vocabularyData.find(v => v.id === progress.itemId) || null;
    } else {
      return kanjiData.find(k => k.id === progress.itemId) || null;
    }
  }, []);

  // Preview next review intervals
  const preview = useMemo(() => {
    if (!currentItem) return null;
    if (settings.srsAlgorithm === 'fsrs') {
      return fsrsPreview(currentItem.fsrsCard, settings.fsrsRequestRetention);
    }
    return null;
  }, [currentItem, settings]);

  const handleReveal = () => {
    setShowAnswer(true);
  };

  const handleRate = (rating: ReviewRating) => {
    if (!currentItem) return;
    
    const responseTime = Date.now() - reviewStartTime;
    recordReview(currentItem.itemId, currentItem.itemType, rating, responseTime);
    setSessionResults(prev => [...prev, { itemId: currentItem.itemId, rating }]);

    if (currentIndex < queue.length - 1) {
      setCurrentIndex(i => i + 1);
      setShowAnswer(false);
      setReviewStartTime(Date.now());
    } else {
      setFinished(true);
    }
  };

  const formatInterval = (days: number): string => {
    if (days < 1) return '< 1 ngày';
    if (days === 1) return '1 ngày';
    if (days < 30) return `${Math.round(days)} ngày`;
    if (days < 365) return `${Math.round(days / 30)} tháng`;
    return `${(days / 365).toFixed(1)} năm`;
  };

  // Empty queue
  if (queue.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 pt-12">
        <div className="bg-white p-12 rounded-3xl shadow-xl border border-emerald-100">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Trophy className="text-emerald-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Tuyệt vời!</h2>
          <p className="text-lg text-slate-500">Không có mục nào cần ôn tập lúc này. Hãy quay lại sau!</p>
          <button
            onClick={onBack}
            className="mt-8 px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  // Finished
  if (finished) {
    const correctCount = sessionResults.filter(r => r.rating === 'good' || r.rating === 'easy').length;
    const accuracy = sessionResults.length > 0 ? correctCount / sessionResults.length : 0;
    
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 animate-in fade-in zoom-in duration-500 pt-8">
        <div className="bg-white p-12 rounded-3xl shadow-xl border border-pink-100">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="text-pink-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Phiên ôn tập hoàn thành!</h2>
          <p className="text-slate-500 mb-8">Bạn đã ôn tập {sessionResults.length} mục</p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-emerald-50 p-4 rounded-xl">
              <p className="text-3xl font-black text-emerald-600">{correctCount}</p>
              <p className="text-sm text-emerald-600 font-medium">Đúng</p>
            </div>
            <div className="bg-rose-50 p-4 rounded-xl">
              <p className="text-3xl font-black text-rose-500">{sessionResults.length - correctCount}</p>
              <p className="text-sm text-rose-500 font-medium">Cần ôn lại</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-3xl font-black text-blue-600">{Math.round(accuracy * 100)}%</p>
              <p className="text-sm text-blue-600 font-medium">Chính xác</p>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-colors shadow-md"
            >
              Quay lại Trang chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  const itemData = currentItem ? getItemData(currentItem) : null;
  if (!itemData || !currentItem) return null;

  const isVocab = 'word' in itemData;
  const displayText = isVocab ? (itemData as Vocabulary).word : (itemData as KanjiWord).character;
  const mastery = currentItem.masteryLevel;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-pink-600 transition-colors py-2 px-4 rounded-xl hover:bg-pink-50 font-medium"
        >
          <ArrowLeft size={18} /> Thoát
        </button>
        <div className="flex items-center gap-4">
          <span className="text-pink-600 font-bold bg-pink-100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <Brain size={14} /> SRS
          </span>
          <span className="text-slate-400 text-sm font-medium">
            {currentIndex + 1} / {queue.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-pink-100 h-2 rounded-full overflow-hidden">
        <motion.div 
          className="bg-gradient-to-r from-pink-500 to-purple-500 h-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / queue.length) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Card */}
      <Card className="min-h-[420px] flex flex-col items-center justify-center p-8 text-center shadow-lg relative overflow-hidden">
        {/* Mastery badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full" 
             style={{ backgroundColor: `${currentItem.masteryLevel >= 3 ? '#dcfce7' : '#fef3c7'}` }}>
          <span>{MASTERY_EMOJI[mastery]}</span>
          <span className="text-slate-600">{MASTERY_LABELS[mastery]}</span>
        </div>

        {/* Question */}
        <h2 className="text-7xl font-serif text-slate-800 mb-4 mt-8">{displayText}</h2>

        <AnimatePresence mode="wait">
          {!showAnswer ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 space-y-4"
            >
              <p className="text-slate-400 text-sm">Bạn nhớ được nghĩa không?</p>
              <button
                onClick={handleReveal}
                className="px-10 py-4 bg-slate-800 text-white font-semibold rounded-full hover:bg-slate-700 transition-colors shadow-md active:scale-95"
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
              {/* Answer display */}
              <div className="space-y-3 bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-2xl border border-pink-100">
                {isVocab ? (
                  <p className="text-xl text-pink-600 font-medium tracking-widest">{(itemData as Vocabulary).furigana}</p>
                ) : (
                  <div className="flex justify-center gap-4 text-pink-600 font-medium">
                    <span className="bg-white/60 px-4 py-2 rounded-full border border-pink-100">
                      <span className="text-pink-400 text-sm mr-2">音</span>{(itemData as KanjiWord).onyomi || '-'}
                    </span>
                    <span className="bg-white/60 px-4 py-2 rounded-full border border-pink-100">
                      <span className="text-pink-400 text-sm mr-2">訓</span>{(itemData as KanjiWord).kunyomi || '-'}
                    </span>
                  </div>
                )}
                <p className="text-2xl text-slate-700 font-bold">{itemData.meaning}</p>
              </div>

              {/* 4-grade rating buttons */}
              <div className="grid grid-cols-4 gap-3 mt-6">
                <button
                  onClick={() => handleRate('again')}
                  className="py-4 flex flex-col items-center gap-1.5 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 border border-rose-200 transition-all active:scale-95"
                >
                  <RotateCcw size={20} />
                  <span className="text-sm">Quên</span>
                  {preview && <span className="text-xs font-normal opacity-70">{formatInterval(preview.again.interval)}</span>}
                </button>
                <button
                  onClick={() => handleRate('hard')}
                  className="py-4 flex flex-col items-center gap-1.5 bg-orange-50 text-orange-600 font-bold rounded-xl hover:bg-orange-100 border border-orange-200 transition-all active:scale-95"
                >
                  <AlertTriangle size={20} />
                  <span className="text-sm">Khó</span>
                  {preview && <span className="text-xs font-normal opacity-70">{formatInterval(preview.hard.interval)}</span>}
                </button>
                <button
                  onClick={() => handleRate('good')}
                  className="py-4 flex flex-col items-center gap-1.5 bg-emerald-50 text-emerald-600 font-bold rounded-xl hover:bg-emerald-100 border border-emerald-200 transition-all active:scale-95"
                >
                  <Check size={20} />
                  <span className="text-sm">Tốt</span>
                  {preview && <span className="text-xs font-normal opacity-70">{formatInterval(preview.good.interval)}</span>}
                </button>
                <button
                  onClick={() => handleRate('easy')}
                  className="py-4 flex flex-col items-center gap-1.5 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 border border-blue-200 transition-all active:scale-95"
                >
                  <Zap size={20} />
                  <span className="text-sm">Dễ</span>
                  {preview && <span className="text-xs font-normal opacity-70">{formatInterval(preview.easy.interval)}</span>}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
