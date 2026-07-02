import React from 'react';
import { Flame, Target, Trophy, Sparkles } from 'lucide-react';
import { useLearning } from '../contexts/LearningContext';
import { Card } from './ui/Card';

export default function DailyGoals() {
  const { getAnalytics, getDailyStats, settings } = useLearning();
  const analytics = getAnalytics();
  const todayStats = getDailyStats();

  const reviewedToday = todayStats?.totalReviewed || 0;
  const reviewGoal = settings.dailyReviewGoal || 20;
  const progressPercent = Math.min(100, Math.round((reviewedToday / reviewGoal) * 100));
  const isGoalMet = reviewedToday >= reviewGoal;

  return (
    <Card className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white border-none shadow-md overflow-hidden relative">
      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-5">
          <div className="relative flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shrink-0">
            {isGoalMet ? (
              <Trophy className="text-yellow-300 animate-bounce" size={32} />
            ) : (
              <Target className="text-white" size={32} />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                Mục tiêu hôm nay
              </span>
              {isGoalMet && (
                <span className="text-xs font-bold bg-yellow-400 text-slate-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles size={12} /> Hoàn thành!
                </span>
              )}
            </div>
            <h3 className="text-2xl font-black tracking-tight">
              {reviewedToday} / {reviewGoal} <span className="text-base font-medium opacity-90">lần ôn tập</span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500/30 backdrop-blur-md rounded-xl flex items-center justify-center border border-orange-400/40">
              <Flame className="text-orange-300 fill-orange-400 animate-pulse" size={24} />
            </div>
            <div>
              <p className="text-2xl font-black">{analytics.currentStreak}</p>
              <p className="text-xs font-semibold opacity-80 uppercase tracking-wider">Ngày liên tiếp</p>
            </div>
          </div>

          <div className="w-24 bg-white/20 h-3 rounded-full overflow-hidden p-0.5">
            <div 
              className="bg-yellow-300 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
