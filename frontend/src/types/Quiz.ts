export interface Quiz {
  id: number;
  name: string;
  points: number;
  num_questions: number | null;
  category: string;
  subject: string;
  topic: string;
  "time-created": string;
  "due-date": string;
  creator: number;
  "result-reveal": boolean | null;
  "answer-reveal": boolean | null;
  "time-limit": number;
  instructions: string;
  description: string;
  shuffle: boolean;
  image: string | null;
  text: string | null;
  "deck-id": number;
  "share-id": number | null;
  fav: boolean | null;
  type: "Quiz";
}

export interface QuestionResult {
  id: number;
  "test-id": number;
  taker: number;
  "question-id": number;
  answer: string;
  points: number;
  "time-created": string;
  "quiz-result-id": number;
  correct: boolean;
}

export interface Question {
  id: number;
  question: string;
  term: string;
  content: string;
  "boc-2": string | null;
  "boc-3": string | null;
  "boc-4": string | null;
  formula: string | null;
  "prompt-option": string | null;
  "q-type": string;
  "q-order": number | null;
  points: number | null;
}

export interface QuizResult {
  id: number;
  "test-id": number;
  taker: number;
  creator: number;
  "due-date": string;
  "start-time": string;
  "end-time": string;
  points: number;
  correct: number;
  blank: number;
  graded: number;
}
