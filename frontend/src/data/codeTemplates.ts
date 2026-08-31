/**
 * Code Templates - Common algorithm patterns and snippets
 */

export interface CodeTemplate {
  id: string;
  name: string;
  pattern: string;
  description: string;
  complexity: {
    time: string;
    space: string;
  };
  code: {
    python: string;
    javascript: string;
    java: string;
    cpp: string;
  };
  whenToUse: string[];
  commonProblems: string[];
}

export const codeTemplates: CodeTemplate[] = [
  {
    id: "two-pointers-opposite",
    name: "Two Pointers (Opposite Ends)",
    pattern: "Two Pointers",
    description: "Start from both ends and move inward. Great for sorted arrays or palindrome checks.",
    complexity: { time: "O(n)", space: "O(1)" },
    code: {
      python: `def two_pointers(arr):
    left, right = 0, len(arr) - 1
    
    while left < right:
        # Process elements at left and right
        current_sum = arr[left] + arr[right]
        
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    
    return []`,
      javascript: `function twoPointers(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left < right) {
        const currentSum = arr[left] + arr[right];
        
        if (currentSum === target) {
            return [left, right];
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return [];
}`,
      java: `public int[] twoPointers(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;
    
    while (left < right) {
        int currentSum = arr[left] + arr[right];
        
        if (currentSum == target) {
            return new int[]{left, right};
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return new int[]{};
}`,
      cpp: `vector<int> twoPointers(vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left < right) {
        int currentSum = arr[left] + arr[right];
        
        if (currentSum == target) {
            return {left, right};
        } else if (currentSum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return {};
}`,
    },
    whenToUse: [
      "Sorted array with target sum",
      "Palindrome verification",
      "Container with most water",
      "Reversing arrays in-place",
    ],
    commonProblems: ["Two Sum II", "Container With Most Water", "3Sum", "Trapping Rain Water"],
  },
  {
    id: "sliding-window-fixed",
    name: "Sliding Window (Fixed Size)",
    pattern: "Sliding Window",
    description: "Window of fixed size K sliding through the array.",
    complexity: { time: "O(n)", space: "O(1)" },
    code: {
      python: `def sliding_window_fixed(arr, k):
    n = len(arr)
    if n < k:
        return -1
    
    # Calculate sum of first window
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # Slide the window
    for i in range(k, n):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum`,
      javascript: `function slidingWindowFixed(arr, k) {
    const n = arr.length;
    if (n < k) return -1;
    
    // Calculate sum of first window
    let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);
    let maxSum = windowSum;
    
    // Slide the window
    for (let i = k; i < n; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}`,
      java: `public int slidingWindowFixed(int[] arr, int k) {
    int n = arr.length;
    if (n < k) return -1;
    
    // Calculate sum of first window
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    int maxSum = windowSum;
    
    // Slide the window
    for (int i = k; i < n; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    
    return maxSum;
}`,
      cpp: `int slidingWindowFixed(vector<int>& arr, int k) {
    int n = arr.size();
    if (n < k) return -1;
    
    // Calculate sum of first window
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    int maxSum = windowSum;
    
    // Slide the window
    for (int i = k; i < n; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = max(maxSum, windowSum);
    }
    
    return maxSum;
}`,
    },
    whenToUse: [
      "Maximum/minimum sum of K elements",
      "Average of subarrays of size K",
      "First negative in every window of size K",
    ],
    commonProblems: ["Maximum Sum Subarray of Size K", "Sliding Window Maximum"],
  },
  {
    id: "sliding-window-variable",
    name: "Sliding Window (Variable Size)",
    pattern: "Sliding Window",
    description: "Window expands and shrinks based on condition.",
    complexity: { time: "O(n)", space: "O(k)" },
    code: {
      python: `def sliding_window_variable(s):
    char_set = set()
    left = 0
    max_length = 0
    
    for right in range(len(s)):
        # Shrink window while we have duplicates
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        
        # Add current character
        char_set.add(s[right])
        max_length = max(max_length, right - left + 1)
    
    return max_length`,
      javascript: `function slidingWindowVariable(s) {
    const charSet = new Set();
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        // Shrink window while we have duplicates
        while (charSet.has(s[right])) {
            charSet.delete(s[left]);
            left++;
        }
        
        // Add current character
        charSet.add(s[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
      java: `public int slidingWindowVariable(String s) {
    Set<Character> charSet = new HashSet<>();
    int left = 0;
    int maxLength = 0;
    
    for (int right = 0; right < s.length(); right++) {
        // Shrink window while we have duplicates
        while (charSet.contains(s.charAt(right))) {
            charSet.remove(s.charAt(left));
            left++;
        }
        
        // Add current character
        charSet.add(s.charAt(right));
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
      cpp: `int slidingWindowVariable(string s) {
    unordered_set<char> charSet;
    int left = 0;
    int maxLength = 0;
    
    for (int right = 0; right < s.length(); right++) {
        // Shrink window while we have duplicates
        while (charSet.count(s[right])) {
            charSet.erase(s[left]);
            left++;
        }
        
        // Add current character
        charSet.insert(s[right]);
        maxLength = max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
    },
    whenToUse: [
      "Longest/shortest substring with condition",
      "Minimum window containing all characters",
      "Longest substring without repeating characters",
    ],
    commonProblems: [
      "Longest Substring Without Repeating Characters",
      "Minimum Window Substring",
      "Longest Repeating Character Replacement",
    ],
  },
  {
    id: "binary-search",
    name: "Binary Search",
    pattern: "Binary Search",
    description: "Divide and conquer on sorted array. Find target or boundary.",
    complexity: { time: "O(log n)", space: "O(1)" },
    code: {
      python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # Not found

# Variation: Find leftmost position
def binary_search_left(arr, target):
    left, right = 0, len(arr)
    
    while left < right:
        mid = left + (right - left) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    
    return left`,
      javascript: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = left + Math.floor((right - left) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Not found
}

// Variation: Find leftmost position
function binarySearchLeft(arr, target) {
    let left = 0;
    let right = arr.length;
    
    while (left < right) {
        const mid = left + Math.floor((right - left) / 2);
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    
    return left;
}`,
      java: `public int binarySearch(int[] arr, int target) {
    int left = 0;
    int right = arr.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Not found
}`,
      cpp: `int binarySearch(vector<int>& arr, int target) {
    int left = 0;
    int right = arr.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1; // Not found
}`,
    },
    whenToUse: [
      "Searching in sorted array",
      "Finding boundary/insertion point",
      "Search space reduction problems",
      "Minimize/maximize problems with monotonic property",
    ],
    commonProblems: [
      "Binary Search",
      "Search in Rotated Sorted Array",
      "Find Minimum in Rotated Sorted Array",
      "Koko Eating Bananas",
    ],
  },
  {
    id: "dfs-recursive",
    name: "DFS (Recursive)",
    pattern: "Graph",
    description: "Depth-first traversal using recursion.",
    complexity: { time: "O(V + E)", space: "O(V)" },
    code: {
      python: `def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
    
    if node in visited:
        return
    
    visited.add(node)
    print(node)  # Process node
    
    for neighbor in graph[node]:
        dfs(graph, neighbor, visited)
    
    return visited

# For grid problems
def dfs_grid(grid, row, col, visited):
    rows, cols = len(grid), len(grid[0])
    
    # Base cases
    if (row < 0 or row >= rows or 
        col < 0 or col >= cols or
        (row, col) in visited or
        grid[row][col] == 0):
        return
    
    visited.add((row, col))
    
    # Explore 4 directions
    dfs_grid(grid, row + 1, col, visited)
    dfs_grid(grid, row - 1, col, visited)
    dfs_grid(grid, row, col + 1, visited)
    dfs_grid(grid, row, col - 1, visited)`,
      javascript: `function dfs(graph, node, visited = new Set()) {
    if (visited.has(node)) return;
    
    visited.add(node);
    console.log(node); // Process node
    
    for (const neighbor of graph[node]) {
        dfs(graph, neighbor, visited);
    }
    
    return visited;
}

// For grid problems
function dfsGrid(grid, row, col, visited) {
    const rows = grid.length;
    const cols = grid[0].length;
    const key = \`\${row},\${col}\`;
    
    // Base cases
    if (row < 0 || row >= rows || 
        col < 0 || col >= cols ||
        visited.has(key) ||
        grid[row][col] === 0) {
        return;
    }
    
    visited.add(key);
    
    // Explore 4 directions
    dfsGrid(grid, row + 1, col, visited);
    dfsGrid(grid, row - 1, col, visited);
    dfsGrid(grid, row, col + 1, visited);
    dfsGrid(grid, row, col - 1, visited);
}`,
      java: `public void dfs(Map<Integer, List<Integer>> graph, int node, Set<Integer> visited) {
    if (visited.contains(node)) return;
    
    visited.add(node);
    System.out.println(node); // Process node
    
    for (int neighbor : graph.get(node)) {
        dfs(graph, neighbor, visited);
    }
}`,
      cpp: `void dfs(unordered_map<int, vector<int>>& graph, int node, unordered_set<int>& visited) {
    if (visited.count(node)) return;
    
    visited.insert(node);
    cout << node << endl; // Process node
    
    for (int neighbor : graph[node]) {
        dfs(graph, neighbor, visited);
    }
}`,
    },
    whenToUse: [
      "Path finding in graphs/grids",
      "Cycle detection",
      "Topological sorting",
      "Connected components",
      "Island counting",
    ],
    commonProblems: ["Number of Islands", "Clone Graph", "Course Schedule", "Pacific Atlantic Water Flow"],
  },
  {
    id: "bfs",
    name: "BFS (Level Order)",
    pattern: "Graph",
    description: "Breadth-first traversal using queue. Great for shortest path.",
    complexity: { time: "O(V + E)", space: "O(V)" },
    code: {
      python: `from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    
    while queue:
        node = queue.popleft()
        print(node)  # Process node
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return visited

# BFS for shortest path in grid
def bfs_shortest_path(grid, start, end):
    rows, cols = len(grid), len(grid[0])
    queue = deque([(start[0], start[1], 0)])  # row, col, distance
    visited = set([start])
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    while queue:
        row, col, dist = queue.popleft()
        
        if (row, col) == end:
            return dist
        
        for dr, dc in directions:
            new_row, new_col = row + dr, col + dc
            if (0 <= new_row < rows and 
                0 <= new_col < cols and
                (new_row, new_col) not in visited and
                grid[new_row][new_col] != 0):
                visited.add((new_row, new_col))
                queue.append((new_row, new_col, dist + 1))
    
    return -1  # No path found`,
      javascript: `function bfs(graph, start) {
    const visited = new Set([start]);
    const queue = [start];
    
    while (queue.length > 0) {
        const node = queue.shift();
        console.log(node); // Process node
        
        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }
    
    return visited;
}

// BFS for shortest path in grid
function bfsShortestPath(grid, start, end) {
    const rows = grid.length;
    const cols = grid[0].length;
    const queue = [[start[0], start[1], 0]]; // row, col, distance
    const visited = new Set([\`\${start[0]},\${start[1]}\`]);
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    
    while (queue.length > 0) {
        const [row, col, dist] = queue.shift();
        
        if (row === end[0] && col === end[1]) {
            return dist;
        }
        
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            const key = \`\${newRow},\${newCol}\`;
            
            if (newRow >= 0 && newRow < rows &&
                newCol >= 0 && newCol < cols &&
                !visited.has(key) &&
                grid[newRow][newCol] !== 0) {
                visited.add(key);
                queue.push([newRow, newCol, dist + 1]);
            }
        }
    }
    
    return -1; // No path found
}`,
      java: `public void bfs(Map<Integer, List<Integer>> graph, int start) {
    Set<Integer> visited = new HashSet<>();
    Queue<Integer> queue = new LinkedList<>();
    
    visited.add(start);
    queue.offer(start);
    
    while (!queue.isEmpty()) {
        int node = queue.poll();
        System.out.println(node); // Process node
        
        for (int neighbor : graph.get(node)) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.offer(neighbor);
            }
        }
    }
}`,
      cpp: `void bfs(unordered_map<int, vector<int>>& graph, int start) {
    unordered_set<int> visited;
    queue<int> q;
    
    visited.insert(start);
    q.push(start);
    
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        cout << node << endl; // Process node
        
        for (int neighbor : graph[node]) {
            if (!visited.count(neighbor)) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
}`,
    },
    whenToUse: [
      "Shortest path in unweighted graph",
      "Level-order traversal",
      "Finding all nodes at distance K",
      "Minimum steps/moves problems",
    ],
    commonProblems: ["Binary Tree Level Order Traversal", "Word Ladder", "Rotting Oranges", "01 Matrix"],
  },
  {
    id: "dp-1d",
    name: "Dynamic Programming (1D)",
    pattern: "Dynamic Programming",
    description: "DP with single dimension state. Often uses prev/curr optimization.",
    complexity: { time: "O(n)", space: "O(n) or O(1)" },
    code: {
      python: `# Example: Climbing Stairs / Fibonacci
def dp_1d(n):
    if n <= 2:
        return n
    
    # Full DP array
    dp = [0] * (n + 1)
    dp[1] = 1
    dp[2] = 2
    
    for i in range(3, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]

# Space optimized version
def dp_1d_optimized(n):
    if n <= 2:
        return n
    
    prev2, prev1 = 1, 2
    
    for i in range(3, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
    
    return prev1`,
      javascript: `// Example: Climbing Stairs / Fibonacci
function dp1d(n) {
    if (n <= 2) return n;
    
    // Full DP array
    const dp = new Array(n + 1).fill(0);
    dp[1] = 1;
    dp[2] = 2;
    
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    
    return dp[n];
}

// Space optimized version
function dp1dOptimized(n) {
    if (n <= 2) return n;
    
    let prev2 = 1, prev1 = 2;
    
    for (let i = 3; i <= n; i++) {
        const curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}`,
      java: `// Example: Climbing Stairs / Fibonacci
public int dp1d(int n) {
    if (n <= 2) return n;
    
    int[] dp = new int[n + 1];
    dp[1] = 1;
    dp[2] = 2;
    
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    
    return dp[n];
}

// Space optimized
public int dp1dOptimized(int n) {
    if (n <= 2) return n;
    
    int prev2 = 1, prev1 = 2;
    
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}`,
      cpp: `// Example: Climbing Stairs / Fibonacci
int dp1d(int n) {
    if (n <= 2) return n;
    
    vector<int> dp(n + 1);
    dp[1] = 1;
    dp[2] = 2;
    
    for (int i = 3; i <= n; i++) {
        dp[i] = dp[i-1] + dp[i-2];
    }
    
    return dp[n];
}

// Space optimized
int dp1dOptimized(int n) {
    if (n <= 2) return n;
    
    int prev2 = 1, prev1 = 2;
    
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}`,
    },
    whenToUse: [
      "Optimization problems with overlapping subproblems",
      "Counting problems (ways to do something)",
      "Min/max problems",
      "Sequential decision making",
    ],
    commonProblems: ["Climbing Stairs", "House Robber", "Maximum Subarray", "Coin Change"],
  },
  {
    id: "backtracking",
    name: "Backtracking",
    pattern: "Backtracking",
    description: "Explore all possibilities by building candidates and abandoning (backtracking) when constraints are violated.",
    complexity: { time: "O(k^n) or O(n!)", space: "O(n)" },
    code: {
      python: `def backtrack(candidates, path, result):
    # Base case: found a valid solution
    if is_solution(path):
        result.append(path[:])  # Make a copy
        return
    
    for i, candidate in enumerate(candidates):
        # Check if candidate is valid
        if not is_valid(candidate, path):
            continue
        
        # Choose
        path.append(candidate)
        
        # Explore (may pass i+1 to avoid duplicates)
        backtrack(candidates[i+1:], path, result)
        
        # Unchoose (backtrack)
        path.pop()

# Example: Subsets
def subsets(nums):
    result = []
    
    def backtrack(start, path):
        result.append(path[:])
        
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(0, [])
    return result

# Example: Permutations
def permutations(nums):
    result = []
    
    def backtrack(path, remaining):
        if not remaining:
            result.append(path[:])
            return
        
        for i in range(len(remaining)):
            path.append(remaining[i])
            backtrack(path, remaining[:i] + remaining[i+1:])
            path.pop()
    
    backtrack([], nums)
    return result`,
      javascript: `function backtrack(candidates, path, result) {
    // Base case: found a valid solution
    if (isSolution(path)) {
        result.push([...path]); // Make a copy
        return;
    }
    
    for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        
        // Check if candidate is valid
        if (!isValid(candidate, path)) continue;
        
        // Choose
        path.push(candidate);
        
        // Explore
        backtrack(candidates.slice(i + 1), path, result);
        
        // Unchoose (backtrack)
        path.pop();
    }
}

// Example: Subsets
function subsets(nums) {
    const result = [];
    
    function backtrack(start, path) {
        result.push([...path]);
        
        for (let i = start; i < nums.length; i++) {
            path.push(nums[i]);
            backtrack(i + 1, path);
            path.pop();
        }
    }
    
    backtrack(0, []);
    return result;
}`,
      java: `public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(nums, 0, new ArrayList<>(), result);
    return result;
}

private void backtrack(int[] nums, int start, List<Integer> path, List<List<Integer>> result) {
    result.add(new ArrayList<>(path));
    
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        backtrack(nums, i + 1, path, result);
        path.remove(path.size() - 1);
    }
}`,
      cpp: `vector<vector<int>> subsets(vector<int>& nums) {
    vector<vector<int>> result;
    vector<int> path;
    backtrack(nums, 0, path, result);
    return result;
}

void backtrack(vector<int>& nums, int start, vector<int>& path, vector<vector<int>>& result) {
    result.push_back(path);
    
    for (int i = start; i < nums.size(); i++) {
        path.push_back(nums[i]);
        backtrack(nums, i + 1, path, result);
        path.pop_back();
    }
}`,
    },
    whenToUse: [
      "Generate all subsets/combinations/permutations",
      "Constraint satisfaction problems",
      "Puzzle solving (N-Queens, Sudoku)",
      "Path finding with constraints",
    ],
    commonProblems: ["Subsets", "Permutations", "Combination Sum", "N-Queens", "Word Search"],
  },
];

/**
 * Get template by ID
 */
export const getTemplateById = (id: string): CodeTemplate | undefined => {
  return codeTemplates.find((t) => t.id === id);
};

/**
 * Get templates by pattern
 */
export const getTemplatesByPattern = (pattern: string): CodeTemplate[] => {
  return codeTemplates.filter((t) => t.pattern === pattern);
};

export default codeTemplates;
