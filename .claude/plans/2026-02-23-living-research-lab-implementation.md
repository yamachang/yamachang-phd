# Living Research Lab Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the academic website into an interactive, narrative-driven "Living Research Lab" with research network hero, journey timeline, blog, publication/project filters, and comprehensive micro-interactions.

**Architecture:** Enhance existing Next.js 14 App Router site. All new interactions use Canvas API, IntersectionObserver, requestAnimationFrame, and CSS transitions — no heavy libraries. Blog uses MDX via next-mdx-remote for markdown content. Static export preserved throughout.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Canvas API, MDX (next-mdx-remote + gray-matter)

**Existing site location:** `/Users/yamachang/Desktop/academic-YC/.claude/worktrees/inspiring-moser/site/`

---

## Task 1: Remove Resources Page & Update Navigation

**Files:**
- Delete: `site/app/resources/page.tsx`
- Delete: `site/data/resources.ts`
- Delete: `site/components/ResourceSection.tsx`
- Modify: `site/components/Nav.tsx`
- Modify: `site/components/MobileMenu.tsx`

**Step 1:** Delete `site/app/resources/page.tsx`, `site/data/resources.ts`, and `site/components/ResourceSection.tsx`.

**Step 2:** Update `site/components/Nav.tsx` — remove the "Resources" entry from the `links` array and add "Blog":

```typescript
const links = [
  { href: "/", label: "Home" },
  { href: "/publications", label: "Publications" },
  { href: "/research", label: "Research" },
  { href: "/blog", label: "Blog" },
];
```

**Step 3:** Verify the build passes: `cd site && npm run build`

**Step 4:** Commit: `git commit -m "refactor: remove resources page, add blog nav link"`

---

## Task 2: Add Research Network Data & Types

**Files:**
- Modify: `site/types/index.ts`
- Create: `site/data/research-network.ts`
- Create: `site/data/news.ts`
- Modify: `site/data/publications.ts` — add `abstract` field to publications that need it and add `filterTags` to support filtering

**Step 1:** Add new types to `site/types/index.ts`:

```typescript
export interface ResearchNode {
  id: string;
  label: string;
  category: "pre-phd" | "phd";
  size: number; // 1-5 scale, determines node radius
  description: string;
  publicationCount: number;
  connections: string[]; // ids of connected nodes
}

export interface NewsItem {
  id: string;
  date: string;
  text: string;
  link?: { label: string; url: string };
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  readingTime: number;
}

export interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  era: "pre-phd" | "phd";
  relatedIds?: string[]; // publication or project ids
}
```

**Step 2:** Create `site/data/research-network.ts` with ~12-15 research topic nodes. Organize into two clusters: Pre-PhD (muted) and PhD (vibrant). Size the "AI + Mental Health" node as the largest (size: 5). Define connections between related topics.

