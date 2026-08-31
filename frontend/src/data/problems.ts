import { Problem } from "@/types/problem";

/**
 * Comprehensive problem data for DSA Logic Builder
 * Organized by pattern with full problem details
 */
export const problems: Problem[] = [
  // Two Pointers
  {
    id: 1,
    title: "Two Sum",
    difficulty: "easy",
    pattern: "Two Pointers",
    status: "pending",
    companies: ["Google", "Amazon", "Meta"],
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0, 1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1, 2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0, 1]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists",
    ],
    hints: [
      "Think about using a hash map to store values you've seen",
      "For each element, check if target - element exists in the hash map",
      "You can solve this in O(n) time with O(n) space",
    ],
    timeComplexity: { brute: "O(n²)", optimal: "O(n)" },
    spaceComplexity: { brute: "O(1)", optimal: "O(n)" },
    starterCode: {
      python: `def twoSum(nums: List[int], target: int) -> List[int]:
    # Your code here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        return new int[]{};
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        return {};
    }
};`,
      javascript: `function twoSum(nums, target) {
    // Your code here
}`,
    },
  },
  {
    id: 2,
    title: "Container With Most Water",
    difficulty: "medium",
    pattern: "Two Pointers",
    status: "pending",
    companies: ["Amazon", "Microsoft"],
    description:
      "Given n non-negative integers representing the heights of bars, find two bars that together with the x-axis form a container that holds the most water.",
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation:
          "The vertical lines at indices 1 and 8 form a container with area = min(8,7) * 7 = 49",
      },
    ],
    constraints: [
      "n == height.length",
      "2 <= n <= 10^5",
      "0 <= height[i] <= 10^4",
    ],
    timeComplexity: { brute: "O(n²)", optimal: "O(n)" },
    spaceComplexity: { brute: "O(1)", optimal: "O(1)" },
  },
  {
    id: 3,
    title: "3Sum",
    difficulty: "medium",
    pattern: "Two Pointers",
    status: "pending",
    companies: ["Amazon", "Adobe"],
    description:
      "Given an integer array nums, return all triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    constraints: [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5",
    ],
    timeComplexity: { brute: "O(n³)", optimal: "O(n²)" },
    spaceComplexity: { brute: "O(1)", optimal: "O(n)" },
  },
  {
    id: 4,
    title: "Trapping Rain Water",
    difficulty: "hard",
    pattern: "Two Pointers",
    status: "pending",
    companies: ["Google", "Amazon", "Meta"],
  },
  {
    id: 5,
    title: "Remove Duplicates from Sorted Array",
    difficulty: "easy",
    pattern: "Two Pointers",
    status: "pending",
    companies: ["Meta", "Microsoft"],
  },
  {
    id: 6,
    title: "Move Zeroes",
    difficulty: "easy",
    pattern: "Two Pointers",
    status: "pending",
    companies: ["Meta", "Bloomberg"],
  },

  // Sliding Window
  {
    id: 7,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "medium",
    pattern: "Sliding Window",
    status: "pending",
    companies: ["Meta", "Bloomberg"],
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: "1", explanation: 'The answer is "b", with the length of 1.' },
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces",
    ],
    timeComplexity: { brute: "O(n³)", optimal: "O(n)" },
    spaceComplexity: { brute: "O(min(n,m))", optimal: "O(min(n,m))" },
  },
  {
    id: 8,
    title: "Minimum Window Substring",
    difficulty: "hard",
    pattern: "Sliding Window",
    status: "pending",
    companies: ["Meta", "Amazon", "Google"],
  },
  {
    id: 9,
    title: "Sliding Window Maximum",
    difficulty: "hard",
    pattern: "Sliding Window",
    status: "pending",
    companies: ["Amazon", "Google"],
  },
  {
    id: 10,
    title: "Longest Repeating Character Replacement",
    difficulty: "medium",
    pattern: "Sliding Window",
    status: "pending",
    companies: ["Google", "Amazon"],
  },

  // Binary Search
  {
    id: 13,
    title: "Binary Search",
    difficulty: "easy",
    pattern: "Binary Search",
    status: "pending",
    companies: ["Google", "Apple"],
    description:
      "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index. Otherwise, return -1.",
    timeComplexity: { brute: "O(n)", optimal: "O(log n)" },
    spaceComplexity: { brute: "O(1)", optimal: "O(1)" },
  },
  {
    id: 14,
    title: "Search in Rotated Sorted Array",
    difficulty: "medium",
    pattern: "Binary Search",
    status: "pending",
    companies: ["Meta", "Amazon", "Microsoft"],
  },
  {
    id: 15,
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "medium",
    pattern: "Binary Search",
    status: "pending",
    companies: ["Amazon", "Microsoft"],
  },

  // Stack
  {
    id: 19,
    title: "Valid Parentheses",
    difficulty: "easy",
    pattern: "Stack",
    status: "pending",
    companies: ["Google", "Uber"],
  },
  {
    id: 20,
    title: "Min Stack",
    difficulty: "medium",
    pattern: "Stack",
    status: "pending",
    companies: ["Amazon", "Bloomberg"],
  },
  {
    id: 21,
    title: "Daily Temperatures",
    difficulty: "medium",
    pattern: "Stack",
    status: "pending",
    companies: ["Meta", "Amazon"],
  },

  // Dynamic Programming
  {
    id: 25,
    title: "Maximum Subarray",
    difficulty: "medium",
    pattern: "Dynamic Programming",
    status: "pending",
    companies: ["Microsoft", "LinkedIn"],
    description:
      "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
    timeComplexity: { brute: "O(n²)", optimal: "O(n)" },
    spaceComplexity: { brute: "O(1)", optimal: "O(1)" },
  },
  {
    id: 26,
    title: "Climbing Stairs",
    difficulty: "easy",
    pattern: "Dynamic Programming",
    status: "pending",
    companies: ["Amazon", "Apple"],
  },
  {
    id: 27,
    title: "House Robber",
    difficulty: "medium",
    pattern: "Dynamic Programming",
    status: "pending",
    companies: ["Amazon", "Google"],
  },
  {
    id: 28,
    title: "Coin Change",
    difficulty: "medium",
    pattern: "Dynamic Programming",
    status: "pending",
    companies: ["Amazon", "Microsoft"],
  },

  // Graph
  {
    id: 49,
    title: "Number of Islands",
    difficulty: "medium",
    pattern: "Graph",
    status: "pending",
    companies: ["Amazon", "Google", "Meta"],
    description:
      'Given an m x n 2D binary grid which represents a map of "1"s (land) and "0"s (water), return the number of islands.',
    timeComplexity: { brute: "O(m*n)", optimal: "O(m*n)" },
    spaceComplexity: { brute: "O(m*n)", optimal: "O(min(m,n))" },
  },
  {
    id: 50,
    title: "Clone Graph",
    difficulty: "medium",
    pattern: "Graph",
    status: "pending",
    companies: ["Meta", "Amazon"],
  },
  {
    id: 51,
    title: "Course Schedule",
    difficulty: "medium",
    pattern: "Graph",
    status: "pending",
    companies: ["Amazon", "Meta"],
  },

  // Linked List
  {
    id: 53,
    title: "Reverse Linked List",
    difficulty: "easy",
    pattern: "Linked List",
    status: "pending",
    companies: ["Amazon", "Microsoft"],
  },
  {
    id: 54,
    title: "Merge Two Sorted Lists",
    difficulty: "easy",
    pattern: "Linked List",
    status: "pending",
    companies: ["Amazon", "Microsoft"],
  },
  {
    id: 58,
    title: "LRU Cache",
    difficulty: "medium",
    pattern: "Linked List",
    status: "pending",
    companies: ["Amazon", "Meta", "Google"],
  },

  // Heap
  {
    id: 59,
    title: "Kth Largest Element in an Array",
    difficulty: "medium",
    pattern: "Heap",
    status: "pending",
    companies: ["Meta", "Amazon"],
  },
  {
    id: 60,
    title: "Merge K Sorted Lists",
    difficulty: "hard",
    pattern: "Heap",
    status: "pending",
    companies: ["Amazon", "Meta", "Google"],
  },

  // Backtracking
  {
    id: 63,
    title: "Subsets",
    difficulty: "medium",
    pattern: "Backtracking",
    status: "pending",
    companies: ["Amazon", "Meta"],
  },
  {
    id: 64,
    title: "Permutations",
    difficulty: "medium",
    pattern: "Backtracking",
    status: "pending",
    companies: ["Amazon", "Meta"],
  },
  {
    id: 67,
    title: "N-Queens",
    difficulty: "hard",
    pattern: "Backtracking",
    status: "pending",
    companies: ["Amazon", "Google"],
  },

  // Trees
  {
    id: 44,
    title: "Invert Binary Tree",
    difficulty: "easy",
    pattern: "Trees",
    status: "pending",
    companies: ["Google", "Amazon"],
  },
  {
    id: 45,
    title: "Maximum Depth of Binary Tree",
    difficulty: "easy",
    pattern: "Trees",
    status: "pending",
    companies: ["Amazon", "LinkedIn"],
  },
  {
    id: 46,
    title: "Validate Binary Search Tree",
    difficulty: "medium",
    pattern: "Trees",
    status: "pending",
    companies: ["Amazon", "Meta"],
  },

  // Hash Map
  {
    id: 39,
    title: "Group Anagrams",
    difficulty: "medium",
    pattern: "Hash Map",
    status: "pending",
    companies: ["Amazon", "Meta"],
  },
  {
    id: 40,
    title: "Top K Frequent Elements",
    difficulty: "medium",
    pattern: "Hash Map",
    status: "pending",
    companies: ["Amazon", "Meta"],
  },
  {
    id: 42,
    title: "Longest Consecutive Sequence",
    difficulty: "medium",
    pattern: "Hash Map",
    status: "pending",
    companies: ["Google", "Amazon"],
  },

  // Greedy
  {
    id: 33,
    title: "Jump Game",
    difficulty: "medium",
    pattern: "Greedy",
    status: "pending",
    companies: ["Amazon", "Microsoft"],
  },
  {
    id: 36,
    title: "Merge Intervals",
    difficulty: "medium",
    pattern: "Greedy",
    status: "pending",
    companies: ["Meta", "Netflix"],
  },
];

/**
 * Get problem by ID
 */
export const getProblemById = (id: number): Problem | undefined => {
  return problems.find((p) => p.id === id);
};

/**
 * Get problems by pattern
 */
export const getProblemsByPattern = (pattern: string): Problem[] => {
  return problems.filter((p) => p.pattern === pattern);
};

/**
 * Get problems by difficulty
 */
export const getProblemsByDifficulty = (difficulty: string): Problem[] => {
  return problems.filter((p) => p.difficulty === difficulty);
};

/**
 * Get unique patterns from problems
 */
export const getUniquePatterns = (): string[] => {
  return [...new Set(problems.map((p) => p.pattern))];
};

/**
 * Get problem statistics
 */
export const getProblemStats = () => {
  const total = problems.length;
  const easy = problems.filter((p) => p.difficulty === "easy").length;
  const medium = problems.filter((p) => p.difficulty === "medium").length;
  const hard = problems.filter((p) => p.difficulty === "hard").length;
  const patterns = getUniquePatterns().length;

  return { total, easy, medium, hard, patterns };
};

export default problems;
