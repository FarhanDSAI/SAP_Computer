import React, { useState } from "react";
import { Search, Filter, Bookmark, Check, X, HelpCircle, Eye } from "lucide-react";
import { MCQQuestion, TestMode } from "../types";

interface SidebarProps {
  questions: MCQQuestion[];
  currentQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  selectedAnswers: { [questionId: number]: "A" | "B" | "C" | "D" };
  revealedQuestions: { [questionId: number]: boolean };
  bookmarks: number[];
  testMode: TestMode;
  isCompleted: boolean;
}

export type SidebarFilter = "all" | "bookmarked" | "attempted" | "unattempted" | "correct" | "incorrect";

export default function Sidebar({
  questions,
  currentQuestionIndex,
  onSelectQuestion,
  selectedAnswers,
  revealedQuestions,
  bookmarks,
  testMode,
  isCompleted
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<SidebarFilter>("all");

  // Determine if a question's correctness is revealed to the user
  const isCorrectnessVisible = (q: MCQQuestion) => {
    if (testMode === "practice") {
      return revealedQuestions[q.id];
    }
    return isCompleted;
  };

  const getQuestionStatus = (q: MCQQuestion) => {
    const isBookmarked = bookmarks.includes(q.id);
    const answer = selectedAnswers[q.id];
    const isAttempted = !!answer;
    
    let isCorrect = false;
    if (isAttempted && isCorrectnessVisible(q)) {
      isCorrect = answer === q.correct_answer;
    }

    return {
      isBookmarked,
      isAttempted,
      isCorrect,
      hasCorrectnessRevealed: isCorrectnessVisible(q)
    };
  };

  // Filter & Search Logic
  const filteredQuestions = questions.map((q, originalIndex) => ({ q, originalIndex })).filter(({ q }) => {
    // Search query match
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      Object.values(q.options).some(opt => opt.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Filter type match
    const status = getQuestionStatus(q);
    switch (activeFilter) {
      case "bookmarked":
        return status.isBookmarked;
      case "attempted":
        return status.isAttempted;
      case "unattempted":
        return !status.isAttempted;
      case "correct":
        return status.isAttempted && status.hasCorrectnessRevealed && status.isCorrect;
      case "incorrect":
        return status.isAttempted && status.hasCorrectnessRevealed && !status.isCorrect;
      case "all":
      default:
        return true;
    }
  });

  return (
    <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 h-full min-h-[500px]" id="sidebar-navigation">
      <div className="border-b border-white/5 pb-3">
        <h3 className="font-display font-semibold text-sm tracking-wide text-gray-300 uppercase flex items-center gap-2">
          <span>Question Navigator</span>
          <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 px-1.5 py-0.5 rounded">
            {questions.length} total
          </span>
        </h3>
      </div>

      {/* Search Input */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search keywords..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl glass-input placeholder-gray-500"
          id="search-mcqs"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-white/5 pb-3">
        {(["all", "bookmarked", "attempted", "unattempted", "correct", "incorrect"] as SidebarFilter[]).map((filter) => {
          // Hide correct/incorrect tabs if they are not relevant in silent exam mode until completion
          if (testMode === "exam" && !isCompleted && (filter === "correct" || filter === "incorrect")) {
            return null;
          }

          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg uppercase tracking-wider border transition-all ${
                isActive
                  ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/30 shadow-sm"
                  : "bg-white/[0.01] text-gray-400 border-transparent hover:bg-white/[0.04] hover:text-gray-300"
              }`}
              id={`filter-tab-${filter}`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Questions Grid Container */}
      <div className="flex-1 overflow-y-auto pr-1 max-h-[380px] min-h-[220px]" id="navigator-grid-container">
        {filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-8 text-gray-500 h-full">
            <HelpCircle className="w-8 h-8 mb-2 stroke-1 text-gray-600" />
            <p className="text-xs font-medium">No questions match filter/search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-2" id="navigator-grid">
            {filteredQuestions.map(({ q, originalIndex }) => {
              const status = getQuestionStatus(q);
              const isCurrent = originalIndex === currentQuestionIndex;

              let boxStyle = "bg-white/[0.02] border-white/5 text-gray-400 hover:bg-white/[0.06] hover:border-white/15";

              if (isCurrent) {
                boxStyle = "border-indigo-500 bg-indigo-500/25 text-white shadow-md shadow-indigo-500/10 scale-105 font-bold z-10";
              } else if (status.isAttempted) {
                if (status.hasCorrectnessRevealed) {
                  boxStyle = status.isCorrect
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-400 font-semibold";
                } else {
                  boxStyle = "bg-indigo-500/10 border-indigo-500/30 text-indigo-300 font-semibold";
                }
              }

              return (
                <button
                  key={q.id}
                  onClick={() => onSelectQuestion(originalIndex)}
                  className={`relative flex items-center justify-center aspect-square text-xs rounded-lg border font-mono transition-all ${boxStyle}`}
                  title={`Question ${q.id}`}
                  id={`grid-box-${q.id}`}
                >
                  {/* Bookmark tiny indicator */}
                  {status.isBookmarked && (
                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-purple-400 shadow-sm" />
                  )}
                  <span>{q.id}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend / Info Footer */}
      <div className="border-t border-white/5 pt-3 mt-auto text-[10px] text-gray-500 flex flex-col gap-1.5">
        <span className="font-semibold text-gray-400 uppercase tracking-wider text-[9px] mb-1">Color Map legend:</span>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-indigo-500/20 border border-indigo-500/30" />
            <span>Selected / Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-indigo-500/10 border border-indigo-500/20" />
            <span>Attempted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500/10 border border-emerald-500/20" />
            <span>Correct choice</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-500/10 border border-rose-500/20" />
            <span>Wrong choice</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-1 border-t border-white/[0.03] pt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <span>Purple dot = Bookmarked Question</span>
        </div>
      </div>
    </div>
  );
}
