export interface MCQQuestion {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: "A" | "B" | "C" | "D";
}

export interface MCQBank {
  title: string;
  source: string;
  total_questions: number;
  questions: MCQQuestion[];
}

export type TestMode = "practice" | "exam";

export interface TestState {
  questions: MCQQuestion[];
  currentQuestionIndex: number;
  selectedAnswers: { [questionId: number]: "A" | "B" | "C" | "D" };
  revealedQuestions: { [questionId: number]: boolean }; // for practice mode showing instant check
  score: number;
  isCompleted: boolean;
  timeLeft: number; // in seconds
  totalTime: number; // in seconds
  isTimerRunning: boolean;
  bookmarks: number[]; // array of question IDs bookmarked
}
