import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft,
  ArrowRight, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  BookOpen,
  Target,
  Code,
  Play,
  Lightbulb,
  Users,
  ThumbsUp,
  MessageSquare,
  Zap
} from "lucide-react";

const patternData = {
  "two-pointers": {
    id: "two-pointers",
    name: "Two Pointers",
    description: "Use two pointers to traverse an array or string efficiently, often from opposite ends or at different speeds.",
    difficulty: "medium",
    problems: 24,
    mastery: 65,
    whenToUse: [
      "Sorted array problems where you need to find pairs",
      "Finding pairs that sum to a target value",
      "Removing duplicates in-place from sorted arrays",
      "Container with most water type problems",
      "Palindrome verification",
      "Merging sorted arrays"
    ],
    whenNotToUse: [
      "When order doesn't matter (use hash map instead)",
      "When you need to find ALL pairs, not just one",
      "Unsorted data where sorting would change semantics",
      "When elements need to be accessed randomly",
      "Problems requiring backtracking"
    ],
    commonMistakes: [
      "Forgetting to handle edge cases (empty array, single element)",
      "Off-by-one errors in pointer movement",
      "Not considering when to move which pointer",
      "Infinite loops when pointers don't converge",
      "Not handling duplicate elements properly"
    ],
    codeExamples: {
      python: `def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    
    while left < right:
        current_sum = nums[left] + nums[right]
        
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1  # Need larger sum
        else:
            right -= 1  # Need smaller sum
    
    return []  # No pair found`,
      java: `public int[] twoSumSorted(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    
    while (left < right) {
        int sum = nums[left] + nums[right];
        
        if (sum == target) {
            return new int[]{left, right};
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return new int[]{};
}`,
      cpp: `vector<int> twoSumSorted(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    
    while (left < right) {
        int sum = nums[left] + nums[right];
        
        if (sum == target) {
            return {left, right};
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return {};
}`
    },
    relatedProblems: [
      { id: 1, title: "Two Sum II - Input Array Is Sorted", difficulty: "medium" },
      { id: 2, title: "Container With Most Water", difficulty: "medium" },
      { id: 3, title: "3Sum", difficulty: "medium" },
      { id: 4, title: "Remove Duplicates from Sorted Array", difficulty: "easy" },
      { id: 5, title: "Valid Palindrome", difficulty: "easy" },
      { id: 6, title: "Trapping Rain Water", difficulty: "hard" },
    ],
    communityExplanations: [
      {
        id: 1,
        author: "CodeMaster_Alex",
        avatar: "A",
        content: "The key insight is that in a sorted array, if sum is too small, we need a bigger number (move left pointer). If sum is too big, we need a smaller number (move right pointer). This greedy approach works because sorting preserves the relative ordering.",
        likes: 142,
        isVerified: true
      },
      {
        id: 2,
        author: "DSA_Ninja",
        avatar: "D",
        content: "I always visualize it as squeezing from both ends. Start with the widest possible window and narrow it down based on the comparison. Each step eliminates one possibility, guaranteeing O(n) time.",
        likes: 89,
        isVerified: false
      }
    ],
    visualSteps: [
      { pointers: [0, 5], sum: 7, target: 9, action: "7 < 9, move left pointer right" },
      { pointers: [1, 5], sum: 12, target: 9, action: "12 > 9, move right pointer left" },
      { pointers: [1, 4], sum: 10, target: 9, action: "10 > 9, move right pointer left" },
      { pointers: [1, 3], sum: 9, target: 9, action: "Found! Return [1, 3]" },
    ]
  },
  "sliding-window": {
    id: "sliding-window",
    name: "Sliding Window",
    description: "Maintain a window of elements while traversing a sequence, expanding or shrinking based on conditions.",
    difficulty: "medium",
    problems: 18,
    mastery: 40,
    whenToUse: [
      "Finding longest/shortest substring with a constraint",
      "Maximum sum subarray of fixed size k",
      "Counting distinct elements in windows",
      "String permutation and anagram problems",
      "Minimum window substring problems"
    ],
    whenNotToUse: [
      "When window size is not fixed and no clear constraint",
      "When you need to process non-contiguous elements",
      "When the problem requires backtracking",
      "When elements can be rearranged"
    ],
    commonMistakes: [
      "Not shrinking window correctly when constraint violated",
      "Incorrect window size calculation (off by one)",
      "Not handling duplicate elements properly in character counts",
      "Forgetting to update the answer at the right time",
      "Not resetting state when starting a new window"
    ],
    codeExamples: {
      python: `def max_sum_subarray(nums, k):
    if len(nums) < k:
        return 0
    
    # Calculate sum of first window
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    # Slide the window
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum`,
      java: `public int maxSumSubarray(int[] nums, int k) {
    if (nums.length < k) return 0;
    
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    
    int maxSum = windowSum;
    for (int i = k; i < nums.length; i++) {
        windowSum += nums[i] - nums[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}`,
      cpp: `int maxSumSubarray(vector<int>& nums, int k) {
    if (nums.size() < k) return 0;
    
    int windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += nums[i];
    }
    
    int maxSum = windowSum;
    for (int i = k; i < nums.size(); i++) {
        windowSum += nums[i] - nums[i - k];
        maxSum = max(maxSum, windowSum);
    }
    return maxSum;
}`
    },
    relatedProblems: [
      { id: 1, title: "Longest Substring Without Repeating Characters", difficulty: "medium" },
      { id: 2, title: "Minimum Window Substring", difficulty: "hard" },
      { id: 3, title: "Permutation in String", difficulty: "medium" },
      { id: 4, title: "Maximum Average Subarray I", difficulty: "easy" },
    ],
    communityExplanations: [
      {
        id: 1,
        author: "WindowWizard",
        avatar: "W",
        content: "Think of it like looking through a camera viewfinder. You slide it across the scene, and at each position, you analyze what's visible. The trick is knowing when to zoom in (shrink) and when to pan (expand).",
        likes: 76,
        isVerified: true
      }
    ],
    visualSteps: []
  }
};

