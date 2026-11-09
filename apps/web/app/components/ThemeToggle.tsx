"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-border bg-card/60" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-9 h-9 rounded-xl bg-card hover:bg-accent border border-border text-muted-foreground hover:text-foreground transition-all duration-200 flex items-center justify-center relative shadow-xs cursor-pointer"
      aria-label="Toggle theme"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun size={17} className="text-amber-400 rotate-0 scale-100 transition-all duration-200" />
      ) : (
        <Moon size={17} className="text-[#075945] rotate-0 scale-100 transition-all duration-200" />
      )}
    </button>
  );
}
