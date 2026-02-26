"use client";

import { useEffect, useRef, useState } from "react";
import { publications } from "@/data/publications";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { value: publications.length, suffix: "+", label: "Publications" },
  { value: 10, suffix: "+", label: "Research Projects" },
  { value: 8, suffix: "+", label: "Years of Research" },
  { value: 3, suffix: "+", label: "Disciplines" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setCount(value);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, started]);

  useEffect(() => {
    if (!started) return;
    const duration = 1500;
    const startTime = performance.now();

    function update(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }, [started, value]);

  return (
    <span
      ref={ref}
      className="font-mono text-4xl md:text-5xl font-bold text-[var(--color-heading)]"
    >
      {count}
      {suffix}
    </span>
  );
}

export function StatsStrip() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-[var(--color-border)] py-10">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            <p className="text-sm text-[var(--color-muted)] mt-2">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
