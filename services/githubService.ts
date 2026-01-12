
import { GithubRepo, FileNode } from '../types';

const GITHUB_API_BASE = 'https://api.github.com';

export const parseRepoUrl = (url: string): { owner: string; repo: string } | null => {
  try {
    const cleanUrl = url.replace(/\/$/, '');
    const parts = cleanUrl.split('/');
    if (parts.length >= 2) {
      const repo = parts.pop();
      const owner = parts.pop();
      if (owner && repo) return { owner, repo };
    }
    return null;
  } catch {
    return null;
  }
};

export const fetchRepoInfo = async (owner: string, repo: string): Promise<GithubRepo> => {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`);
  if (!response.ok) throw new Error('Repository not found or API limit reached');
  return response.json();
};

export const fetchFileTree = async (owner: string, repo: string, path: string = ''): Promise<FileNode[]> => {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`);
  if (!response.ok) throw new Error('Failed to fetch file tree');
  const data = await response.json();
  
  return data.map((item: any) => ({
    name: item.name,
    path: item.path,
    type: item.type === 'dir' ? 'dir' : 'file'
  }));
};

export const fetchFileContent = async (owner: string, repo: string, path: string): Promise<string> => {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`);
  if (!response.ok) throw new Error('Failed to fetch file content');
  const data = await response.json();
  
  if (data.encoding === 'base64') {
    return atob(data.content.replace(/\n/g, ''));
  }
  return data.content || '';
};

export const fetchReadme = async (owner: string, repo: string): Promise<string> => {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`, {
    headers: { 'Accept': 'application/vnd.github.v3.raw' }
  });
  if (!response.ok) return 'No README found.';
  return response.text();
};
