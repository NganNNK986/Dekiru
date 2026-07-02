import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Vocabulary, MASTERY_EMOJI, MASTERY_LABELS } from '../types';
import { Card, CardContent } from './ui/Card';
import { Zap, BookOpen, Quote, Brain, Eye, Star } from 'lucide-react';
import { useLearning } from '../contexts/LearningContext';
import KanjiVocabLink from './KanjiVocabLink';
import { vocabularyData, kanjiData } from '../data';

interface WordCardProps {
  word: Vocabulary;
  isStarred?: boolean;
  onToggleStar?: () => void;
  blurFurigana?: boolean;
  onNavigateKanji?: (kanjiId: string) => void;
}

export default function WordCard({
  word,
  isStarred = false,
  onToggleStar,
  blurFurigana = true,
  onNavigateKanji
}: WordCardProps) {
  const [method, setMethod] = useState<'rote' | 'deep'>('rote');
  const [isRevealed, setIsRevealed] = useState(false);
  const { getProgress } = useLearning();
  const progress = getProgress(word.id, 'vocab');
  const mastery = progress.masteryLevel;

  useEffect(() => {
    setIsRevealed(false);
    setMethod('rote');
  }, [word.id]);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group">
      {/* Mastery Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold border border-pink-100 shadow-sm">
        <span>{MASTERY_EMOJI[mastery]}</span>
        <span className="text-slate-700">{MASTERY_LABELS[mastery]}</span>
      </div>

      {/* Star Button */}
      {onToggleStar && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar();
          }}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-pink-100 transition-colors backdrop-blur-sm"
          aria-label="Toggle star"
        >
          <Star
            size={24}
            className={`transition-colors ${isStarred ? 'fill-yellow-400 text-yellow-500' : 'text-slate-300 hover:text-yellow-400'}`}
          />
        </button>
      )}

      {/* Word Header */}
      <div 
        className={`bg-gradient-to-r from-pink-50 to-pink-100/50 p-8 pt-12 text-center border-b border-pink-100 transition-colors ${!isRevealed ? 'cursor-pointer hover:from-pink-100 hover:to-pink-200/50' : ''}`}
        onClick={() => !isRevealed && setIsRevealed(true)}
      >
        {!isRevealed && (
          <p className="text-sm text-pink-400 mb-2 font-medium tracking-wide animate-pulse">
            Chạm để xem chi tiết
          </p>
        )}
        <p className={`text-pink-600 font-medium text-lg mb-2 tracking-widest transition-all ${!isRevealed && blurFurigana ? 'blur-sm select-none' : ''}`}>
          {word.furigana}
        </p>
        <h2 className="text-6xl font-bold text-slate-800 mb-4 font-serif">{word.word}</h2>
        <p className="text-xl text-slate-600 font-medium">{word.meaning}</p>
      </div>

      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {/* Method Toggle */}
            <div className="flex border-b border-pink-100">
              <button
                onClick={() => setMethod('rote')}
                className={`flex-1 py-4 px-4 font-medium text-sm flex items-center justify-center gap-2 transition-colors
                  ${method === 'rote' ? 'bg-white text-pink-600 border-b-2 border-pink-500' : 'bg-pink-50/50 text-slate-500 hover:text-pink-500 hover:bg-pink-50'}`}
              >
                <Zap size={18} />
                Cách 1: Học Mẹo (Nhanh)
              </button>
              <button
                onClick={() => setMethod('deep')}
                className={`flex-1 py-4 px-4 font-medium text-sm flex items-center justify-center gap-2 transition-colors
                  ${method === 'deep' ? 'bg-white text-pink-600 border-b-2 border-pink-500' : 'bg-pink-50/50 text-slate-500 hover:text-pink-500 hover:bg-pink-50'}`}
              >
                <BookOpen size={18} />
                Cách 2: Học Sâu (Theo ngữ cảnh)
              </button>
            </div>

            {/* Content Area */}
            <CardContent className="min-h-[320px] bg-white pt-6">
              <AnimatePresence mode="wait">
                {method === 'rote' ? (
                  <motion.div
                    key="rote"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h3 className="flex items-center gap-2 text-pink-600 font-semibold mb-2">
                        <Eye size={18} /> Gợi ý hình ảnh
                      </h3>
                      <p className="text-slate-700 leading-relaxed bg-pink-50/50 p-4 rounded-xl border border-pink-100/50">{word.visualClue}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="flex items-center gap-2 text-pink-600 font-semibold mb-2">
                        <Quote size={18} /> Gợi ý âm thanh
                      </h3>
                      <p className="text-slate-700 leading-relaxed bg-pink-50/50 p-4 rounded-xl border border-pink-100/50">{word.soundMnemonic}</p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="flex items-center gap-2 text-pink-600 font-semibold mb-2">
                        <Brain size={18} /> Câu chuyện vui
                      </h3>
                      <p className="text-slate-700 leading-relaxed bg-gradient-to-r from-pink-50 to-white p-4 rounded-xl border border-pink-100 italic">
                        "{word.wackyStory}"
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="deep"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <h3 className="flex items-center gap-2 text-pink-600 font-semibold mb-3">
                        <Eye size={18} /> Phân tích Hán tự
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {word.kanjiDeconstruction.map((part, i) => {
                          const isStr = typeof part === 'string';
                          const kanjiChar = isStr ? part.split(' ')[0] : part.kanji;
                          const meaningStr = isStr ? part : part.meaning;
                          const kObj = kanjiData.find(k => k.character === kanjiChar);
                          return (
                            <div 
                              key={i} 
                              onClick={() => kObj && onNavigateKanji && onNavigateKanji(kObj.id)}
                              className={`flex items-center gap-3 bg-pink-50/50 p-3 rounded-xl border border-pink-100/50 ${kObj ? 'cursor-pointer hover:border-pink-400 hover:bg-pink-100/50 transition-all' : ''}`}
                            >
                              <span className="text-3xl text-pink-700 font-serif">{kanjiChar}</span>
                              <span className="text-slate-600 font-medium">{meaningStr} {kObj ? '🔗' : ''}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="flex items-center gap-2 text-pink-600 font-semibold mb-2">
                        <Brain size={18} /> Liên kết Logic
                      </h3>
                      <p className="text-slate-700 leading-relaxed bg-pink-50/50 p-4 rounded-xl border border-pink-100/50">{word.logicalAnchor}</p>
                    </div>

                    <div className="space-y-2 mt-4">
                      <h3 className="flex items-center gap-2 text-pink-600 font-semibold mb-2">
                        <Quote size={18} /> Ví dụ Ngữ cảnh
                      </h3>
                      <div className="bg-gradient-to-r from-slate-50 to-white p-5 rounded-xl border border-slate-100">
                        <p className="text-lg text-slate-800 font-medium mb-2">{word.collocation}</p>
                        <p className="text-slate-500">{word.collocationMeaning}</p>
                      </div>
                    </div>

                    {/* Bidirectional Kanji linking */}
                    <KanjiVocabLink
                      vocab={word}
                      allVocab={vocabularyData}
                      allKanji={kanjiData}
                      onSelectKanji={onNavigateKanji}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
