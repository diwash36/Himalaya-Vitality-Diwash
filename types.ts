
export interface GithubRepo {
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  default_branch: string;
  html_url: string;
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'dir';
  content?: string;
  children?: FileNode[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  id: string;
}

export interface AnalysisResult {
  summary: string;
  techStack: string[];
  keyFeatures: string[];
  architectureSuggestion: string;
}