```typescript
import { ResearchNode } from "@/types";

export const researchNodes: ResearchNode[] = [
  // Pre-PhD cluster
  {
    id: "lgbtq-health",
    label: "LGBTQ+ Mental Health",
    category: "pre-phd",
    size: 3,
    description: "Identity development, minority stress, structural stigma",
    publicationCount: 3,
    connections: ["suicide-prevention", "structural-stigma", "digital-interventions"],
  },
  {
    id: "suicide-prevention",
    label: "Suicide Prevention",
    category: "pre-phd",
    size: 3,
    description: "Ideation trajectories, risk prediction, late-life depression",
    publicationCount: 3,
    connections: ["lgbtq-health", "computational-psych", "trauma"],
  },
  {
    id: "structural-stigma",
    label: "Structural Stigma",
    category: "pre-phd",
    size: 2,
    description: "Policy-level influences on minority health outcomes",
    publicationCount: 2,
    connections: ["lgbtq-health", "digital-interventions"],
  },
  {
    id: "trauma",
    label: "Childhood Trauma",
    category: "pre-phd",
    size: 2,
    description: "Early adversity and suicidal behavior onset",
    publicationCount: 1,
    connections: ["suicide-prevention", "computational-psych"],
  },
  {
    id: "clinical-psych",
    label: "Clinical Psychology",
    category: "pre-phd",
    size: 2,
    description: "Assessment, intervention design, clinical trials",
    publicationCount: 0,
    connections: ["lgbtq-health", "digital-interventions", "suicide-prevention"],
  },
  // Bridge topics
  {
    id: "digital-interventions",
    label: "Digital Interventions",
    category: "pre-phd",
    size: 3,
    description: "Single-session interventions, web-based RCTs",
    publicationCount: 2,
    connections: ["lgbtq-health", "structural-stigma", "jitais", "ai-mental-health"],
  },
  {
    id: "computational-psych",
    label: "Computational Psychiatry",
    category: "pre-phd",
    size: 2,
    description: "LASSO prediction, latent profile analysis",
    publicationCount: 2,
    connections: ["suicide-prevention", "machine-learning", "trauma"],
  },
  // PhD cluster
  {
    id: "ai-mental-health",
    label: "AI + Mental Health",
    category: "phd",
    size: 5,
    description: "Core research focus: AI-driven mental health systems",
    publicationCount: 0,
    connections: ["machine-learning", "jitais", "nlp", "passive-sensing", "digital-interventions"],
  },
  {
    id: "machine-learning",
    label: "Machine Learning",
    category: "phd",
    size: 3,
    description: "XGBoost, elastic net, time-series prediction",
    publicationCount: 1,
    connections: ["ai-mental-health", "computational-psych", "passive-sensing"],
  },
  {
    id: "jitais",
    label: "JITAIs",
    category: "phd",
    size: 4,
    description: "Just-in-time adaptive interventions for mental wellness",
    publicationCount: 0,
    connections: ["ai-mental-health", "digital-interventions", "passive-sensing", "llms"],
  },
  {
    id: "passive-sensing",
    label: "Passive Sensing",
    category: "phd",
    size: 3,
    description: "Wearable devices, multimodal data streams",
    publicationCount: 0,
    connections: ["ai-mental-health", "machine-learning", "jitais"],
  },
  {
    id: "nlp",
    label: "NLP",
    category: "phd",
    size: 2,
    description: "Natural language processing for clinical text",
    publicationCount: 0,
    connections: ["ai-mental-health", "llms"],
  },
  {
    id: "llms",
    label: "Large Language Models",
    category: "phd",
    size: 3,
    description: "LLM-based decision engines for adaptive support",
    publicationCount: 0,
    connections: ["ai-mental-health", "jitais", "nlp"],
  },
];
```

**Step 3:** Create `site/data/news.ts` with placeholder entries:

```typescript
import { NewsItem } from "@/types";

export const newsItems: NewsItem[] = [
  {
    id: "news-1",
    date: "2025-01",
    text: "Paper accepted at SSM-Mental Health on structural stigma and digital interventions",
    link: { label: "Read more", url: "/publications" },
  },
  {
    id: "news-2",
    date: "2025-01",
    text: "Paper on multiply-minoritized sexual minority adolescents accepted (in press)",
    link: { label: "Read more", url: "/publications" },
  },
];
```

**Step 4:** Add `abstract` field to publications in `site/data/publications.ts` where available. Add short abstracts for each publication. Also add `filterTags` to the Publication type to support "First Author" filtering:

In `site/types/index.ts`, add `isFirstAuthor?: boolean;` to the Publication interface.

Then in `site/data/publications.ts`, add `isFirstAuthor: true` for publications where Chang, Y. W. is first or joint first author, and add `abstract` strings.

**Step 5:** Create `site/data/timeline.ts` for the research journey:

```typescript
import { TimelineEntry } from "@/types";

export const timelineEntries: TimelineEntry[] = [
  {
    year: "2016",
    title: "First Research at National Taiwan University",
    description: "Began studying transgender identity development and minority stress experiences.",
    era: "pre-phd",
    relatedIds: ["cgnc"],
  },
  {
    year: "2017",
    title: "Columbia University — MA in Clinical Psychology",
    description: "Trained in clinical assessment and intervention design. Deepened focus on LGBTQ+ mental health disparities.",
    era: "pre-phd",
  },
  {
    year: "2018–2020",
    title: "Digital Interventions & LGBTQ+ Health Research",
    description: "Studied structural stigma, digital single-session interventions, and computational approaches to suicide risk.",
    era: "pre-phd",
    relatedIds: ["structural-stigma-ssi", "ml-lasso"],
  },
  {
    year: "",
    title: "The Pivot",
    description: "I realized AI could make mental health interventions more scalable, personalized, and accessible.",
    era: "pre-phd",
  },
  {
    year: "2021",
    title: "Dartmouth College — PhD in Quantitative Biomedical Science",
    description: "Joined the AI and Mental Health Lab at the Center for Technology and Behavioral Health. Pivoted to computational methods.",
    era: "phd",
  },
  {
    year: "2022–2023",
    title: "First ML + Mental Health Publications",
    description: "Published work on time-series prediction of depression and childhood trauma onset modeling.",
    era: "phd",
    relatedIds: ["ttt-ema", "chang-2023-childhood-trauma"],
  },
  {
    year: "2023",
    title: "Evergreen AI Campus Intervention System",
    description: "Began designing a real-time, campus-wide intervention system integrating multimodal data with LLM-based decision engines.",
    era: "phd",
  },
  {
    year: "Present",
    title: "Building at the Intersection",
    description: "Researching JITAIs, passive sensing, and clinical safety in AI-driven mental health systems.",
    era: "phd",
  },
];
```

