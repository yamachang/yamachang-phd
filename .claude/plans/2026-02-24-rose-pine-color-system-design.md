# Rose Pine 4-Color System Design

**Date:** 2026-02-24
**Status:** Approved

## Overview

Replace the current 2-color system (accent + highlight) with a full 4-color system based on the Rose Pine palette. The site uses CSS custom properties, so changing variables transforms every component site-wide.

## Palette

Rose Pine with "Rose" substituted for "Love" (softer coral vs sharper red).

| Role | Variable | Dawn (Light) | Moon (Dark) | Named Color |
|------|----------|-------------|------------|-------------|
| Accent | `--color-accent` | `#286983` | `#9ccfd8` | Pine |
| Highlight | `--color-highlight` | `#ea9d34` | `#f6c177` | Gold |
| Tertiary | `--color-tertiary` | `#d7827e` | `#ebbcba` | Rose |
| Quaternary | `--color-quaternary` | `#907aa9` | `#c4a7e7` | Iris |

Light variants:

| Variable | Dawn | Moon |
|----------|------|------|
| `--color-accent-light` | `#56949f` (Foam) | `#9ccfd8` |
| `--color-highlight-light` | `#f6c177` | `#f6c177` |
| `--color-tertiary-light` | `#ebbcba` | `#ebbcba` |
| `--color-quaternary-light` | `#c4a7e7` | `#c4a7e7` |

## Color Role Mapping

### Accent (Pine) — Primary interactive
Nav underline, links, Download CV button, avatar ring pulse, filter chips active state, timeline dots/line.

### Highlight (Gold) — Warm attention
Status dots (in-press/under-review), role badges in projects, news item left border, tagline text.

### Tertiary (Rose) — Secondary interactive
Research interest pills, timeline era labels, blog post tags, publication underline hover, about section badges.

### Quaternary (Iris) — Differentiation accent
Publication author highlight ("Chang, Y. W."), PhD era label, tooltip category label.

### Research Network Node Groups
- clinical (pre-PhD) -> Rose `#d7827e`
- tech (PhD tools: ML, LLMs) -> Pine `#286983`
- core (PhD focus: AI+MH, JITAIs) -> Iris `#907aa9`

## Files to Modify

1. **globals.css** — Replace sapphire/iris schemes with Rose Pine; add tertiary + quaternary variables
2. **ResearchNetwork.tsx** — Read tertiary + quaternary from CSS; map clinical->highlight, tech->accent, core->quaternary
3. **PaletteSwitcher.tsx** — Remove multi-scheme switcher
4. **Hero.tsx** — Tagline uses highlight (Gold)
5. **AboutSection.tsx** — Interest badges use tertiary (Rose)
6. **PublicationRow.tsx** — Author highlight uses quaternary (Iris)
7. **ResearchTimeline.tsx** — Era labels use tertiary/quaternary
8. **StatusDot.tsx** — Published dot uses accent, in-press uses highlight
9. **ProjectCard.tsx** — Role badge uses highlight, tags use tertiary
10. **FilterChips.tsx** — Active chip uses accent
11. **NewsTicker.tsx** — Left border uses highlight
12. **BlogPostCard.tsx** — Tags use tertiary
13. **layout.tsx** — Remove PaletteSwitcher; clean up inline scheme script
