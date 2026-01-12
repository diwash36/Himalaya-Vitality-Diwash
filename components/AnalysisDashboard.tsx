
import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisDashboardProps {
  analysis: AnalysisResult | null;
  loading: boolean;
  onAnalyze: () => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ analysis, loading, onAnalyze }) => {
  if (loading) {
    return (
      <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-400 font-medium">Gemini is analyzing the codebase...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="p-12 bg-gradient-to-br from-blue-900/20 to-zinc-900 border border-zinc-800 rounded-3xl text-center">
        <h3 className="text-3xl font-bold mb-4 text-white">Unlock Repository Insights</h3>
        <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
          Let our advanced AI analyze the entire project structure and documentation to provide you with a high-level overview, tech stack, and architectural insights.
        </p>
        <button
          onClick={onAnalyze}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all hover:scale-105 shadow-xl shadow-blue-900/40"
        >
          Generate AI Analysis
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-1 md:col-span-2 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <h3 className="text-xl font-bold mb-3 text-white">Project Summary</h3>
        <p className="text-zinc-300 leading-relaxed">{analysis.summary}</p>
      </div>

      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <h3 className="text-lg font-bold mb-3 text-blue-400">Tech Stack</h3>
        <div className="flex flex-wrap gap-2">
          {analysis.techStack.map((tech) => (
            <span key={tech} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full text-sm font-medium border border-zinc-700">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <h3 className="text-lg font-bold mb-3 text-emerald-400">Key Features</h3>
        <ul className="space-y-2">
          {analysis.keyFeatures.map((feat, i) => (
            <li key={i} className="flex gap-2 text-sm text-zinc-300">
              <span className="text-emerald-500">•</span> {feat}
            </li>
          ))}
        </ul>
      </div>

      <div className="col-span-1 md:col-span-2 p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
        <h3 className="text-lg font-bold mb-3 text-purple-400">Architectural Note</h3>
        <p className="text-zinc-300 italic text-sm">"{analysis.architectureSuggestion}"</p>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
