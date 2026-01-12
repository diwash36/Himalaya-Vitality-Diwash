
import React, { useState } from 'react';
import RepoInput from './components/RepoInput';
import FileExplorer from './components/FileExplorer';
import CodeViewer from './components/CodeViewer';
import AnalysisDashboard from './components/AnalysisDashboard';
import { GithubRepo, AnalysisResult } from './types';
import { parseRepoUrl, fetchRepoInfo, fetchFileTree, fetchReadme } from './services/githubService';
import { analyzeRepository } from './services/geminiService';

const App: React.FC = () => {
  const [repo, setRepo] = useState<GithubRepo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImport = async (url: string) => {
    setLoading(true);
    setError(null);
    setSelectedFilePath(null);
    setAnalysis(null);
    
    const parsed = parseRepoUrl(url);
    if (!parsed) {
      setError('Invalid GitHub URL format');
      setLoading(false);
      return;
    }

    try {
      const data = await fetchRepoInfo(parsed.owner, parsed.repo);
      setRepo(data);
    } catch (err: any) {
      setError(err.message || 'Failed to import repository');
    } finally {
      setLoading(false);
    }
  };

  const handleStartAnalysis = async () => {
    if (!repo) return;
    setIsAnalyzing(true);
    try {
      const tree = await fetchFileTree(repo.owner.login, repo.name);
      const structure = tree.map(n => n.path).join('\n');
      const readme = await fetchReadme(repo.owner.login, repo.name);
      const res = await analyzeRepository(repo.full_name, readme, structure);
      setAnalysis(res);
    } catch (err) {
      console.error(err);
      setError('AI Analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-zinc-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">GitMind <span className="text-blue-500">Explorer</span></h1>
          </div>
          {repo && (
            <button 
              onClick={() => { setRepo(null); setAnalysis(null); setSelectedFilePath(null); }}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {!repo ? (
          <div className="mt-20">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                Import Your GitHub Project
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Explore any public repository with the power of Gemini 3 Pro. Get high-level analysis, file explanations, and technical breakdowns in seconds.
              </p>
            </div>
            <RepoInput onImport={handleImport} isLoading={loading} />
            {error && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 text-center max-w-2xl mx-auto">
                {error}
              </div>
            )}
            
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'AI Analysis', desc: 'Get a comprehensive summary of any project structure.', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
                { title: 'Code Explainer', desc: 'Break down complex files into easy-to-understand logic.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                { title: 'Deep Context', desc: 'Gemini understands the relationship between your files.', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
              ].map((feature, i) => (
                <div key={i} className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl hover:border-zinc-700 transition-all group">
                  <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 h-[calc(100vh-160px)]">
            {/* Repo Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-zinc-900 border border-zinc-800 rounded-3xl">
              <div className="flex items-center gap-4">
                <img src={repo.owner.avatar_url} alt={repo.owner.login} className="w-12 h-12 rounded-full border-2 border-zinc-800" />
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    {repo.name}
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </h2>
                  <p className="text-zinc-500 text-sm">{repo.description || 'No description provided.'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  {repo.stargazers_count} stars
                </div>
                <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  {repo.language || 'Multiple'}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
              {/* Sidebar: File Explorer */}
              <div className="lg:col-span-3 min-h-0">
                <FileExplorer 
                  owner={repo.owner.login} 
                  repo={repo.name} 
                  onFileSelect={setSelectedFilePath} 
                />
              </div>

              {/* Main: Viewer & Analysis */}
              <div className="lg:col-span-9 flex flex-col gap-8 overflow-y-auto no-scrollbar pb-12">
                {/* Global AI Analysis */}
                <AnalysisDashboard 
                  analysis={analysis} 
                  loading={isAnalyzing} 
                  onAnalyze={handleStartAnalysis} 
                />

                {/* File Content / Code Viewer */}
                <div className="min-h-[500px]">
                  <CodeViewer 
                    owner={repo.owner.login} 
                    repo={repo.name} 
                    path={selectedFilePath} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-500 text-sm">
          <p>© {new Date().getFullYear()} GitMind Explorer. Powered by Gemini 3 Pro.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
