import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EdgeCaseGenerator from "@/components/problem/EdgeCaseGenerator";
import ConstraintTraining from "@/components/problem/ConstraintTraining";
import MistakeFeedback from "@/components/problem/MistakeFeedback";
import { 
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  BookOpen,
  Target,
  Sparkles,
  Zap,
  Brain,
  Users,
  Code
} from "lucide-react";

const patterns = [
  {
    id: "two-pointers",
    name: "Two Pointers",
    description: "Use two pointers to traverse an array or string efficiently",
    problems: 24,
    mastery: 65,
    difficulty: "medium",
    icon: "👆👆",
    whenToUse: [
      "Sorted array problems",
      "Finding pairs that sum to target",
      "Removing duplicates in-place",
      "Container with most water type problems"
    ],
    whenNotToUse: [
      "When order doesn't matter (use hash map)",
      "When you need to find all pairs, not just one",
      "Unsorted data where sorting changes semantics"
    ],
    commonMistakes: [
      "Forgetting to handle edge cases (empty array, single element)",
      "Off-by-one errors in pointer movement",
      "Not considering when to move which pointer"
    ]
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    description: "Maintain a window of elements while traversing a sequence",
    problems: 18,
    mastery: 40,
    difficulty: "medium",
    icon: "🪟",
    whenToUse: [
      "Finding longest/shortest substring with constraint",
      "Maximum sum subarray of size k",
      "Counting distinct elements in windows",
      "String permutation problems"
    ],
    whenNotToUse: [
      "When window size is not fixed and no clear constraint",
      "When you need to process non-contiguous elements",
      "When the problem requires backtracking"
    ],
    commonMistakes: [
      "Not shrinking window correctly when constraint violated",
      "Incorrect window size calculation",
      "Not handling duplicate elements properly"
    ]
  },
  {
    id: "binary-search",
    name: "Binary Search on Answer",
    description: "Apply binary search to find optimal values in sorted search spaces",
    problems: 21,
    mastery: 25,
    difficulty: "hard",
    icon: "🔍",
    whenToUse: [
      "Finding minimum/maximum value that satisfies condition",
      "Optimization problems with monotonic properties",
      "Capacity/allocation problems",
      "Finding kth smallest/largest element"
    ],
    whenNotToUse: [
      "When search space is not monotonic",
      "When you need exact matching, not optimization",
      "Small search spaces where linear scan is fine"
    ],
    commonMistakes: [
      "Wrong mid calculation causing infinite loop",
      "Incorrect boundary update (should include mid or not)",
      "Not identifying the correct search space bounds"
    ]
  },
  {
    id: "dynamic-programming",
    name: "Recursion to DP",
    description: "Convert recursive solutions to dynamic programming for efficiency",
    problems: 45,
    mastery: 10,
    difficulty: "hard",
    icon: "🧩",
    whenToUse: [
      "Overlapping subproblems (same subproblem solved multiple times)",
      "Optimal substructure (optimal solution built from optimal sub-solutions)",
      "Counting problems",
      "Min/max optimization problems"
    ],
    whenNotToUse: [
      "When subproblems don't overlap (use divide & conquer)",
      "When greedy works (simpler solution)",
      "When there's no clear state to memoize"
    ],
    commonMistakes: [
      "Incorrect state definition",
      "Wrong base cases",
      "Not considering all transitions",
      "Space optimization when problem requires backtracking"
    ]
  },
  {
    id: "greedy",
    name: "Greedy Algorithms",
    description: "Make locally optimal choices to find global optimum",
    problems: 15,
    mastery: 55,
    difficulty: "medium",
    icon: "💰",
    whenToUse: [
      "When local optimum leads to global optimum",
      "Interval scheduling problems",
      "Huffman coding type problems",
      "Activity selection"
    ],
    whenNotToUse: [
      "When you need to explore all possibilities",
      "When local optimal choice blocks better global solution",
      "When problem requires backtracking"
    ],
    commonMistakes: [
      "Assuming greedy works without proof",
      "Wrong sorting criteria",
      "Not handling edge cases"
    ]
  },
  {
    id: "stack",
    name: "Stack-Based Thinking",
    description: "Use stack for problems requiring last-in-first-out processing",
    problems: 16,
    mastery: 70,
    difficulty: "easy",
    icon: "📚",
    whenToUse: [
      "Matching parentheses/brackets",
      "Next greater/smaller element",
      "Expression evaluation",
      "Monotonic stack problems"
    ],
    whenNotToUse: [
      "When you need random access to elements",
      "When FIFO order is needed (use queue)",
      "When you need to process from both ends"
    ],
    commonMistakes: [
      "Stack underflow (popping from empty stack)",
      "Not cleaning up stack after processing",
      "Incorrect order of push/pop operations"
    ]
  }
];

