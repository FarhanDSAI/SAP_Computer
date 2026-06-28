import React, { useState, useEffect } from "react";
import { 
  Award, 
  BookOpen, 
  Compass, 
  HelpCircle, 
  RefreshCw, 
  RotateCcw, 
  Upload, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Sparkles, 
  Layers, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  Flame,
  UserCheck,
  Home,
  Grid,
  Menu,
  X
} from "lucide-react";
import { DEFAULT_QUESTIONS } from "./questions";
import { MCQQuestion, TestMode } from "./types";
import { prepareQuestions } from "./utils";
import BackgroundGlow from "./components/BackgroundGlow";
import Importer from "./components/Importer";
import StatsCard from "./components/StatsCard";
import QuestionCard from "./components/QuestionCard";
import Sidebar from "./components/Sidebar";
import TimerPanel from "./components/TimerPanel";
import HomeDashboard from "./components/HomeDashboard";
import ResultsPage from "./components/ResultsPage";

export default function App() {
  // --- STATE ---
  const [view, setView] = useState<"home" | "test" | "results">("home");
  const [baseQuestions, setBaseQuestions] = useState<MCQQuestion[]>(DEFAULT_QUESTIONS);
  const [questions, setQuestions] = useState<MCQQuestion[]>(DEFAULT_QUESTIONS);
  const [bankTitle, setBankTitle] = useState("NED Entry Test Computer Bank");
  const [testMode, setTestMode] = useState<TestMode>("practice");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: number]: "A" | "B" | "C" | "D" }>({});
  const [revealedQuestions, setRevealedQuestions] = useState<{ [questionId: number]: boolean }>({});
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showImporter, setShowImporter] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Custom Glass Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    alternativeText?: string;
    onConfirm: () => void;
    onAlternative?: () => void;
  } | null>(null);

  // Active configuration state to remember setups on resetting
  const [activeConfig, setActiveConfig] = useState<{
    mode: TestMode;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    poolSize: "all" | number;
    timeLimitMinutes: number | "auto";
  } | null>(null);

  // Timer states
  const [totalTime, setTotalTime] = useState(15 * 60); // default 15 minutes
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Live calculation variables
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const attemptedCount = Object.keys(selectedAnswers).length;
  
  // Calculate score & statistics based on mode
  const getResults = () => {
    let correct = 0;
    let incorrect = 0;

    Object.entries(selectedAnswers).forEach(([idStr, ans]) => {
      const qId = Number(idStr);
      const question = questions.find((q) => q.id === qId);
      if (question) {
        if (question.correct_answer === ans) {
          correct++;
        } else {
          incorrect++;
        }
      }
    });

    return { correct, incorrect };
  };

  const { correct, incorrect } = getResults();

  // --- TIMER EFFECT ---
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerRunning && !isCompleted) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer finished
            setIsCompleted(true);
            setIsTimerRunning(false);
            setView("results");
            if (interval) clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isCompleted]);

  // --- HANDLERS ---
  const handleSelectOption = (option: "A" | "B" | "C" | "D") => {
    if (isCompleted) return;

    // Save selected answer
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option
    }));

    // In practice mode, lock and reveal correctness immediately
    if (testMode === "practice") {
      setRevealedQuestions((prev) => ({
        ...prev,
        [currentQuestion.id]: true
      }));
    }
  };

  const handleToggleBookmark = () => {
    setBookmarks((prev) =>
      prev.includes(currentQuestion.id)
        ? prev.filter((id) => id !== currentQuestion.id)
        : [...prev, currentQuestion.id]
    );
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleToggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleUpdateTimeLimit = (seconds: number) => {
    setTotalTime(seconds);
    setTimeLeft(seconds);
    setIsTimerRunning(false);
  };

  const handleResetTest = () => {
    setConfirmModal({
      title: "Reset Exam Progress?",
      message: "Are you sure you want to reset your test? This will erase all selected answers, re-shuffle questions (if enabled), and restart the timer.",
      confirmText: "Yes, Reset",
      cancelText: "Keep Progress",
      onConfirm: () => {
        setSelectedAnswers({});
        setRevealedQuestions({});
        setCurrentQuestionIndex(0);
        setIsCompleted(false);

        if (activeConfig) {
          const prepared = prepareQuestions(baseQuestions, {
            shuffleQuestions: activeConfig.shuffleQuestions,
            shuffleOptions: activeConfig.shuffleOptions,
            poolSize: activeConfig.poolSize
          });
          setQuestions(prepared);
          
          const seconds = activeConfig.timeLimitMinutes === "auto"
            ? prepared.length * 45
            : activeConfig.timeLimitMinutes * 60;
            
          setTotalTime(seconds);
          setTimeLeft(seconds);
          setIsTimerRunning(activeConfig.mode === "exam");
        } else {
          setTimeLeft(totalTime);
          setIsTimerRunning(testMode === "exam");
        }
        setConfirmModal(null);
      }
    });
  };

  const handleSwitchMode = (newMode: TestMode) => {
    setTestMode(newMode);
    setSelectedAnswers({});
    setRevealedQuestions({});
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
    setTimeLeft(totalTime);
    setIsTimerRunning(false);

    if (activeConfig) {
      setActiveConfig({ ...activeConfig, mode: newMode });
    }
  };

  const handleStartTest = (settings: {
    mode: TestMode;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
    poolSize: "all" | number;
    timeLimitMinutes: number | "auto";
  }) => {
    setActiveConfig(settings);
    setTestMode(settings.mode);
    setSelectedAnswers({});
    setRevealedQuestions({});
    setCurrentQuestionIndex(0);
    setIsCompleted(false);

    // Prepare customized questions pool
    const prepared = prepareQuestions(baseQuestions, {
      shuffleQuestions: settings.shuffleQuestions,
      shuffleOptions: settings.shuffleOptions,
      poolSize: settings.poolSize
    });
    setQuestions(prepared);

    // Compute seconds
    const totalTimeSeconds = typeof settings.timeLimitMinutes === "number"
      ? settings.timeLimitMinutes * 60
      : prepared.length * 45;

    setTotalTime(totalTimeSeconds);
    setTimeLeft(totalTimeSeconds);
    setIsTimerRunning(settings.mode === "exam");
    setView("test");
  };

  const handleImportSuccess = (importedQuestions: MCQQuestion[], title: string) => {
    setBaseQuestions(importedQuestions);
    setQuestions(importedQuestions);
    setBankTitle(title);
    setSelectedAnswers({});
    setRevealedQuestions({});
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
    const optimalTime = Math.min(60 * 60, Math.max(5 * 60, importedQuestions.length * 45));
    setTotalTime(optimalTime);
    setTimeLeft(optimalTime);
    setIsTimerRunning(false);
    setActiveConfig(null);
  };

  const handleSubmitExam = () => {
    const unanswered = totalQuestions - attemptedCount;
    setConfirmModal({
      title: unanswered > 0 ? "Submit with Unanswered Questions?" : "End Exam & Submit?",
      message: unanswered > 0
        ? `You have only answered ${attemptedCount} out of ${totalQuestions} questions. There are ${unanswered} unanswered questions left. Are you sure you want to end and submit the exam?`
        : "Are you sure you are ready to submit your exam and view your final scorecard?",
      confirmText: "Yes, Submit Exam",
      cancelText: "Keep Answering",
      onConfirm: () => {
        setIsCompleted(true);
        setIsTimerRunning(false);
        setConfirmModal(null);
        setView("results");
      }
    });
  };

  return (
    <div className={`relative min-h-screen px-4 sm:px-6 lg:px-8 pt-8 max-w-7xl mx-auto flex flex-col gap-6 select-none ${view === "test" ? "pb-28 md:pb-16" : "pb-16"}`} id="app-root">
      {/* Background radial overlays & glowing colors */}
      <BackgroundGlow />

      {view === "home" ? (
        <HomeDashboard
          bankTitle={bankTitle}
          totalQuestions={totalQuestions}
          onStartTest={handleStartTest}
          onOpenImporter={() => setShowImporter(true)}
        />
      ) : view === "results" ? (
        <ResultsPage
          questions={questions}
          selectedAnswers={selectedAnswers}
          correct={correct}
          incorrect={incorrect}
          totalTime={totalTime}
          timeLeft={timeLeft}
          testMode={testMode}
          bookmarksCount={bookmarks.length}
          onReview={() => {
            setView("test");
          }}
          onRestart={() => {
            if (activeConfig) {
              handleStartTest(activeConfig);
            } else {
              handleStartTest({
                mode: testMode,
                shuffleQuestions: true,
                shuffleOptions: true,
                poolSize: "all",
                timeLimitMinutes: "auto"
              });
            }
          }}
          onGoHome={() => {
            setView("home");
            setSelectedAnswers({});
            setRevealedQuestions({});
            setCurrentQuestionIndex(0);
            setIsCompleted(false);
          }}
        />
      ) : (
        <>
          {/* --- APPLICATION HEADER --- */}
          <header className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-5 relative overflow-hidden" id="app-header">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (!isCompleted) {
                    setConfirmModal({
                      title: "Exit Active Session?",
                      message: "Your test is in progress. Would you like to end the session and view your Scorecard, completely exit to the main menu (progress will be lost), or stay and complete?",
                      confirmText: "End & View Scorecard",
                      cancelText: "Stay & Complete",
                      alternativeText: "Exit & Discard",
                      onConfirm: () => {
                        setIsCompleted(true);
                        setIsTimerRunning(false);
                        setView("results");
                        setConfirmModal(null);
                      },
                      onAlternative: () => {
                        setIsTimerRunning(false);
                        setSelectedAnswers({});
                        setRevealedQuestions({});
                        setCurrentQuestionIndex(0);
                        setIsCompleted(false);
                        setView("home");
                        setConfirmModal(null);
                      }
                    });
                  } else {
                    setIsTimerRunning(false);
                    setView("home");
                  }
                }}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-gray-300 hover:text-white transition-all flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer"
                title="Go to Home Dashboard"
                id="back-to-home-btn"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>
              
              <div className="h-8 w-[1px] bg-white/10 hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display font-bold text-lg tracking-tight text-white leading-none">
                      Computer MCQ Bank
                    </h1>
                    <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                      NED Entry Practice
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 max-w-xl font-medium">
                    Loaded: <span className="text-white font-semibold">{bankTitle}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Header Controls - Hidden on mobile during active test for pristine space and focus */}
            <div className="hidden md:flex flex-wrap items-center gap-3">
              {/* Mode Selector Switcher */}
              <div className="bg-black/40 border border-white/5 rounded-xl p-1 flex items-center">
                <button
                  onClick={() => handleSwitchMode("practice")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    testMode === "practice"
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/25"
                      : "text-gray-400 hover:text-white"
                  }`}
                  id="switch-practice-mode"
                >
                  Practice Mode
                </button>
                <button
                  onClick={() => handleSwitchMode("exam")}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    testMode === "exam"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/25"
                      : "text-gray-400 hover:text-white"
                  }`}
                  id="switch-exam-mode"
                >
                  Exam Mode
                </button>
              </div>

              {/* Import JSON Trigger */}
              <button
                onClick={() => setShowImporter(true)}
                className="glass-button text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 text-white hover:border-indigo-500/30 cursor-pointer"
                id="open-importer-btn"
              >
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>Upload JSON Bank</span>
              </button>
            </div>
          </header>

          {/* --- CORE CONTENT LAYOUT GRID --- */}
          <main className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="app-main">
            
            {/* Left Column (8 cols): Question Card and navigation */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              
              {/* Practice/Exam description warning banner */}
              {testMode === "exam" && !isCompleted && (
                <div className="glass-card bg-amber-500/5 border-amber-500/10 p-4 rounded-xl text-xs text-amber-300 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500 animate-pulse" />
                  <div>
                    <span className="font-semibold block text-amber-200">Exam Mode Active</span>
                    <span>Correctness is hidden until you submit the test or the timer runs out. Ensure you monitor the countdown timer!</span>
                  </div>
                </div>
              )}

              {/* Core Question Render */}
              {currentQuestion ? (
                <QuestionCard
                  question={currentQuestion}
                  index={currentQuestionIndex}
                  totalQuestions={totalQuestions}
                  selectedAnswer={selectedAnswers[currentQuestion.id]}
                  isRevealed={!!revealedQuestions[currentQuestion.id]}
                  onSelectOption={handleSelectOption}
                  isBookmarked={bookmarks.includes(currentQuestion.id)}
                  onToggleBookmark={handleToggleBookmark}
                  testMode={testMode}
                  isCompleted={isCompleted}
                />
              ) : (
                <div className="glass-panel p-12 text-center rounded-2xl flex flex-col items-center justify-center">
                  <HelpCircle className="w-12 h-12 text-gray-500 mb-3" />
                  <p className="text-gray-300 font-medium">No questions loaded in database</p>
                </div>
              )}

              {/* Navigational buttons and Complete test trigger */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.01] p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="glass-button py-2.5 px-4 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    id="prev-question-btn"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={currentQuestionIndex === totalQuestions - 1}
                    className="glass-button py-2.5 px-4 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    id="next-question-btn"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Submit & View Scorecard Button */}
                {!isCompleted && (
                  <button
                    onClick={handleSubmitExam}
                    className="w-full sm:w-auto bg-amber-500/20 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-amber-500/5 animate-pulse cursor-pointer"
                    id="submit-exam-btn"
                  >
                    Submit & View Results
                  </button>
                )}

                {/* View Results Button once finished */}
                {isCompleted && (
                  <button
                    onClick={() => setView("results")}
                    className="w-full sm:w-auto bg-indigo-500/20 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                    id="view-results-completed-btn"
                  >
                    View Scorecard Report
                  </button>
                )}
              </div>
            </div>

            {/* Right Column (4 cols): Timer, Stats & Navigator Panel (hidden on mobile, accessed via bottom drawer) */}
            <div className="hidden lg:flex lg:col-span-4 flex-col gap-6">
              
              {/* Countdown Clock / Controls */}
              <TimerPanel
                timeLeft={timeLeft}
                totalTime={totalTime}
                isTimerRunning={isTimerRunning}
                onToggleTimer={handleToggleTimer}
                onResetTest={handleResetTest}
                onUpdateTimeLimit={handleUpdateTimeLimit}
                isCompleted={isCompleted}
              />

              {/* Test scoreboard */}
              <StatsCard
                score={correct}
                totalQuestions={totalQuestions}
                attempted={attemptedCount}
                correct={correct}
                incorrect={incorrect}
                bookmarksCount={bookmarks.length}
                timeLeft={timeLeft}
                totalTime={totalTime}
                isCompleted={isCompleted}
                testMode={testMode}
              />

              {/* Grid visual navigator */}
              <Sidebar
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                onSelectQuestion={setCurrentQuestionIndex}
                selectedAnswers={selectedAnswers}
                revealedQuestions={revealedQuestions}
                bookmarks={bookmarks}
                testMode={testMode}
                isCompleted={isCompleted}
              />
            </div>
          </main>

          {/* Mobile Bottom Fixed Bar for easy navigation (only visible on mobile lg:hidden) */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-t border-white/10 px-4 py-3 flex items-center justify-between shadow-2xl">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Question Progress</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white font-mono">
                  {currentQuestionIndex + 1} / {totalQuestions}
                </span>
                <span className="text-[10px] text-indigo-400 font-semibold bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/10">
                  {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
                </span>
              </div>
            </div>

            {/* Time countdown showing dynamic timer state */}
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
              <span className={`w-1.5 h-1.5 rounded-full ${isTimerRunning ? 'bg-amber-400 animate-ping' : 'bg-gray-400'}`} />
              <span className="text-xs font-bold font-mono text-gray-200">
                {Math.floor(timeLeft / 60).toString().padStart(2, "0")}:{Math.floor(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            </div>

            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              id="mobile-trigger-navigator-btn"
            >
              <Grid className="w-4 h-4 text-indigo-400" />
              <span>Navigator</span>
            </button>
          </div>

          {/* Mobile Slide-Up Navigator Drawer Overlay */}
          {isMobileDrawerOpen && (
            <div className="fixed inset-0 z-50 lg:hidden" id="mobile-navigator-drawer">
              {/* Overlay Backdrop */}
              <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
                onClick={() => setIsMobileDrawerOpen(false)}
              />
              
              {/* Drawer Content */}
              <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-[#0c0f1d] border-t border-white/10 rounded-t-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-slide-up">
                {/* Drag handle/Indicator */}
                <div className="flex justify-center py-3">
                  <div className="w-12 h-1 bg-white/20 rounded-full" />
                </div>

                {/* Header with Close */}
                <div className="px-5 pb-3 flex items-center justify-between border-b border-white/5">
                  <div>
                    <h3 className="text-base font-display font-bold text-white">Navigator & Status</h3>
                    <p className="text-[11px] text-gray-400">Jump directly to any question</p>
                  </div>
                  <button
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Content inside Drawer */}
                <div className="flex-1 overflow-y-auto p-5 pb-10 flex flex-col gap-6">
                  <div>
                    <TimerPanel
                      timeLeft={timeLeft}
                      totalTime={totalTime}
                      isTimerRunning={isTimerRunning}
                      onToggleTimer={handleToggleTimer}
                      onResetTest={handleResetTest}
                      onUpdateTimeLimit={handleUpdateTimeLimit}
                      isCompleted={isCompleted}
                    />
                  </div>

                  <div>
                    <StatsCard
                      score={correct}
                      totalQuestions={totalQuestions}
                      attempted={attemptedCount}
                      correct={correct}
                      incorrect={incorrect}
                      bookmarksCount={bookmarks.length}
                      timeLeft={timeLeft}
                      totalTime={totalTime}
                      isCompleted={isCompleted}
                      testMode={testMode}
                    />
                  </div>

                  <Sidebar
                    questions={questions}
                    currentQuestionIndex={currentQuestionIndex}
                    onSelectQuestion={(idx) => {
                      setCurrentQuestionIndex(idx);
                      setIsMobileDrawerOpen(false);
                    }}
                    selectedAnswers={selectedAnswers}
                    revealedQuestions={revealedQuestions}
                    bookmarks={bookmarks}
                    testMode={testMode}
                    isCompleted={isCompleted}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* --- OVERLAY BLURRED MODAL: JSON IMPORTER --- */}
      {showImporter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" id="importer-modal">
          <div className="w-full max-w-lg transition-transform duration-300 scale-100">
            <Importer
              onImportSuccess={handleImportSuccess}
              onClose={() => setShowImporter(false)}
            />
          </div>
        </div>
      )}

      {/* --- CUSTOM GLASS CONFIRMATION DIALOG --- */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" id="confirm-modal-overlay">
          <div className="w-full max-w-md bg-white/[0.04] border border-white/10 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl flex flex-col gap-5 relative overflow-hidden" id="confirm-modal">
            <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-indigo-500/10 rounded-full blur-[40px] pointer-events-none" />
            
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-display font-bold text-white tracking-tight" id="confirm-modal-title">
                {confirmModal.title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed" id="confirm-modal-message">
                {confirmModal.message}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 w-full">
              {confirmModal.alternativeText && confirmModal.onAlternative ? (
                <button
                  onClick={confirmModal.onAlternative}
                  className="px-4 py-2 text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/30 rounded-xl transition-all cursor-pointer text-center"
                  id="confirm-modal-alternative"
                >
                  {confirmModal.alternativeText}
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all cursor-pointer"
                  id="confirm-modal-cancel"
                >
                  {confirmModal.cancelText || "Cancel"}
                </button>
                <button
                  onClick={confirmModal.onConfirm}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl border border-indigo-500/20 shadow-md hover:shadow-indigo-500/10 transition-all cursor-pointer"
                  id="confirm-modal-submit"
                >
                  {confirmModal.confirmText || "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
