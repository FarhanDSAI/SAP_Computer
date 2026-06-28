import React, { useState, useMemo } from "react";
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RotateCcw, 
  Home, 
  Search, 
  Bookmark, 
  Activity, 
  ChevronRight, 
  HelpCircle,
  GraduationCap,
  Check,
  X,
  AlertCircle,
  Lightbulb,
  Filter,
  BookOpen
} from "lucide-react";
import { MCQQuestion, TestMode } from "../types";

interface ResultsPageProps {
  questions: MCQQuestion[];
  selectedAnswers: Record<string, "A" | "B" | "C" | "D">;
  correct: number;
  incorrect: number;
  totalTime: number;
  timeLeft: number;
  testMode: TestMode;
  bookmarksCount: number;
  onReview: () => void;
  onRestart: () => void;
  onGoHome: () => void;
}

/**
 * Generates an educational, high-quality Computer Science explanation tip
 * based on question keywords to help students learn and avoid cheating.
 */
function generateExplanationTip(q: MCQQuestion): string {
  const text = q.question.toLowerCase();
  const correctText = q.options[q.correct_answer];
  
  // Custom smart rules matching computer science fundamentals in the NED syllabus
  if (text.includes("terminal") && text.includes("link")) {
    return "An online terminal is connected directly to the CPU, transmitting data immediately. If it were offline, data would be stored locally first for batch-transmission.";
  }
  if (text.includes("decentralized")) {
    return "Decentralized data processing places independent processing power and storage at multiple physical sites, meaning data is not gathered in one centralized repository. This helps improve survivability, flexibility, and localized processing speed.";
  }
  if (text.includes("fed") && text.includes("process data")) {
    return "Computers require both raw 'data' to act upon and specific 'instructions' (the program) telling them how to manipulate that data. Therefore, feeding both data and programs is essential.";
  }
  if (text.includes("alu") || text.includes("arithmetic logic")) {
    return "The Arithmetic Logic Unit (ALU) is the CPU subsection responsible for calculations (addition, subtraction, multiplication, etc.) and comparative logical tests (greater than, equal to, etc.).";
  }
  if (text.includes("compiler")) {
    return "A Compiler processes high-level programming instructions to create an entire translated machine-language file (.exe/binary) at once, rather than translating and running line-by-line (which is what an interpreter does).";
  }
  if (text.includes("interpreter")) {
    return "An Interpreter translates and executes high-level source code instructions sequentially, line-by-line, providing fast debugging feed but slower execution compared to compilers.";
  }
  if (text.includes("rom") || text.includes("read only memory")) {
    return "Read-Only Memory (ROM) is non-volatile primary memory that houses the critical bootup software (BIOS) required to wake the system and locate the storage drive.";
  }
  if (text.includes("ram") || text.includes("random access memory")) {
    return "Random Access Memory (RAM) is high-speed volatile storage. It serves as the primary workspace for active execution, holding instruction streams and operational data directly for the CPU.";
  }
  if (text.includes("register")) {
    return "Registers are extremely compact, high-speed memory cells built directly inside the microchip's silicon core to stage inputs, hold operations, and point to immediate code addresses.";
  }
  if (text.includes("operating system") || text.includes("os")) {
    return "The Operating System controls system hardware, disk resources, memory pools, and CPU execution scheduling, serving as a unified platform for application software to run securely.";
  }
  if (text.includes("binary") || text.includes("two states")) {
    return "Binary architecture relies on two electrical voltage levels: high (represented by 1) and low (represented by 0). This drastically reduces electrical noise interference compared to multi-voltage analogue architectures.";
  }
  if (text.includes("cpu") || text.includes("central processing")) {
    return "The Central Processing Unit (CPU) is the main logic brain of the computer system, hosting the control registers, clock, Arithmetic Logic Unit (ALU), and the Control Unit (CU).";
  }
  if (text.includes("database") || text.includes("dbms")) {
    return "A Database Management System (DBMS) organizes data records into relational tables, files, or objects, offering systematic indexing, queries, recovery, and security controls.";
  }
  if (text.includes("modem")) {
    return "A MODEM (Modulator-Demodulator) translates digital binary pulses from a computer into analog high-frequency waveforms for transit across analog lines, and vice versa.";
  }
  if (text.includes("primary storage") || text.includes("main memory")) {
    return "Primary storage (RAM/ROM) is directly accessible by the processor's address lines, allowing lightning-fast read/write times compared to slower secondary media like hard drives or magnetic tape.";
  }
  if (text.includes("secondary storage") || text.includes("magnetic disk")) {
    return "Secondary storage is non-volatile and retains vast chunks of application and user files. It is not directly accessed by the CPU's memory bus; data must be loaded into RAM first.";
  }
  if (text.includes("cache")) {
    return "Cache memory is static RAM (SRAM) sitting between the main dynamic RAM (DRAM) and the CPU registers. It stores predicted upcoming instructions to prevent CPU wait-states.";
  }
  if (text.includes("software")) {
    return "Software comprises the logical command sequences, source code scripts, and instructions that direct physical hardware modules to perform useful computations.";
  }
  if (text.includes("hardware")) {
    return "Hardware refers to the physical electronic circuits, silicon substrates, magnetic drives, metal casings, and peripheral components that make up a computer system.";
  }
  if (text.includes("lan") || text.includes("local area")) {
    return "A Local Area Network (LAN) connects computers and peripheral units across a restricted, localized physical perimeter (like a school building, office suite, or home).";
  }
  if (text.includes("wan") || text.includes("wide area")) {
    return "A Wide Area Network (WAN) spans immense geographic territories—often linking multiple LAN branches across countries or continents—using telecommunication systems.";
  }
  if (text.includes("bus")) {
    return "A system bus is a set of parallel physical conductor lines (address bus, data bus, control bus) that route digital state bytes between CPU cores, RAM modules, and I/O chips.";
  }
  if (text.includes("assembler")) {
    return "An Assembler translates mnemonic-driven low-level assembly language files directly into machine-executable binary opcodes.";
  }
  if (text.includes("time sharing") || text.includes("timesharing")) {
    return "Time-sharing allocates small slices of CPU execution time (quanta) among multiple logged-on users, giving the illusion of dedicated attention to all connected terminals.";
  }
  if (text.includes("ascii")) {
    return "ASCII (American Standard Code for Information Interchange) is a 7-bit character encoding system representing 128 characters, including numerals, English letters, and controls.";
  }
  if (text.includes("unicode")) {
    return "Unicode is a universal character encoding standard that can represent text from virtually all of the world's writing systems, supporting thousands of characters.";
  }
  if (text.includes("bit")) {
    return "A bit (Binary Digit) is the fundamental unit of information in computing, holding a value of either 0 or 1.";
  }
  if (text.includes("byte")) {
    return "A byte is a standard group of 8 bits, capable of representing 256 unique digital values (such as an integer from 0 to 255, or a single keyboard character).";
  }
  if (text.includes("kb") || text.includes("kilobyte")) {
    return "A Kilobyte (KB) represents exactly 1,024 bytes of data, adhering to binary address increments (2 to the power of 10).";
  }
  if (text.includes("mb") || text.includes("megabyte")) {
    return "A Megabyte (MB) represents exactly 1,024 Kilobytes or 1,048,576 bytes of digital data.";
  }
  if (text.includes("gb") || text.includes("gigabyte")) {
    return "A Gigabyte (GB) represents exactly 1,024 Megabytes or roughly 1.07 billion bytes of digital data storage.";
  }
  
  // Custom default explanation block
  return `Concept verification: Option ${q.correct_answer} is correct because "${correctText}" is the textbook solution corresponding to the standard Computer Science test specifications. Read standard technical syllabi to reinforce this concept.`;
}

