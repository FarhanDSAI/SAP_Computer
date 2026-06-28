import React, { useState } from "react";
import { Clock, Play, Pause, RotateCcw, ShieldAlert, Sparkles } from "lucide-react";

interface TimerPanelProps {
  timeLeft: number;
  totalTime: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  onResetTest: () => void;
  onUpdateTimeLimit: (seconds: number) => void;
  isCompleted: boolean;
}

export default function TimerPanel({
  timeLeft,
  totalTime,
  isTimerRunning,
  onToggleTimer,
  onResetTest,
  onUpdateTimeLimit,
  isCompleted
}: TimerPanelProps) {
  const [showConfig, setShowConfig] = useState(false);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Predefined time presets (in minutes)
  const timePresets = [5, 10, 15, 20, 30, 45, 60];

  const percentLeft = (timeLeft / totalTime) * 100;
  const isUrgent = timeLeft < 30 && timeLeft > 0;

  return (
    <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4 relative overflow-hidden" id="timer-component">
      {/* Dynamic Red pulse decoration when time is running out */}
      {isUrgent && (
        <div className="absolute inset-0 bg-rose-500/5 animate-pulse pointer-events-none" />
      )}

      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h3 className="font-display font-semibold text-sm tracking-wide text-gray-300 uppercase flex items-center gap-1.5">
          <Clock className={`w-4 h-4 ${isUrgent ? 'text-rose-400 animate-spin' : 'text-indigo-400'}`} />
          <span>Timer & Control</span>
        </h3>
        
        {!isCompleted && (
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-[10px] uppercase font-bold tracking-wider text-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] px-2 py-0.5 rounded-md border border-white/5 transition-all"
            id="configure-timer-preset"
          >
            {showConfig ? "Done" : "Change Limit"}
          </button>
        )}
      </div>

      {showConfig && !isCompleted ? (
        <div className="flex flex-col gap-2.5" id="timer-preset-selector">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Select exam time limit:</span>
          <div className="grid grid-cols-4 gap-1.5">
            {timePresets.map((mins) => {
              const seconds = mins * 60;
              const isActive = totalTime === seconds;
              return (
                <button
                  key={mins}
                  onClick={() => {
                    onUpdateTimeLimit(seconds);
                    setShowConfig(false);
                  }}
                  className={`py-1 text-xs font-mono font-semibold rounded-lg border transition-all ${
                    isActive
                      ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/35"
                      : "bg-white/[0.01] text-gray-400 border-transparent hover:bg-white/[0.04]"
                  }`}
                  id={`preset-${mins}m`}
                >
                  {mins}m
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-2 relative" id="timer-display-panel">
          {/* Main Digital Timer Text */}
          <span className={`text-4xl md:text-5xl font-bold font-mono tracking-tight select-none leading-none ${
            isUrgent 
              ? "text-rose-400 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse" 
              : timeLeft === 0 
                ? "text-gray-500" 
                : "text-white"
          }`}>
            {formatTime(timeLeft)}
          </span>

          {/* Progress Bar under the timer */}
          <div className="w-4/5 bg-white/[0.02] h-1.5 rounded-full mt-4 overflow-hidden border border-white/[0.03] relative">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isUrgent ? "bg-rose-500" : "bg-indigo-500"
              }`}
              style={{ width: `${percentLeft}%` }}
            />
          </div>

          {/* Time Limit Indicator */}
          <span className="text-[10px] text-gray-400 font-medium mt-2">
            Exam limit set to <strong className="font-mono text-gray-300">{totalTime / 60} minutes</strong>
          </span>
        </div>
      )}

      {/* Primary Actions Button Rail */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        {/* Play / Pause Toggle Button */}
        <button
          onClick={onToggleTimer}
          disabled={isCompleted || timeLeft === 0}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-semibold text-sm transition-all shadow-md ${
            isCompleted || timeLeft === 0
              ? "bg-white/[0.01] text-gray-600 border-transparent cursor-not-allowed"
              : isTimerRunning
                ? "bg-amber-500/10 hover:bg-amber-500/15 text-amber-400 border-amber-500/30"
                : "bg-indigo-500/20 hover:bg-indigo-500/25 text-indigo-400 border-indigo-500/30"
          }`}
          id="play-pause-timer-btn"
        >
          {isTimerRunning ? (
            <>
              <Pause className="w-4 h-4 fill-amber-400/10" />
              <span>Pause Timer</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-indigo-400/10" />
              <span>Start Timer</span>
            </>
          )}
        </button>

        {/* Reset Quiz / Restart Button */}
        <button
          onClick={onResetTest}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.07] text-gray-300 hover:text-white font-semibold text-sm transition-all"
          id="reset-quiz-btn"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Test</span>
        </button>
      </div>

      {/* Time out Warn Banner */}
      {isUrgent && (
        <div className="flex items-center gap-2 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300" id="timer-alert-urgent">
          <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-400 animate-bounce" />
          <span>Time is running out! Hurry to complete the questions.</span>
        </div>
      )}
    </div>
  );
}
