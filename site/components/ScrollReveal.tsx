"use client";

import { useEffect, useRef, useState } from "react";

type AnimationVariant = "fade-up" | "fade-in-left" | "scale-up";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: AnimationVariant;
}

const variantClasses: Record<AnimationVariant, string> = {
  "fade-up": "animate-fade-up",
  "fade-in-left": "animate-fade-in-left",
  "scale-up": "animate-scale-up",
};

export function ScrollReveal({
  children,
  delay = 0,
  className = "",
  variant = "fade-up",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${visible ? variantClasses[variant] : "opacity-0"}`}
      style={visible && delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
