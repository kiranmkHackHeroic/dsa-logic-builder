import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Coffee,
  Brain,
  Settings,
  CheckCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalStorage } from "@/hooks/useUtils";

type TimerMode = "focus" | "shortBreak" | "longBreak";

interface PomodoroSettings {
  focusDuration: number; // minutes
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsBeforeLongBreak: number;
}

interface PomodoroStats {
  totalFocusSessions: number;
  totalFocusMinutes: number;
  todaySessions: number;
  todayMinutes: number;
  lastSessionDate: string;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
};

const PomodoroTimer = () => {
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>(
    "pomodoro-settings",
    DEFAULT_SETTINGS
  );
  const [stats, setStats] = useLocalStorage<PomodoroStats>("pomodoro-stats", {
    totalFocusSessions: 0,
    totalFocusMinutes: 0,
    todaySessions: 0,
    todayMinutes: 0,
    lastSessionDate: "",
  });

  const [mode, setMode] = useState<TimerMode>("focus");
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // Reset daily stats if it's a new day
  useEffect(() => {
    if (stats.lastSessionDate !== today) {
      setStats((prev) => ({
        ...prev,
        todaySessions: 0,
        todayMinutes: 0,
        lastSessionDate: today,
      }));
    }
  }, [today, stats.lastSessionDate, setStats]);

  // Handle timer complete
  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);

    // Play notification sound
    const audio = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleC0ALIjQ4emvYhQAJIjO5fK/dCsAG4LG4/bRhz0AEHy+3vjdkUoAAXO12/nnm1gAAGit1PjwnGIAAGCo0Pf0oGcAAFmjzPX4pGwAAFOey/P8qHIAAE2Zyez+rHgAAEmVxuj/sH4AAEWSwOT/tIQAAEGPu+D/uIkAAD2Lttz/vI8AADmIs9n/wZUAADaFsNb/xZsAADOCrNP/yqEAADCAqNH/zqcAAC19o87/0q0AACp6oMz/1rMAAChynsr/2rkAACVvm8j/3b8AACJtmMb/4MUAACBqksT/48sAAB1njML/5tEAABtkiL//6dcAABhig73/7N0AABZfer7/7+MAABJ4d7z/8ukAABB2dbr/9O8AAA50c7n/9vQAAAxycrf/+PkAAAtwcLX/+v4AAAhubrT//AMAB2xss///BwAFamqq//8LAARoaKn//w8AAmdmpv//EwACZGSk//8YAAFiYqL//xwAAGBgn///IQAAnp6e//8mAACcnJz//ysAAJqamv//LwAAmJiY//80AACXV1f//zgAAJVVVf//PQAAk1NT//9CAACRUlL//0cAAJBQUP//TAAAT09P//9RAABNT0///1YAAE1NTf//WwAAS0tL//9gAABKSkr//2UAAEhISP//agAARkZG//9vAABFRUX//3QAAENDQ///eQAAQkJC//9+AAA/Pz///4MAADw8PP//iAAAOjo6//+NAAA4ODj//5IAADc3N///lwAANTU1//+cAAAzMzP//6EAADIyMv//pgAAMDAw//+rAAAtLS3//7AAADQ0NP//tQAAMjIy//+6AAAoKCj//8EAACoqKv//xAAA"
    );
    audio.play().catch(() => {}); // Ignore if autoplay blocked

    if (mode === "focus") {
      const newSessionsCompleted = sessionsCompleted + 1;
      setSessionsCompleted(newSessionsCompleted);

      // Update stats
      setStats((prev) => ({
        ...prev,
        totalFocusSessions: prev.totalFocusSessions + 1,
        totalFocusMinutes: prev.totalFocusMinutes + settings.focusDuration,
        todaySessions: prev.todaySessions + 1,
        todayMinutes: prev.todayMinutes + settings.focusDuration,
        lastSessionDate: today,
      }));

      // Determine next break type
      if (newSessionsCompleted % settings.sessionsBeforeLongBreak === 0) {
        setMode("longBreak");
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setMode("shortBreak");
        setTimeLeft(settings.shortBreakDuration * 60);
      }
    } else {
      setMode("focus");
      setTimeLeft(settings.focusDuration * 60);
    }
  }, [mode, sessionsCompleted, setStats, settings, today]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, handleTimerComplete]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(
      mode === "focus"
        ? settings.focusDuration * 60
        : mode === "shortBreak"
        ? settings.shortBreakDuration * 60
        : settings.longBreakDuration * 60
    );
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(
      newMode === "focus"
        ? settings.focusDuration * 60
        : newMode === "shortBreak"
        ? settings.shortBreakDuration * 60
        : settings.longBreakDuration * 60
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getDuration = () => {
    switch (mode) {
      case "focus":
        return settings.focusDuration * 60;
      case "shortBreak":
        return settings.shortBreakDuration * 60;
      case "longBreak":
        return settings.longBreakDuration * 60;
    }
  };

  const progress = ((getDuration() - timeLeft) / getDuration()) * 100;

  const modeConfig = {
    focus: {
      label: "Focus",
      icon: Brain,
      color: "text-primary",
      bgColor: "bg-primary/10",
      gradient: "from-primary to-primary/50",
    },
    shortBreak: {
      label: "Short Break",
      icon: Coffee,
      color: "text-success",
      bgColor: "bg-success/10",
      gradient: "from-success to-success/50",
    },
    longBreak: {
      label: "Long Break",
      icon: Coffee,
      color: "text-warning",
      bgColor: "bg-warning/10",
      gradient: "from-warning to-warning/50",
    },
  };

  const currentMode = modeConfig[mode];
  const Icon = currentMode.icon;

  return (
    <Card className="overflow-hidden">
      <div className={`h-1 bg-gradient-to-r ${currentMode.gradient}`} />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pomodoro Timer
          </CardTitle>
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Timer Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Focus Duration (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.focusDuration}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        focusDuration: parseInt(e.target.value) || 25,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Short Break (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.shortBreakDuration}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        shortBreakDuration: parseInt(e.target.value) || 5,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Long Break (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.longBreakDuration}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        longBreakDuration: parseInt(e.target.value) || 15,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sessions Before Long Break</Label>
                  <Input
                    type="number"
                    value={settings.sessionsBeforeLongBreak}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        sessionsBeforeLongBreak: parseInt(e.target.value) || 4,
                      }))
                    }
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mode Selector */}
        <div className="flex gap-2">
          {(["focus", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
            <Button
              key={m}
              variant={mode === m ? "default" : "outline"}
              size="sm"
              className="flex-1"
              onClick={() => switchMode(m)}
            >
              {modeConfig[m].label}
            </Button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="text-center py-8">
          <div
            className={`inline-flex items-center justify-center w-40 h-40 rounded-full ${currentMode.bgColor}`}
          >
            <div className="text-center">
              <Icon className={`h-8 w-8 mx-auto mb-2 ${currentMode.color}`} />
              <span className={`text-4xl font-bold ${currentMode.color}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Progress value={progress} className="h-2" />

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={resetTimer}
            className="w-12 h-12 rounded-full"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            onClick={toggleTimer}
            className="w-16 h-16 rounded-full"
          >
            {isRunning ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
        </div>

        {/* Session Progress */}
        <div className="flex justify-center gap-1">
          {Array.from({ length: settings.sessionsBeforeLongBreak }).map(
            (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < sessionsCompleted % settings.sessionsBeforeLongBreak
                    ? "bg-primary"
                    : "bg-secondary"
                }`}
              />
            )
          )}
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 gap-4 text-center pt-4 border-t">
          <div>
            <p className="text-2xl font-bold text-primary">
              {stats.todaySessions}
            </p>
            <p className="text-xs text-muted-foreground">Sessions Today</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success">
              {stats.todayMinutes}m
            </p>
            <p className="text-xs text-muted-foreground">Focus Time</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;
