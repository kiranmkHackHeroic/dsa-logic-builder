import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Clock, 
  RotateCcw,
  Bot,
  HelpCircle,
  SlidersHorizontal
} from "lucide-react";
import { Problem } from "@/types/problem";

interface VoiceInterviewPanelProps {
  problem: Problem | null;
  onTranscriptUpdate: (text: string) => void;
  onUnlockCode: () => void;
  canUnlock: boolean;
  initialTranscript?: string;
}

// Evaluation Rubric Checkers
const checkAssumptions = (text: string) => {
  const keywords = [
    "assume", "assumption", "empty", "null", "negative", "sorted", 
    "duplicate", "duplicates", "unique", "modify", "in-place", "single",
    "can the", "is the", "do we have"
  ];
  const count = keywords.filter((k) => text.toLowerCase().includes(k)).length;
  return {
    passed: count >= 2,
    count,
    feedback: count >= 2 
      ? "Great job stating key assumptions regarding input shapes, edge cases, and bounds."
      : "Clarify: Can inputs be empty, negative, or contain duplicates? Are inputs already sorted?",
  };
};

const checkConstraints = (text: string, problemConstraints?: string[]) => {
  const keywords = [
    "constraint", "constraints", "bound", "bounds", "length", "size", 
    "10^", "memory", "overflow", "limit", "time limit", "quadratic", "linear"
  ];
  const count = keywords.filter((k) => text.toLowerCase().includes(k)).length;
  const passed = count >= 2 || (problemConstraints && problemConstraints.some(c => text.includes(c.slice(0, 5))));
  return {
    passed,
    count,
    feedback: passed
      ? "Verified input constraints and determined the acceptable time/space boundary."
      : "Remember to verify: How large is N? Will O(N^2) time out (N > 10^4)?",
  };
};

const checkTradeoffs = (text: string) => {
  const keywords = [
    "trade-off", "tradeoff", "trade off", "time vs space", "space vs time",
    "brute force", "naive", "hash map", "two pointer", "extra space",
    "o(1) space", "o(n) time", "o(n^2)", "faster", "sacrifice", "instead of"
  ];
  const count = keywords.filter((k) => text.toLowerCase().includes(k)).length;
  return {
    passed: count >= 2,
    count,
    feedback: count >= 2
      ? "Strong trade-off analysis: compared naive baseline against optimal time & space."
      : "Explain trade-offs: Will you spend extra memory (O(N) space) to save execution time?",
  };
};

