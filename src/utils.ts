import { MCQQuestion } from "./types";

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Prepares questions based on custom shuffle and limit settings.
 * Maintains full answer integrity by dynamically re-mapping the correct_answer key
 * when options are shuffled.
 */
export function prepareQuestions(
  baseQuestions: MCQQuestion[],
  settings: {
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    poolSize: "all" | number;
  }
): MCQQuestion[] {
  let list = [...baseQuestions];

  // 1. Shuffle question list if enabled
  if (settings.shuffleQuestions) {
    list = shuffleArray(list);
  }

  // 2. Truncate to desired pool size if requested
  if (settings.poolSize !== "all" && typeof settings.poolSize === "number") {
    list = list.slice(0, settings.poolSize);
  }

  // 3. Shuffle options within each question if enabled
  if (settings.shuffleOptions) {
    list = list.map((q) => {
      const originalCorrectText = q.options[q.correct_answer];
      
      // Get all option texts
      const optionTexts = [q.options.A, q.options.B, q.options.C, q.options.D];
      const shuffledTexts = shuffleArray(optionTexts);

      const newOptions = {
        A: shuffledTexts[0],
        B: shuffledTexts[1],
        C: shuffledTexts[2],
        D: shuffledTexts[3]
      };

      // Determine the new key of the correct text
      let newCorrectKey: "A" | "B" | "C" | "D" = "A";
      if (newOptions.B === originalCorrectText) newCorrectKey = "B";
      else if (newOptions.C === originalCorrectText) newCorrectKey = "C";
      else if (newOptions.D === originalCorrectText) newCorrectKey = "D";

      return {
        ...q,
        options: newOptions,
        correct_answer: newCorrectKey
      };
    });
  }

  return list;
}
