import React from "react";
import { Award, CheckCircle2, XCircle, HelpCircle, Bookmark, Zap, Lock } from "lucide-react";
import { TestMode } from "../types";

interface StatsCardProps {
  score: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  bookmarksCount: number;
  timeLeft: number;
  totalTime: number;
  isCompleted: boolean;
  testMode: TestMode;
}

export default function StatsCard({
  score,
  totalQuestions,
  attempted,
  correct,
  incorrect,
  bookmarksCount,
  timeLeft,
  totalTime,
  isCompleted,
  testMode
}: StatsCardProps) {
  const showStats = !(testMode === "exam" && !isCompleted);

  const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const progressPercent = Math.round((attempted / totalQuestions) * 100);
  const timeSpent = totalTime - timeLeft;
  const avgTimePerQuestion = attempted > 0 ? Math.round(timeSpent / attempted) : 0;

  // Grade calculator based on correctness
  const getGrade = () => {
    if (!showStats) return "Hidden";
    if (attempted === 0) return "N/A";
    const ratio = correct / totalQuestions;
    if (ratio >= 0.9) return "Outstanding (A+)";
    if (ratio >= 0.8) return "Excellent (A)";
    if (ratio >= 0.7) return "Very Good (B)";
    if (ratio >= 0.6) return "Good (C)";
    if (ratio >= 0.5) return "Satisfactory (D)";
    return "Needs Improvement (F)";
  };

  return (
    <div className="glass-panel p-5 rounded-2xl w-full flex flex-col gap-5 relative overflow-hidden" id="scoreboard-component">
      {/* Decorative backdrop glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-10 -mt-10" />

      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h3 className="font-display font-semibold text-sm tracking-wide text-gray-300 uppercase">Test Scoreboard</h3>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${isCompleted ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'}`}>
          {isCompleted ? "Completed" : "In Progress"}
        </span>
      </div>

      {/* Main Stats Display */}
      <div className="grid grid-cols-2 gap-4">
        {/* Score Radial Ring Card */}
        <div className="glass-panel-light p-4 rounded-xl flex flex-col items-center justify-center text-center">
          <div className="relative flex items-center justify-center w-20 h-20 mb-2">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth="6"
                fill="transparent"
              />
              {/* Foreground Accuracy or Progress Ring */}
              <circle
                cx="40"
                cy="40"
                r="34"
                stroke={isCompleted ? "#10b981" : showStats ? "#6366f1" : "rgba(255, 255, 255, 0.1)"}
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 34}
                strokeDashoffset={2 * Math.PI * 34 * (1 - (showStats ? accuracy : progressPercent) / 100)}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              {showStats ? (
                <>
                  <span className="text-lg font-bold font-display text-white">{accuracy}%</span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-medium">Accuracy</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 text-indigo-400 mb-0.5 animate-pulse" />
                  <span className="text-[8px] uppercase tracking-wider text-indigo-300 font-medium font-semibold">Locked</span>
                </>
              )}
            </div>
          </div>
          <span className="text-xs text-gray-400 font-medium">Grade: <span className="text-white font-semibold">{getGrade()}</span></span>
        </div>

        {/* Primary stats list */}
        <div className="flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between bg-white/[0.01] px-3 py-2 rounded-lg border border-white/[0.02]">
            <span className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              Total Score
            </span>
            <span className="text-sm font-bold text-white font-mono" id="score-counter">
              {showStats ? `${correct} / ${totalQuestions}` : `— / ${totalQuestions}`}
            </span>
          </div>

          <div className="flex items-center justify-between bg-white/[0.01] px-3 py-2 rounded-lg border border-white/[0.02]">
            <span className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Avg Time
            </span>
            <span className="text-sm font-bold text-white font-mono">{avgTimePerQuestion}s <span className="text-[10px] text-gray-400 font-normal">/ q</span></span>
          </div>

          <div className="flex items-center justify-between bg-white/[0.01] px-3 py-2 rounded-lg border border-white/[0.02]">
            <span className="text-xs text-gray-400 flex items-center gap-1.5 font-medium">
              <Bookmark className="w-3.5 h-3.5 text-purple-400" />
              Bookmarked
            </span>
            <span className="text-sm font-bold text-white font-mono">{bookmarksCount}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-gray-400">Completion Progress</span>
          <span className="text-white">{progressPercent}% ({attempted} / {totalQuestions})</span>
        </div>
        <div className="w-full bg-white/[0.03] rounded-full h-2 overflow-hidden border border-white/[0.03]">
          <div 
            className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Breakdown counters */}
      <div className="grid grid-cols-3 gap-2 text-center pt-1">
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-2.5">
          <div className="flex items-center justify-center gap-1 text-emerald-400 mb-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Correct</span>
          </div>
          <span className="text-lg font-bold text-white font-mono" id="correct-counter">
            {showStats ? correct : "?"}
          </span>
        </div>

        <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-2.5">
          <div className="flex items-center justify-center gap-1 text-rose-400 mb-0.5">
            <XCircle className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Wrong</span>
          </div>
          <span className="text-lg font-bold text-white font-mono" id="wrong-counter">
            {showStats ? incorrect : "?"}
          </span>
        </div>

        <div className="bg-gray-800/20 border border-gray-700/20 rounded-xl p-2.5">
          <div className="flex items-center justify-center gap-1 text-gray-400 mb-0.5">
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Left</span>
          </div>
          <span className="text-lg font-bold text-white font-mono">{totalQuestions - attempted}</span>
        </div>
      </div>
    </div>
  );
}
