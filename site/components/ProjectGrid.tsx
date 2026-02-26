"use client";

import { useState } from "react";
import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import { ScrollReveal } from "./ScrollReveal";
import { FilterChips } from "./FilterChips";

const FILTER_OPTIONS = [
  "All",
  "AI/ML",
  "Digital Mental Health",
  "LGBTQ+",
  "Suicide Prevention",
  "Machine Learning",
];

function matchesFilter(tags: string[], filter: string): boolean {
  const lowerTags = tags.map((t) => t.toLowerCase());

  switch (filter) {
    case "AI/ML":
      return lowerTags.some(
        (t) =>
          t.includes("machine learning") ||
          t.includes("computational") ||
          t.includes("ml")
      );
    case "Suicide Prevention":
      return lowerTags.some((t) => t.includes("suicide"));
    default:
      return lowerTags.some((t) => t === filter.toLowerCase());
  }
}

export function ProjectGrid() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => matchesFilter(p.tags, activeFilter));

  // Featured first, then by date descending
  const sorted = [...filtered].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div>
      <FilterChips
        options={FILTER_OPTIONS}
        selected={activeFilter}
        onSelect={setActiveFilter}
      />

      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
        {sorted.map((project, i) => (
          <ScrollReveal
            key={project.id}
            delay={i * 0.05}
            className={project.featured ? "md:col-span-2" : ""}
          >
            <ProjectCard project={project} featured={project.featured} />
          </ScrollReveal>
        ))}
      </div>

      {sorted.length === 0 && (
        <p className="text-center text-[var(--color-muted)] font-mono text-sm py-12">
          No projects match this filter.
        </p>
      )}
    </div>
  );
}