const Patterns = () => {
  const [selectedView, setSelectedView] = useState<"grid" | "list">("grid");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge variant="primary" className="mb-4">Pattern Library</Badge>
            <h1 className="text-4xl font-bold mb-4">Master the Patterns</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Learn when to use each pattern, when NOT to use it, and common mistakes. 
              Understanding patterns is the key to solving new problems.
            </p>
          </div>

          <Tabs defaultValue="patterns" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 max-w-xl mx-auto">
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="edge-cases">Edge Cases</TabsTrigger>
            </TabsList>

            {/* Patterns Tab */}
            <TabsContent value="patterns" className="space-y-6">
              {/* Pattern Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patterns.map((pattern) => (
                  <Link key={pattern.id} to={`/patterns/${pattern.id}`}>
                    <Card variant="interactive" className="group flex flex-col h-full">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl">{pattern.icon}</span>
                          <Badge variant={pattern.difficulty === "easy" ? "success" : pattern.difficulty === "medium" ? "warning" : "destructive"}>
                            {pattern.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="group-hover:text-primary transition-colors">
                          {pattern.name}
                        </CardTitle>
                        <CardDescription>{pattern.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col">
                        {/* Mastery Progress */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Mastery</span>
                            <span className="font-medium">{pattern.mastery}%</span>
                          </div>
                          <Progress value={pattern.mastery} variant="accent" />
                        </div>

                        {/* Quick Preview */}
                        <div className="space-y-3 flex-1">
                          <div>
                            <div className="flex items-center gap-2 text-sm font-medium text-success mb-1">
                              <CheckCircle className="h-3 w-3" />
                              When to Use
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {pattern.whenToUse[0]}
                            </p>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-sm font-medium text-destructive mb-1">
                              <XCircle className="h-3 w-3" />
                              When Not to Use
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {pattern.whenNotToUse[0]}
                            </p>
                          </div>
                        </div>

                        {/* View Details */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                          <span className="text-sm text-muted-foreground">{pattern.problems} problems</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pattern Comparison */}
              <Card variant="elevated" className="mt-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Quick Pattern Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4">Pattern</th>
                          <th className="text-left py-3 px-4">Best For</th>
                          <th className="text-left py-3 px-4">Time Complexity</th>
                          <th className="text-left py-3 px-4">Key Data Structure</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 font-medium">Two Pointers</td>
                          <td className="py-3 px-4 text-muted-foreground">Sorted arrays, pair finding</td>
                          <td className="py-3 px-4"><code className="text-primary">O(n)</code></td>
                          <td className="py-3 px-4">Array</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 font-medium">Sliding Window</td>
                          <td className="py-3 px-4 text-muted-foreground">Subarray/substring problems</td>
                          <td className="py-3 px-4"><code className="text-primary">O(n)</code></td>
                          <td className="py-3 px-4">Array + Hash Map</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 font-medium">Binary Search</td>
                          <td className="py-3 px-4 text-muted-foreground">Optimization with monotonic property</td>
                          <td className="py-3 px-4"><code className="text-primary">O(log n)</code></td>
                          <td className="py-3 px-4">Sorted Array</td>
                        </tr>
                        <tr className="border-b border-border">
                          <td className="py-3 px-4 font-medium">Dynamic Programming</td>
                          <td className="py-3 px-4 text-muted-foreground">Overlapping subproblems</td>
                          <td className="py-3 px-4"><code className="text-primary">O(n²) or O(n×m)</code></td>
                          <td className="py-3 px-4">2D Array / Memo Map</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 font-medium">Stack</td>
                          <td className="py-3 px-4 text-muted-foreground">LIFO, next greater/smaller</td>
                          <td className="py-3 px-4"><code className="text-primary">O(n)</code></td>
                          <td className="py-3 px-4">Stack</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Training Tab */}
            <TabsContent value="training">
              <div className="grid lg:grid-cols-2 gap-6">
                <ConstraintTraining />
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      Why Constraint Training?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      One of the most common mistakes is not analyzing constraints before coding. 
                      This leads to TLE (Time Limit Exceeded) errors and wasted time.
                    </p>
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">The 10⁸ Rule</h4>
                      <p className="text-sm text-muted-foreground">
                        Most systems can handle ~10⁸ operations per second. Use this to quickly 
                        estimate if your algorithm will pass:
                      </p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• n = 10⁴ → O(n²) = 10⁸ ✓ (borderline)</li>
                        <li>• n = 10⁵ → O(n²) = 10¹⁰ ✗ (too slow)</li>
                        <li>• n = 10⁶ → O(n log n) = 2×10⁷ ✓ (fast)</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Feedback Tab */}
            <TabsContent value="feedback">
              <div className="grid lg:grid-cols-2 gap-6">
                <MistakeFeedback />
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                      Top 5 Mistakes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { rank: 1, mistake: "Not checking constraints", pct: 34 },
                        { rank: 2, mistake: "Missing edge cases", pct: 28 },
                        { rank: 3, mistake: "Wrong complexity analysis", pct: 18 },
                        { rank: 4, mistake: "Off-by-one errors", pct: 12 },
                        { rank: 5, mistake: "Incorrect base cases", pct: 8 },
                      ].map((item) => (
                        <div key={item.rank} className="flex items-center gap-4">
                          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                            {item.rank}
                          </span>
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{item.mistake}</span>
                              <span className="text-muted-foreground">{item.pct}%</span>
                            </div>
                            <Progress value={item.pct} variant="warning" size="sm" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Edge Cases Tab */}
            <TabsContent value="edge-cases">
              <div className="grid lg:grid-cols-2 gap-6">
                <EdgeCaseGenerator problemType="array" />
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-accent" />
                      Edge Case Checklist
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-secondary/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Arrays</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>□ Empty array</li>
                          <li>□ Single element</li>
                          <li>□ Two elements</li>
                          <li>□ All same elements</li>
                          <li>□ All negative / all positive</li>
                          <li>□ Contains zeros</li>
                          <li>□ Maximum size (10⁵ or 10⁶)</li>
                        </ul>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Strings</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>□ Empty string</li>
                          <li>□ Single character</li>
                          <li>□ All same characters</li>
                          <li>□ Special characters</li>
                          <li>□ Spaces and whitespace</li>
                        </ul>
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-4">
                        <h4 className="font-semibold mb-2">Numbers</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>□ Zero</li>
                          <li>□ Negative numbers</li>
                          <li>□ Integer overflow (2³¹ - 1)</li>
                          <li>□ Very small/large values</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Patterns;
