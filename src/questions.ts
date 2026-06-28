import { MCQQuestion } from "./types";
import { chunk1 } from "./questions_chunk1";
import { chunk2 } from "./questions_chunk2";
import { chunk3 } from "./questions_chunk3";
import { chunk4 } from "./questions_chunk4";
import { chunk5 } from "./questions_chunk5";
import { chunk6 } from "./questions_chunk6";

export const DEFAULT_QUESTIONS: MCQQuestion[] = [
  ...chunk1,
  ...chunk2,
  ...chunk3,
  ...chunk4,
  ...chunk5,
  ...chunk6
].map((q, idx) => ({
  ...q,
  id: idx + 1
}));
