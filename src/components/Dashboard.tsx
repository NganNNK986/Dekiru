import React, { useMemo } from 'react';
import { BookOpen, Layers, PlayCircle, Sparkles, Star, PieChart as PieChartIcon, Brain, BarChart2, CheckCircle2, Clock4 } from 'lucide-react';
import { lessons, vocabularyData, kanjiData } from '../data';
import { Card, CardContent } from './ui/Card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import DailyGoals from './DailyGoals';
import { useLearning } from '../contexts/LearningContext';

interface DashboardProps {
  onSelectLesson: (id: string) => void;
  onSetupTest: () => void;
  onReviewStarred: () => void;
  onStartSRS: () => void;
  onOpenAnalytics: () => void;
}

const COLORS = ['#f472b6', '#38bdf8', '#fbbf24', '#34d399', '#a78bfa', '#fb7185'];

export default function Dashboard({
  onSelectLesson,
  onSetupTest,
  onReviewStarred,
  onStartSRS,
  onOpenAnalytics
}: DashboardProps) {
  const { getDueCount, getStarredIds, getAnalytics } = useLearning();
  const dueCount = getDueCount();
  const starredCount = getStarredIds('vocab').size + getStarredIds('kanji').size;
  const analytics = getAnalytics();

  const lessonProgressById = useMemo(
    () => Object.fromEntries(analytics.lessonProgress.map((item) => [item.lessonId, item])),
    [analytics.lessonProgress]
  );

  const totalItems = vocabularyData.length + kanjiData.length;
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
      
      {/* Daily Goals Header Widget */}
      <DailyGoals />

      {/* Hero Section */}
      <div className="text-center space-y-4 py-2">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
          Sakura <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-600">Vocab</span>
        </h1>
        <p className="text-base text-slate-500 max-w-xl mx-auto">
          Hệ thống học tiếng Nhật thông minh với Spaced Repetition (FSRS/SM-2) & Active Recall.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="bg-slate-950 text-white shadow-lg">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Ôn tập hôm nay</p>
                <p className="mt-3 text-3xl font-black">{dueCount}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-200">
                <Clock4 size={20} />
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">Số mục đến hạn hôm nay để bạn duy trì lộ trình.</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-slate-100">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Mục đã lưu</p>
                <p className="mt-3 text-3xl font-black text-amber-600">{starredCount}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-100 text-amber-600">
                <Star size={20} />
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">Những mục bạn đã đánh dấu để ôn tập nhanh.</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-slate-100">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Đã thuộc</p>
                <p className="mt-3 text-3xl font-black text-sky-600">{analytics.totalMastered}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-100 text-sky-600">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">Tổng số mục bạn đã chinh phục trong hệ thống.</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-slate-100">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Bài học</p>
                <p className="mt-3 text-3xl font-black text-pink-600">{lessons.length}</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-pink-100 text-pink-600">
                <BookOpen size={20} />
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-500">Số bài học hiện có trong chương trình học.</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-100 hover:shadow-md transition-all">
        <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <button
            onClick={onStartSRS}
            className="w-full px-4 py-3 rounded-2xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
          >
            Ôn tập ngay
          </button>
          <button
            onClick={() => onSelectLesson(lessons[0].id)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          >
            Bài học tiếp theo
          </button>
          <button
            onClick={onReviewStarred}
            className="w-full px-4 py-3 rounded-2xl bg-amber-100 text-amber-700 font-semibold hover:bg-amber-200 transition"
          >
            Mục đã lưu
          </button>
          <button
            onClick={onOpenAnalytics}
            className="w-full px-4 py-3 rounded-2xl bg-pink-50 text-pink-700 font-semibold hover:bg-pink-100 transition"
          >
            Xem thống kê
          </button>
        </CardContent>
      </Card>

      {/* Main Action Banner: SRS Review Today */}
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-200 font-bold text-sm uppercase tracking-wider">
              <Brain size={18} /> Thuật toán Spaced Repetition
            </div>
            <h3 className="text-2xl font-black">
              {dueCount > 0 ? `Bạn có ${dueCount} mục đến hạn ôn tập hôm nay` : 'Tất cả các từ đã được ôn tập tới hạn!'}
            </h3>
            <p className="text-emerald-100 text-sm">
              {dueCount > 0 
                ? 'Ôn tập ngay để giữ vững trí nhớ và tăng điểm độ thành thạo (Mastery).' 
                : 'Bạn có thể tự do luyện các bài tập chủ động bên dưới hoặc học bài mới.'}
            </p>
          </div>
          <button
            onClick={onStartSRS}
            className="px-8 py-4 bg-white text-emerald-700 font-extrabold rounded-2xl shadow-md hover:bg-emerald-50 transition-all shrink-0 active:scale-95"
          >
            {dueCount > 0 ? `Bắt đầu ôn (${dueCount})` : 'Luyện tập thêm'}
          </button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Analytics Dashboard */}
        <Card className="col-span-1 md:col-span-2 shadow-sm border-slate-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                <PieChartIcon className="text-pink-500" size={20} /> Phân bố Từ vựng & Hán tự
              </h3>
              <button
                onClick={onOpenAnalytics}
                className="text-sm font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 bg-pink-50 px-3 py-1.5 rounded-xl transition-colors"
              >
                <BarChart2 size={16} /> Xem chi tiết
              </button>
            </div>
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
                  disabled={starredCount === 0}
                  className="w-full py-3 bg-yellow-50 text-yellow-700 font-bold rounded-xl hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {starredCount > 0 ? `Ôn tập ${starredCount} mục` : 'Chưa có mục nào'}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Test Setup Widget */}
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
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <h4 className="text-lg font-bold text-slate-800 group-hover:text-pink-600 transition-colors">
                        {lesson.title}
                      </h4>
                      <p className="text-slate-500 text-sm leading-relaxed mt-1">
                        {lesson.description}
                      </p>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-600 bg-pink-50 px-2 py-1 rounded-full">
                      {lessonProgressById[lesson.id]?.masteredCount ?? 0}/{lessonProgressById[lesson.id]?.totalItems ?? 0} thuộc
                    </span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden mt-4">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-pink-400"
                      style={{ width: `${Math.min(100, lessonProgressById[lesson.id]?.masteredCount && lessonProgressById[lesson.id]?.totalItems ? (lessonProgressById[lesson.id].masteredCount / lessonProgressById[lesson.id].totalItems) * 100 : 0)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
