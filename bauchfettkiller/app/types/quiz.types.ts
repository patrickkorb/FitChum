export interface QuizOption {
  id: string;
  label: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  multiSelect: boolean;
}

export interface QuizAnswers {
  [questionId: string]: string | string[];
}
