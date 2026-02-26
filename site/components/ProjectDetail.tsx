"use client";

import { useEffect, useCallback } from "react";
import { Project } from "@/types";

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

export function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-8 animate-fade-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-border)] transition-colors"
          aria-label="Close"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>

        {/* Role badge */}
        {project.role && (
          <span className="inline-block font-mono text-xs text-[var(--color-highlight)] bg-[var(--color-highlight)]/10 px-2 py-0.5 rounded mb-3">
            {project.role}
          </span>
        )}

        {/* Title */}
        <h2 className="font-heading text-2xl font-semibold text-[var(--color-heading)] mb-4">
          {project.title}
        </h2>

        {/* Full description */}
        <p className="text-base leading-relaxed text-[var(--color-body)] mb-6">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-xs bg-[var(--color-accent)]/10 text-[var(--color-accent)] px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Date */}
        <p className="font-mono text-xs text-[var(--color-muted)] mb-4">
          {new Date(project.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
          })}
        </p>

        {/* Links */}
        {project.links.length > 0 && (
          <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border)]">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--color-accent)] hover:underline"
              >
                {link.label}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
