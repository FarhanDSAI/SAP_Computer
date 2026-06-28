import React, { useState, useRef } from "react";
import { Upload, FileJson, Check, AlertCircle, RefreshCw, X } from "lucide-react";
import { MCQQuestion } from "../types";

interface ImporterProps {
  onImportSuccess: (questions: MCQQuestion[], title: string) => void;
  onClose?: () => void;
}

export default function Importer({ onImportSuccess, onClose }: ImporterProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndProcessJSON = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      let questionsToLoad: MCQQuestion[] = [];
      let bankTitle = "Imported MCQ Bank";

      // Case 1: Directly an array of questions
      if (Array.isArray(parsed)) {
        questionsToLoad = parsed;
      } 
      // Case 2: Object containing "questions" array (like the NED entry test format)
      else if (parsed && typeof parsed === "object") {
        if (parsed.title) {
          bankTitle = parsed.title;
        }
        if (Array.isArray(parsed.questions)) {
          questionsToLoad = parsed.questions;
        } else {
          throw new Error("Missing 'questions' array in JSON root object.");
        }
      } else {
        throw new Error("Invalid JSON structure. Must be an array of questions or an object containing a 'questions' array.");
      }

      // Validate questions schema
      if (questionsToLoad.length === 0) {
        throw new Error("The questions list is empty.");
      }

      const validatedQuestions: MCQQuestion[] = questionsToLoad.map((q: any, index: number) => {
        if (!q.question || typeof q.question !== "string") {
          throw new Error(`Question at index ${index} is missing the 'question' text.`);
        }
        if (!q.options || typeof q.options !== "object") {
          throw new Error(`Question ${q.id || index + 1} is missing the 'options' object.`);
        }
        const opts = q.options;
        if (!opts.A || !opts.B || !opts.C || !opts.D) {
          throw new Error(`Question ${q.id || index + 1} options must contain A, B, C, and D answers.`);
        }
        
        // Normalize or validate correct_answer
        let correct = q.correct_answer || q.correctAnswer;
        if (!correct || typeof correct !== "string") {
          throw new Error(`Question ${q.id || index + 1} is missing the 'correct_answer'.`);
        }
        correct = correct.trim().toUpperCase();
        if (correct !== "A" && correct !== "B" && correct !== "C" && correct !== "D") {
          throw new Error(`Question ${q.id || index + 1} correct_answer '${correct}' must be A, B, C, or D.`);
        }

        return {
          id: Number(q.id) || index + 1,
          question: q.question,
          options: {
            A: String(opts.A),
            B: String(opts.B),
            C: String(opts.C),
            D: String(opts.D)
          },
          correct_answer: correct as "A" | "B" | "C" | "D"
        };
      });

      // Clear previous errors and set success
      setError(null);
      setSuccessMsg(`Successfully validated ${validatedQuestions.length} questions from "${bankTitle}"!`);
      setTimeout(() => {
        onImportSuccess(validatedQuestions, bankTitle);
        if (onClose) onClose();
      }, 1500);

    } catch (err: any) {
      setError(err.message || "Failed to parse JSON file. Check format.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith(".json")) {
      setError("Please upload a valid .json file containing questions.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        validateAndProcessJSON(text);
      } else {
        setError("Could not read file data.");
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError("Error reading the file.");
      setLoading(false);
    };
    reader.readAsText(file);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="glass-panel p-6 rounded-2xl max-w-lg w-full mx-auto relative overflow-hidden" id="importer-component">
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          title="Close"
          id="close-importer"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
          <FileJson className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-lg text-white">Import MCQ Bank</h3>
          <p className="text-xs text-gray-400">Load custom questions via JSON file</p>
        </div>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragActive
            ? "border-indigo-400 bg-indigo-500/10"
            : "border-gray-700 hover:border-gray-600 bg-white/[0.01]"
        }`}
        id="import-drag-zone"
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".json"
          onChange={handleChange}
          id="import-file-input"
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-4 bg-gray-800/40 rounded-full text-gray-400 border border-gray-700/30">
            <Upload className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-200">
              Drag & drop your question JSON, or <span className="text-indigo-400 hover:underline">browse file</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">Accepts standard MCQ format files (.json)</p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-indigo-400" id="importer-loading">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Processing questions data...</span>
        </div>
      )}

      {error && (
        <div className="flex gap-2.5 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl mt-4 text-xs text-rose-300" id="importer-error">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Validation Error:</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-2.5 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mt-4 text-xs text-emerald-300 animate-pulse" id="importer-success">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="mt-5 bg-gray-800/20 rounded-xl p-3 border border-gray-700/20 text-[11px] text-gray-400">
        <span className="font-medium text-gray-300 block mb-1">Expected JSON format:</span>
        <pre className="font-mono text-left bg-black/40 p-2 rounded-lg text-gray-300 overflow-x-auto text-[10px] leading-relaxed">
{`{
  "title": "Computer Section Practice",
  "questions": [
    {
      "id": 1,
      "question": "What is the size of one byte in bits?",
      "options": {
        "A": "4 bits", "B": "8 bits", "C": "16 bits", "D": "32 bits"
      },
      "correct_answer": "B"
    }
  ]
}`}
        </pre>
      </div>
    </div>
  );
}
