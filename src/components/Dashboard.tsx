import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { BookOpen, Layers, PlayCircle, Sparkles, Star, PieChart as PieChartIcon, BookType } from 'lucide-react';
import { lessons, vocabularyData, kanjiData } from '../data';
import { Card, CardContent } from './ui/Card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardProps {
  onSelectLesson: (id: string) => void;
  onSetupTest: () => void;
  starredWordsCount: number;
  starredKanjiCount: number;
  onReviewStarred: () => void;
  onShowGrammar: () => void;
}

const COLORS = ['#f472b6', '#38bdf8', '#fbbf24', '#34d399', '#a78bfa', '#fb7185'];

export default function Dashboard({ onSelectLesson, onSetupTest, starredWordsCount, starredKanjiCount, onReviewStarred, onShowGrammar }: DashboardProps) {
  const chartData = useMemo(() => {
    return lessons.map(lesson => {
      const vCount = vocabularyData.filter(v => v.lessonId === lesson.id).length;
      const kCount = kanjiData.filter(k => k.lessonId === lesson.id).length;
      return { 
        name: lesson.title.split(':')[0].trim(), 
        value: vCount + kCount 
      };
    }).filter(data => data.value > 0);
  }, []);
  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* Hero Section */}
      <div className="text-center space-y-4 py-6">
        <div className="inline-flex items-center justify-center p-3 bg-pink-100/50 rounded-2xl mb-2 text-pink-500">
          <Sparkles size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
          Sakura <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600">Vocab</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto">
          Chinh phục từ vựng tiếng Nhật thông qua ngữ cảnh thực tế và hình ảnh trực quan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Analytics Dashboard */}
        <Card className="col-span-1 md:col-span-2 shadow-sm border-slate-100">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 mb-6">
              <PieChartIcon className="text-pink-500" size={20} /> Phân bố Từ vựng & Hán tự
            </h3>
            <div className="h-[200px] w-full min-h-[200px]">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#334155', fontWeight: 600 }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex gap-8">
              <div>
                <p className="text-3xl font-bold text-slate-800">{vocabularyData.length + kanjiData.length}</p>
                <p className="text-sm text-slate-500 font-medium">Tổng số từ và Hán tự</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Actions Column */}
        <div className="col-span-1 flex flex-col gap-6">
          {/* Starred Words Widget */}
          <Card className="shadow-sm border-slate-100 flex-1 hover:border-yellow-300 hover:shadow-md transition-all">
            <CardContent className="p-6 flex flex-col h-full justify-between">
              <div>
                <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-4">
                  <Star size={20} className="fill-yellow-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Mục đã lưu</h3>
                <p className="text-slate-500 text-sm">Ôn tập từ vựng & Kanji bạn đã đánh dấu.</p>
              </div>
              <div className="mt-6">
                <button
                  onClick={onReviewStarred}
                  disabled={starredWordsCount === 0 && starredKanjiCount === 0}
                  className="w-full py-3 bg-yellow-50 text-yellow-700 font-bold rounded-xl hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {(starredWordsCount > 0 || starredKanjiCount > 0) ? `Ôn tập ${starredWordsCount + starredKanjiCount} mục` : 'Chưa có mục nào'}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Grammar Widget */}
          <Card className="shadow-sm border-slate-100 border bg-gradient-to-br from-indigo-50 to-blue-100/50 hover:border-indigo-300 transition-all">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-indigo-700 mb-2">
                <BookType size={18} /> Ngữ pháp JPD326
              </h3>
              <p className="text-indigo-600/80 text-sm mb-4">
                Hệ thống 74 mẫu ngữ pháp theo nhóm chức năng.
              </p>
              <button
                onClick={onShowGrammar}
                className="w-full px-4 py-2.5 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-600 transition-all flex items-center gap-2 justify-center"
              >
                <BookOpen size={18} />
                Xem Ngữ Pháp
              </button>
            </CardContent>
          </Card>

          {/* Test Setup Widget - Shrunk */}
          <Card className="shadow-sm border-slate-100 border bg-gradient-to-br from-pink-50 to-pink-100/50 hover:border-pink-300 transition-all">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-pink-700 mb-2">
                <Layers size={18} /> Kiểm tra tổng hợp
              </h3>
              <p className="text-pink-600/80 text-sm mb-4">
                Tạo bài kiểm tra kết hợp từ nhiều bài học khác nhau.
              </p>
              <button
                onClick={onSetupTest}
                className="w-full px-4 py-2.5 bg-pink-500 text-white font-semibold rounded-xl hover:bg-pink-600 transition-all flex items-center gap-2 justify-center"
              >
                <PlayCircle size={18} />
                Bắt đầu thiết lập
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Lesson List */}
        <div className="col-span-1 md:col-span-3 space-y-4 mt-4">
          <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 px-1">
            <BookOpen className="text-pink-500" /> Danh sách bài học
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {lessons.map((lesson) => (
              <Card 
                key={lesson.id} 
                className="hover:border-pink-300 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => onSelectLesson(lesson.id)}
              >
                <CardContent className="p-6">
                  <h4 className="text-lg font-bold text-slate-800 group-hover:text-pink-600 transition-colors mb-2">
                    {lesson.title}
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {lesson.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
