import React from 'react';
import { Vocabulary, KanjiWord } from '../types';
import { Card } from './ui/Card';
import { BookOpen } from 'lucide-react';

interface KanjiVocabLinkProps {
  kanji?: KanjiWord;
  vocab?: Vocabulary;
  allVocab: Vocabulary[];
  allKanji: KanjiWord[];
  onSelectVocab?: (id: string) => void;
  onSelectKanji?: (id: string) => void;
}

export default function KanjiVocabLink({
  kanji,
  vocab,
  allVocab,
  allKanji,
  onSelectVocab,
  onSelectKanji
}: KanjiVocabLinkProps) {
  if (kanji) {
    const relatedVocab = allVocab.filter(v => v.word.includes(kanji.character));
    if (relatedVocab.length === 0) return null;

    return (
      <div className="space-y-3 mt-6 border-t border-slate-100 pt-6">
        <h3 className="flex items-center gap-2 text-emerald-600 font-semibold text-base">
          <BookOpen size={18} /> Từ vựng trong hệ thống chứa chữ [{kanji.character}] ({relatedVocab.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {relatedVocab.map(v => (
            <div
              key={v.id}
              onClick={() => onSelectVocab && onSelectVocab(v.id)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/30 cursor-pointer transition-all"
            >
              <div>
                <p className="font-bold text-slate-800 font-serif text-lg">{v.word}</p>
                <p className="text-xs text-emerald-600 font-medium">{v.furigana}</p>
              </div>
              <span className="text-sm text-slate-600 text-right">{v.meaning}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (vocab) {
    const relatedKanji = allKanji.filter(k => vocab.word.includes(k.character));
    if (relatedKanji.length === 0) return null;

    return (
      <div className="space-y-3 mt-6 border-t border-slate-100 pt-6">
        <h3 className="flex items-center gap-2 text-pink-600 font-semibold text-base">
          <BookOpen size={18} /> Kanji cấu thành từ vựng này ({relatedKanji.length})
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {relatedKanji.map(k => (
            <div
              key={k.id}
              onClick={() => onSelectKanji && onSelectKanji(k.id)}
              className="flex items-center gap-4 p-3 rounded-xl bg-pink-50/40 border border-pink-100 hover:border-pink-300 hover:bg-pink-50 cursor-pointer transition-all"
            >
              <span className="text-3xl font-serif text-pink-700 bg-white px-3 py-1 rounded-lg border border-pink-100 font-bold">
                {k.character}
              </span>
              <div>
                <p className="font-bold text-slate-800">{k.meaning}</p>
                <p className="text-xs text-slate-500">
                  {k.onyomi ? `Onyomi: ${k.onyomi}` : k.kunyomi ? `Kunyomi: ${k.kunyomi}` : ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
