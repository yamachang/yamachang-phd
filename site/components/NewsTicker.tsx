import { newsItems } from "@/data/news";
import { ScrollReveal } from "./ScrollReveal";

export function NewsTicker() {
  const recent = newsItems.slice(0, 4);
  if (recent.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto px-6 py-10">
      <ScrollReveal>
        <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-4">
          Latest News
        </h2>
      </ScrollReveal>
      <div className="space-y-3">
        {recent.map((item, i) => (
          <ScrollReveal key={item.id} delay={0.1 * (i + 1)}>
            <div className="border-l-2 border-[var(--color-highlight)]/30 pl-4 py-1">
              <p className="text-sm text-[var(--color-body)]">
                <span className="font-mono text-xs text-[var(--color-muted)] mr-2">
                  {item.date}
                </span>
                {item.text}
                {item.link && (
                  <a
                    href={item.link.url}
                    className="ml-2 font-mono text-xs text-[var(--color-accent)] hover:underline"
                  >
                    {item.link.label} &rarr;
                  </a>
                )}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