const PatternDetail = () => {
  const { patternId } = useParams();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<"python" | "java" | "cpp">("python");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVisualStep, setCurrentVisualStep] = useState(0);

  const pattern = patternData[patternId as keyof typeof patternData];

  if (!pattern) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-12 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Pattern not found</h1>
            <Button onClick={() => navigate("/patterns")}>Back to Patterns</Button>
          </div>
        </main>
      </div>
    );
  }

  const sampleArray = [1, 3, 5, 7, 9, 11];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          {/* Back Button & Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate("/patterns")} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Patterns
            </Button>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{pattern.name}</h1>
                  <Badge variant={pattern.difficulty === "easy" ? "success" : pattern.difficulty === "medium" ? "warning" : "destructive"}>
                    {pattern.difficulty}
                  </Badge>
                </div>
                <p className="text-muted-foreground max-w-2xl">{pattern.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground mb-1">Your Mastery</div>
                <div className="flex items-center gap-3">
                  <Progress value={pattern.mastery} variant="accent" className="w-32" />
                  <span className="font-bold text-lg">{pattern.mastery}%</span>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="learn" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 max-w-2xl">
              <TabsTrigger value="learn">Learn</TabsTrigger>
              <TabsTrigger value="visualize">Visualize</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>

            {/* Learn Tab */}
            <TabsContent value="learn" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* When to Use */}
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-success">
                      <CheckCircle className="h-5 w-5" />
                      When to Use
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {pattern.whenToUse.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-success mt-1 shrink-0">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* When Not to Use */}
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <XCircle className="h-5 w-5" />
                      When NOT to Use
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {pattern.whenNotToUse.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-destructive mt-1 shrink-0">✗</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Common Mistakes */}
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-warning">
                      <AlertTriangle className="h-5 w-5" />
                      Common Mistakes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {pattern.commonMistakes.map((item, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-warning mt-1 shrink-0">⚠</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Key Insight */}
              <Card variant="gradient">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Key Insight</h3>
                      <p className="text-muted-foreground">
                        {pattern.id === "two-pointers" 
                          ? "The two pointer technique works because each pointer movement eliminates at least one possibility. In sorted arrays, moving the left pointer right increases the sum, while moving the right pointer left decreases it. This gives us O(n) time instead of O(n²) brute force."
                          : "The sliding window technique maintains a contiguous view of elements. By tracking what enters and exits the window, we avoid recalculating everything from scratch, reducing O(n×k) operations to O(n)."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Visualize Tab */}
            <TabsContent value="visualize" className="space-y-6">
              <Card variant="step-active">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary" />
                    Interactive Visualization
                  </CardTitle>
                  <CardDescription>
                    Watch how the {pattern.name} pattern works step by step
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Array Visualization */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Array: <span className="font-mono">[{sampleArray.join(", ")}]</span>, Target: <span className="font-mono">9</span>
                    </p>
                    <div className="flex gap-2 justify-center py-4">
                      {sampleArray.map((num, idx) => {
                        const step = pattern.visualSteps[currentVisualStep];
                        const isLeftPointer = step?.pointers[0] === idx;
                        const isRightPointer = step?.pointers[1] === idx;
                        
                        return (
                          <div
                            key={idx}
                            className={`
                              w-16 h-16 flex flex-col items-center justify-center rounded-lg border-2 transition-all duration-300
                              ${isLeftPointer ? "border-primary bg-primary/20 scale-110" : ""}
                              ${isRightPointer ? "border-accent bg-accent/20 scale-110" : ""}
                              ${!isLeftPointer && !isRightPointer ? "border-border bg-secondary/50" : ""}
                            `}
                          >
                            <span className="font-mono font-bold">{num}</span>
                            <span className="text-xs text-muted-foreground">i={idx}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Pointer Labels */}
                    <div className="flex justify-center gap-6 mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-sm">Left Pointer</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-accent" />
                        <span className="text-sm">Right Pointer</span>
                      </div>
                    </div>
                  </div>

                  {/* Current Step Info */}
                  {pattern.visualSteps.length > 0 && (
                    <div className="bg-secondary/50 rounded-lg p-4 text-center">
                      <p className="font-medium">
                        Step {currentVisualStep + 1}: {pattern.visualSteps[currentVisualStep]?.action}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Current sum: {pattern.visualSteps[currentVisualStep]?.sum}
                      </p>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentVisualStep(0)}
                      disabled={currentVisualStep === 0}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentVisualStep(Math.max(0, currentVisualStep - 1))}
                      disabled={currentVisualStep === 0}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="hero"
                      onClick={() => setCurrentVisualStep(Math.min(pattern.visualSteps.length - 1, currentVisualStep + 1))}
                      disabled={currentVisualStep === pattern.visualSteps.length - 1}
                    >
                      Next Step
                    </Button>
                  </div>

                  {/* Step Progress */}
                  <div className="flex items-center justify-center gap-1">
                    {pattern.visualSteps.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentVisualStep(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          idx === currentVisualStep ? "bg-primary w-6" : idx < currentVisualStep ? "bg-success" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Code Tab */}
            <TabsContent value="code" className="space-y-6">
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-primary" />
                      Code Template
                    </CardTitle>
                    <div className="flex gap-2">
                      {(["python", "java", "cpp"] as const).map((lang) => (
                        <Button
                          key={lang}
                          variant={selectedLanguage === lang ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedLanguage(lang)}
                        >
                          {lang === "cpp" ? "C++" : lang.charAt(0).toUpperCase() + lang.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <div className="bg-secondary/50 px-4 py-2 border-b border-border flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-destructive/50" />
                        <div className="w-3 h-3 rounded-full bg-warning/50" />
                        <div className="w-3 h-3 rounded-full bg-success/50" />
                      </div>
                      <span className="text-xs text-muted-foreground font-mono ml-2">
                        {pattern.name.toLowerCase().replace(/\s+/g, "_")}.{selectedLanguage === "cpp" ? "cpp" : selectedLanguage === "java" ? "java" : "py"}
                      </span>
                    </div>
                    <pre className="p-4 overflow-x-auto text-sm font-mono bg-background">
                      <code>{pattern.codeExamples[selectedLanguage]}</code>
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Practice Tab */}
            <TabsContent value="practice" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Practice Problems
                </h2>
                <Badge variant="primary">{pattern.relatedProblems.length} problems</Badge>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {pattern.relatedProblems.map((problem) => (
                  <Link key={problem.id} to={`/problems/${problem.id}`}>
                    <Card variant="interactive" className="group h-full">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold group-hover:text-primary transition-colors">
                              {problem.title}
                            </p>
                            <Badge 
                              variant={problem.difficulty as "easy" | "medium" | "hard"} 
                              className="mt-2"
                            >
                              {problem.difficulty}
                            </Badge>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>

            {/* Community Tab */}
            <TabsContent value="community" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Community Explanations
                </h2>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Add Your Explanation
                </Button>
              </div>

              <div className="space-y-4">
                {pattern.communityExplanations.map((explanation) => (
                  <Card key={explanation.id} variant="elevated">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold shrink-0">
                          {explanation.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">{explanation.author}</span>
                            {explanation.isVerified && (
                              <Badge variant="success" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Mentor Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground">{explanation.content}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {explanation.likes}
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PatternDetail;