**Step 6:** Verify the build passes: `cd site && npm run build`

**Step 7:** Commit: `git commit -m "feat: add research network, news, and timeline data layers"`

---

## Task 3: Interactive Research Network Hero

**Files:**
- Create: `site/components/ResearchNetwork.tsx` — replaces DataMesh
- Modify: `site/components/Hero.tsx` — swap DataMesh for ResearchNetwork, add gradient text reveal
- Create: `site/components/GradientReveal.tsx` — word-by-word text reveal
- Modify: `site/app/globals.css` — add new animation keyframes

**Step 1:** Add new keyframe animations to `site/app/globals.css`:

```css
/* Gradient text reveal */
@keyframes gradient-reveal {
  from { background-size: 0% 100%; }
  to { background-size: 100% 100%; }
}

/* Fade-in-left for timeline */
@keyframes fade-in-left {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Scale-up for stats */
@keyframes scale-up {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}

/* Breathing pulse for avatar ring */
@keyframes ring-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(13, 148, 136, 0.2); }
  50% { box-shadow: 0 0 0 12px rgba(13, 148, 136, 0); }
}

/* Status dot pulse */
@keyframes dot-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.animate-fade-in-left {
  animation: fade-in-left 0.6s ease-out forwards;
  opacity: 0;
}

.animate-scale-up {
  animation: scale-up 0.6s ease-out forwards;
  opacity: 0;
}

.animate-ring-pulse {
  animation: ring-pulse 3s ease-in-out infinite;
}

.animate-dot-pulse {
  animation: dot-pulse 2s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-left,
  .animate-scale-up {
    animation: none;
    opacity: 1;
  }
  .animate-ring-pulse,
  .animate-dot-pulse {
    animation: none;
  }
}
```

**Step 2:** Create `site/components/ResearchNetwork.tsx` — Canvas-based force-directed graph. Key behaviors:
- Read nodes from `data/research-network.ts`
- Position Pre-PhD cluster on the left, PhD cluster on the right
- Apply simple force-directed layout (repulsion between all nodes, attraction between connected nodes, gravity toward cluster center)
- Node radius proportional to `size` property
- Pre-PhD nodes: muted teal (rgba with low alpha), PhD nodes: vibrant teal
- On hover: node glows (larger radius, brighter color), show tooltip with label + description + publication count
- On click: smooth-scroll to relevant section (using `id` attributes on sections below)
- Respect prefers-reduced-motion: static positioned layout, no continuous animation
- Use `requestAnimationFrame` for smooth 60fps animation
- Handle canvas resize on window resize
- Canvas should fill parent container

**Step 3:** Create `site/components/GradientReveal.tsx` — Client component that reveals text word-by-word:
- Split tagline into words
- Each word starts transparent, becomes visible with staggered delay
- Use CSS animation with `animation-delay` per word
- Respect prefers-reduced-motion (show all text immediately)

```typescript
"use client";

import { useEffect, useRef, useState } from "react";

interface GradientRevealProps {
  text: string;
  className?: string;
  delayMs?: number;
}

export function GradientReveal({ text, className = "", delayMs = 100 }: GradientRevealProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }
    // Small delay before starting the reveal
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-500"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(8px)",
            transitionDelay: visible ? `${i * delayMs}ms` : "0ms",
          }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}
```

**Step 4:** Update `site/components/Hero.tsx`:
- Replace `<DataMesh />` with `<ResearchNetwork />`
- Replace static tagline with `<GradientReveal text="From clinical insight to intelligent intervention" />`
- Add `animate-ring-pulse` class to avatar image
- Keep social icons and CV download button

**Step 5:** Verify the build passes and preview the hero section.

**Step 6:** Commit: `git commit -m "feat: interactive research network hero with gradient text reveal"`

---

## Task 4: News Ticker Section

**Files:**
- Create: `site/components/NewsTicker.tsx`
- Modify: `site/app/page.tsx` — add NewsTicker between Hero and Divider

**Step 1:** Create `site/components/NewsTicker.tsx`:
- Read from `data/news.ts`
- Display 2-3 most recent items
- Each item: date (formatted as "MMM YYYY") + text + optional link
- Left border accent in teal
- ScrollReveal wrapper
- Simple stacked list, small text

