import React, { useState } from 'react';
import { ArrowLeft, BookType, ChevronDown, ChevronRight } from 'lucide-react';
import { grammarData } from '../grammar';
import { Card, CardContent } from './ui/Card';

interface GrammarViewProps {
  onBack: () => void;
}

export default function GrammarView({ onBack }: GrammarViewProps) {
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set([grammarData[0]?.id]));

  const toggleCat = (id: string) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/60 rounded-full transition-colors text-slate-500"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookType className="text-indigo-500" /> Ngữ pháp JPD326
          </h2>
          <p className="text-slate-500 text-sm">Hệ thống tổng hợp các mẫu ngữ pháp Trung cấp</p>
        </div>
      </div>

      <div className="space-y-4">
        {grammarData.map(cat => (
          <Card key={cat.id} className="border-slate-200 shadow-sm overflow-hidden">
            <button 
              className="w-full p-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-left"
              onClick={() => toggleCat(cat.id)}
            >
              <h3 className="text-lg font-bold text-slate-800">{cat.title}</h3>
              {expandedCats.has(cat.id) ? (
                <ChevronDown className="text-slate-500" size={20} />
              ) : (
                <ChevronRight className="text-slate-500" size={20} />
              )}
            </button>
            
            {expandedCats.has(cat.id) && (
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {cat.points.map(point => (
                    <div key={point.id} className="p-4 sm:p-6 hover:bg-slate-50/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-bold rounded-lg text-lg">
                              {point.pattern}
                            </span>
                            {point.group && (
                              <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                                {point.group}
                              </span>
                            )}
                          </div>
                          
                          {point.structure && (
                            <div className="text-sm font-mono text-slate-600 bg-slate-100 px-3 py-1.5 rounded-md inline-block">
                              {point.structure}
                            </div>
                          )}
                          
                          <div className="text-slate-700">
                            <span className="font-medium text-slate-500 mr-2">Ý nghĩa:</span>
                            {point.meaning}
                          </div>
                          
                          {point.nuance && (
                            <div className="text-indigo-600 text-sm bg-indigo-50 px-3 py-2 rounded-md">
                              <span className="font-semibold mr-1">Sắc thái:</span>
                              {point.nuance}
                            </div>
                          )}
                          
                          {point.note && (
                            <div className="text-amber-700 text-sm bg-amber-50 px-3 py-2 rounded-md border border-amber-100">
                              <span className="font-semibold mr-1">Lưu ý:</span>
                              {point.note}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
