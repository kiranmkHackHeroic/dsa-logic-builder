import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  description: string;
  action: () => void;
}

/**
 * Hook to manage keyboard shortcuts throughout the application
 */
export const useKeyboardShortcuts = (shortcuts: ShortcutConfig[], enabled = true) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : true;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          event.preventDefault();
          shortcut.action();
          break;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
};

/**
 * Global navigation shortcuts
 */
export const useGlobalShortcuts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const shortcuts: ShortcutConfig[] = [
    {
      key: "p",
      ctrl: true,
      description: "Go to Problems",
      action: () => navigate("/problems"),
    },
    {
      key: "d",
      ctrl: true,
      description: "Go to Dashboard",
      action: () => navigate("/dashboard"),
    },
    {
      key: "i",
      ctrl: true,
      description: "Go to Interview Mode",
      action: () => navigate("/interview"),
    },
    {
      key: "/",
      description: "Show keyboard shortcuts",
      action: () => {
        toast({
          title: "Keyboard Shortcuts",
          description: "Ctrl+P: Problems | Ctrl+D: Dashboard | Ctrl+I: Interview | ?: Help",
        });
      },
    },
    {
      key: "?",
      shift: true,
      description: "Show help",
      action: () => {
        toast({
          title: "Keyboard Shortcuts",
          description: "Ctrl+P: Problems | Ctrl+D: Dashboard | Ctrl+I: Interview",
        });
      },
    },
  ];

  useKeyboardShortcuts(shortcuts);
};

/**
 * Problem solving page shortcuts
 */
export const useProblemSolvingShortcuts = ({
  onNextStep,
  onPrevStep,
  onRunCode,
  onSubmitCode,
  enabled = true,
}: {
  onNextStep?: () => void;
  onPrevStep?: () => void;
  onRunCode?: () => void;
  onSubmitCode?: () => void;
  enabled?: boolean;
}) => {
  const shortcuts: ShortcutConfig[] = [
    ...(onNextStep
      ? [
          {
            key: "Enter",
            ctrl: true,
            description: "Go to next step",
            action: onNextStep,
          },
        ]
      : []),
    ...(onPrevStep
      ? [
          {
            key: "Backspace",
            ctrl: true,
            description: "Go to previous step",
            action: onPrevStep,
          },
        ]
      : []),
    ...(onRunCode
      ? [
          {
            key: "r",
            ctrl: true,
            description: "Run code",
            action: onRunCode,
          },
        ]
      : []),
    ...(onSubmitCode
      ? [
          {
            key: "s",
            ctrl: true,
            shift: true,
            description: "Submit code",
            action: onSubmitCode,
          },
        ]
      : []),
  ];

  useKeyboardShortcuts(shortcuts, enabled);
};

export default useKeyboardShortcuts;
