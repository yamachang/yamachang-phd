# Rose Pine 4-Color System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the 2-color CSS system with a 4-color Rose Pine palette (Pine, Gold, Rose, Iris) used throughout the entire site.

**Architecture:** Add `--color-tertiary` and `--color-quaternary` CSS variables to the theme. Replace the multi-scheme switcher with a single Rose Pine identity. Update ~10 components to use the new color roles. The ResearchNetwork canvas derives its palette from CSS variables dynamically.

**Tech Stack:** Next.js 16, Tailwind CSS 4, CSS custom properties, canvas 2D

---

### Task 1: Update globals.css — Rose Pine foundation

**Files:**
- Modify: `site/app/globals.css`

**Step 1: Replace @theme color values and add tertiary/quaternary**

Replace the `@theme` block's color values with Rose Pine Dawn:
```css
  --color-accent: #286983;
  --color-accent-light: #56949f;
  --color-highlight: #ea9d34;
  --color-highlight-light: #f6c177;
```
Add two new variables after `--color-highlight-light`:
```css
  --color-tertiary: #d7827e;
  --color-tertiary-light: #ebbcba;
  --color-quaternary: #907aa9;
  --color-quaternary-light: #c4a7e7;
```

**Step 2: Replace .dark block with Rose Pine Moon values**

```css
.dark {
  --color-bg: #232136;
  --color-surface: #2a273f;
  --color-heading: #e0def4;
  --color-body: #908caa;
  --color-muted: #6e6a86;
  --color-border: #393552;
  --color-accent: #9ccfd8;
  --color-accent-light: #9ccfd8;
  --color-highlight: #f6c177;
  --color-highlight-light: #f6c177;
  --color-tertiary: #ebbcba;
  --color-tertiary-light: #ebbcba;
  --color-quaternary: #c4a7e7;
  --color-quaternary-light: #c4a7e7;
}
```

**Step 3: Remove the sapphire and iris scheme blocks**

Delete the `[data-scheme="sapphire"]`, `.dark[data-scheme="sapphire"]`, `[data-scheme="iris"]`, `.dark[data-scheme="iris"]` blocks entirely.

**Step 4: Build to verify**

Run: `npx next build` from `site/`
Expected: Compiles successfully

**Step 5: Commit**

```bash
git add site/app/globals.css
git commit -m "feat: replace color system with Rose Pine 4-color palette"
```

---

### Task 2: Remove PaletteSwitcher and clean up layout

**Files:**
- Delete: `site/components/PaletteSwitcher.tsx`
- Modify: `site/app/layout.tsx`

**Step 1: Remove PaletteSwitcher import and usage from layout.tsx**

Remove the import line:
```typescript
import { PaletteSwitcher } from "@/components/PaletteSwitcher";
```
Remove `<PaletteSwitcher />` from the JSX.

Remove the `data-scheme` line from the inline script:
```javascript
var scheme = localStorage.getItem('color-scheme');
if (scheme) document.documentElement.setAttribute('data-scheme', scheme);
```

**Step 2: Delete PaletteSwitcher.tsx**

Remove: `site/components/PaletteSwitcher.tsx`

**Step 3: Build to verify**

