import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import StepIndicator from "@/components/problem/StepIndicator";
import UnderstandProblemStep from "@/components/problem/UnderstandProblemStep";
import HumanThinkingStep from "@/components/problem/HumanThinkingStep";
import BruteForceStep from "@/components/problem/BruteForceStep";
import OptimizationStep from "@/components/problem/OptimizationStep";
import FinalApproachStep from "@/components/problem/FinalApproachStep";
import CodingStep from "@/components/problem/CodingStep";
import VisualizationStep from "@/components/problem/VisualizationStep";
import { useProblemProgress } from "@/hooks/useProblemProgress";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Clock, BookOpen, ExternalLink, Loader2, Trophy, Sparkles, ArrowRight } from "lucide-react";
import { getProblemById } from "@/data/problems";
import { COMPANY_PROBLEMS } from "@/data/companyProblems";
import { useToast } from "@/hooks/use-toast";
import { readLocalProgress, writeLocalProgress } from "@/lib/progressStorage";

const toLeetCodeSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const getLeetCodeUrl = (title: string, explicitUrl?: string) => {
  if (explicitUrl) return explicitUrl;
  return `https://leetcode.com/problems/${toLeetCodeSlug(title)}/`;
};

const ProblemSolving = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const problemId = id || "1";
  const localScope = user?.id || "guest";
  const isCompanyRoute = problemId.startsWith("company-");
  const companyRouteId = isCompanyRoute ? Number(problemId.replace("company-", "")) : null;
  const numericProblemId = Number(problemId);
  const { progress, isLoading, updateProgressAsync } = useProblemProgress(problemId);

  const navigate = useNavigate();
  const problem = Number.isFinite(numericProblemId) ? getProblemById(numericProblemId) : undefined;
  const nextProblem = Number.isFinite(numericProblemId) ? getProblemById(numericProblemId + 1) : null;
  const companyProblem = isCompanyRoute
    ? COMPANY_PROBLEMS.find((item) => item.id === companyRouteId)
    : COMPANY_PROBLEMS.find((item) => item.localProblemId === numericProblemId);

  const problemData = {
    title: problem?.title || companyProblem?.title || `Problem #${problemId}`,
    difficulty: problem?.difficulty || companyProblem?.difficulty || "medium",
    pattern: problem?.pattern || companyProblem?.concept || "General",
    description:
      problem?.description ||
      `Solve ${problem?.title || companyProblem?.title || "this problem"} using the 7-step process: understand, think manually, brute force, optimize, finalize, code, and visualize.`,
    examples:
      problem?.examples?.length
        ? problem.examples
        : [
            {
              input: "Use the provided examples from the original problem statement.",
              output: "Derive expected output from the logic.",
              explanation: "If examples are missing, create small custom test cases before coding.",
            },
          ],
    constraints:
      problem?.constraints?.length
        ? problem.constraints
        : [
            "Read constraints from the source problem.",
            "Target an optimal solution based on input size.",
            "Validate edge cases before final submission.",
          ],
    leetcodeUrl: getLeetCodeUrl(problem?.title || companyProblem?.title || `problem-${problemId}`, companyProblem?.leetcodeUrl),
    timeComplexity: problem?.timeComplexity || { brute: "O(n²)", optimal: "O(n)" },
    spaceComplexity: problem?.spaceComplexity || { brute: "O(1)", optimal: "O(n)" },
    hints: problem?.hints || [],
  };
  
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [isAdvancingStep, setIsAdvancingStep] = useState(false);

  useEffect(() => {
    setCurrentStep(1);
    setCompletedSteps([]);
    setInitialized(false);
    setIsAdvancingStep(false);
  }, [problemId, user?.id]);

  // Load saved progress after auth state settles to avoid early initialization with stale/null user.
  useEffect(() => {
    if (initialized || authLoading) return;

    if (progress) {
      setCurrentStep(progress.current_step || 1);
      setCompletedSteps(progress.completed_steps || []);
      setInitialized(true);
      return;
    }

    if (!isLoading && !user) {
      const localProgress = readLocalProgress(problemId, localScope);
      if (localProgress) {
        setCurrentStep(localProgress.current_step);
        setCompletedSteps(localProgress.completed_steps);
      }
      setInitialized(true);
      return;
    }

    if (!isLoading && user && !progress) {
      setInitialized(true);
    }
  }, [authLoading, initialized, isLoading, localScope, problemId, progress, user]);

  const totalSteps = 7;
  const progressPercent = (completedSteps.length / totalSteps) * 100;
  const maxUnlockedStep = Math.min(totalSteps, Math.max(1, ...completedSteps, currentStep) + 1);

  const isProblemCompleted = completedSteps.length === totalSteps || progress?.status === "completed";

  const completeStep = useCallback(async (step: number, metadata?: { code_solution?: string }) => {
    if (isAdvancingStep) return;

    const previousStep = currentStep;
    const previousCompleted = completedSteps;

    const newCompleted = completedSteps.includes(step) 
      ? completedSteps 
      : [...completedSteps, step];
    const newStep = step < totalSteps ? step + 1 : step;
    
    setCompletedSteps(newCompleted);
    setCurrentStep(newStep);
    if (!user) {
      writeLocalProgress(
        problemId,
        {
          current_step: newStep,
          completed_steps: newCompleted,
          ...(metadata?.code_solution ? { code_solution: metadata.code_solution } : {}),
        },
        localScope
      );
    }

    if (!user) return;

    setIsAdvancingStep(true);
    try {
      const isAllComplete = newCompleted.length === totalSteps;
      await updateProgressAsync({
        current_step: newStep,
        completed_steps: newCompleted,
        status: isAllComplete ? "completed" : "in_progress",
        ...(metadata?.code_solution ? { code_solution: metadata.code_solution } : {}),
        ...(isAllComplete ? { completed_at: new Date().toISOString() } : {}),
      });
    } catch {
      setCurrentStep(previousStep);
      setCompletedSteps(previousCompleted);
      if (!user) {
        writeLocalProgress(
          problemId,
          {
            current_step: previousStep,
            completed_steps: previousCompleted,
          },
          localScope
        );
      }
      toast({
        title: "Could not save progress",
        description: "Step progress was not saved. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAdvancingStep(false);
    }
  }, [
    completedSteps,
    currentStep,
    isAdvancingStep,
    localScope,
    problemId,
    toast,
    totalSteps,
    updateProgressAsync,
    user,
  ]);

  const getStepStatus = (step: number): "completed" | "active" | "locked" => {
    if (completedSteps.includes(step)) return "completed";
    if (step === currentStep) return "active";
    return "locked";
  };

  const steps = [
    { id: 1, title: "Understand Problem", status: getStepStatus(1) },
    { id: 2, title: "Human Thinking", status: getStepStatus(2) },
    { id: 3, title: "Brute Force", status: getStepStatus(3) },
    { id: 4, title: "Optimization", status: getStepStatus(4) },
    { id: 5, title: "Final Approach", status: getStepStatus(5) },
    { id: 6, title: "Coding", status: getStepStatus(6) },
    { id: 7, title: "Visualization", status: getStepStatus(7) },
  ];

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <UnderstandProblemStep
            problem={problemData}
            onComplete={() => void completeStep(1)}
            isActive={true}
          />
        );
      case 2:
        return (
          <HumanThinkingStep
            problem={problemData}
            onComplete={() => void completeStep(2)}
            isActive={true}
            isCompleted={completedSteps.includes(2)}
          />
        );
      case 3:
        return (
          <BruteForceStep
            problem={problemData}
            constraints={problemData.constraints}
            onComplete={() => void completeStep(3)}
            isActive={true}
            isCompleted={completedSteps.includes(3)}
          />
        );
      case 4:
        return (
          <OptimizationStep
            problem={problemData}
            onComplete={() => void completeStep(4)}
            isActive={true}
            isCompleted={completedSteps.includes(4)}
          />
        );
      case 5:
        return (
          <FinalApproachStep
            problem={problemData}
            onComplete={() => void completeStep(5)}
            isActive={true}
            isCompleted={completedSteps.includes(5)}
          />
        );
      case 6:
        return (
          <CodingStep
            isActive={true}
            isCompleted={completedSteps.includes(6)}
            onComplete={(code) => void completeStep(6, { code_solution: code })}
            savedCode={progress?.code_solution}
            starterCode={problem?.starterCode}
            problemTitle={problemData.title}
            examples={problemData.examples}
            leetcodeUrl={problemData.leetcodeUrl}
            autoOpenLeetCode={false}
          />
        );
      default:
        return (
          <VisualizationStep
            isActive={true}
            isCompleted={completedSteps.includes(7)}
            onComplete={() => void completeStep(7)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Link to="/problems">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold">{problemData.title}</h1>
                  <Badge variant={problemData.difficulty as "easy" | "medium" | "hard"}>
                    {problemData.difficulty}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {problemData.pattern}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    ~30 min
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a href={problemData.leetcodeUrl} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  LeetCode
                </Button>
              </a>
              <div className="text-sm text-muted-foreground">
                Progress: {completedSteps.length}/{totalSteps} steps
              </div>
              <Progress value={progressPercent} variant="accent" className="w-32" />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:hidden mb-4 bg-card/50 border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Step {currentStep} of {totalSteps}</p>
              <Badge variant="step-active">{steps[currentStep - 1]?.title}</Badge>
            </div>
            <Progress value={(currentStep / totalSteps) * 100} variant="primary" />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isAdvancingStep || currentStep <= 1}
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isAdvancingStep || currentStep >= maxUnlockedStep}
                onClick={() => setCurrentStep((prev) => Math.min(maxUnlockedStep, prev + 1))}
              >
                Next
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[240px_1fr] gap-6">
            {/* Step Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24 bg-card/50 rounded-xl border border-border p-4">
                <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wide">
                  Problem Flow
                </h3>
                <StepIndicator 
                  steps={steps}
                  currentStep={currentStep}
                  onStepClick={(step) => {
                    if (!isAdvancingStep && (completedSteps.includes(step) || step === currentStep)) {
                      setCurrentStep(step);
                    }
                  }}
                />
              </div>
            </div>

            {/* Steps Content */}
            <div className="space-y-6">
              {!user && (
                <div className="text-sm text-muted-foreground">
                  Progress is being saved locally on this device.
                </div>
              )}
              {isProblemCompleted && (
                <div className="bg-gradient-to-r from-success/15 via-primary/10 to-accent/15 border border-success/30 rounded-xl p-5 shadow-sm animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success shrink-0">
                        <Trophy className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground flex items-center gap-2">
                          Problem Completed! <Sparkles className="h-4 w-4 text-warning" />
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          All 7 steps mastered. Your solution and logic breakdown have been saved.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {nextProblem && (
                        <Button
                          variant="hero"
                          size="sm"
                          onClick={() => navigate(`/problems/${nextProblem.id}`)}
                          className="flex-1 sm:flex-none"
                        >
                          Next Problem <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/dashboard")}
                        className="flex-1 sm:flex-none"
                      >
                        Dashboard
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {renderCurrentStep()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProblemSolving;
