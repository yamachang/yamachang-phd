"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Theme = "light" | "dark";

interface TransitionState {
  readonly active: boolean;
  readonly x: number;
  readonly y: number;
  readonly targetTheme: Theme;
}

const TRANSITION_DURATION_MS = 400;

const INITIAL_TRANSITION: TransitionState = {
  active: false,
  x: 0,
  y: 0,
  targetTheme: "light",
};

const ThemeContext = createContext<{
  theme: Theme;
  toggle: (e?: React.MouseEvent) => void;
}>({ theme: "light", toggle: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

function getTargetTheme(current: Theme): Theme {
  return current === "light" ? "dark" : "light";
}

function getThemeBgColor(theme: Theme): string {
  return theme === "dark" ? "#0a0a0a" : "#fafaf8";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [transition, setTransition] =
    useState<TransitionState>(INITIAL_TRANSITION);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    setTheme(stored || preferred);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = useCallback(
    (e?: React.MouseEvent) => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const nextTheme = getTargetTheme(theme);

      if (prefersReduced || !e) {
        setTheme(nextTheme);
        return;
      }

      const x = e.clientX;
      const y = e.clientY;

      setTransition({ active: true, x, y, targetTheme: nextTheme });

      const timer = setTimeout(() => {
        setTheme(nextTheme);
        setTransition(INITIAL_TRANSITION);
      }, TRANSITION_DURATION_MS);

      return () => clearTimeout(timer);
    },
    [theme]
  );

  // Animate overlay clip-path after it mounts
  useEffect(() => {
    if (!transition.active) return;
    const el = overlayRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.style.clipPath = `circle(150% at ${transition.x}px ${transition.y}px)`;
    });
  }, [transition]);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
      {transition.active && (
        <div
          ref={overlayRef}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            pointerEvents: "none",
            backgroundColor: getThemeBgColor(transition.targetTheme),
            clipPath: `circle(0% at ${transition.x}px ${transition.y}px)`,
            transition: `clip-path ${TRANSITION_DURATION_MS}ms ease-in-out`,
          }}
          aria-hidden="true"
        />
      )}
    </ThemeContext.Provider>
  );
}
