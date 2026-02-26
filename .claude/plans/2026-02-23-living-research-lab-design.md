# Living Research Lab: Academic Website Redesign

**Date:** 2026-02-23
**Author:** Ya-Wen (Yama) Chang
**Status:** Approved

## Vision

Transform the academic website from a standard portfolio into a "Living Research Lab" — an interactive, narrative-driven experience that demonstrates the same data literacy, interactivity, and care for human experience that Yama's research embodies.

**Core identity:** AI + Mental Health researcher
**Narrative arc:** Pre-PhD clinical foundations + digital interventions --> PhD pivot to AI-powered mental health solutions
**Primary audience:** Mixed academic (faculty search committees, collaborators) + industry (digital health departments, research labs)
**Aesthetic:** Playful & interactive (Pudding.cool-inspired), not corporate or template-like

## Site Structure

4 pages + home page news section:

1. **Home** — Narrative landing page with interactive research network, stats, about, journey timeline, news
2. **Publications** — Enhanced Tufte-style listing with filters and abstracts
3. **Research** — Interactive project grid with magnetic hover and detail expansion
4. **Blog** — Long-form and short-form research writing

Resources page removed (R workshop was outdated).

---

## Home Page Design

### 1. Interactive Research Network Hero

Replaces the random DataMesh canvas animation with a purposeful force-directed graph.

**Nodes (~12-15):** Each represents a research topic (e.g., "LGBTQ+ Mental Health", "Suicide Prevention", "Digital Interventions", "Machine Learning", "JITAIs", "Computational Psychiatry", "NLP", "Reinforcement Learning").

**Node properties:**
- Sized by centrality to current work — "AI + Mental Health" is the largest node
- Color: Pre-PhD cluster uses muted teal; PhD cluster uses vibrant teal
- Connection lines show topic relationships
- Two visual clusters matching the two-act narrative

**Interactions:**
- Hover: Node glows, tooltip shows topic name + brief context (e.g., "3 publications")
- Click: Smooth scroll to the relevant section below
- Continuous: Subtle floating/breathing animation
- Reduced-motion: Falls back to static positioned nodes with no animation

**Hero text overlay:**
- Gradient text reveal: Tagline fades in word-by-word via radial gradient sweep on load
- Tagline: "From clinical insight to intelligent intervention" (or similar)
- Name, role, affiliation in clean Plus Jakarta Sans typography
- Social icons + CV download button preserved

### 2. News Ticker

Small section after the hero showing 2-3 recent updates.

**Format:** Date + one-liner, with optional link to blog post.
**Example entries:**
- "Feb 2026 — Started internship at [Company]"
- "Jan 2026 — Paper accepted at [Conference]"
- "Nov 2025 — Presented at [Workshop]"

**Design:** Simple stacked list, small text, subtle left border accent. Recent items first.

### 3. Impact Stats Strip

Horizontal row of 4 animated counters between news and about section.

**Stats:**
- Publications (count from data)
- Research Projects (count from data)
- Years of Research (calculated from earliest project year)
- Methods Used (curated list count)

**Animation:**
- IntersectionObserver triggers count-up from 0
- Ease-out cubic easing over ~1.5s
- Fires once (not on every scroll)
- JetBrains Mono font for numbers (data-oriented feel)
- Small label below each number

**Design:** Clean horizontal layout, generous whitespace, subtle top/bottom border lines. No background color.

### 4. About Section (Enhanced)

**Narrative reframing:**
- Lead with two-act story: Pre-PhD foundations --> PhD AI + mental health focus
- Brief, punchy prose (not a wall of text)

**Interactive interest tags:**
- Hover glow effect mirroring hero network node behavior
- Subtle magnetic pull toward cursor

**Education mini-timeline:**
- Vertical left border line connecting three degrees
- Reinforces the "journey" visual motif from the research network

**Avatar:**
- Existing teal ring gets slow breathing pulse animation
- Signal/transmission metaphor for digital health

### 5. Research Journey Timeline

Vertical scroll-driven timeline telling the two-act career story.