export const VoiceInterviewPanel = ({
  problem,
  onTranscriptUpdate,
  onUnlockCode,
  canUnlock,
  initialTranscript = "",
}: VoiceInterviewPanelProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState(initialTranscript);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(true);
  const [speakingSeconds, setSpeakingSeconds] = useState(0);
  const [aiInterviewerMessage, setAiInterviewerMessage] = useState(
    "Welcome! I am your AI Interviewer. Take the first 10 minutes to speak your thought process out loud: State your assumptions, verify the constraints, and explain your trade-offs before we start coding."
  );

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let currentInterim = "";
      let finalSpeech = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalSpeech += event.results[i][0].transcript + " ";
        } else {
          currentInterim += event.results[i][0].transcript;
        }
      }

      if (finalSpeech) {
        setTranscript((prev) => {
          const updated = (prev + " " + finalSpeech).trim();
          onTranscriptUpdate(updated);
          return updated;
        });
      }
      setInterimTranscript(currentInterim);
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      if (isListening) {
        try {
          recognition.start();
        } catch {
          setIsListening(false);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {}
    };
  }, []);

  // Verbal Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isListening) {
      interval = setInterval(() => {
        setSpeakingSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening]);

  // Real-time evaluation rubrics
  const evaluation = useMemo(() => {
    const fullText = `${transcript} ${interimTranscript}`.trim();
    const assumptions = checkAssumptions(fullText);
    const constraints = checkConstraints(fullText, problem?.constraints);
    const tradeoffs = checkTradeoffs(fullText);

    const readyToCode = assumptions.passed && constraints.passed && tradeoffs.passed;

    return {
      assumptions,
      constraints,
      tradeoffs,
      readyToCode,
      wordCount: fullText.split(/\s+/).filter(Boolean).length,
    };
  }, [transcript, interimTranscript, problem?.constraints]);

  // Voice output (Text to Speech)
  const speakAI = (text: string) => {
    if (!aiVoiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Trigger feedback when candidate covers milestones
  const feedbackTriggeredRef = useRef({ assumptions: false, constraints: false, tradeoffs: false });
  useEffect(() => {
    if (evaluation.assumptions.passed && !feedbackTriggeredRef.current.assumptions) {
      feedbackTriggeredRef.current.assumptions = true;
      const msg = "Excellent: You clarified your assumptions. Now examine the input constraints.";
      setAiInterviewerMessage(msg);
      speakAI(msg);
    } else if (evaluation.constraints.passed && !feedbackTriggeredRef.current.constraints) {
      feedbackTriggeredRef.current.constraints = true;
      const msg = "Good observation on constraints. Now compare the naive approach versus your optimal trade-off.";
      setAiInterviewerMessage(msg);
      speakAI(msg);
    } else if (evaluation.tradeoffs.passed && !feedbackTriggeredRef.current.tradeoffs) {
      feedbackTriggeredRef.current.tradeoffs = true;
      const msg = "Outstanding trade-off breakdown! You've checked all 3 FAANG criteria. You may now unlock the code editor.";
      setAiInterviewerMessage(msg);
      speakAI(msg);
    }
  }, [evaluation.assumptions.passed, evaluation.constraints.passed, evaluation.tradeoffs.passed]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  const formatSpeakingTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      {/* ── Top Voice Control Bar ── */}
      <div className="bg-card border border-border/80 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Pulsing Mic Button */}
            <button
              onClick={toggleListening}
              className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${
                isListening
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
              }`}
              title={isListening ? "Pause microphone" : "Start speaking thought process"}
            >
              {isListening ? (
                <>
                  <span className="absolute inset-0 rounded-full bg-rose-400 animate-ping opacity-75" />
                  <Mic className="h-6 w-6 relative z-10" />
                </>
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-base">
                  {isListening ? "Listening to Your Thought Process..." : "Click to Speak Your Thought Process"}
                </h4>
                {isListening && (
                  <Badge variant="destructive" className="animate-pulse text-[10px] uppercase font-bold py-0">
                    Live Audio
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                First 10 minutes: Verbalize your reasoning as if speaking to a FAANG interviewer.
              </p>
            </div>
          </div>

          {/* Right Controls: Timer & Audio Voice Toggle */}
          <div className="flex items-center gap-2.5 self-end sm:self-center">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-xs font-mono">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Speaking: {formatSpeakingTime(speakingSeconds)}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setAiVoiceEnabled(!aiVoiceEnabled)}
              className="h-8 gap-1.5 text-xs font-medium"
              title={aiVoiceEnabled ? "Mute AI Voice response" : "Enable AI Voice response"}
            >
              {aiVoiceEnabled ? (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-primary" />
                  <span className="hidden sm:inline">AI Voice On</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="hidden sm:inline">AI Voice Muted</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {!isSpeechSupported && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs text-amber-500 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Web Speech API is not supported in this browser. You can type your verbal explanation directly below.</span>
          </div>
        )}
      </div>

      {/* ── AI Interviewer Live Feedback Callout ── */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-0.5">
          <Bot className="h-4 w-4" />
        </div>
        <div className="space-y-1 text-xs">
          <span className="font-bold text-primary uppercase tracking-wider text-[10px]">
            AI Interviewer Feedback
          </span>
          <p className="text-foreground text-sm leading-relaxed">
            "{aiInterviewerMessage}"
          </p>
        </div>
      </div>

      {/* ── The 3 Core FAANG Evaluation Rubrics ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        
        {/* Rubric 1: Assumptions */}
        <div className={`p-4 rounded-xl border transition-all ${
          evaluation.assumptions.passed 
            ? "border-primary/50 bg-primary/5 shadow-2xs" 
            : "border-border/80 bg-card/60"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold flex items-center gap-1.5">
              {evaluation.assumptions.passed ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
              1. State Assumptions
            </span>
            <Badge variant={evaluation.assumptions.passed ? "default" : "outline"} className="text-[10px]">
              {evaluation.assumptions.passed ? "Verified" : "Pending"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {evaluation.assumptions.feedback}
          </p>
        </div>

        {/* Rubric 2: Constraints */}
        <div className={`p-4 rounded-xl border transition-all ${
          evaluation.constraints.passed 
            ? "border-primary/50 bg-primary/5 shadow-2xs" 
            : "border-border/80 bg-card/60"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold flex items-center gap-1.5">
              {evaluation.constraints.passed ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
              2. Verify Constraints
            </span>
            <Badge variant={evaluation.constraints.passed ? "default" : "outline"} className="text-[10px]">
              {evaluation.constraints.passed ? "Verified" : "Pending"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {evaluation.constraints.feedback}
          </p>
        </div>

        {/* Rubric 3: Trade-offs */}
        <div className={`p-4 rounded-xl border transition-all ${
          evaluation.tradeoffs.passed 
            ? "border-primary/50 bg-primary/5 shadow-2xs" 
            : "border-border/80 bg-card/60"
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold flex items-center gap-1.5">
              {evaluation.tradeoffs.passed ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500" />
              )}
              3. Explain Trade-offs
            </span>
            <Badge variant={evaluation.tradeoffs.passed ? "default" : "outline"} className="text-[10px]">
              {evaluation.tradeoffs.passed ? "Verified" : "Pending"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {evaluation.tradeoffs.feedback}
          </p>
        </div>

      </div>

      {/* ── Live Transcribed Speech Editor ── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Live Voice Transcript ({evaluation.wordCount} words spoken)
          </label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setTranscript("");
              setInterimTranscript("");
              onTranscriptUpdate("");
            }}
            className="h-7 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>

        <Textarea
          value={transcript + (interimTranscript ? ` [${interimTranscript}]` : "")}
          onChange={(e) => {
            setTranscript(e.target.value);
            onTranscriptUpdate(e.target.value);
          }}
          placeholder="Speak into your microphone. Your verbal thoughts, assumptions, and complexity analysis will transcribe here in real-time..."
          className="min-h-[140px] font-mono text-xs leading-relaxed"
        />
      </div>

      {/* ── Bottom Action Row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <span className="text-xs text-muted-foreground">
          {evaluation.readyToCode
            ? "✓ All 3 FAANG criteria verbalized. Ready to code!"
            : "Complete all 3 checks (Assumptions, Constraints, Trade-offs) to unlock the code editor."}
        </span>

        <Button
          onClick={onUnlockCode}
          disabled={!evaluation.readyToCode && !canUnlock}
          variant={evaluation.readyToCode || canUnlock ? "hero" : "secondary"}
          className="font-bold text-xs px-5 shadow-xs"
        >
          {evaluation.readyToCode || canUnlock ? "Unlock Code Editor ❯" : "Verbalize Criteria to Unlock"}
        </Button>
      </div>
    </div>
  );
};

export default VoiceInterviewPanel;
