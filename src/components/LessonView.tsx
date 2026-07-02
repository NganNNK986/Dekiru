import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight, List, Keyboard, Edit3, PenTool, Sparkles } from 'lucide-react';
import { Vocabulary, KanjiWord } from '../types';
import WordCard from './WordCard';
import KanjiCard from './KanjiCard';

interface LessonViewProps {
  title: string;
  description?: string;
  words: Vocabulary[];
  kanjis: KanjiWord[];
  onBack: () => void;
  isStarred: (id: string) => boolean;
  onToggleStar: (id: string, type: 'vocab' | 'kanji') => void;
  blurFurigana: boolean;
  onStartMultipleChoice: () => void;
  onStartTyping: () => void;
  onStartFillBlank: () => void;
  onStartKanjiWriting: () => void;
  onStartMatching: () => void;
  onNavigateToItem: (id: string, type: 'vocab' | 'kanji') => void;
}

export default function LessonView({
  title,
  description,
  words,
  kanjis,
  onBack,
  isStarred,
  onToggleStar,
  blurFurigana,
  onStartMultipleChoice,
  onStartTyping,
  onStartFillBlank,
  onStartKanjiWriting,
  onStartMatching,
  onNavigateToItem
}: LessonViewProps) {
  const [activeTab, setActiveTab] = useState<'vocab' | 'kanji'>('vocab');
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentList = activeTab === 'vocab' ? words : kanjis;

  const handleTabSwitch = (tab: 'vocab' | 'kanji') => {
    setActiveTab(tab);
    setCurrentIndex(0);
  };

  if (words.length === 0 && kanjis.length === 0) return (
    <div className="max-w-4xl mx-auto text-center py-20 space-y-4">
      <h2 className="text-2xl font-bold text-slate-800">Không có dữ liệu</h2>
      <button onClick={onBack} className="text-pink-600 hover:text-pink-700 font-bold">
        Quay lại Trang chủ
      </button>
    </div>
  );

  const currentItem = currentList[currentIndex];

  const goNext = () => setCurrentIndex((prev) => Math.min(prev + 1, currentList.length - 1));
  const goPrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Nav */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-pink-600 transition-colors py-2 px-4 rounded-xl hover:bg-pink-50 font-medium"
        >
          <ArrowLeft size={18} />
          Quay lại Trang chủ
        </button>
        <div className="text-slate-400 text-sm font-medium">
          {currentIndex + 1} / {currentList.length}
        </div>
      </div>

      {/* Title */}
      <div className="text-center space-y-2 pb-2">
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        {description && <p className="text-slate-500">{description}</p>}
      </div>

      {/* Practice Mode Selector Grid */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100/60 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-black uppercase text-slate-400 mr-2">Luyện tập:</span>
        <button
          onClick={onStartMultipleChoice}
          disabled={words.length + kanjis.length < 4}
          className="px-3.5 py-2 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
        >
          <List size={14} /> Trắc nghiệm
        </button>
        <button
          onClick={onStartMatching}
          disabled={words.length + kanjis.length < 3}
          className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
        >
          <Sparkles size={14} /> Nối cặp
        </button>
        <button
          onClick={onStartTyping}
          className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
        >
          <Keyboard size={14} /> Gõ từ (Active Recall)
        </button>
        <button
          onClick={onStartFillBlank}
          disabled={words.length === 0}
          className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
        >
          <Edit3 size={14} /> Điền từ ngữ cảnh
        </button>
        <button
          onClick={onStartKanjiWriting}
          disabled={kanjis.length === 0}
          className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
        >
          <PenTool size={14} /> Luyện viết Kanji
        </button>
      </div>

      {/* Tabs */}
      {(words.length > 0 || kanjis.length > 0) && (
        <div className="flex bg-slate-100 p-1 rounded-xl max-w-sm mx-auto mb-6">
          <button
            onClick={() => handleTabSwitch('vocab')}
            disabled={words.length === 0}
            className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${activeTab === 'vocab' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 disabled:opacity-50'}`}
          >
            Từ vựng ({words.length})
          </button>
          <button
            onClick={() => handleTabSwitch('kanji')}
            disabled={kanjis.length === 0}
            className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-sm transition-all ${activeTab === 'kanji' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 disabled:opacity-50'}`}
          >
            Kanji ({kanjis.length})
          </button>
        </div>
      )}

      {/* Main Flashcard view */}
      <div className="relative">
        {currentItem && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'vocab' ? (
                <WordCard 
                  word={currentItem as Vocabulary}
                  isStarred={isStarred(currentItem.id)}
                  onToggleStar={() => onToggleStar(currentItem.id, 'vocab')}
                  blurFurigana={blurFurigana}
                  onNavigateKanji={(kId) => onNavigateToItem(kId, 'kanji')}
                />
              ) : (
                <KanjiCard 
                  kanji={currentItem as KanjiWord}
                  isStarred={isStarred(currentItem.id)}
                  onToggleStar={() => onToggleStar(currentItem.id, 'kanji')}
                  blurDetails={blurFurigana}
                  onNavigateVocab={(vId) => onNavigateToItem(vId, 'vocab')}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Navigation Controls */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className={`p-4 rounded-full bg-white shadow-sm border transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${activeTab === 'vocab' ? 'border-pink-100 text-pink-600 hover:bg-pink-50' : 'border-emerald-100 text-emerald-600 hover:bg-emerald-50'}`}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goNext}
            disabled={currentIndex === currentList.length - 1}
            className={`p-4 rounded-full bg-white shadow-sm border transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${activeTab === 'vocab' ? 'border-pink-100 text-pink-600 hover:bg-pink-50' : 'border-emerald-100 text-emerald-600 hover:bg-emerald-50'}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