Run: `npx next build` from `site/`
Expected: Compiles successfully

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove multi-scheme switcher, ship single Rose Pine identity"
```

---

### Task 3: Update ResearchNetwork — 4-color node groups

**Files:**
- Modify: `site/components/ResearchNetwork.tsx`

**Step 1: Update buildPaletteFromCSS to read tertiary + quaternary**

In `buildPaletteFromCSS`, after reading accent and highlight, add:
```typescript
const [tr, tg, tb] = hexToRgb(
  style.getPropertyValue("--color-tertiary").trim(),
);
const [qr, qg, qb] = hexToRgb(
  style.getPropertyValue("--color-quaternary").trim(),
);
```

Change the `clinical` group to use tertiary (Rose) instead of highlight:
```typescript
clinical: {
  fill: rgbaStr(tr, tg, tb, isDark ? 0.12 : 0.14),
  stroke: rgbaStr(tr, tg, tb, isDark ? 0.28 : 0.32),
  glow: rgbaStr(tr, tg, tb, isDark ? 0.06 : 0.08),
},
```

Change the `core` group to use quaternary (Iris) instead of accent:
```typescript
core: {
  fill: rgbaStr(qr, qg, qb, isDark ? 0.2 : 0.24),
  stroke: rgbaStr(qr, qg, qb, isDark ? 0.4 : 0.48),
  glow: rgbaStr(qr, qg, qb, isDark ? 0.08 : 0.1),
},
```

Keep `tech` group using accent (Pine) — no change needed.

**Step 2: Update tooltip category label**

Change line with `text-[var(--color-accent)]` in the tooltip to:
```tsx
<p className="text-[10px] text-[var(--color-quaternary)] mt-1">
```

**Step 3: Build to verify**

Run: `npx next build` from `site/`
Expected: Compiles successfully

**Step 4: Commit**

```bash
git add site/components/ResearchNetwork.tsx
git commit -m "feat: research network uses 4-color palette for node groups"
```

---

### Task 4: Update Hero — tagline uses Gold

**Files:**
- Modify: `site/components/Hero.tsx`

**Step 1: Change tagline color**

Find the tagline `className` containing `text-[var(--color-accent)]` with `tracking-wide uppercase`:
```
text-[var(--color-accent)]
```
Replace with:
```
text-[var(--color-highlight)]
```
Only the tagline line (the one with `uppercase block mb-4`). All other accent usages in Hero (links, button, avatar ring) stay as accent.

**Step 2: Build to verify**

Run: `npx next build` from `site/`

**Step 3: Commit**

```bash
git add site/components/Hero.tsx
git commit -m "feat: hero tagline uses Gold highlight color"
```

---

### Task 5: Update AboutSection — interest badges use Rose

**Files:**
- Modify: `site/components/AboutSection.tsx`

**Step 1: Change interest badge colors from accent to tertiary**

Find the interest badge className:
```
bg-[var(--color-accent)]/8 text-[var(--color-accent)] px-3 py-1.5 rounded-full border border-[var(--color-accent)]/15 accent-glow-hover hover:border-[var(--color-accent)]/40
```
Replace all `--color-accent` with `--color-tertiary` in that className only:
```
bg-[var(--color-tertiary)]/8 text-[var(--color-tertiary)] px-3 py-1.5 rounded-full border border-[var(--color-tertiary)]/15 accent-glow-hover hover:border-[var(--color-tertiary)]/40
```

Education timeline dots and border (lines 47, 50) stay as `--color-accent`.

**Step 2: Build to verify**

Run: `npx next build` from `site/`

**Step 3: Commit**

```bash
git add site/components/AboutSection.tsx
git commit -m "feat: research interest badges use Rose tertiary color"
```

---

### Task 6: Update PublicationRow — author highlight uses Iris

**Files:**
- Modify: `site/components/PublicationRow.tsx`

**Step 1: Change author highlight from accent to quaternary**

Find:
```
className={isYama ? "text-[var(--color-accent)] font-semibold" : ""}
```
Replace with:
```
className={isYama ? "text-[var(--color-quaternary)] font-semibold" : ""}
```

All other accent usages (links, hover border, underline SVG stroke) stay as accent.

**Step 2: Build to verify**

Run: `npx next build` from `site/`

**Step 3: Commit**

```bash
git add site/components/PublicationRow.tsx
git commit -m "feat: author name highlight uses Iris quaternary color"
```

---

### Task 7: Update ResearchTimeline — era labels use Rose + Iris

**Files:**
- Modify: `site/components/ResearchTimeline.tsx`

**Step 1: Change Pre-PhD era label from muted to tertiary (Rose)**

Find:
```
text-[var(--color-muted)] uppercase tracking-wider pl-12
```
(the Pre-PhD Foundations heading)
Replace `--color-muted` with `--color-tertiary`.

**Step 2: Change PhD era label from accent to quaternary (Iris)**

Find:
```
text-[var(--color-accent)] uppercase tracking-wider pl-12
```
(the PhD & Beyond heading)
Replace `--color-accent` with `--color-quaternary`.

Timeline dots, gradient line, and pivot quote stay as `--color-accent` (Pine).

**Step 3: Build to verify**

Run: `npx next build` from `site/`

**Step 4: Commit**

```bash
git add site/components/ResearchTimeline.tsx
git commit -m "feat: timeline era labels use Rose/Iris for pre-PhD/PhD"
```

---

### Task 8: Update tags across ProjectCard + BlogPostCard

**Files:**
- Modify: `site/components/ProjectCard.tsx`
- Modify: `site/components/BlogPostCard.tsx`

**Step 1: Change ProjectCard tag badges from accent to tertiary**

Find in ProjectCard.tsx:
```
bg-[var(--color-accent)]/10 text-[var(--color-accent)]
```
(the tag badges line with `rounded-full`)
Replace both `--color-accent` with `--color-tertiary`.

Role badge (highlight) and project links (accent) stay unchanged.

**Step 2: Change BlogPostCard tag badges from accent to tertiary**

Find in BlogPostCard.tsx:
```
bg-[var(--color-accent)]/10 text-[var(--color-accent)]
```
(the tag badges line with `rounded-full`)
Replace both `--color-accent` with `--color-tertiary`.

Title hover color stays as accent.

**Step 3: Build to verify**

Run: `npx next build` from `site/`

**Step 4: Commit**

```bash
git add site/components/ProjectCard.tsx site/components/BlogPostCard.tsx
git commit -m "feat: project/blog tags use Rose tertiary color"
```

---

### Task 9: Update NewsTicker — left border uses Gold

**Files:**
- Modify: `site/components/NewsTicker.tsx`

**Step 1: Change news item border from accent to highlight**

Find:
```
border-[var(--color-accent)]/30
```
Replace with:
```
border-[var(--color-highlight)]/30
```

News links stay as accent.

**Step 2: Build to verify**

Run: `npx next build` from `site/`

**Step 3: Commit**

```bash
git add site/components/NewsTicker.tsx
git commit -m "feat: news item border uses Gold highlight color"
```

---

### Task 10: Final build + visual verification

**Step 1: Full build**

Run: `npx next build` from `site/`
Expected: All pages compile successfully

**Step 2: Start dev server and take screenshots**

Verify with preview_screenshot:
- Home page light mode: Pine accent, Gold tagline, Rose interest badges, Iris author name
- Home page dark mode: Moon variants of all colors
- Publications page: Iris author highlight, accent links
- Research page: highlight role badges, tertiary tags

**Step 3: Final commit if any fixes needed**
