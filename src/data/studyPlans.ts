/**
 * Curated Study Plans for structured DSA learning
 */

export interface StudyPlan {
  id: string;
  name: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedDays: number;
  problemIds: number[];
  tags: string[];
  icon: string;
  color: string;
}

export const studyPlans: StudyPlan[] = [
  {
    id: "blind-75",
    name: "Blind 75",
    description:
      "The famous 75 LeetCode questions that cover all important patterns. Perfect for interview preparation.",
    difficulty: "intermediate",
    estimatedDays: 30,
    problemIds: [
      1, 3, 7, 13, 14, 19, 20, 21, 25, 26, 27, 28, 33, 36, 39, 40, 42, 44, 45,
      46, 49, 50, 51, 53, 54, 58, 59, 60, 63, 64, 67,
    ],
    tags: ["interview", "essential", "comprehensive"],
    icon: "🎯",
    color: "from-blue-500 to-purple-500",
  },
  {
    id: "grind-169",
    name: "Grind 169",
    description:
      "Extended version of Blind 75 with more problems for thorough preparation.",
    difficulty: "intermediate",
    estimatedDays: 60,
    problemIds: [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 14, 15, 19, 20, 21, 25, 26, 27, 28, 33,
      36, 39, 40, 42, 44, 45, 46, 49, 50, 51, 53, 54, 58, 59, 60, 63, 64, 67,
    ],
    tags: ["interview", "comprehensive", "extended"],
    icon: "💪",
    color: "from-green-500 to-teal-500",
  },
  {
    id: "beginner-dsa",
    name: "DSA Fundamentals",
    description:
      "Start your DSA journey with easy problems covering basic concepts.",
    difficulty: "beginner",
    estimatedDays: 14,
    problemIds: [1, 5, 6, 13, 19, 26, 44, 45, 53, 54],
    tags: ["beginner", "fundamentals", "easy"],
    icon: "🌱",
    color: "from-emerald-400 to-green-500",
  },
  {
    id: "two-pointers-master",
    name: "Two Pointers Mastery",
    description: "Deep dive into the two pointers pattern with progressive difficulty.",
    difficulty: "intermediate",
    estimatedDays: 7,
    problemIds: [1, 2, 3, 4, 5, 6],
    tags: ["pattern", "two-pointers", "focused"],
    icon: "👆👆",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "sliding-window-master",
    name: "Sliding Window Mastery",
    description: "Master the sliding window technique for substring/subarray problems.",
    difficulty: "intermediate",
    estimatedDays: 7,
    problemIds: [7, 8, 9, 10],
    tags: ["pattern", "sliding-window", "focused"],
    icon: "🪟",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "dp-intro",
    name: "Dynamic Programming Intro",
    description:
      "Learn DP step by step with classic problems from easy to medium.",
    difficulty: "intermediate",
    estimatedDays: 14,
    problemIds: [25, 26, 27, 28],
    tags: ["pattern", "dp", "essential"],
    icon: "🧩",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "graph-basics",
    name: "Graph Fundamentals",
    description: "Learn graph traversal, BFS, DFS, and common graph patterns.",
    difficulty: "intermediate",
    estimatedDays: 10,
    problemIds: [49, 50, 51],
    tags: ["pattern", "graph", "essential"],
    icon: "🕸️",
    color: "from-orange-500 to-amber-500",
  },
  {
    id: "tree-traversal",
    name: "Tree Mastery",
    description: "Master binary trees, BSTs, and tree traversal techniques.",
    difficulty: "intermediate",
    estimatedDays: 10,
    problemIds: [44, 45, 46],
    tags: ["pattern", "trees", "essential"],
    icon: "🌳",
    color: "from-lime-500 to-green-500",
  },
  {
    id: "weekly-challenge",
    name: "Weekly Sprint",
    description: "7 carefully selected problems to solve in a week. Great for maintaining consistency.",
    difficulty: "intermediate",
    estimatedDays: 7,
    problemIds: [1, 7, 13, 19, 25, 44, 49],
    tags: ["weekly", "variety", "challenge"],
    icon: "🏃",
    color: "from-red-500 to-orange-500",
  },
  {
    id: "faang-prep",
    name: "FAANG Interview Prep",
    description:
      "Problems frequently asked at top tech companies. Focus on patterns over memorization.",
    difficulty: "advanced",
    estimatedDays: 45,
    problemIds: [
      1, 2, 3, 4, 7, 8, 14, 25, 27, 28, 42, 46, 49, 51, 58, 60,
    ],
    tags: ["faang", "interview", "advanced"],
    icon: "🏢",
    color: "from-indigo-500 to-blue-600",
  },
];

/**
 * Get study plan by ID
 */
export const getStudyPlanById = (id: string): StudyPlan | undefined => {
  return studyPlans.find((plan) => plan.id === id);
};

/**
 * Get study plans by difficulty
 */
export const getStudyPlansByDifficulty = (
  difficulty: StudyPlan["difficulty"]
): StudyPlan[] => {
  return studyPlans.filter((plan) => plan.difficulty === difficulty);
};

/**
 * Get study plans by tag
 */
export const getStudyPlansByTag = (tag: string): StudyPlan[] => {
  return studyPlans.filter((plan) => plan.tags.includes(tag));
};

export default studyPlans;
