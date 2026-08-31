import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Sparkles, Database } from "lucide-react";
import { useState } from "react";

interface OptimizationStepProps {
  onComplete: () => void;
  isActive: boolean;
  isCompleted: boolean;
}

const dataStructures = [
  "Array", "Hash Map", "Hash Set", "Stack", "Queue", 
  "Heap/Priority Queue", "Tree", "Graph", "Trie"
];

const patterns = [
  "Two Pointers", "Sliding Window", "Binary Search", 
  "Dynamic Programming", "Greedy", "DFS/BFS", 
  "Divide & Conquer", "Monotonic Stack"
];

const OptimizationStep = ({ onComplete, isActive, isCompleted }: OptimizationStepProps) => {
  const [inefficiency, setInefficiency] = useState("");
  const [selectedDS, setSelectedDS] = useState<string[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<string[]>([]);
  const [optimization, setOptimization] = useState("");

  const toggleSelection = (item: string, list: string[], setList: (items: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const isReady = 
    inefficiency.length >= 20 && 
    selectedDS.length > 0 && 
    selectedPattern.length > 0 && 
    optimization.length >= 30;

  return (
    <Card variant={isActive ? "step-active" : isCompleted ? "step-completed" : "step-locked"}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold">
              4
            </span>
            Optimization Discovery
          </CardTitle>
          {isCompleted && (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Completed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instruction */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h5 className="font-medium text-primary">Find the Insight</h5>
              <p className="text-sm text-muted-foreground mt-1">
                What is causing the brute force to be slow? What data structure or technique can help?
              </p>
            </div>
          </div>
        </div>

        {isActive && (
          <>
            {/* Inefficiency Analysis */}
            <div>
              <label className="block text-sm font-medium mb-2">
                What specific operation is making the brute force slow?
              </label>
              <Textarea
                value={inefficiency}
                onChange={(e) => setInefficiency(e.target.value)}
                placeholder="The nested loop means we're repeatedly searching for the complement. Each search takes O(n) time..."
                className="min-h-[80px]"
              />
            </div>

            {/* Data Structure Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Database className="h-4 w-4" />
                Which data structure(s) could help?
              </label>
              <div className="flex flex-wrap gap-2">
                {dataStructures.map((ds) => (
                  <Button
                    key={ds}
                    variant={selectedDS.includes(ds) ? "step-active" : "step"}
                    size="sm"
                    onClick={() => toggleSelection(ds, selectedDS, setSelectedDS)}
                  >
                    {ds}
                  </Button>
                ))}
              </div>
            </div>

            {/* Pattern Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Which algorithm pattern applies?
              </label>
              <div className="flex flex-wrap gap-2">
                {patterns.map((pattern) => (
                  <Button
                    key={pattern}
                    variant={selectedPattern.includes(pattern) ? "step-active" : "step"}
                    size="sm"
                    onClick={() => toggleSelection(pattern, selectedPattern, setSelectedPattern)}
                  >
                    {pattern}
                  </Button>
                ))}
              </div>
            </div>

            {/* Optimization Explanation */}
            <div>
              <label className="block text-sm font-medium mb-2">
                How will this optimize the solution?
              </label>
              <Textarea
                value={optimization}
                onChange={(e) => setOptimization(e.target.value)}
                placeholder="By using a Hash Map, we can store each number we've seen. For each new number, we check if its complement exists in O(1) time instead of O(n)..."
                className="min-h-[100px]"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {!isReady ? "Complete all fields to continue" : "✓ Great optimization insight!"}
              </span>
              <Button
                onClick={onComplete}
                disabled={!isReady}
                variant={isReady ? "success" : "secondary"}
              >
                Proceed to Final Approach
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default OptimizationStep;
