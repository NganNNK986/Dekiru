/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import LessonView from './components/LessonView';
import TestSetup from './components/TestSetup';
import QuizView from './components/QuizView';
import MultipleChoiceQuiz from './components/MultipleChoiceQuiz';
import SRSReviewSession from './components/SRSReviewSession';
import ProgressDashboard from './components/ProgressDashboard';
import TypingQuiz from './components/exercises/TypingQuiz';
import FillBlankQuiz from './components/exercises/FillBlankQuiz';
import KanjiWritingQuiz from './components/exercises/KanjiWritingQuiz';
import MatchingGame from './components/exercises/MatchingGame';
import { LearningProvider, useLearning } from './contexts/LearningContext';
import { lessons, vocabularyData, kanjiData } from './data';

type AppView = 
  | 'dashboard' 
  | 'lesson' 
  | 'test-setup' 
  | 'quiz' 
  | 'starred-review' 
  | 'multiple-choice'
  | 'srs-review'
  | 'analytics'
  | 'typing'
  | 'fill-blank'
  | 'kanji-writing'
  | 'matching';

function MainApp() {
  const [view, setView] = useState<AppView>('dashboard');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [testLessonIds, setTestLessonIds] = useState<string[]>([]);
  const [testType, setTestType] = useState<'vocab' | 'kanji' | 'mixed'>('mixed');
  const [blurFurigana, setBlurFurigana] = useState(true);

  const { toggleStar, isStarred } = useLearning();

  const handleSelectLesson = (id: string) => {
    setActiveLessonId(id);
    setView('lesson');
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
    setActiveLessonId(null);
    setTestLessonIds([]);
  };

  return (
    <div className="min-h-screen bg-sakura-50 font-sans selection:bg-pink-200">
      
      {/* Universal header nav */}
      <header className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-pink-100/50 shadow-xs">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 font-black text-xl text-slate-800 tracking-tight transition-transform active:scale-95"
          >
            🌸 Sakura
            <span className="text-pink-500 font-medium">Vocab</span>
          </button>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-600 cursor-pointer hover:text-pink-600 transition-colors">
              <input 
                type="checkbox"
                checked={blurFurigana}
                onChange={(e) => setBlurFurigana(e.target.checked)}
                className="accent-pink-500 rounded cursor-pointer w-4 h-4"
              />
              <span className="hidden sm:inline">Làm mờ cách đọc/nghĩa</span>
            </label>
            <div className="text-sm font-medium text-slate-500 bg-pink-50 px-3 py-1 rounded-full border border-pink-100 hidden sm:block">
              Dekiru Chukyu
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto p-6 md:p-8">
        {view === 'dashboard' && (
          <Dashboard 
            onSelectLesson={handleSelectLesson} 
            onSetupTest={() => setView('test-setup')} 
            onReviewStarred={() => setView('starred-review')}
            onStartSRS={() => setView('srs-review')}
            onOpenAnalytics={() => setView('analytics')}
          />
        )}

        {view === 'srs-review' && (
          <SRSReviewSession onBack={handleBackToDashboard} />
        )}

        {view === 'analytics' && (
          <ProgressDashboard onBack={handleBackToDashboard} />
        )}
        
        {view === 'lesson' && activeLessonId && (() => {
          const lesson = lessons.find((l) => l.id === activeLessonId);
          const words = vocabularyData.filter((v) => v.lessonId === activeLessonId);
          const kanjis = kanjiData.filter((k) => k.lessonId === activeLessonId);
          return (
            <LessonView 
              title={lesson?.title || 'Lesson'}
              description={lesson?.description}
              words={words}
              kanjis={kanjis}
              onBack={handleBackToDashboard}
              isStarred={isStarred}
              onToggleStar={toggleStar}
              blurFurigana={blurFurigana}
              onStartMultipleChoice={() => setView('multiple-choice')}
              onStartTyping={() => setView('typing')}
              onStartFillBlank={() => setView('fill-blank')}
              onStartKanjiWriting={() => setView('kanji-writing')}
              onStartMatching={() => setView('matching')}
              onNavigateToItem={(id, type) => {
                // Find lesson containing this item and navigate
                const targetLessonId = type === 'vocab' 
                  ? vocabularyData.find(v => v.id === id)?.lessonId
                  : kanjiData.find(k => k.id === id)?.lessonId;
                if (targetLessonId) setActiveLessonId(targetLessonId);
              }}
            />
          );
        })()}

        {view === 'starred-review' && (() => {
           const words = vocabularyData.filter((v) => isStarred(v.id));
           const kanjis = kanjiData.filter((k) => isStarred(k.id));
           return (
            <LessonView 
              title="Ôn tập mục đã lưu"
              description="Ôn tập những từ vựng và Hán tự bạn đã đánh dấu sao."
              words={words}
              kanjis={kanjis}
              onBack={handleBackToDashboard}
              isStarred={isStarred}
              onToggleStar={toggleStar}
              blurFurigana={blurFurigana}
              onStartMultipleChoice={() => setView('multiple-choice')}
              onStartTyping={() => setView('typing')}
              onStartFillBlank={() => setView('fill-blank')}
              onStartKanjiWriting={() => setView('kanji-writing')}
              onStartMatching={() => setView('matching')}
              onNavigateToItem={() => {}}
            />
           );
        })()}

        {view === 'test-setup' && (
          <TestSetup 
            onBack={handleBackToDashboard} 
            onStartQuiz={(lessonIds, type) => {
              setTestLessonIds(lessonIds);
              setTestType(type);
              setView('quiz');
            }} 
          />
        )}

        {view === 'quiz' && testLessonIds.length > 0 && (
          <QuizView 
            lessonIds={testLessonIds} 
            testType={testType}
            onBack={handleBackToDashboard} 
            onMarkStarred={(id, type) => toggleStar(id, type)}
          />
        )}

        {/* Exercises */}
        {view === 'multiple-choice' && (() => {
          let title = '';
          let words = [];
          let kanjis = [];

          if (activeLessonId) {
            const lesson = lessons.find((l) => l.id === activeLessonId);
            title = lesson ? `Trắc nghiệm: ${lesson.title}` : 'Trắc nghiệm';
            words = vocabularyData.filter((v) => v.lessonId === activeLessonId);
            kanjis = kanjiData.filter((k) => k.lessonId === activeLessonId);
          } else {
            title = 'Trắc nghiệm: Mục đã lưu';
            words = vocabularyData.filter((v) => isStarred(v.id));
            kanjis = kanjiData.filter((k) => isStarred(k.id));
          }

          return (
            <MultipleChoiceQuiz
              title={title}
              words={words}
              kanjis={kanjis}
              onBack={() => setView(activeLessonId ? 'lesson' : 'starred-review')}
            />
          );
        })()}

        {view === 'typing' && (() => {
          const items = activeLessonId
            ? [...vocabularyData.filter(v => v.lessonId === activeLessonId), ...kanjiData.filter(k => k.lessonId === activeLessonId)]
            : [...vocabularyData.filter(v => isStarred(v.id)), ...kanjiData.filter(k => isStarred(k.id))];
          return <TypingQuiz items={items} onBack={() => setView(activeLessonId ? 'lesson' : 'starred-review')} />;
        })()}

        {view === 'fill-blank' && (() => {
          const words = activeLessonId
            ? vocabularyData.filter(v => v.lessonId === activeLessonId)
            : vocabularyData.filter(v => isStarred(v.id));
          return <FillBlankQuiz words={words} onBack={() => setView(activeLessonId ? 'lesson' : 'starred-review')} />;
        })()}

        {view === 'kanji-writing' && (() => {
          const kanjis = activeLessonId
            ? kanjiData.filter(k => k.lessonId === activeLessonId)
            : kanjiData.filter(k => isStarred(k.id));
          return <KanjiWritingQuiz kanjis={kanjis} onBack={() => setView(activeLessonId ? 'lesson' : 'starred-review')} />;
        })()}

        {view === 'matching' && (() => {
          const items = activeLessonId
            ? [...vocabularyData.filter(v => v.lessonId === activeLessonId), ...kanjiData.filter(k => k.lessonId === activeLessonId)]
            : [...vocabularyData.filter(v => isStarred(v.id)), ...kanjiData.filter(k => isStarred(k.id))];
          return <MatchingGame items={items} onBack={() => setView(activeLessonId ? 'lesson' : 'starred-review')} />;
        })()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <LearningProvider>
      <MainApp />
    </LearningProvider>
  );
}
