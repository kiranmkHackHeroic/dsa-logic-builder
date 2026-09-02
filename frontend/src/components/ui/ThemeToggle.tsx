import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`h-9 w-9 rounded-lg opacity-70 ${className || ""}`}
        aria-label="Toggle theme"
      >
        <span className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = (theme === "system" ? resolvedTheme : theme) === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative h-9 w-9 rounded-lg border border-border/60 hover:bg-secondary hover:border-primary/40 transition-all duration-200 active:scale-95 ${className || ""}`}
      title={isDark ? "Switch to Light theme (White)" : "Switch to Dark theme (Black)"}
      aria-label={isDark ? "Switch to Light theme" : "Switch to Dark theme"}
    >
      <Sun className={`h-4 w-4 text-amber-500 transition-all duration-300 ${
        isDark ? "rotate-90 scale-0 opacity-0 absolute" : "rotate-0 scale-100 opacity-100"
      }`} />
      <Moon className={`h-4 w-4 text-indigo-400 transition-all duration-300 ${
        isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0 absolute"
      }`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default ThemeToggle;
