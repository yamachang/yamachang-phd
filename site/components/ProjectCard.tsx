"use client";

import { useState } from "react";
import { Project } from "@/types";
import { publications } from "@/data/publications";
import { MagneticCard } from "./MagneticCard";
import { ProjectDetail } from "./ProjectDetail";

export function ProjectCard({
  project,
  featured,
}: {
  project: Project;
  featured?: boolean;
}) {
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const relatedPubCount = publications.filter((pub) =>
    pub.tags.some((t) =>
      project.tags.some((pt) => pt.toLowerCase() === t.toLowerCase()),
    ),
  ).length;

  return (
    <>
      <MagneticCard className="h-full">
        <div
          onClick={() => setIsDetailOpen(true)}
          className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-6 h-full cursor-pointer"
        >
          {/* Role badge + publication count row */}
          <div className="flex items-center justify-between mb-3">
            {project.role ? (
              <span className="inline-block font-mono text-xs text-[var(--color-highlight)] bg-[var(--color-highlight)]/10 px-2 py-0.5 rounded">
                {project.role}
              </span>
            ) : (
              <span />
            )}

            {relatedPubCount > 0 && (
              <span className="font-mono text-[10px] text-[var(--color-muted)] bg-[var(--color-border)]/50 px-2 py-0.5 rounded-full">
                {relatedPubCount} {relatedPubCount === 1 ? "paper" : "papers"}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-heading text-xl font-semibold text-[var(--color-heading)] mb-2">
            {project.title}
          </h3>

          {/* Description */}
          <p
            className={`text-sm leading-relaxed text-[var(--color-body)] ${
              featured ? "" : "line-clamp-3"
            }`}
          >
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] bg-[var(--color-tertiary)]/10 text-[var(--color-tertiary)] px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Links */}
          {project.links.length > 0 && (
            <div className="flex items-center gap-3 mt-4 pt-3 border-t border-[var(--color-border)]">
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-mono text-xs text-[var(--color-accent)] hover:underline"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </MagneticCard>

      {/* Detail modal */}
      {isDetailOpen && (
        <ProjectDetail
          project={project}
          onClose={() => setIsDetailOpen(false)}
        />
      )}
    </>
  );
}
