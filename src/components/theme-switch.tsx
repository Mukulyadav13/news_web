"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MonitorIcon, MoonIcon, SunIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function ThemeSwitch({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus-ring",
        isDark ? "bg-community" : "bg-muted-2",
        className,
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full bg-surface text-ink-soft shadow-sm transition-transform duration-200",
          isDark ? "translate-x-[22px]" : "translate-x-0.5",
        )}
      >
        {mounted ? (
          isDark ? (
            <MoonIcon className="h-3 w-3" />
          ) : (
            <SunIcon className="h-3 w-3" />
          )
        ) : (
          <MonitorIcon className="h-3 w-3" />
        )}
      </span>
    </button>
  );
}
