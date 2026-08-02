/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import LessonView from './components/LessonView';
import TestSetup from './components/TestSetup';
import QuizView from './components/QuizView';
import MultipleChoiceQuiz from './components/MultipleChoiceQuiz';
import GrammarView from './components/GrammarView';
import { lessons, vocabularyData, kanjiData } from './data';

export default function App() {
  const [view, setView] = useState<'dashboard' | 'lesson' | 'test-setup' | 'quiz' | 'starred-review' | 'multiple-choice' | 'grammar'>('dashboard');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [testLessonIds, setTestLessonIds] = useState<string[]>([]);
  const [testType, setTestType] = useState<'vocab' | 'kanji' | 'mixed'>('mixed');
  const [blurFurigana, setBlurFurigana] = useState(true);

  // Starred words state with LocalStorage persistence
  const [starredIds, setStarredIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('sakura_starred');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [starredKanjiIds, setStarredKanjiIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('sakura_kanji_starred');
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem('sakura_starred', JSON.stringify(Array.from(starredIds)));
  }, [starredIds]);

  useEffect(() => {
    localStorage.setItem('sakura_kanji_starred', JSON.stringify(Array.from(starredKanjiIds)));
  }, [starredKanjiIds]);

  const toggleStar = (id: string, type: 'vocab' | 'kanji', forceStatus?: boolean) => {
    const setState = type === 'vocab' ? setStarredIds : setStarredKanjiIds;
    
    setState(prev => {
      const newSet = new Set(prev);
      if (forceStatus !== undefined) {
        if (forceStatus) newSet.add(id);
        else newSet.delete(id);
      } else {
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
      }
      return newSet;
    });
  };

  const handleSelectLesson = (id: string) => {
    setActiveLessonId(id);
    setView('lesson');
  };

  const handleStartMultipleChoice = () => {
    setView('multiple-choice');
  };

  const handleSetupTest = () => {
    setView('test-setup');
  };

  const handleShowGrammar = () => {
    setView('grammar');
  };

  const handleStartQuiz = (lessonIds: string[], type: 'vocab' | 'kanji' | 'mixed') => {
    setTestLessonIds(lessonIds);
    setTestType(type);
    setView('quiz');
  };

  const handleReviewStarred = () => {
    setView('starred-review');
  };

  const handleBackToDashboard = () => {
    setView('dashboard');
    setActiveLessonId(null);
    setTestLessonIds([]);
  };

  return (
    <div className="min-h-screen bg-sakura-50 font-sans selection:bg-pink-200">
      
      {/* Universal header nav */}
      <header className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-pink-100/50">
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
            onSetupTest={handleSetupTest} 
            starredWordsCount={starredIds.size}
            starredKanjiCount={starredKanjiIds.size}
            onReviewStarred={handleReviewStarred}
            onShowGrammar={handleShowGrammar}
          />
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
              starredIds={starredIds}
              starredKanjiIds={starredKanjiIds}
              onToggleStar={toggleStar}
              blurFurigana={blurFurigana}
              onStartMultipleChoice={handleStartMultipleChoice}
            />
          );
        })()}

        {view === 'starred-review' && (() => {
           const words = vocabularyData.filter((v) => starredIds.has(v.id));
           const kanjis = kanjiData.filter((k) => starredKanjiIds.has(k.id));
           return (
            <LessonView 
              title="Ôn tập mục đã lưu"
              description="Ôn tập những từ vựng và Hán tự bạn đã đánh dấu sao."
              words={words}
              kanjis={kanjis}
              onBack={handleBackToDashboard}
              starredIds={starredIds}
              starredKanjiIds={starredKanjiIds}
              onToggleStar={toggleStar}
              blurFurigana={blurFurigana}
              onStartMultipleChoice={handleStartMultipleChoice}
            />
           );
        })()}

        {view === 'test-setup' && (
          <TestSetup 
            onBack={handleBackToDashboard} 
            onStartQuiz={handleStartQuiz} 
          />
        )}

        {view === 'quiz' && testLessonIds.length > 0 && (
          <QuizView 
            lessonIds={testLessonIds} 
            testType={testType}
            onBack={handleBackToDashboard} 
            onMarkStarred={(id, type) => toggleStar(id, type, true)}
          />
        )}

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
            // For starred review
            title = 'Trắc nghiệm: Mục đã lưu';
            words = vocabularyData.filter((v) => starredIds.has(v.id));
            kanjis = kanjiData.filter((k) => starredKanjiIds.has(k.id));
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

        {view === 'grammar' && (
          <GrammarView onBack={handleBackToDashboard} />
        )}
      </main>

    </div>
  );
}
