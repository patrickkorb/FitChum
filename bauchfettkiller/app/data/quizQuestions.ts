import { QuizQuestion } from '../types/quiz.types';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'gender',
    question: 'Was ist dein Geschlecht?',
    options: [
      { id: 'male', label: 'Mann' },
      { id: 'female', label: 'Frau' },
    ],
    multiSelect: false,
  },
  {
    id: 'age',
    question: 'Wie alt bist du?',
    options: [
      { id: 'under40', label: 'Unter 40' },
      { id: '40-50', label: '40 - 50' },
      { id: '50-60', label: '50 - 60' },
      { id: '60+', label: '60+' },
    ],
    multiSelect: false,
  },
  {
    id: 'fatArea',
    question: 'Wo sitzt dein hartnäckigstes Fett?',
    options: [
      { id: 'belly', label: 'Bauch' },
      { id: 'hips', label: 'Hüften' },
      { id: 'thighs', label: 'Oberschenkel' },
      { id: 'arms', label: 'Arme'},
      { id: 'everywhere', label: 'Überall' },
    ],
    multiSelect: true,
  },
  {
    id: 'diets',
    question: 'Wie viele Diäten hast du schon probiert?',
    options: [
      { id: 'none', label: 'Keine' },
      { id: '1', label: '1' },
      {id: '2-3', label: '2-3' },
      { id: '4+', label: 'Mehr als 4' },
    ],
    multiSelect: false,
  },
  {
    id: 'obstacle',
    question: 'Was hat dich bisher am meisten aufgehalten?',
    options: [
      { id: 'time', label: 'Keine Zeit' },
      { id: 'motivation', label: 'Fehlende Motivation' },
      { id: 'food', label: 'Der Verzicht auf Essen' },
      { id: 'method', label: 'Die falsche Methode' },
    ],
    multiSelect: false,
  },
  {
    id: 'speed',
    question: 'Wie schnell willst du Ergebnisse sehen?',
    options: [
      { id: 'fast', label: 'So schnell wie möglich'},
      { id: '2weeks', label: 'In 2 Wochen' },
      { id: '4weeks', label: 'In 4 Wochen' },
      { id: 'noRush', label: 'Zeit spielt keine Rolle' },
    ],
    multiSelect: false,
  },
];
