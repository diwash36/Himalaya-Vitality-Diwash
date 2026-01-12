
import React, { useState, useEffect } from 'react';
import { FileNode } from '../types';
import { fetchFileTree } from '../services/githubService';

interface FileExplorerProps {
  owner: string;
  repo: string;
  onFileSelect: (path: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ owner, repo, onFileSelect }) => {
  const [nodes, setNodes] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadRoot();
  }, [owner, repo]);

  const loadRoot = async () => {
    setLoading(true);
    try {
      const tree = await fetchFileTree(owner, repo);
      setNodes(tree);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFolder = async (path: string) => {
    if (expandedPaths.has(path)) {
      const newPaths = new Set(expandedPaths);
      newPaths.delete(path);
      setExpandedPaths(newPaths);
    } else {
      setExpandedPaths(new Set([...expandedPaths, path]));
      // In a real robust implementation, we'd fetch subfolder contents here if not already cached.
      // For simplicity, we assume root-level view for now or recursive loading.
    }
  };

  const FolderIcon = () => (
    <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
  );

  const FileIcon = () => (
    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden bg-zinc-900/50 border border-zinc-800 rounded-xl">
      <div className="p-4 border-b border-zinc-800 font-semibold flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        File Explorer
      </div>
      <div className="flex-1 overflow-y-auto p-2 no-scrollbar">
        {loading ? (
          <div className="flex items-center justify-center p-8 text-zinc-500 animate-pulse">
            Loading repository structure...
          </div>
        ) : (
          <ul className="space-y-1">
            {nodes.map((node) => (
              <li key={node.path}>
                <button
                  onClick={() => node.type === 'dir' ? toggleFolder(node.path) : onFileSelect(node.path)}
                  className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
                    node.type === 'dir' ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-zinc-800/80 text-zinc-400'
                  }`}
                >
                  {node.type === 'dir' ? <FolderIcon /> : <FileIcon />}
                  <span className="truncate text-sm">{node.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;
