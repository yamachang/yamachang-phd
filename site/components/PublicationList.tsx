"use client";

import { useMemo, useState } from "react";
import { publications } from "@/data/publications";
import { Publication } from "@/types";
import { PublicationRow } from "./PublicationRow";
import { FilterChips } from "./FilterChips";
import { ScrollReveal } from "./ScrollReveal";

const FILTER_OPTIONS = [
  "All",
  "First Author",
  "AI/ML",
  "LGBTQ+",
  "Digital Health",
  "Suicide",
  "Neuroscience",
];

function filterPublications(pubs: Publication[], filter: string): Publication[] {
  if (filter === "All") return pubs;
  if (filter === "First Author") return pubs.filter((p) => p.isFirstAuthor === true);
  return pubs.filter((p) =>
    p.tags.some((tag) => tag.toLowerCase().includes(filter.toLowerCase()))
  );
}

function groupByYear(pubs: Publication[]): Record<number, Publication[]> {
  return pubs.reduce<Record<number, Publication[]>>((acc, pub) => {
    const yearPubs = acc[pub.year];
    return { ...acc, [pub.year]: yearPubs ? [...yearPubs, pub] : [pub] };
  }, {});
}

export function PublicationList() {
  const [selected, setSelected] = useState("All");

  const filtered = useMemo(() => filterPublications(publications, selected), [selected]);
  const grouped = useMemo(() => groupByYear(filtered), [filtered]);

  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div>
      <FilterChips options={FILTER_OPTIONS} selected={selected} onSelect={setSelected} />

      <div className="space-y-12">
        {years.map((year, yi) => (
          <ScrollReveal key={`${selected}-${year}`} delay={yi * 0.1}>
            <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-x-8">
              {/* Year label -- sticky on desktop */}
              <div className="md:sticky md:top-20 md:self-start">
                <span className="font-heading text-2xl text-[var(--color-muted)]">{year}</span>
              </div>

              {/* Publications for this year */}
              <div className="space-y-2 mt-2 md:mt-0">
                {grouped[year].map((pub) => (
                  <PublicationRow key={pub.id} pub={pub} />
                ))}
              </div>
            </div>
          </ScrollReveal>
        ))}

        {years.length === 0 && (
          <p className="text-center text-[var(--color-muted)] font-mono text-sm py-12">
            No publications match this filter.
          </p>
        )}
      </div>
    </div>
  );
}
