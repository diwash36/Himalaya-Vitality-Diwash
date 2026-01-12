
import React, { useState } from 'react';

interface RepoInputProps {
  onImport: (url: string) => void;
  isLoading: boolean;
}

const RepoInput: React.FC<RepoInputProps> = ({ onImport, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onImport(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-12">
      <div className="relative group">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/facebook/react"
          disabled={isLoading}
          className="w-full px-6 py-4 bg-zinc-900 border-2 border-zinc-800 rounded-2xl text-lg focus:outline-none focus:border-blue-500 transition-all placeholder-zinc-600 group-hover:border-zinc-700 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isLoading || !url}
          className="absolute right-3 top-3 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:bg-zinc-700"
        >
          {isLoading ? 'Importing...' : 'Import Project'}
        </button>
      </div>
      <p className="mt-3 text-center text-sm text-zinc-500">
        Enter a public GitHub repository URL to start the exploration
      </p>
    </form>
  );
};

export default RepoInput;
