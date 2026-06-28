import React, { useState } from "react";
import { 
  BookOpen, 
  Play, 
  Upload, 
  HelpCircle, 
  Sparkles, 
  Flame, 
  Timer, 
  Bookmark, 
  ShieldCheck, 
  CheckCircle,
  GraduationCap,
  ExternalLink,
  Shuffle,
  Grid,
  Layers,
  Settings
} from "lucide-react";
import { TestMode } from "../types";

interface HomeDashboardProps {
  bankTitle: string;
  totalQuestions: number;
  onStartTest: (settings: {
    mode: TestMode;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    poolSize: "all" | number;
    timeLimitMinutes: number | "auto";
  }) => void;
  onOpenImporter: () => void;
}

export default function HomeDashboard({
  bankTitle,
  totalQuestions,
  onStartTest,
  onOpenImporter
}: HomeDashboardProps) {
  // --- CONFIGURATION STATES ---
  const [mode, setMode] = useState<TestMode>("practice");
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [poolSize, setPoolSize] = useState<"all" | 25 | 50 | 100>("all");
  const [timeLimit, setTimeLimit] = useState<"auto" | 15 | 30 | 45 | 60>("auto");

  // Determine dynamic questions pool size
  const activePoolCount = poolSize === "all" ? totalQuestions : Math.min(poolSize, totalQuestions);

  // Compute standard estimated time: 45 seconds per question
  const estimatedTimeSeconds = activePoolCount * 45;
  const estimatedTimeMins = Math.ceil(estimatedTimeSeconds / 60);

  const handleLaunch = () => {
    onStartTest({
      mode,
      shuffleQuestions,
      shuffleOptions,
      poolSize: poolSize === "all" ? "all" : activePoolCount,
      timeLimitMinutes: timeLimit === "auto" ? estimatedTimeMins : timeLimit
    });
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 max-w-6xl mx-auto py-2 sm:py-4 animate-fade-in" id="home-dashboard">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight">
              NED Entry Test Preparation
            </h1>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
              Current Database: <span className="text-gray-300 font-semibold">{bankTitle}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenImporter}
            className="glass-button text-xs font-semibold py-2 px-3.5 rounded-xl flex items-center gap-2 text-white hover:border-indigo-500/30 cursor-pointer w-full sm:w-auto justify-center"
            id="home-open-importer"
          >
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>Upload custom JSON bank</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* LEFT COLUMN: HERO INFORMATION & PREPARATION FEATURES (7 columns) */}
        <div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">
          <section className="glass-panel p-5 sm:p-8 rounded-2xl sm:rounded-3xl relative overflow-hidden border border-white/10">
            {/* Ambient decorative circle */}
            <div className="absolute top-[-30px] left-[-30px] w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px]" />
            
            <div className="flex flex-col gap-3 relative z-10">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight leading-tight">
                Computer Science <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-indigo-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
                  MCQ Practice Simulator
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-xl">
                Prepare with maximum efficiency. This simulator lets you mimic actual NED University computer science entry-level criteria with fully random question combinations, option order scrambling, and strict exam mode restrictions.
              </p>
            </div>
          </section>

          {/* Core Features list */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex gap-3.5">
              <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400 h-fit">
                <Shuffle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Custom Option Shuffling</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Avoid simple rote memorization of option keys (A, B, C, D). Our engine reshuffles option rows dynamically while preserving correctness.
                </p>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex gap-3.5">
              <div className="p-2 bg-pink-500/10 rounded-xl text-pink-400 h-fit">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Interactive Exam Timer</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Practice under real time constraints. Exam simulation hides answers until you submit or the clock hits zero.
                </p>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex gap-3.5">
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 h-fit">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Configurable Pool Count</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Select a full-length 100-question exam, or quick 25/50 sprints to fit your daily study schedule perfectly.
                </p>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex gap-3.5">
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400 h-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Comprehensive Scoring</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  View immediate incorrect answers, explanation breakdowns, bookmarks, and detailed stats once completed.
                </p>
              </div>
            </div>
          </section>

          {/* Similar platform footer links */}
          <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-3 px-6">
            <span className="font-semibold text-gray-500 uppercase tracking-widest text-[10px]">
              SAP English NED Simulator Reference
            </span>
            <a 
              href="https://sapenglishned.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-all"
            >
              <span>Visit SAP English 8th Edition Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: SIMULATOR CONTROL CENTER & LAUNCHER (5 columns) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 relative overflow-hidden flex flex-col gap-5" id="simulation-panel">
            {/* Top glowing strip */}
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500" />
            
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Settings className="w-4 h-4 text-indigo-400 animate-spin" />
              <h3 className="font-display font-bold text-sm tracking-wide text-white uppercase">
                Configure Active Simulator
              </h3>
            </div>

            {/* 1. Practice vs Exam Mode Toggle Switch */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                1. Mode Selection
              </label>
              <div className="grid grid-cols-2 p-1 bg-black/40 border border-white/5 rounded-2xl">
                <button
                  onClick={() => setMode("practice")}
                  className={`py-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    mode === "practice"
                      ? "bg-indigo-500/15 text-indigo-300 border border-indigo-500/25"
                      : "text-gray-400 hover:text-white"
                  }`}
                  id="setup-practice-btn"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Practice Mode</span>
                </button>
                <button
                  onClick={() => setMode("exam")}
                  className={`py-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    mode === "exam"
                      ? "bg-amber-500/15 text-amber-300 border border-amber-500/25 animate-pulse"
                      : "text-gray-400 hover:text-white"
                  }`}
                  id="setup-exam-btn"
                >
                  <Timer className="w-4 h-4" />
                  <span>Exam Simulation</span>
                </button>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 px-1 leading-relaxed">
                {mode === "practice" 
                  ? "✓ Instant corrections enabled. Solve at your own pace." 
                  : "⚠ Real exam limits apply. Correct answers remain locked until submission."}
              </p>
            </div>

            {/* 2. Custom Shuffle Settings */}
            <div className="flex flex-col gap-3">
              <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                2. Custom Shuffle Controls
              </label>
              <div className="flex flex-col gap-2.5 bg-black/20 p-3.5 rounded-2xl border border-white/5">
                {/* Shuffle Questions Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Shuffle Questions Order</span>
                    <span className="text-[10px] text-gray-400">Randomize the order of items</span>
                  </div>
                  <button
                    onClick={() => setShuffleQuestions(!shuffleQuestions)}
                    className={`w-12 h-6.5 rounded-full p-1 transition-colors relative cursor-pointer ${
                      shuffleQuestions ? "bg-indigo-500" : "bg-white/10"
                    }`}
                    id="toggle-shuffle-questions"
                  >
                    <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-md transition-transform transform ${
                      shuffleQuestions ? "translate-x-5.5" : "translate-x-0"
                    }`} />
                  </button>
                </div>

                <div className="h-[1px] bg-white/5" />

                {/* Shuffle Options Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">Shuffle MCQ Options</span>
                    <span className="text-[10px] text-gray-400">Scramble choices A, B, C, D</span>
                  </div>
                  <button
                    onClick={() => setShuffleOptions(!shuffleOptions)}
                    className={`w-12 h-6.5 rounded-full p-1 transition-colors relative cursor-pointer ${
                      shuffleOptions ? "bg-indigo-500" : "bg-white/10"
                    }`}
                    id="toggle-shuffle-options"
                  >
                    <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-md transition-transform transform ${
                      shuffleOptions ? "translate-x-5.5" : "translate-x-0"
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Question Count Pool */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                3. MCQ Pool size ({totalQuestions} Available)
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {([25, 50, 100, "all"] as const).map((size) => {
                  const isActive = poolSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setPoolSize(size)}
                      className={`py-2 text-xs font-bold font-mono rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/35 scale-105"
                          : "bg-black/20 text-gray-400 border-white/5 hover:bg-white/[0.04]"
                      }`}
                      id={`pool-size-btn-${size}`}
                    >
                      {size === "all" ? "ALL" : size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Timer Preset Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                4. Timer Setup
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {(["auto", 15, 30, 45, 60] as const).map((t) => {
                  const isActive = timeLimit === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setTimeLimit(t)}
                      className={`py-2 text-[10px] font-semibold rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/35 scale-102"
                          : "bg-black/20 text-gray-400 border-white/5 hover:bg-white/[0.04]"
                      }`}
                      id={`timer-preset-btn-${t}`}
                    >
                      {t === "auto" ? "Auto" : `${t}m`}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-500 px-1 mt-0.5">
                Auto provides 45s per MCQ: <strong className="text-gray-300 font-mono">{estimatedTimeMins} min Limit</strong> ({activePoolCount} questions).
              </p>
            </div>

            {/* Huge Glowing Launch Button */}
            <button
              onClick={handleLaunch}
              className="mt-2 py-4 px-6 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:from-indigo-400 hover:to-indigo-600 text-white font-bold rounded-2xl text-sm uppercase tracking-wider transition-all duration-300 shadow-xl hover:shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              id="launch-simulator-btn"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Customized Simulator</span>
            </button>

          </div>
        </div>

      </div>

    </div>
  );
}