**Structure:**
```
PRE-PHD FOUNDATIONS (sticky header)
  2016 — First research at NTU
  2017 — Columbia MA, clinical psychology
  2018-2020 — Digital interventions, LGBTQ+ health research
    [inline publication/project cards]
  "I realized AI could make mental health interventions more scalable, personalized, and accessible"

PHD & BEYOND (sticky header)
  2021 — Dartmouth PhD in QBS, computational methods
  2022 — First ML + mental health publications
  2023 — Evergreen AI campus intervention system
    [featured project card inline]
  Present — Building at the intersection of AI + clinical science
```

**Visual design:**
- Vertical teal line on the left connecting all entries
- Year labels with CSS `position: sticky`
- Era headers ("Pre-PhD Foundations" / "PhD & Beyond") are large and bold
- Timeline line gradient: muted teal (past) --> vibrant teal (present)
- ScrollReveal with fade-left animation for entries

---

## Publications Page Design

**Preserved:** Tufte-style year grouping, sticky year labels, author highlighting (Chang in teal), DOI/PDF links.

**New features:**

1. **SVG underline draw on hover** — Stroke-dashoffset animation draws a line under publication title on hover
2. **Status dot pulse** — "Under review" and "In prep" status dots get slow pulse animation (signals active work)
3. **Filter chips** — Top of page: "All", "First Author", "AI/ML", "LGBTQ+", "Digital Health". Smooth animated filtering
4. **Abstract expand** — Click a publication row to expand abstract inline (accordion-style). Smooth height transition

---

## Research Page Design

**Preserved:** Asymmetric masonry grid, featured cards spanning 2 columns, role badges, tags, links.

**New features:**

1. **Magnetic 3D card hover** — On mousemove, card subtly tilts/translates toward cursor (CSS perspective transform, ~15px max). Disabled on mobile and reduced-motion
2. **Tag filtering** — Filter bar: "All", "AI/ML", "Digital Health", "LGBTQ+", "Suicide Prevention". Cards animate in/out when filtering
3. **Project detail expansion** — Click card to show full description, methodology, and all links (inline expansion or modal overlay)
4. **Publication cross-reference badges** — Small "N papers" badge on project cards linking to related publications

---

## Blog Page Design

New page for long-form and short-form research writing.

**Content types:**
- Research notes & updates (short, lab-notebook style)
- Long-form explainers (accessible pieces about AI + mental health)

**Technical approach:**
- Markdown-based content files (easy authoring)
- Tag-based categorization
- Clean editorial layout matching site design system
- Reading time estimate
- Date and tags displayed prominently

**Layout:** Single column, max-w-prose, generous line-height. Blog index shows post cards with title, date, tags, and excerpt.

---

## Global Polish & Micro-interactions

### Animations

1. **Gradient text reveal** — Hero tagline: radial gradient sweep revealing text word-by-word on load
2. **ScrollReveal variants** — Beyond fade-up: fade-in-left (timeline), scale-up (stats), blur-to-clear (images)
3. **Animated wavy dividers** — SVG path dividers with subtle wave motion on scroll
4. **Avatar ring pulse** — Slow breathing animation on the teal ring
5. **Status dot pulse** — Active publication statuses pulse gently

### Hover Interactions

6. **Cursor trail glow** — Subtle teal glow following cursor on hero section (desktop only, reduced-motion aware)
7. **Link arrow slide-in** — External links get an arrow icon that slides in on hover
8. **Nav underline draw** — Active nav links: teal underline draws in with stroke animation
9. **Magnetic cards** — Research project cards tilt toward cursor

### Transitions

10. **Dark mode radial wipe** — Theme toggle triggers expanding circle transition from toggle button position
11. **Page transitions** — Smooth fade-out/fade-in between pages (Next.js View Transitions API or CSS fallback)

### Accessibility

- All animations respect `prefers-reduced-motion` (critical for a mental health researcher's site)
- Every interactive element has keyboard support and focus indicators
- ARIA labels on all interactive nodes in research network
- Semantic HTML throughout
- Sufficient color contrast in both light and dark modes

---

## Technical Constraints

- **Stack:** Next.js 14, TypeScript, Tailwind CSS v4, static export
- **No heavy dependencies:** No Three.js, D3, or GSAP. Canvas API + IntersectionObserver + requestAnimationFrame + CSS transitions
- **Blog content:** MDX or plain Markdown files in a content/ directory
- **Performance:** All animations use transform and opacity (GPU-composited properties only)
- **Mobile:** All hover interactions gracefully degrade. Magnetic cards disabled. Touch-friendly interactions preserved
