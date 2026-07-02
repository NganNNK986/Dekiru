import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Circle, PlayCircle } from 'lucide-react';
import { lessons } from '../data';
import { Card, CardContent } from './ui/Card';

interface TestSetupProps {
  onBack: () => void;
  onStartQuiz: (lessonIds: string[], type: 'vocab' | 'kanji' | 'mixed') => void;
}

export default function TestSetup({ onBack, onStartQuiz }: TestSetupProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [testType, setTestType] = useState<'vocab' | 'kanji' | 'mixed'>('mixed');

  const toggleLesson = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(lessons.map((l) => l.id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 text-slate-500 hover:text-pink-600 transition-colors rounded-xl flex-shrink-0"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-3xl font-bold text-slate-800">Thiết lập Kiểm tra</h2>
      </div>

      <Card>
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-800">Chọn bài học để kiểm tra</h3>
            <button 
              onClick={selectAll}
              className="text-sm font-medium text-pink-600 hover:text-pink-700"
            >
              Chọn tất cả
            </button>
          </div>

          <div className="space-y-3">
            {lessons.map((lesson) => {
              const isSelected = selectedIds.includes(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => toggleLesson(lesson.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group
                    ${isSelected ? 'border-pink-500 bg-pink-50/50' : 'border-slate-100 hover:border-pink-200 hover:bg-slate-50'}`}
                >
                  <div>
                    <h4 className={`font-bold text-lg ${isSelected ? 'text-pink-700' : 'text-slate-700 group-hover:text-pink-600'}`}>
                      {lesson.title}
                    </h4>
                    <p className={`text-sm ${isSelected ? 'text-pink-600/80' : 'text-slate-500'}`}>
                      {lesson.description}
                    </p>
                  </div>
                  <div className={`${isSelected ? 'text-pink-500' : 'text-slate-300'}`}>
                    {isSelected ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-800">Chọn loại kiểm tra</h3>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setTestType('vocab')}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${testType === 'vocab' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Từ vựng
                </button>
                <button
                  onClick={() => setTestType('kanji')}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${testType === 'kanji' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Kanji
                </button>
                <button
                  onClick={() => setTestType('mixed')}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all ${testType === 'mixed' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Hỗn hợp
                </button>
              </div>
            </div>

            <button
              onClick={() => onStartQuiz(selectedIds, testType)}
              disabled={selectedIds.length === 0}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl font-bold text-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <PlayCircle size={24} />
              Bắt đầu ({selectedIds.length} bài học)
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
