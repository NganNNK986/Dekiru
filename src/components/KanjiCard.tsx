import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KanjiWord, MASTERY_EMOJI, MASTERY_LABELS } from '../types';
import { Card, CardContent } from './ui/Card';
import { Star, BookOpen } from 'lucide-react';
import { useLearning } from '../contexts/LearningContext';
import KanjiVocabLink from './KanjiVocabLink';
import { vocabularyData, kanjiData } from '../data';

interface KanjiCardProps {
  kanji: KanjiWord;
  isStarred?: boolean;
  onToggleStar?: () => void;
  blurDetails?: boolean;
  onNavigateVocab?: (vocabId: string) => void;
}

export default function KanjiCard({
  kanji,
  isStarred = false,
  onToggleStar,
  blurDetails = true,
  onNavigateVocab
}: KanjiCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const { getProgress } = useLearning();
  const progress = getProgress(kanji.id, 'kanji');
  const mastery = progress.masteryLevel;

  useEffect(() => {
    setIsRevealed(false);
  }, [kanji.id]);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group">
      {/* Mastery Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 shadow-sm">
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
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-emerald-100 transition-colors backdrop-blur-sm"
          aria-label="Toggle star"
        >
          <Star
            size={24}
            className={`transition-colors ${isStarred ? 'fill-yellow-400 text-yellow-500' : 'text-slate-300 hover:text-yellow-400'}`}
          />
        </button>
      )}

      {/* Header */}
      <div 
        className={`bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-8 pt-12 text-center border-b border-emerald-100 transition-colors ${!isRevealed ? 'cursor-pointer hover:from-emerald-100 hover:to-emerald-200/50' : ''}`}
        onClick={() => !isRevealed && setIsRevealed(true)}
      >
        {!isRevealed && (
          <p className="text-sm text-emerald-500 mb-2 font-medium tracking-wide animate-pulse">
            Chạm để xem chi tiết
          </p>
        )}
        <h2 className="text-8xl font-bold text-slate-800 mb-4 font-serif">{kanji.character}</h2>
        
        <div className={`space-y-4 transition-all duration-300 ${!isRevealed && blurDetails ? 'blur-md select-none opacity-60' : ''}`}>
          <p className="text-2xl text-emerald-700 font-bold tracking-widest uppercase">
            {kanji.meaning}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-slate-600 font-medium">
            <span className="bg-white/60 px-4 py-2 rounded-full border border-emerald-100">
              <span className="text-slate-400 text-sm mr-2">音</span>{kanji.onyomi || '-'}
            </span>
            <span className="bg-white/60 px-4 py-2 rounded-full border border-emerald-100">
              <span className="text-slate-400 text-sm mr-2">訓</span>{kanji.kunyomi || '-'}
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isRevealed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <CardContent className="bg-white pt-6 space-y-6">
              
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-emerald-600 font-semibold mb-2">
                  <BookOpen size={18} /> Ví dụ từ ghép
                </h3>
                <div className="space-y-2 relative">
                  {kanji.examples.map((ex, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-100 hover:bg-emerald-50/30 transition-colors">
                      <div className="flex flex-col mb-2 sm:mb-0">
                        <span className="text-xl font-bold text-slate-800">{ex.word}</span>
                        <span className="text-sm text-emerald-600 font-medium">{ex.reading}</span>
                      </div>
                      <span className="text-slate-600">{ex.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bidirectional Vocab linking */}
              <KanjiVocabLink
                kanji={kanji}
                allVocab={vocabularyData}
                allKanji={kanjiData}
                onSelectVocab={onNavigateVocab}
              />

            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