```typescript
import { newsItems } from "@/data/news";
import { ScrollReveal } from "./ScrollReveal";

export function NewsTicker() {
  const recent = newsItems.slice(0, 3);
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
            <div className="border-l-2 border-[var(--color-accent)]/30 pl-4 py-1">
              <p className="text-sm text-[var(--color-body)]">
                <span className="font-mono text-xs text-[var(--color-muted)] mr-2">{item.date}</span>
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
```

**Step 2:** Update `site/app/page.tsx` to include NewsTicker:

```typescript
import { Hero } from "@/components/Hero";
import { NewsTicker } from "@/components/NewsTicker";
import { Divider } from "@/components/Divider";
import { AboutSection } from "@/components/AboutSection";

export default function Home() {
  return (
    <>
      <Hero />
      <NewsTicker />
      <Divider />
      <AboutSection />
    </>
  );
}
```

**Step 3:** Verify the build and preview.

**Step 4:** Commit: `git commit -m "feat: add news ticker section to home page"`

---

## Task 5: Impact Stats Strip

**Files:**
- Create: `site/components/StatsStrip.tsx`
- Modify: `site/app/page.tsx` — add StatsStrip between NewsTicker and Divider

**Step 1:** Create `site/components/StatsStrip.tsx`:

```typescript
"use client";

import { useEffect, useRef, useState } from "react";
import { publications } from "@/data/publications";
import { projects } from "@/data/projects";

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { value: publications.length, suffix: "+", label: "Publications" },
  { value: projects.length, suffix: "", label: "Research Projects" },
  { value: new Date().getFullYear() - 2016, suffix: "+", label: "Years of Research" },
  { value: 8, suffix: "+", label: "Methods Used" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
      { threshold: 0.5 }
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
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }, [started, value]);

  return (
    <span ref={ref} className="font-mono text-4xl md:text-5xl font-bold text-[var(--color-heading)]">
      {count}{suffix}
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
            <p className="text-sm text-[var(--color-muted)] mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

**Step 2:** Update `site/app/page.tsx`:

```typescript
import { Hero } from "@/components/Hero";
import { NewsTicker } from "@/components/NewsTicker";
import { StatsStrip } from "@/components/StatsStrip";
import { Divider } from "@/components/Divider";
import { AboutSection } from "@/components/AboutSection";

export default function Home() {
  return (
    <>
      <Hero />
      <NewsTicker />
      <StatsStrip />
      <Divider />
      <AboutSection />
    </>
  );
}
```

**Step 3:** Verify build and preview.

**Step 4:** Commit: `git commit -m "feat: add animated impact stats strip"`

---

## Task 6: Enhanced About Section

**Files:**
- Modify: `site/components/AboutSection.tsx` — narrative reframing, interactive tags, education timeline, avatar pulse

**Step 1:** Rewrite `site/components/AboutSection.tsx`:
- Reframe bio text to tell the two-act narrative (Pre-PhD foundations -> PhD AI + mental health)
- Education section: vertical left border line connecting degrees (mini-timeline style)
- Research interest tags: add hover glow effect (CSS box-shadow transition, teal glow on hover)
- Avatar with `animate-ring-pulse` class (if avatar is shown in about section)

The education section should use a connected timeline pattern:
```html
<div className="relative border-l-2 border-[var(--color-accent)]/20 pl-6 space-y-4">
  {education items with left dot markers}
</div>
```

Each education entry gets a small teal dot on the left border line.

Interest tags get hover styles:
```html
<span className="... hover:shadow-[0_0_12px_rgba(13,148,136,0.3)] hover:border-[var(--color-accent)]/40 transition-all duration-200 cursor-default">
```

**Step 2:** Verify build and preview.

**Step 3:** Commit: `git commit -m "feat: enhance about section with narrative framing and interactive tags"`

---

## Task 7: Research Journey Timeline

**Files:**
- Create: `site/components/ResearchTimeline.tsx`
- Modify: `site/app/page.tsx` — add timeline after AboutSection

**Step 1:** Create `site/components/ResearchTimeline.tsx`:
- Read from `data/timeline.ts`
- Vertical teal line on the left
- Sticky era headers ("Pre-PhD Foundations" / "PhD & Beyond")
- Year labels on the left
- Entry content on the right
- Timeline line gradient: muted teal (top) -> vibrant teal (bottom) via CSS `linear-gradient`
- Use ScrollReveal with `animate-fade-in-left` for entries
- The "pivot" entry (empty year, italic description) gets special styling — larger text, centered, teal color
- Related publication/project IDs render as small inline linked cards

```typescript
"use client";

