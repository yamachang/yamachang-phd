import { timelineEntries } from "@/data/timeline";
import { ScrollReveal } from "./ScrollReveal";
import { TimelineEntry } from "@/types";

export function ResearchTimeline() {
  const prePhd = timelineEntries.filter((e) => e.era === "pre-phd");
  const phd = timelineEntries.filter((e) => e.era === "phd");

  return (
    <section className="max-w-4xl mx-auto px-6 py-16" id="journey">
      <ScrollReveal>
        <h2 className="font-heading text-2xl font-bold mb-12 text-[var(--color-heading)]">
          Research Journey
        </h2>
      </ScrollReveal>

      <div className="relative">
        {/* Gradient timeline line */}
        <div
          className="absolute left-4 top-0 bottom-0 w-0.5"
          style={{
            background:
              "linear-gradient(to bottom, color-mix(in srgb, var(--color-accent) 20%, transparent), color-mix(in srgb, var(--color-accent) 80%, transparent))",
          }}
        />

        {/* Pre-PhD Era */}
        <div className="mb-12">
          <div className="sticky top-20 z-10 bg-[var(--color-bg)] py-2 mb-6">
            <h3 className="font-heading text-lg font-bold text-[var(--color-tertiary)] uppercase tracking-wider pl-12">
              Pre-PhD Foundations
            </h3>
          </div>
          <TimelineEntries entries={prePhd} />
        </div>

        {/* PhD Era */}
        <div>
          <div className="sticky top-20 z-10 bg-[var(--color-bg)] py-2 mb-6">
            <h3 className="font-heading text-lg font-bold text-[var(--color-quaternary)] uppercase tracking-wider pl-12">
              PhD &amp; Beyond
            </h3>
          </div>
          <TimelineEntries entries={phd} />
        </div>
      </div>
    </section>
  );
}

function TimelineEntries({ entries }: { entries: readonly TimelineEntry[] }) {
  return (
    <div className="space-y-6">
      {entries.map((entry, i) => {
        const isPivot = entry.year === "" && entry.title === "The Pivot";

        return (
          <ScrollReveal key={i} delay={i * 0.1}>
            <div className="relative pl-12">
              {/* Dot on timeline */}
              <div
                className={`absolute left-[11px] top-2 w-3 h-3 rounded-full border-2 border-[var(--color-accent)] ${
                  isPivot ? "bg-[var(--color-accent)]" : "bg-[var(--color-bg)]"
                }`}
              />

              {isPivot ? (
                <blockquote className="text-lg italic text-[var(--color-accent)] py-4">
                  &ldquo;{entry.description}&rdquo;
                </blockquote>
              ) : (
                <>
                  {entry.year && (
                    <span className="font-mono text-xs text-[var(--color-muted)]">
                      {entry.year}
                    </span>
                  )}
                  <h4 className="font-heading text-base font-semibold text-[var(--color-heading)] mt-1">
                    {entry.title}
                  </h4>
                  <p className="text-sm text-[var(--color-body)] mt-1 leading-relaxed">
                    {entry.description}
                  </p>
                </>
              )}
            </div>
          </ScrollReveal>
        );
      })}
    </div>
  );
}
