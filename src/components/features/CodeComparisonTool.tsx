import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  GitCompare,
  Clock,
  Cpu,
  HardDrive,
  CheckCircle,
  XCircle,
  Lightbulb,
  Code,
  Zap,
} from "lucide-react";

interface CodeSolution {
  id: string;
  name: string;
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
  code: string;
  language: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
}

const sampleSolutions: CodeSolution[] = [
  {
    id: "brute",
    name: "Brute Force",
    approach: "Nested loops to check all pairs",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    language: "python",
    code: `def twoSum(nums, target):
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []`,
    pros: [
      "Simple to understand and implement",
      "No extra space required",
      "Works with any data type that supports comparison",
    ],
    cons: [
      "Slow for large arrays (O(n²) time)",
      "Not suitable for real-time applications",
      "May timeout on competitive programming platforms",
    ],
    bestFor: [
      "Small input sizes (n < 1000)",
      "When space is extremely limited",
      "Initial problem understanding",
    ],
  },
  {
    id: "hashmap",
    name: "Hash Map (Optimal)",
    approach: "Single pass with hash map lookup",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    language: "python",
    code: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    pros: [
      "Optimal time complexity O(n)",
      "Single pass through array",
      "Efficient for large datasets",
    ],
    cons: [
      "Uses extra O(n) space",
      "Hash collisions may affect performance",
      "Not cache-friendly for very small arrays",
    ],
    bestFor: [
      "Large input sizes",
      "Interview settings (shows optimization skills)",
      "Real-world applications",
    ],
  },
  {
    id: "twopointer",
    name: "Two Pointers (Sorted Array)",
    approach: "Sort array and use two pointers from ends",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    language: "python",
    code: `def twoSum(nums, target):
    # Store original indices
    indexed = [(num, i) for i, num in enumerate(nums)]
    indexed.sort()
    
    left, right = 0, len(nums) - 1
    while left < right:
        curr_sum = indexed[left][0] + indexed[right][0]
        if curr_sum == target:
            return [indexed[left][1], indexed[right][1]]
        elif curr_sum < target:
            left += 1
        else:
            right -= 1
    return []`,
    pros: [
      "No hash map needed",
      "Can be extended to find all pairs",
      "Good for sorted input",
    ],
    cons: [
      "Sorting adds O(n log n) overhead",
      "Need to track original indices",
      "More complex implementation",
    ],
    bestFor: [
      "When input is already sorted",
      "Finding multiple pairs",
      "Memory-constrained environments with sorted data",
    ],
  },
];

const CodeComparisonTool = () => {
  const [selectedLeft, setSelectedLeft] = useState<string>("brute");
  const [selectedRight, setSelectedRight] = useState<string>("hashmap");
  const [selectedProblem, setSelectedProblem] = useState<string>("two-sum");

  const leftSolution = sampleSolutions.find((s) => s.id === selectedLeft)!;
  const rightSolution = sampleSolutions.find((s) => s.id === selectedRight)!;

  const getComplexityColor = (complexity: string) => {
    if (complexity.includes("1") || complexity.includes("log")) return "text-green-500";
    if (complexity.includes("n)") && !complexity.includes("²")) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link to="/problems">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">
                <span className="gradient-text">Code Comparison Tool</span>
              </h1>
              <p className="text-muted-foreground">
                Compare different approaches and understand trade-offs
              </p>
            </div>
            <Select value={selectedProblem} onValueChange={setSelectedProblem}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select problem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="two-sum">Two Sum</SelectItem>
                <SelectItem value="container-water">Container With Most Water</SelectItem>
                <SelectItem value="longest-substring">Longest Substring</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Comparison Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Solution */}
            <Card className="border-2 border-blue-500/30">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-500" />
                    Solution A
                  </CardTitle>
                  <Select value={selectedLeft} onValueChange={setSelectedLeft}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleSolutions.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <SolutionDetails solution={leftSolution} getComplexityColor={getComplexityColor} />
              </CardContent>
            </Card>

            {/* Right Solution */}
            <Card className="border-2 border-green-500/30">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-green-500" />
                    Solution B
                  </CardTitle>
                  <Select value={selectedRight} onValueChange={setSelectedRight}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sampleSolutions.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <SolutionDetails solution={rightSolution} getComplexityColor={getComplexityColor} />
              </CardContent>
            </Card>
          </div>

          {/* Comparison Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5" />
                Comparison Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Time Complexity
                  </h4>
                  <div className="flex items-center gap-4">
                    <span className={getComplexityColor(leftSolution.timeComplexity)}>
                      {leftSolution.name}: {leftSolution.timeComplexity}
                    </span>
                    <span className="text-muted-foreground">vs</span>
                    <span className={getComplexityColor(rightSolution.timeComplexity)}>
                      {rightSolution.name}: {rightSolution.timeComplexity}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {leftSolution.timeComplexity > rightSolution.timeComplexity
                      ? `${rightSolution.name} is faster`
                      : leftSolution.timeComplexity < rightSolution.timeComplexity
                      ? `${leftSolution.name} is faster`
                      : "Both have same time complexity"}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-primary" />
                    Space Complexity
                  </h4>
                  <div className="flex items-center gap-4">
                    <span className={getComplexityColor(leftSolution.spaceComplexity)}>
                      {leftSolution.name}: {leftSolution.spaceComplexity}
                    </span>
                    <span className="text-muted-foreground">vs</span>
                    <span className={getComplexityColor(rightSolution.spaceComplexity)}>
                      {rightSolution.name}: {rightSolution.spaceComplexity}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    Recommendation
                  </h4>
                  <p className="text-sm">
                    For interviews, prefer <span className="text-primary font-semibold">Hash Map</span> approach 
                    as it demonstrates optimization skills and has optimal time complexity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

const SolutionDetails = ({
  solution,
  getComplexityColor,
}: {
  solution: CodeSolution;
  getComplexityColor: (c: string) => string;
}) => {
  return (
    <div className="space-y-4">
      {/* Approach */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-1">Approach</h4>
        <p className="font-medium">{solution.approach}</p>
      </div>

      {/* Complexity */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className={`font-mono ${getComplexityColor(solution.timeComplexity)}`}>
            {solution.timeComplexity}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-muted-foreground" />
          <span className={`font-mono ${getComplexityColor(solution.spaceComplexity)}`}>
            {solution.spaceComplexity}
          </span>
        </div>
      </div>

      {/* Code */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Code</h4>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{solution.code}</code>
        </pre>
      </div>

      {/* Pros */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-500" />
          Pros
        </h4>
        <ul className="space-y-1">
          {solution.pros.map((pro, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <Zap className="h-3 w-3 mt-1.5 text-green-500 shrink-0" />
              {pro}
            </li>
          ))}
        </ul>
      </div>

      {/* Cons */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
          <XCircle className="h-4 w-4 text-red-500" />
          Cons
        </h4>
        <ul className="space-y-1">
          {solution.cons.map((con, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span className="h-3 w-3 mt-1.5 text-red-500 shrink-0">•</span>
              {con}
            </li>
          ))}
        </ul>
      </div>

      {/* Best For */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Best For</h4>
        <div className="flex flex-wrap gap-2">
          {solution.bestFor.map((use, i) => (
            <Badge key={i} variant="secondary">
              {use}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeComparisonTool;
