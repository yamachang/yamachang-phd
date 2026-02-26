"use client";

import { useState } from "react";
import { Publication } from "@/types";
import { StatusDot } from "./StatusDot";

function highlightAuthor(authors: string[]) {
  return authors.map((author, i) => {
    const isYama = author.includes("Chang, Y. W");
    return (
      <span key={i}>
        {i > 0 && ", "}
        <span
          className={
            isYama ? "text-[var(--color-quaternary)] font-semibold" : ""
          }
        >
          {author}
        </span>
      </span>
    );
  });
}

export function PublicationRow({ pub }: { pub: Publication }) {
  const [showAbstract, setShowAbstract] = useState(false);

  return (
    <div className="group border-l-2 border-transparent hover:border-[var(--color-accent)] pl-4 py-3 transition-all duration-200">
      {/* Authors */}
      <p className="text-sm leading-relaxed">
        {highlightAuthor(pub.authors)}{" "}
        <span className="text-[var(--color-muted)]">({pub.year})</span>
      </p>

      {/* Title */}
      <p className="text-base italic mt-1 text-[var(--color-heading)]">
        {pub.title}
      </p>

      {/* SVG underline draw on hover */}
      <svg className="w-full h-0.5 mt-1 overflow-visible" aria-hidden="true">
        <line
          x1="0"
          y1="0"
          x2="100%"
          y2="0"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="transition-all duration-500 group-hover:[stroke-dashoffset:0]"
        />
      </svg>

      {/* Journal + Status */}
      <div className="flex flex-wrap items-center gap-3 mt-2">
        <span
          className="text-sm text-[var(--color-muted)]"
          style={{ fontVariant: "small-caps" }}
        >
          {pub.journal}
        </span>
        <StatusDot status={pub.status} />
      </div>

      {/* Links */}
      <div className="flex items-center gap-3 mt-2">
        {pub.doi && (
          <a
            href={`https://doi.org/${pub.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-[var(--color-accent)] hover:underline"
          >
            DOI
          </a>
        )}
        {pub.pdfUrl && (
          <a
            href={pub.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-[var(--color-accent)] hover:underline"
          >
            PDF
          </a>
        )}
      </div>

      {/* Abstract expand/collapse */}
      {pub.abstract && (
        <>
          <button
            onClick={() => setShowAbstract(!showAbstract)}
            className="font-mono text-xs text-[var(--color-accent)] hover:underline mt-2"
          >
            {showAbstract ? "Hide abstract" : "Abstract"}
          </button>
          <div
            className={`grid transition-all duration-300 ${
              showAbstract ? "grid-rows-[1fr] mt-2" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <p className="text-sm text-[var(--color-body)] leading-relaxed">
                {pub.abstract}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
