// Problem data types for the DSA Logic Builder application

export type Difficulty = "easy" | "medium" | "hard";
export type ProblemStatus = "pending" | "in-progress" | "completed";

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: number;
  title: string;
  difficulty: Difficulty;
  pattern: string;
  status: ProblemStatus;
  companies: string[];
  description?: string;
  examples?: Example[];
  constraints?: string[];
  hints?: string[];
  timeComplexity?: {
    brute: string;
    optimal: string;
  };
  spaceComplexity?: {
    brute: string;
    optimal: string;
  };
  starterCode?: {
    python: string;
    java: string;
    cpp: string;
    javascript: string;
  };
  solution?: {
    python: string;
    java: string;
    cpp: string;
    javascript: string;
  };
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  problemCount: number;
  difficulty: Difficulty;
  color: string;
  icon?: string;
  keyTechniques: string[];
  whenToUse: string[];
  relatedPatterns: string[];
}

// Available DSA patterns
export const DSA_PATTERNS = [
  "Two Pointers",
  "Sliding Window",
  "Binary Search",
  "Stack",
  "Dynamic Programming",
  "Greedy",
  "Hash Map",
  "Trees",
  "Graph",
  "Linked List",
  "Heap",
  "Backtracking",
  "Trie",
  "Union Find",
  "Monotonic Stack",
  "Bit Manipulation",
] as const;

export type DSAPattern = (typeof DSA_PATTERNS)[number];

// Company tags
export const COMPANIES = [
  "Google",
  "Amazon",
  "Meta",
  "Microsoft",
  "Apple",
  "Netflix",
  "Adobe",
  "Bloomberg",
  "LinkedIn",
  "Uber",
  "Twitter",
  "Stripe",
] as const;

export type Company = (typeof COMPANIES)[number];

// Difficulty colors for UI
export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: "text-success bg-success/10",
  medium: "text-warning bg-warning/10",
  hard: "text-destructive bg-destructive/10",
};

// Pattern colors for UI
export const PATTERN_COLORS: Record<string, string> = {
  "Two Pointers": "bg-blue-500/10 text-blue-500",
  "Sliding Window": "bg-purple-500/10 text-purple-500",
  "Binary Search": "bg-green-500/10 text-green-500",
  "Stack": "bg-orange-500/10 text-orange-500",
  "Dynamic Programming": "bg-pink-500/10 text-pink-500",
  "Greedy": "bg-yellow-500/10 text-yellow-500",
  "Hash Map": "bg-cyan-500/10 text-cyan-500",
  "Trees": "bg-emerald-500/10 text-emerald-500",
  "Graph": "bg-indigo-500/10 text-indigo-500",
  "Linked List": "bg-teal-500/10 text-teal-500",
  "Heap": "bg-rose-500/10 text-rose-500",
  "Backtracking": "bg-violet-500/10 text-violet-500",
};
