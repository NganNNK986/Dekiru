import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Book, ChevronDown, ChevronUp, AlertCircle, PlayCircle } from 'lucide-react';
import { grammarData } from '../grammarData';
import { Card, CardContent } from './ui/Card';

interface GrammarViewProps {
  onBack: () => void;
  onStartQuiz: () => void;
}

export default function GrammarView({ onBack, onStartQuiz }: GrammarViewProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['cat-1']));

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedCategories(new Set(grammarData.map(c => c.id)));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center justify-between sticky top-16 z-40 bg-sakura-50/95 backdrop-blur py-4 border-b border-pink-100">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-pink-600 transition-colors py-2 px-4 rounded-xl hover:bg-pink-50 font-medium"
        >
          <ArrowLeft size={18} /> Quay lại
        </button>
        <div className="flex items-center gap-4">
          <button 
            onClick={expandAll}
            className="text-sm font-medium text-pink-600 hover:bg-pink-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            Mở rộng tất cả
          </button>
          <button 
            onClick={collapseAll}
            className="text-sm font-medium text-slate-500 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            Thu gọn tất cả
          </button>
        </div>
      </div>

      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center justify-center p-3 bg-pink-100/50 rounded-2xl mb-2 text-pink-500">
          <Book size={32} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          74 Mẫu Ngữ Pháp JPD326
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto px-4">
          Thay vì học theo bài, hãy học theo chức năng. Đây cũng chính là cách ra đề của Quiz và JLPT N2: các đáp án thường cùng nghĩa nhưng khác sắc thái.
        </p>
        <button
          onClick={onStartQuiz}
          className="mt-6 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
        >
          <PlayCircle size={20} /> Bắt đầu trắc nghiệm ngữ pháp
        </button>
      </div>

      <div className="space-y-4 pb-12">
        {grammarData.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          
          return (
            <Card key={category.id} className="overflow-hidden border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <button 
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-5 bg-white hover:bg-slate-50 transition-colors text-left"
              >
                <h2 className="text-xl font-bold text-slate-800">{category.title}</h2>
                <div className="text-slate-400">
                  {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </div>
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <CardContent className="p-0 border-t border-slate-100">
                      <div className="bg-slate-50/50 p-5 space-y-6">
                        {/* Group points if they have groups, otherwise just list them */}
                        {(() => {
                          const groupedPoints: Record<string, typeof category.points> = {};
                          category.points.forEach(pt => {
                            const groupName = pt.group || 'default';
                            if (!groupedPoints[groupName]) groupedPoints[groupName] = [];
                            groupedPoints[groupName].push(pt);
                          });

                          return Object.entries(groupedPoints).map(([group, points], idx) => (
                            <div key={idx} className="space-y-3">
                              {group !== 'default' && (
                                <h3 className="font-semibold text-pink-600 text-sm tracking-wider uppercase">{group}</h3>
                              )}
                              <div className="grid gap-3">
                                {points.map(pt => (
                                  <div key={pt.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="md:w-1/3 shrink-0">
                                      <div className="font-bold text-lg text-slate-800">{pt.pattern}</div>
                                      {pt.structure && <div className="text-sm font-mono text-slate-500 mt-1 bg-slate-100 inline-block px-2 py-0.5 rounded">{pt.structure}</div>}
                                    </div>
                                    <div className="md:w-2/3 flex flex-col gap-2">
                                      {pt.meaning && <div className="text-slate-700 font-medium">{pt.meaning}</div>}
                                      {pt.nuance && (
                                        <div className="text-sm text-slate-500 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg w-fit">
                                          Sắc thái / Khác nhau: {pt.nuance}
                                        </div>
                                      )}
                                      {pt.note && (
                                        <div className="text-sm bg-amber-50 text-amber-700 px-3 py-2 rounded-lg flex items-start gap-2">
                                          <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                          <span>{pt.note}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
