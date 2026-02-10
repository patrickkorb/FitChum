'use client';

import { useState, useCallback, useRef } from 'react';
import { quizQuestions } from '../../data/quizQuestions';
import { QuizAnswers } from '../../types/quiz.types';
import ProgressBar from '../ui/ProgressBar';
import QuizQuestion from './QuizQuestion';
import AnalysisScreen from './AnalysisScreen';
import ResultScreen from './ResultScreen';

type QuizPhase = 'questions' | 'analysis' | 'result';

function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
}

function trackGoal(goalName: string) {
  const visitorId = getCookie('datafast_visitor_id');
  if (!visitorId) return;

  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ visitorId, name: goalName }),
  }).catch(() => {});
}

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [phase, setPhase] = useState<QuizPhase>('questions');
  const quizCompletedRef = useRef(false);

  const handleAnswer = useCallback((answer: string | string[]) => {
    const question = quizQuestions[currentQuestion];

    setAnswers((prev) => ({
      ...prev,
      [question.id]: answer,
    }));

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      if (!quizCompletedRef.current) {
        quizCompletedRef.current = true;
        trackGoal('quiz_completed');
      }
      setPhase('analysis');
    }
  }, [currentQuestion]);

  const handleAnalysisComplete = useCallback(() => {
    setPhase('result');
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {phase === 'questions' && (
        <header className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-6 py-4 border-b border-border">
          <ProgressBar
            current={currentQuestion + 1}
            total={quizQuestions.length}
          />
          {currentQuestion === 0 && (
            <div className="text-center mt-4">
              <p className="text-primary font-semibold text-sm uppercase tracking-wide mb-1">
                Kostenloser Check
              </p>
              <h1 className="text-xl font-bold text-foreground leading-tight">
                Finde heraus, wie du endlich dein Bauchfett loswirst
              </h1>
              <p className="text-muted-foreground text-sm mt-2">
                In nur 60 Sekunden zu deinem persönlichen Ergebnis
              </p>
            </div>
          )}
        </header>
      )}

      <main className="flex-1 relative">
        {quizQuestions.map((question, index) => (
          <QuizQuestion
            key={question.id}
            question={question}
            onAnswer={handleAnswer}
            isVisible={phase === 'questions' && currentQuestion === index}
          />
        ))}

        <AnalysisScreen
          onComplete={handleAnalysisComplete}
          isVisible={phase === 'analysis'}
        />

        <ResultScreen
          answers={answers}
          isVisible={phase === 'result'}
        />
      </main>
    </div>
  );
}
