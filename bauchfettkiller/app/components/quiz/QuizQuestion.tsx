'use client';

import { useState, useEffect } from 'react';
import { QuizQuestion as QuizQuestionType } from '../../types/quiz.types';
import OptionButton from '../ui/OptionButton';
import Button from '../ui/Button';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (answer: string | string[]) => void;
  isVisible: boolean;
}

export default function QuizQuestion({
  question,
  onAnswer,
  isVisible,
}: QuizQuestionProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  useEffect(() => {
    setSelectedOptions([]);
  }, [question.id]);

  const handleOptionClick = (optionId: string) => {
    if (question.multiSelect) {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      onAnswer(optionId);
    }
  };

  const handleContinue = () => {
    if (selectedOptions.length > 0) {
      onAnswer(selectedOptions);
    }
  };

  return (
    <div
      className={`
        absolute inset-0 flex flex-col justify-center px-6
        transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}
      `}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-8 leading-tight">
        {question.question}
      </h2>

      <div className="space-y-3 max-w-md mx-auto w-full">
        {question.options.map((option) => (
          <OptionButton
            key={option.id}
            label={option.label}
            selected={selectedOptions.includes(option.id)}
            onClick={() => handleOptionClick(option.id)}
            multiSelect={question.multiSelect}
          />
        ))}
      </div>

      {question.multiSelect && (
        <div className="mt-6 max-w-md mx-auto w-full">
          <Button
            variant="accent"
            size="lg"
            className="w-full"
            onClick={handleContinue}
            disabled={selectedOptions.length === 0}
          >
            Weiter
          </Button>
        </div>
      )}
    </div>
  );
}