export default function ResultsPage({
  questions,
  selectedAnswers,
  correct,
  incorrect,
  totalTime,
  timeLeft,
  testMode,
  bookmarksCount,
  onReview,
  onRestart,
  onGoHome
}: ResultsPageProps) {
  const totalQuestions = questions.length;
  const attemptedCount = Object.keys(selectedAnswers).length;
  const unansweredCount = totalQuestions - attemptedCount;
  
  // Calculate statistics
  const scorePercent = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
  const accuracyPercent = attemptedCount > 0 ? Math.round((correct / attemptedCount) * 100) : 0;
  const timeSpentSeconds = totalTime - timeLeft;
  
  // Interactive filters state
  const [filterType, setFilterType] = useState<"all" | "correct" | "incorrect" | "skipped">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Format time spent
  const formatTimeSpent = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    if (mins === 0) return `${remainingSecs}s`;
    return `${mins}m ${remainingSecs}s`;
  };

  // Average time per answered question
  const avgTimePerQuestion = attemptedCount > 0 ? Math.round(timeSpentSeconds / attemptedCount) : 0;

  // Grade and motivational message
  const getAssessment = () => {
    if (scorePercent >= 90) {
      return {
        grade: "A+",
        title: "Outstanding Performance!",
        description: "Incredible score! You have masterfully completed this prep set. Your level matches or exceeds the top candidates at NED University.",
        colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        ringColor: "#10b981"
      };
    } else if (scorePercent >= 80) {
      return {
        grade: "A",
        title: "Excellent Competence!",
        description: "Superb attempt! Your understanding of computer science concepts is highly solid. Keep brushing up on any tricky questions.",
        colorClass: "text-teal-400 bg-teal-500/10 border-teal-500/20",
        ringColor: "#14b8a6"
      };
    } else if (scorePercent >= 70) {
      return {
        grade: "B",
        title: "Great Progression!",
        description: "You've successfully cleared the core benchmarks. Review your mistakes to lock in a flawless score on your official test.",
        colorClass: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
        ringColor: "#6366f1"
      };
    } else if (scorePercent >= 50) {
      return {
        grade: "C",
        title: "Cleared Benchmarks",
        description: "A passing attempt. To ensure standard acceptance, we recommend doing another practice run with shuffled options enabled.",
        colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        ringColor: "#f59e0b"
      };
    } else {
      return {
        grade: "F",
        title: "Needs More Study",
        description: "Don't be discouraged! Engineering entry prep is rigorous. Re-study the questions in Practice Mode where you can see live hints.",
        colorClass: "text-rose-400 bg-rose-500/10 border-rose-500/20",
        ringColor: "#f43f5e"
      };
    }
  };

  const assessment = getAssessment();

  // Filter and search computation
  const filteredQuestions = useMemo(() => {
    return questions.filter((q, index) => {
      const userAnswer = selectedAnswers[q.id];
      const isCorrect = userAnswer === q.correct_answer;
      
      // Filter type matching
      if (filterType === "correct" && !isCorrect) return false;
      if (filterType === "incorrect" && (!userAnswer || isCorrect)) return false;
      if (filterType === "skipped" && userAnswer) return false;

      // Search matching
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQuestion = q.question.toLowerCase().includes(query);
        const matchesOptions = Object.values(q.options).some(o => o.toLowerCase().includes(query));
        if (!matchesQuestion && !matchesOptions) return false;
      }

      return true;
    });
  }, [questions, selectedAnswers, filterType, searchQuery]);

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto py-6 animate-fade-in" id="results-dashboard">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
            <Award className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">
              Test Scorecard & Report
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Completed in <span className="text-indigo-300 font-semibold font-mono uppercase">{testMode}</span> mode
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onGoHome}
            className="glass-button text-xs font-semibold py-2 px-4 rounded-xl flex items-center gap-2 text-white hover:bg-white/10 cursor-pointer"
            id="results-back-to-home-header"
          >
            <Home className="w-4 h-4 text-indigo-400" />
            <span>Go to Home</span>
          </button>
        </div>
      </div>

      {/* Main Scorecard Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Grade Circle (5 cols) */}
        <div className="md:col-span-5 glass-panel p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-center gap-5 text-center relative overflow-hidden" id="results-circle-panel">
          <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-indigo-500/5 rounded-full blur-[40px] pointer-events-none" />
          
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Overall Score Percentage
          </span>

          {/* Glowing Radial Progress */}
          <div className="relative w-44 h-44 flex items-center justify-center" id="results-progress-circle-container">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="74"
                stroke="rgba(255, 255, 255, 0.03)"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="88"
                cy="88"
                r="74"
                stroke={assessment.ringColor}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 74}
                strokeDashoffset={2 * Math.PI * 74 * (1 - scorePercent / 100)}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold font-display text-white tracking-tight">{scorePercent}%</span>
              <span className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider font-semibold">Score</span>
            </div>
          </div>

          <div className={`px-4 py-1.5 rounded-full border text-xs font-bold font-mono tracking-wide ${assessment.colorClass}`} id="results-grade-badge">
            Grade: {assessment.grade}
          </div>
        </div>

        {/* Right Column: Dynamic assessment box & core breakdown (7 cols) */}
        <div className="md:col-span-7 flex flex-col gap-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col gap-3 relative overflow-hidden" id="results-assessment-card">
            <div className="absolute top-0 right-0 p-3 text-indigo-500/10">
              <GraduationCap className="w-24 h-24" />
            </div>
            
            <h3 className="text-lg font-display font-bold text-white tracking-tight">
              {assessment.title}
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed relative z-10">
              {assessment.description}
            </p>
          </div>

          {/* Quick Metrics grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-400" />
                Time Spent
              </span>
              <span className="text-base font-bold text-white font-mono">{formatTimeSpent(timeSpentSeconds)}</span>
              <span className="text-[9px] text-gray-500">of {formatTimeSpent(totalTime)} total</span>
            </div>

            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                <Activity className="w-3 h-3 text-emerald-400" />
                Accuracy Rate
              </span>
              <span className="text-base font-bold text-white font-mono">{accuracyPercent}%</span>
              <span className="text-[9px] text-gray-500">on attempted questions</span>
            </div>
          </div>
        </div>

      </div>

      {/* Breakdown Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="results-stats-row">
        
        <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Correct</span>
          </div>
          <span className="text-2xl font-bold text-white font-mono">{correct}</span>
          <span className="text-[10px] text-gray-500">points rewarded</span>
        </div>

        <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-2xl flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-rose-400">
            <XCircle className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Incorrect</span>
          </div>
          <span className="text-2xl font-bold text-white font-mono">{incorrect}</span>
          <span className="text-[10px] text-gray-500">wrong selections</span>
        </div>

        <div className="bg-gray-800/15 border border-white/5 p-4 rounded-2xl flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-gray-400">
            <HelpCircle className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Skipped</span>
          </div>
          <span className="text-2xl font-bold text-white font-mono">{unansweredCount}</span>
          <span className="text-[10px] text-gray-500">not answered</span>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Bookmark className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Bookmarked</span>
          </div>
          <span className="text-2xl font-bold text-white font-mono">{bookmarksCount}</span>
          <span className="text-[10px] text-gray-500">flagged during test</span>
        </div>

      </div>

      {/* Speed assessment block */}
      <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 flex items-center justify-between gap-4 text-xs text-gray-400 px-6">
        <span className="font-semibold text-gray-500 uppercase tracking-widest text-[9px] font-mono">
          Speed Analytics
        </span>
        <div className="flex items-center gap-6">
          <span>Average Time Spent per Attempted Question: <strong className="text-white font-mono">{avgTimePerQuestion} seconds</strong></span>
        </div>
      </div>

      {/* Stunning Action Center Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4" id="results-action-center">
        
        {/* Action 1: Review */}
        <button
          onClick={onReview}
          className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-indigo-500/30 text-left flex flex-col gap-2 transition-all cursor-pointer group text-white"
          id="btn-results-review"
        >
          <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 w-fit group-hover:scale-110 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-0.5 group-hover:text-indigo-300 transition-colors">
              Review Questions
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Examine each correct answer, reading dynamic text explanation blocks for mistakes.
            </p>
          </div>
        </button>

        {/* Action 2: Restart */}
        <button
          onClick={onRestart}
          className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-indigo-500/30 text-left flex flex-col gap-2 transition-all cursor-pointer group text-white"
          id="btn-results-restart"
        >
          <div className="p-2.5 bg-pink-500/10 rounded-xl text-pink-400 w-fit group-hover:scale-110 transition-transform">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-0.5 group-hover:text-pink-300 transition-colors">
              Retry with Same Settings
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Start a fresh trial using the same custom pool, scrambled orders, and timer bounds.
            </p>
          </div>
        </button>

        {/* Action 3: Go Home */}
        <button
          onClick={onGoHome}
          className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-indigo-500/30 text-left flex flex-col gap-2 transition-all cursor-pointer group text-white"
          id="btn-results-gohome"
        >
          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 w-fit group-hover:scale-110 transition-transform">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-0.5 group-hover:text-emerald-300 transition-colors">
              Return to main dashboard
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Exit back to the settings page to prepare, shuffle, or load another customized JSON quiz bank.
            </p>
          </div>
        </button>

      </div>

      {/* --- REVOLUTIONARY DETAILED REVIEW AND EXPLANATION CENTER --- */}
      <div className="border-t border-white/10 pt-8 mt-4 flex flex-col gap-6" id="results-detailed-review">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Detailed Question Review
          </h2>
          <p className="text-xs text-gray-400">
            Browse through your test results, inspect your wrong responses, and read verified **Explanation Tips** to master the concepts.
          </p>
        </div>

        {/* Filter and Search Bar Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto" id="results-filter-tabs">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                filterType === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              All ({totalQuestions})
            </button>
            <button
              onClick={() => setFilterType("correct")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                filterType === "correct"
                  ? "bg-emerald-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              Correct ({correct})
            </button>
            <button
              onClick={() => setFilterType("incorrect")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                filterType === "incorrect"
                  ? "bg-rose-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              <X className="w-3.5 h-3.5" />
              Incorrect ({incorrect})
            </button>
            <button
              onClick={() => setFilterType("skipped")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                filterType === "skipped"
                  ? "bg-amber-600/80 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Skipped ({unansweredCount})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>
        </div>

        {/* Filter Indicator */}
        <div className="text-xs text-gray-500 flex items-center justify-between px-1">
          <span>
            Showing <strong>{filteredQuestions.length}</strong> of <strong>{totalQuestions}</strong> questions
          </span>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="text-indigo-400 hover:underline cursor-pointer font-medium"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Questions List */}
        <div className="flex flex-col gap-6" id="results-questions-list">
          {filteredQuestions.length === 0 ? (
            <div className="glass-panel p-10 rounded-2xl border border-white/5 text-center flex flex-col items-center justify-center gap-3">
              <HelpCircle className="w-10 h-10 text-gray-500 animate-pulse" />
              <h3 className="text-sm font-semibold text-white">No Matching Questions</h3>
              <p className="text-xs text-gray-400 max-w-sm">
                No questions fit the active filter: "{filterType}" {searchQuery ? `containing "${searchQuery}"` : ""}. Try selecting a different tab.
              </p>
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const originalIndex = questions.findIndex(origQ => origQ.id === q.id);
              const userAnswer = selectedAnswers[q.id];
              const isCorrect = userAnswer === q.correct_answer;
              const isSkipped = !userAnswer;

              let statusBadge = (
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Correct
                </span>
              );

              if (isSkipped) {
                statusBadge = (
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-full flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Skipped
                  </span>
                );
              } else if (!isCorrect) {
                statusBadge = (
                  <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center gap-1">
                    <X className="w-3 h-3" /> Wrong
                  </span>
                );
              }

              return (
                <div 
                  key={q.id} 
                  className={`glass-panel p-6 rounded-2xl border flex flex-col gap-5 relative overflow-hidden transition-all duration-300 ${
                    isCorrect 
                      ? "hover:border-emerald-500/20 border-white/5" 
                      : isSkipped 
                      ? "hover:border-amber-500/20 border-white/5"
                      : "hover:border-rose-500/20 border-rose-500/20"
                  }`}
                  id={`review-question-${q.id}`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-gray-400">
                        Q#{originalIndex !== -1 ? originalIndex + 1 : idx + 1}
                      </span>
                      <span className="text-[10px] text-gray-500">• ID: {q.id}</span>
                    </div>
                    {statusBadge}
                  </div>

                  {/* Question Prompt */}
                  <h3 className="text-base md:text-lg font-medium text-white font-display leading-relaxed">
                    {q.question}
                  </h3>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id={`review-options-grid-${q.id}`}>
                    {(["A", "B", "C", "D"] as const).map((key) => {
                      const optionText = q.options[key];
                      const isCorrectChoice = q.correct_answer === key;
                      const isUserChoice = userAnswer === key;

                      let style = "bg-white/[0.02] border-white/5 text-gray-400";
                      
                      if (isCorrectChoice) {
                        style = "bg-emerald-500/10 border-emerald-500/30 text-emerald-200 font-medium ring-1 ring-emerald-500/10";
                      } else if (isUserChoice) {
                        style = "bg-rose-500/10 border-rose-500/30 text-rose-200 font-medium ring-1 ring-rose-500/10";
                      }

                      return (
                        <div 
                          key={key} 
                          className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs leading-relaxed transition-all ${style}`}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] border flex-shrink-0 ${
                            isCorrectChoice
                              ? "bg-emerald-500 text-white border-transparent"
                              : isUserChoice
                              ? "bg-rose-500 text-white border-transparent"
                              : "bg-white/5 border-white/10 text-gray-400"
                          }`}>
                            {key}
                          </span>
                          <span className="pr-4">{optionText}</span>
                          
                          {/* Icons indicators */}
                          {isCorrectChoice && (
                            <Check className="w-4 h-4 text-emerald-400 ml-auto flex-shrink-0" />
                          )}
                          {!isCorrectChoice && isUserChoice && (
                            <X className="w-4 h-4 text-rose-400 ml-auto flex-shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Dynamic Explanation Tip */}
                  <div className="bg-indigo-950/20 border border-indigo-500/10 rounded-xl p-4 flex gap-3 text-xs text-indigo-300 leading-relaxed mt-1" id={`explanation-tip-container-${q.id}`}>
                    <Lightbulb className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5 animate-pulse" />
                    <div className="flex flex-col gap-1">
                      <strong className="text-indigo-200 uppercase tracking-widest text-[9px] font-mono font-bold">
                        Concept & Explanation Tip:
                      </strong>
                      <p className="text-gray-300">
                        {generateExplanationTip(q)}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
