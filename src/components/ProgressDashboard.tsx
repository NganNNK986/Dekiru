import React from 'react';
import { ArrowLeft, BarChart2, Flame, AlertTriangle, Download, Upload } from 'lucide-react';
import { useLearning } from '../contexts/LearningContext';
import { Card, CardContent } from './ui/Card';
import { MASTERY_EMOJI, MASTERY_LABELS, MasteryLevel } from '../types';
import { vocabularyData, kanjiData } from '../data';

interface ProgressDashboardProps {
  onBack: () => void;
}

export default function ProgressDashboard({ onBack }: ProgressDashboardProps) {
  const { getAnalytics, exportData, importData } = useLearning();
  const analytics = getAnalytics();

  const handleExport = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dekiru-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importData(content);
        if (success) alert('Khôi phục dữ liệu học tập thành công!');
        else alert('File dữ liệu không hợp lệ.');
      }
    };
    reader.readAsText(file);
  };

  const getItemName = (itemId: string, itemType: string) => {
    if (itemType === 'vocab') {
      const v = vocabularyData.find(x => x.id === itemId);
      return v ? `${v.word} (${v.furigana}) - ${v.meaning}` : itemId;
    } else {
      const k = kanjiData.find(x => x.id === itemId);
      return k ? `${k.character} - ${k.meaning}` : itemId;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 text-slate-500 hover:text-pink-600 rounded-xl">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart2 className="text-pink-500" /> Thống Kê & Tiến Độ Học Tập
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl flex items-center gap-2 text-sm transition-colors">
            <Download size={16} /> Sao lưu
          </button>
          <label className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-pink-600 font-semibold rounded-xl flex items-center gap-2 text-sm cursor-pointer transition-colors">
            <Upload size={16} /> Khôi phục
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-400">Độ chính xác</p>
          <p className="text-3xl font-black text-slate-800 mt-1">{Math.round(analytics.overallAccuracy * 100)}%</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-400">Thành thạo (Mastered)</p>
          <p className="text-3xl font-black text-blue-500 mt-1">{analytics.totalMastered}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-400">Đã thuộc (Known)</p>
          <p className="text-3xl font-black text-emerald-500 mt-1">{analytics.totalKnown}</p>
        </Card>
        <Card className="p-5">
          <p className="text-sm font-medium text-slate-400">Chuỗi kỷ lục</p>
          <p className="text-3xl font-black text-orange-500 mt-1 flex items-center gap-1">
            <Flame className="fill-orange-500" size={24} /> {analytics.longestStreak}
          </p>
        </Card>
      </div>

      {/* Lesson Breakdown */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <h3 className="text-xl font-bold text-slate-800">Tiến độ theo từng bài học</h3>
          <div className="space-y-4">
            {analytics.lessonProgress.map(lp => {
              const masteredPct = lp.totalItems > 0 ? (lp.masteredCount / lp.totalItems) * 100 : 0;
              const knownPct = lp.totalItems > 0 ? (lp.knownCount / lp.totalItems) * 100 : 0;
              const learningPct = lp.totalItems > 0 ? (lp.learningCount / lp.totalItems) * 100 : 0;

              return (
                <div key={lp.lessonId} className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-slate-800">{lp.lessonTitle} ({lp.totalItems} từ)</span>
                    <span className="text-pink-600 font-bold">{Math.round(masteredPct + knownPct)}% đã thuộc</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div style={{ width: `${masteredPct}%` }} className="bg-blue-500 h-full" title="Thành thạo" />
                    <div style={{ width: `${knownPct}%` }} className="bg-emerald-500 h-full" title="Đã thuộc" />
                    <div style={{ width: `${learningPct}%` }} className="bg-orange-400 h-full" title="Đang học" />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Weakest Items Table */}
      {analytics.weakestItems.length > 0 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <AlertTriangle className="text-amber-500" /> Các từ cần ưu tiên ôn tập (Hay quên nhất)
            </h3>
            <div className="divide-y divide-slate-100">
              {analytics.weakestItems.map(item => {
                const acc = item.totalReviews > 0 ? Math.round((item.correctCount / item.totalReviews) * 100) : 0;
                return (
                  <div key={item.itemId} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{MASTERY_EMOJI[item.masteryLevel as MasteryLevel]}</span>
                      <div>
                        <p className="font-bold text-slate-800">{getItemName(item.itemId, item.itemType)}</p>
                        <p className="text-xs text-slate-400">Đã sai {item.incorrectCount} / {item.totalReviews} lần ôn tập</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-rose-50 text-rose-600 font-bold text-sm rounded-full">
                      Chính xác: {acc}%
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
