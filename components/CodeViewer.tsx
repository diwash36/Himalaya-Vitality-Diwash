
import React, { useState, useEffect } from 'react';
import { fetchFileContent } from '../services/githubService';
import { getCodeExplanation } from '../services/geminiService';

interface CodeViewerProps {
  owner: string;
  repo: string;
  path: string | null;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ owner, repo, path }) => {
  const [content, setContent] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [explaining, setExplaining] = useState(false);

  useEffect(() => {
    if (path) {
      loadContent(path);
      setExplanation(null);
    }
  }, [path, owner, repo]);

  const loadContent = async (filePath: string) => {
    setLoading(true);
    try {
      const data = await fetchFileContent(owner, repo, filePath);
      setContent(data);
    } catch (err) {
      setContent('Error loading file content.');
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!content || !path) return;
    setExplaining(true);
    try {
      const exp = await getCodeExplanation(path, content);
      setExplanation(exp);
    } catch (err) {
      setExplanation('Failed to generate AI explanation.');
    } finally {
      setExplaining(false);
    }
  };

  if (!path) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-zinc-500 border border-zinc-800 rounded-xl bg-zinc-900/30 p-8 text-center">
        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <p className="text-xl font-medium">Select a file to view content</p>
        <p className="text-sm mt-2">Explore the codebase and get AI-powered explanations for any file.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4 overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0 bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="p-3 border-b border-zinc-800 bg-zinc-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-500 px-2 py-0.5 bg-zinc-800 rounded">File</span>
            <span className="text-sm font-mono text-zinc-300 truncate">{path}</span>
          </div>
          <button
            onClick={handleExplain}
            disabled={explaining || loading}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm rounded-lg transition-colors flex items-center gap-2"
          >
            {explaining ? (
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                Explaining...
              </span>
            ) : (
              <>
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Explain with AI
              </>
            )}
          </button>
        </div>
        <div className="flex-1 p-4 overflow-auto font-mono text-sm leading-relaxed text-zinc-300 no-scrollbar whitespace-pre-wrap">
          {loading ? (
            <div className="flex justify-center p-8 animate-pulse text-zinc-600">Fetching content...</div>
          ) : content}
        </div>
      </div>

      {explanation && (
        <div className="h-1/3 bg-blue-900/10 border border-blue-500/30 rounded-xl p-4 overflow-y-auto no-scrollbar">
          <h4 className="flex items-center gap-2 text-blue-400 font-semibold mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            AI Explanation
          </h4>
          <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default CodeViewer;