import { timelineEntries } from "@/data/timeline";
import { ScrollReveal } from "./ScrollReveal";

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
            background: "linear-gradient(to bottom, rgba(13,148,136,0.2), rgba(13,148,136,0.8))",
          }}
        />

        {/* Pre-PhD Era */}
        <div className="mb-12">
          <div className="sticky top-20 z-10 bg-[var(--color-bg)] py-2 mb-6">
            <h3 className="font-heading text-lg font-bold text-[var(--color-muted)] uppercase tracking-wider pl-12">
              Pre-PhD Foundations
            </h3>
          </div>
          {renderEntries(prePhd)}
        </div>

        {/* PhD Era */}
        <div>
          <div className="sticky top-20 z-10 bg-[var(--color-bg)] py-2 mb-6">
            <h3 className="font-heading text-lg font-bold text-[var(--color-accent)] uppercase tracking-wider pl-12">
              PhD &amp; Beyond
            </h3>
          </div>
          {renderEntries(phd)}
        </div>
      </div>
    </section>
  );
}

function renderEntries(entries: typeof timelineEntries) {
  return (
    <div className="space-y-6">
      {entries.map((entry, i) => {
        const isPivot = entry.year === "" && entry.title === "The Pivot";

        return (
          <ScrollReveal key={i} delay={i * 0.1}>
            <div className="relative pl-12">
              {/* Dot on timeline */}
              <div className={`absolute left-[11px] top-2 w-3 h-3 rounded-full border-2 border-[var(--color-accent)] ${
                isPivot ? "bg-[var(--color-accent)]" : "bg-[var(--color-bg)]"
              }`} />

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
```

**Step 2:** Update `site/app/page.tsx`:

```typescript
import { Hero } from "@/components/Hero";
import { NewsTicker } from "@/components/NewsTicker";
import { StatsStrip } from "@/components/StatsStrip";
import { Divider } from "@/components/Divider";
import { AboutSection } from "@/components/AboutSection";
import { ResearchTimeline } from "@/components/ResearchTimeline";

export default function Home() {
  return (
    <>
      <Hero />
      <NewsTicker />
      <StatsStrip />
      <Divider />
      <AboutSection />
      <Divider />
      <ResearchTimeline />
    </>
  );
}
```

**Step 3:** Verify build and preview.

**Step 4:** Commit: `git commit -m "feat: add research journey timeline to home page"`

---

## Task 8: Publications Page Enhancements

**Files:**
- Modify: `site/components/PublicationRow.tsx` — SVG underline draw, abstract expand
- Modify: `site/components/StatusDot.tsx` — pulse animation for active statuses
- Create: `site/components/FilterChips.tsx` — reusable filter chip component
- Modify: `site/components/PublicationList.tsx` — integrate filters
- Modify: `site/app/publications/page.tsx` — client wrapper for filtering state

**Step 1:** Update `site/components/StatusDot.tsx` to add pulse animation for "under-review" and "in-prep":

```typescript
import { PublicationStatus } from "@/types";

const statusConfig: Record<PublicationStatus, { color: string; label: string; pulse: boolean }> = {
  published: { color: "bg-[var(--color-accent)]", label: "Published", pulse: false },
  "in-press": { color: "bg-[var(--color-highlight)]", label: "In Press", pulse: true },
  "under-review": { color: "bg-[var(--color-highlight)]", label: "Under Review", pulse: true },
  "in-prep": { color: "bg-[var(--color-muted)]", label: "In Preparation", pulse: true },
};

export function StatusDot({ status }: { status: PublicationStatus }) {
  const config = statusConfig[status];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${config.color} ${config.pulse ? "animate-dot-pulse" : ""}`} />
      <span className="font-mono text-xs text-[var(--color-muted)]">{config.label}</span>
    </span>
  );
}
```

**Step 2:** Create `site/components/FilterChips.tsx` — reusable filter component used by both Publications and Research pages:

```typescript
"use client";

interface FilterChipsProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
}

export function FilterChips({ options, selected, onSelect }: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`font-mono text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
            selected === option
              ? "bg-[var(--color-accent)] text-white border-[var(--color-accent)]"
              : "bg-transparent text-[var(--color-body)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
```

**Step 3:** Update `site/components/PublicationRow.tsx`:
- Add SVG underline draw animation on hover (using `stroke-dashoffset` transition)
- Add abstract expand on click (accordion with smooth height transition)
- Make the component a client component (needs useState for abstract toggle)

Key additions:
- Wrap title in a `<span>` with a decorative SVG underline that draws in on group-hover
- Add a clickable "Abstract" toggle that expands/collapses the abstract text
- Use `grid-rows-[0fr]` -> `grid-rows-[1fr]` transition for smooth accordion

**Step 4:** Update `site/components/PublicationList.tsx` to be a client component with filter state:
- Add FilterChips at the top: "All", "First Author", "AI/ML", "LGBTQ+", "Digital Health", "Suicide", "Neuroscience"
- Filter publications based on selected chip
- Animate filtered results with CSS transitions (opacity/transform)

**Step 5:** Update `site/app/publications/page.tsx` — since PublicationList is now a client component, the page can stay as a server component.

**Step 6:** Verify build and preview.

**Step 7:** Commit: `git commit -m "feat: publication filters, abstract expand, SVG underline, status pulse"`

---

## Task 9: Research Page Enhancements

**Files:**
- Create: `site/components/MagneticCard.tsx` — wrapper component for 3D tilt effect
- Create: `site/components/ProjectDetail.tsx` — expanded project detail modal/overlay
- Modify: `site/components/ProjectCard.tsx` — integrate magnetic hover, detail expansion, publication cross-refs
- Modify: `site/components/ProjectGrid.tsx` — add tag filtering
- Modify: `site/app/research/page.tsx` — client wrapper for filtering

**Step 1:** Create `site/components/MagneticCard.tsx`:

```typescript
"use client";

import { useRef, useCallback, useEffect, useState } from "react";

interface MagneticCardProps {
  children: React.ReactNode;
  className?: string;
}

export function MagneticCard({ children, className = "" }: MagneticCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Disable on mobile and when reduced motion is preferred
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(!isMobile && !prefersReduced);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!enabled || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8; // max 8deg
      const rotateY = ((x - centerX) / centerX) * 8;

      cardRef.current.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    },
    [enabled]
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
  }, []);

  return (
    <div
      ref={cardRef}
      className={`transition-transform duration-200 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}
```

**Step 2:** Create `site/components/ProjectDetail.tsx` — modal overlay for project detail:
- Full project description (no line-clamp)
- Methodology notes
- All links (GitHub, OSF, papers)
- Related publications cross-reference
- Close button, click-outside to close, Escape key to close
- Smooth fade-in/scale animation

**Step 3:** Update `site/components/ProjectCard.tsx`:
- Wrap in MagneticCard
- Add click handler to open ProjectDetail
- Add small publication cross-reference badge (count related publications by matching tags)
- Make it a client component

**Step 4:** Update `site/components/ProjectGrid.tsx`:
- Add FilterChips at the top: "All", "AI/ML", "Digital Mental Health", "LGBTQ+", "Suicide Prevention", "Computational Psychiatry"
- Filter projects by selected tag
- Animate card transitions (CSS opacity + transform)
- Make it a client component

**Step 5:** Verify build and preview.

**Step 6:** Commit: `git commit -m "feat: magnetic project cards, tag filtering, detail expansion"`

---

## Task 10: Blog Page with MDX Support

**Files:**
- Install: `next-mdx-remote`, `gray-matter` npm packages
- Create: `site/content/blog/` directory for markdown posts
- Create: `site/content/blog/hello-world.mdx` — sample blog post
- Create: `site/lib/blog.ts` — blog post loading utilities
- Create: `site/components/BlogPostCard.tsx` — post card for index page
- Create: `site/app/blog/page.tsx` — blog index page
- Create: `site/app/blog/[slug]/page.tsx` — individual blog post page

**Step 1:** Install MDX dependencies:
```bash
cd site && npm install next-mdx-remote gray-matter
```

**Step 2:** Create `site/content/blog/hello-world.mdx`:
```mdx
---
title: "Welcome to My Research Blog"
date: "2026-02-23"
tags: ["meta"]
excerpt: "A brief introduction to what I'll be writing about — AI, mental health, and the intersection of clinical science and technology."
---

Welcome to my research blog. Here I'll share ongoing research notes, reflections from conferences, and longer pieces about the intersection of AI and mental health.

## What to expect

- **Research updates** — short notes on ongoing projects and preliminary findings
- **Long-form explainers** — deeper dives into why AI needs clinical psychologists, and vice versa
- **Conference reflections** — key takeaways from academic conferences and workshops

Stay tuned for more.
```

**Step 3:** Create `site/lib/blog.ts`:
- `getAllPosts()` — reads all `.mdx` files from `content/blog/`, parses frontmatter with gray-matter, returns sorted by date descending
- `getPostBySlug(slug)` — reads single post, returns frontmatter + raw content
- Calculate reading time (words / 200, round up)
- Return `BlogPost[]` typed array

Note: Since we're using static export, use `fs` and `path` to read files at build time. These functions run only during build (in server components or `generateStaticParams`).

**Step 4:** Create `site/components/BlogPostCard.tsx`:
- Title, date, tags, excerpt, reading time
- Link to `/blog/[slug]`
- Clean editorial card layout

**Step 5:** Create `site/app/blog/page.tsx`:
```typescript
import { getAllPosts } from "@/lib/blog";
import { BlogPostCard } from "@/components/BlogPostCard";

export const metadata = {
  title: "Blog",
};

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-heading text-4xl mb-12">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-[var(--color-muted)]">No posts yet. Check back soon.</p>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
```

**Step 6:** Create `site/app/blog/[slug]/page.tsx`:
- Use `generateStaticParams` to pre-render all blog posts at build time
- Parse MDX content with `next-mdx-remote/rsc` (RSC-compatible)
- Render with clean typography (prose-like layout)
- Show title, date, tags, reading time at top
- Back link to `/blog`

**Step 7:** Update `site/next.config.ts` if needed for MDX support. Since we're using `next-mdx-remote` (not `@next/mdx`), no config changes should be needed.

**Step 8:** Verify build passes with static export: `cd site && npm run build`

**Step 9:** Commit: `git commit -m "feat: add blog page with MDX support"`

---

## Task 11: Global Micro-interactions & Polish

**Files:**
- Modify: `site/app/globals.css` — cursor trail styles, link hover styles
- Create: `site/components/CursorGlow.tsx` — hero cursor trail
- Modify: `site/components/Divider.tsx` — animate wave on scroll
- Modify: `site/components/Hero.tsx` — integrate cursor glow
- Modify: `site/components/ScrollReveal.tsx` — support variant animations
- Modify: `site/app/layout.tsx` — add page transition wrapper

**Step 1:** Create `site/components/CursorGlow.tsx`:
- Client component that follows mouse position on the hero section
- Renders a radial gradient div that follows cursor with slight lag (using requestAnimationFrame lerp)
- Only active on desktop, respects prefers-reduced-motion
- Teal glow color, large blur radius, very low opacity

```typescript
"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (prefersReduced || isMobile) return;

    const glow = glowRef.current;
    if (!glow) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = glow.parentElement?.getBoundingClientRect();
      if (!rect) return;
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;
      glow.style.transform = `translate(${currentX - 150}px, ${currentY - 150}px)`;
      requestAnimationFrame(animate);
    };

    const parent = glow.parentElement;
    parent?.addEventListener("mousemove", handleMouseMove);
    const frameId = requestAnimationFrame(animate);

    return () => {
      parent?.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="absolute w-[300px] h-[300px] rounded-full pointer-events-none opacity-0 md:opacity-100"
      style={{
        background: "radial-gradient(circle, rgba(13,148,136,0.08) 0%, transparent 70%)",
        willChange: "transform",
      }}
      aria-hidden="true"
    />
  );
}
```

**Step 2:** Update `site/components/ScrollReveal.tsx` to support animation variants:

```typescript
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
```

**Step 3:** Add link hover styles to `site/app/globals.css`:

```css
/* External link arrow slide-in */
a[target="_blank"]::after {
  content: " \2197"; /* ↗ arrow */
  display: inline-block;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.2s ease;
}

a[target="_blank"]:hover::after {
  opacity: 1;
  transform: translateX(0);
}

/* Exclude icon-only links */
a[aria-label][target="_blank"]::after {
  content: none;
}
```

**Step 4:** Update `site/components/Divider.tsx` to animate wave on scroll:
- Make it a client component
- Use IntersectionObserver to trigger a CSS animation on the SVG path
- Add `stroke-dasharray` and `stroke-dashoffset` animation

**Step 5:** Integrate CursorGlow into Hero.tsx (add as a child of the hero section's relative container).

**Step 6:** Verify build and preview all interactions.

**Step 7:** Commit: `git commit -m "feat: global micro-interactions — cursor glow, link arrows, scroll variants"`

---

## Task 12: Dark Mode Radial Wipe Transition

**Files:**
- Modify: `site/components/ThemeProvider.tsx` — add transition overlay
- Modify: `site/components/ThemeToggle.tsx` — pass click coordinates
- Modify: `site/app/globals.css` — radial wipe keyframes

**Step 1:** Add radial wipe animation to `site/app/globals.css`:

```css
@keyframes radial-wipe {
  from {
    clip-path: circle(0% at var(--wipe-x, 50%) var(--wipe-y, 50%));
  }
  to {
    clip-path: circle(150% at var(--wipe-x, 50%) var(--wipe-y, 50%));
  }
}
```

**Step 2:** Update `site/components/ThemeToggle.tsx`:
- On click, capture the click coordinates relative to the viewport
- Pass coordinates to the toggle function
- The ThemeProvider uses these coordinates to set `--wipe-x` and `--wipe-y` CSS custom properties on a temporary overlay div

**Step 3:** Update `site/components/ThemeProvider.tsx`:
- On toggle, create a temporary full-screen overlay with the new theme's background color
- Animate with `clip-path: circle()` expanding from the toggle button position
- After animation completes (~400ms), remove the overlay and apply the actual theme change
- Respect prefers-reduced-motion (instant swap, no animation)

**Step 4:** Verify the theme toggle transition works smoothly in both directions.

**Step 5:** Commit: `git commit -m "feat: dark mode radial wipe transition"`

---

## Task 13: Page Transitions

**Files:**
- Create: `site/components/PageTransition.tsx` — fade wrapper for page content
- Modify: `site/app/layout.tsx` — wrap children with PageTransition

**Step 1:** Create `site/components/PageTransition.tsx`:
- Client component that fades content in on mount
- Uses CSS opacity transition
- Respect prefers-reduced-motion

```typescript
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false);
    const timer = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(timer);
  }, [pathname]);

  return (
    <div
      className={`transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      style={{
        // Respect reduced motion
        transitionDuration: window?.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ? "0ms" : "300ms",
      }}
    >
      {children}
    </div>
  );
}
```

Note: The `window` access needs to be handled carefully for SSR. Use a `useEffect` to set the duration or use CSS media query instead.

Better approach — use CSS media query directly in globals.css instead of inline style.

**Step 2:** Wrap `{children}` in `site/app/layout.tsx` with `<PageTransition>`.

**Step 3:** Verify page transitions work when navigating between pages.

**Step 4:** Commit: `git commit -m "feat: smooth page fade transitions"`

---

## Task 14: Nav Underline Draw Animation

**Files:**
- Modify: `site/components/Nav.tsx` — replace static underline with SVG draw animation

**Step 1:** Update the active link indicator in `site/components/Nav.tsx`:
- Replace the static `<span>` underline with an SVG line that uses `stroke-dasharray` and `stroke-dashoffset` transition
- On active: line draws from left to right (dashoffset transitions from full width to 0)
- Smooth 300ms transition

**Step 2:** Verify nav active state animation.

**Step 3:** Commit: `git commit -m "feat: nav underline draw animation"`

---

## Task 15: Final Build Verification & Cleanup

**Files:**
- All files — verify no unused imports, no TypeScript errors
- `site/components/DataMesh.tsx` — delete if no longer used (replaced by ResearchNetwork)

**Step 1:** Delete `site/components/DataMesh.tsx` (replaced by ResearchNetwork in Task 3).

**Step 2:** Run full build: `cd site && npm run build`

**Step 3:** Fix any build errors.

**Step 4:** Run the dev server and manually verify all pages:
- Home: Research network hero, gradient text reveal, news ticker, stats strip, about section, research journey timeline
- Publications: Filter chips, SVG underline hover, status pulse, abstract expand
- Research: Tag filtering, magnetic card hover, project detail modal
- Blog: Post index, individual post rendering
- Dark mode: Radial wipe transition
- Navigation: Underline draw, page transitions
- Mobile: All interactions gracefully degrade

**Step 5:** Commit: `git commit -m "chore: final cleanup and build verification"`

---

## Execution Order & Dependencies

```
Task 1 (Remove Resources) — no dependencies
Task 2 (Data Layer) — no dependencies
  → Task 3 (Research Network Hero) — depends on Task 2
  → Task 4 (News Ticker) — depends on Task 2
  → Task 5 (Stats Strip) — no dependencies (reads from existing data)
  → Task 6 (About Section) — no dependencies
  → Task 7 (Research Timeline) — depends on Task 2
  → Task 8 (Publications) — no dependencies
  → Task 9 (Research Page) — no dependencies
  → Task 10 (Blog) — depends on Task 1 (nav update)
  → Task 11 (Micro-interactions) — depends on Task 3 (hero)
  → Task 12 (Dark Mode Wipe) — no dependencies
  → Task 13 (Page Transitions) — no dependencies
  → Task 14 (Nav Underline) — no dependencies
Task 15 (Final Verification) — depends on all above
```

**Parallelizable batches:**
- Batch 1: Tasks 1, 2 (foundation)
- Batch 2: Tasks 3, 4, 5, 6, 7 (home page sections — Task 3 depends on 2)
- Batch 3: Tasks 8, 9, 10 (page enhancements)
- Batch 4: Tasks 11, 12, 13, 14 (polish)
- Batch 5: Task 15 (verification)
