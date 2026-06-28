import React from "react";
import { Bookmark, Check, X, Circle, AlertCircle, HelpCircle, BookOpen } from "lucide-react";
import { MCQQuestion, TestMode } from "../types";

interface QuestionCardProps {
  question: MCQQuestion;
  index: number;
  totalQuestions: number;
  selectedAnswer: "A" | "B" | "C" | "D" | undefined;
  isRevealed: boolean;
  onSelectOption: (option: "A" | "B" | "C" | "D") => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  testMode: TestMode;
  isCompleted: boolean;
}

export default function QuestionCard({
  question,
  index,
  totalQuestions,
  selectedAnswer,
  isRevealed,
  onSelectOption,
  isBookmarked,
  onToggleBookmark,
  testMode,
  isCompleted
}: QuestionCardProps) {
  const optionsKeys: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
  
  // Decide whether correctness should be visually revealed
  const showCorrectness = testMode === "practice" ? isRevealed : isCompleted;

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-2xl flex flex-col gap-4 sm:gap-5 relative overflow-hidden" id={`question-card-${question.id}`}>
      {/* Visual Header / Meta */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold font-mono text-sm">
            {index + 1}
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs text-gray-400 font-medium tracking-wide uppercase">Question {index + 1} of {totalQuestions}</span>
            <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium">Topic: Computer Science Fundamental</span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center gap-2">
          {/* Practice/Exam Mode Tag */}
          <span className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
            testMode === "practice" 
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
          }`}>
            {testMode === "practice" ? "Practice" : "Exam Mode"}
          </span>

          {/* Bookmark Button */}
          <button
            onClick={onToggleBookmark}
            className={`p-1.5 sm:p-2 rounded-lg transition-all border ${
              isBookmarked
                ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                : "bg-white/[0.01] hover:bg-white/[0.05] text-gray-400 hover:text-white border-white/5"
            }`}
            title={isBookmarked ? "Remove Bookmark" : "Bookmark Question"}
            id={`bookmark-btn-${question.id}`}
          >
            <Bookmark className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isBookmarked ? "fill-purple-400/20" : ""}`} />
          </button>
        </div>
      </div>

      {/* Question Text */}
      <div className="py-1 sm:py-2">
        <h2 className="text-base sm:text-lg md:text-xl font-medium text-gray-100 font-display leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* MCQ Options */}
      <div className="flex flex-col gap-3 sm:gap-4">
        {optionsKeys.map((key) => {
          const optionText = question.options[key];
          const isSelected = selectedAnswer === key;
          const isCorrectOption = question.correct_answer === key;

          // Default state styling following the requested premium Frosted Glass design
          let optionStyle = "border-white/10 bg-white/5 hover:bg-white/10 text-white/80 rounded-2xl sm:rounded-3xl";
          let badgeStyle = "bg-white/5 border-white/20 text-white/40";
          let showIcon: "none" | "check" | "cross" = "none";

          if (showCorrectness) {
            if (isCorrectOption) {
              // Correct Choice State (both if selected or just correct choice)
              optionStyle = "border-emerald-500/50 bg-emerald-500/10 text-white rounded-2xl sm:rounded-3xl font-medium";
              badgeStyle = "bg-emerald-500 text-white border-transparent";
              showIcon = "check";
            } else if (isSelected) {
              // Wrong Selected State
              optionStyle = "border-rose-500/50 bg-rose-500/10 text-white rounded-2xl sm:rounded-3xl font-medium";
              badgeStyle = "bg-rose-500 text-white border-transparent";
              showIcon = "cross";
            } else {
              // Unselected other choices
              optionStyle = "border-white/5 bg-white/1 text-white/30 rounded-2xl sm:rounded-3xl opacity-40 pointer-events-none";
              badgeStyle = "bg-white/5 border-white/10 text-white/20";
            }
          } else {
            // Normal selection workflow
            if (isSelected) {
              optionStyle = "border-indigo-500/50 bg-indigo-500/15 text-white rounded-2xl sm:rounded-3xl shadow-lg shadow-indigo-500/10";
              badgeStyle = "bg-indigo-500 text-white border-transparent";
            }
          }

          // Disable selection once answered in practice mode OR when whole exam is completed
          const isDisabled = (testMode === "practice" && isRevealed) || isCompleted;

          return (
            <button
              key={key}
              onClick={() => !isDisabled && onSelectOption(key)}
              disabled={isDisabled}
              className={`p-3.5 sm:p-5 flex items-center gap-3 sm:gap-4 transition-all text-left relative border group ${optionStyle} ${
                !isDisabled ? "cursor-pointer" : "cursor-default"
              }`}
              id={`option-${key}-${question.id}`}
            >
              {/* Badge letter holder */}
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center font-bold text-xs sm:text-sm transition-all flex-shrink-0 ${badgeStyle} ${
                !isDisabled && !isSelected ? "group-hover:bg-indigo-500 group-hover:text-white group-hover:border-transparent" : ""
              }`}>
                {key}
              </div>

              {/* Option Text */}
              <span className="text-sm sm:text-base leading-relaxed pr-8 sm:pr-10">{optionText}</span>

              {/* Status Icons aligned absolute right like in design template */}
              {showIcon !== "none" && (
                <div className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2">
                  {showIcon === "check" ? (
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
                  ) : (
                    <X className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400" />
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Explanatory Feedback Banner (shown after answering in practice mode OR when completed) */}
      {showCorrectness && (
        <div 
          className={`flex gap-3 p-4 rounded-xl border mt-2 text-sm leading-relaxed ${
            selectedAnswer === question.correct_answer
              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
              : "bg-rose-500/5 border-rose-500/20 text-rose-300"
          }`}
          id={`feedback-banner-${question.id}`}
        >
          {selectedAnswer === question.correct_answer ? (
            <>
              <Check className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <span className="font-semibold block text-emerald-200">Correct Answer!</span>
                <span>You answered <strong className="font-mono text-white">Option {question.correct_answer}</strong> which is the correct choice. Great job!</span>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
              <div>
                <span className="font-semibold block text-rose-200">Incorrect Answer</span>
                <span>
                  You answered <strong className="font-mono text-white">Option {selectedAnswer || "None"}</strong>. 
                  The correct answer is <strong className="font-mono text-emerald-300">Option {question.correct_answer}</strong>: 
                  <span className="italic text-gray-300"> "{question.options[question.correct_answer]}"</span>.
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
