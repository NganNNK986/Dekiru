import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ArrowLeft, RefreshCcw, Sparkles } from 'lucide-react';
import { Vocabulary, KanjiWord } from '../../types';
import { Card } from '../ui/Card';
import { useLearning } from '../../contexts/LearningContext';

interface MatchingGameProps {
  items: Array<Vocabulary | KanjiWord>;
  onBack: () => void;
}

export default function MatchingGame({ items, onBack }: MatchingGameProps) {
  const { recordExerciseResult } = useLearning();
  const itemsKey = useMemo(() => items.map(i => i.id).join(','), [items]);

  const [gameItems, setGameItems] = useState<Array<{ id: string; text: string; meaning: string; type: 'vocab' | 'kanji' }>>([]);
  const [leftTiles, setLeftTiles] = useState<Array<{ id: string; text: string }>>([]);
  const [rightTiles, setRightTiles] = useState<Array<{ id: string; text: string }>>([]);
  
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [wrongPair, setWrongPair] = useState<boolean>(false);
  
  const [moves, setMoves] = useState(0);
  const [finished, setFinished] = useState(false);

  const initGame = useCallback(() => {
    const subset = [...items].sort(() => 0.5 - Math.random()).slice(0, 6);
    const parsed = subset.map(i => ({
      id: i.id,
      text: 'word' in i ? i.word : i.character,
      meaning: i.meaning,
      type: ('word' in i ? 'vocab' : 'kanji') as 'vocab' | 'kanji',
    }));

    setGameItems(parsed);
    setLeftTiles(parsed.map(i => ({ id: i.id, text: i.text })).sort(() => 0.5 - Math.random()));
    setRightTiles(parsed.map(i => ({ id: i.id, text: i.meaning })).sort(() => 0.5 - Math.random()));
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedIds(new Set());
    setMoves(0);
    setFinished(false);
  }, [items]);

  useEffect(() => {
    initGame();
  }, [itemsKey, initGame]);

  const handleLeftClick = (id: string) => {
    if (matchedIds.has(id) || wrongPair) return;
    setSelectedLeft(id);
    checkMatch(id, selectedRight);
  };

  const handleRightClick = (id: string) => {
    if (matchedIds.has(id) || wrongPair) return;
    setSelectedRight(id);
    checkMatch(selectedLeft, id);
  };

  const checkMatch = (leftId: string | null, rightId: string | null) => {
    if (!leftId || !rightId) return;

    setMoves(m => m + 1);
    if (leftId === rightId) {
      const matchedItem = gameItems.find(i => i.id === leftId);
      if (matchedItem) {
        recordExerciseResult(matchedItem.id, matchedItem.type, true);
      }
      setMatchedIds(prev => {
        const next = new Set(prev).add(leftId);
        if (next.size === gameItems.length) {
          setTimeout(() => setFinished(true), 500);
        }
        return next;
      });
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      const wrongItem = gameItems.find(i => i.id === leftId);
      if (wrongItem) {
        recordExerciseResult(wrongItem.id, wrongItem.type, false);
      }
      setWrongPair(true);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setWrongPair(false);
      }, 800);
    }
  };

  if (items.length < 3) {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <p className="text-slate-600">Cần ít nhất 3 từ/Kanji để chơi game nối cặp.</p>
        <button onClick={onBack} className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-xl">Quay lại</button>
      </div>
    );
  }

  if (finished) {
    return (
      <Card className="max-w-xl mx-auto p-8 text-center space-y-6">
        <Sparkles className="text-amber-500 mx-auto" size={48} />
        <h2 className="text-3xl font-bold text-slate-800">Hoàn thành ghép cặp!</h2>
        <p className="text-lg text-slate-500">Hoàn thành với <span className="font-bold text-pink-600">{moves}</span> bước nối</p>
        <div className="flex justify-center gap-4">
          <button onClick={initGame} className="px-6 py-3 bg-slate-100 rounded-xl font-bold flex items-center gap-2">
            <RefreshCcw size={18} /> Chơi lại
          </button>
          <button onClick={onBack} className="px-6 py-3 bg-pink-500 text-white rounded-xl font-bold">Quay lại</button>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-pink-600 font-medium">
          <ArrowLeft size={18} /> Thoát
        </button>
        <span className="text-sm font-bold bg-pink-100 text-pink-600 px-3 py-1 rounded-full">Bước nối: {moves}</span>
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-slate-800 text-center mb-6">Nối từ tiếng Nhật với nghĩa đúng</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            {leftTiles.map(t => {
              const isMatched = matchedIds.has(t.id);
              const isSelected = selectedLeft === t.id;
              let style = "bg-slate-50 border-slate-200 text-slate-800 hover:border-pink-300";
              if (isMatched) style = "bg-emerald-50 border-emerald-300 text-emerald-400 opacity-50";
              else if (isSelected && wrongPair) style = "bg-rose-100 border-rose-500 text-rose-800 animate-shake";
              else if (isSelected) style = "bg-pink-100 border-pink-500 text-pink-800";

              return (
                <button
                  key={t.id}
                  disabled={isMatched}
                  onClick={() => handleLeftClick(t.id)}
                  className={`w-full p-4 rounded-xl border-2 font-serif font-bold text-2xl transition-all ${style}`}
                >
                  {t.text}
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {rightTiles.map(t => {
              const isMatched = matchedIds.has(t.id);
              const isSelected = selectedRight === t.id;
              let style = "bg-slate-50 border-slate-200 text-slate-700 hover:border-pink-300";
              if (isMatched) style = "bg-emerald-50 border-emerald-300 text-emerald-400 opacity-50";
              else if (isSelected && wrongPair) style = "bg-rose-100 border-rose-500 text-rose-800 animate-shake";
              else if (isSelected) style = "bg-pink-100 border-pink-500 text-pink-800";

              return (
                <button
                  key={t.id}
                  disabled={isMatched}
                  onClick={() => handleRightClick(t.id)}
                  className={`w-full p-4 rounded-xl border-2 font-medium text-base transition-all ${style}`}
                >
                  {t.text}
                </button>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
