"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme !== "light" : true;

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="transition-[background-color,border-color,transform] duration-200 ease-out hover:border-border hover:bg-[hsl(var(--foreground)/0.06)] active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary)/0.5)] dark:hover:border-[rgba(255,255,255,0.45)] dark:hover:bg-[rgba(255,255,255,0.08)]"
      style={{
        alignItems: "center",
        border: isDark
          ? "1px solid rgba(255,255,255,0.25)"
          : "1px solid hsl(var(--border) / 0.9)",
        borderRadius: "999px",
        color: isDark ? "#FFFFFF" : "hsl(var(--foreground))",
        cursor: "pointer",
        display: "flex",
        flexShrink: 0,
        height: "39px",
        justifyContent: "center",
        padding: 0,
        width: "39px",
        backgroundColor: "transparent",
      }}
    >
      {mounted &&
        (isDark ? (
          <Sun aria-hidden size={16} strokeWidth={1.8} />
        ) : (
          <Moon aria-hidden size={16} strokeWidth={1.8} />
        ))}
    </button>
  );
}
