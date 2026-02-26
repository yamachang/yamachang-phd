"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { researchNodes } from "@/data/research-network";
import type { ResearchNode } from "@/types";

/* ------------------------------------------------------------------ */
/*  Internal types                                                     */
/* ------------------------------------------------------------------ */

interface SimNode {
  readonly data: ResearchNode;
  x: number;
  y: number;
  vx: number;
  vy: number;
  readonly radius: number;
  readonly targetX: number;
  readonly targetY: number;
  readonly labelLines: string[];
}

interface TooltipState {
  readonly visible: boolean;
  readonly x: number;
  readonly y: number;
  readonly node: ResearchNode | null;
}

/* ------------------------------------------------------------------ */
/*  Color palette — derived from CSS custom properties                 */
/* ------------------------------------------------------------------ */

interface NodeStyle {
  readonly fill: string;
  readonly stroke: string;
  readonly glow: string;
}

interface Palette {
  /** 3 node color groups: clinical (pre-PhD), tech (PhD tools), core (PhD focus) */
  readonly clinical: NodeStyle;
  readonly tech: NodeStyle;
  readonly core: NodeStyle;
  readonly hover: { readonly fill: string; readonly stroke: string };
  readonly glowHover: string;
  readonly connection: string;
  readonly connectionHover: string;
  readonly label: string;
  readonly labelHover: string;
  readonly shadow: string;
}

/** Map each node to its color group */
const NODE_GROUP: Record<string, "clinical" | "tech" | "core"> = {
  "lgbtq-health": "clinical",
  "suicide-prevention": "clinical",
  "digital-interventions": "clinical",
  "ai-mental-health": "core",
  jitais: "core",
  "machine-learning": "tech",
  llms: "tech",
};

/** Parse a hex color (#RRGGBB or RRGGBB) to [R, G, B]. */
function hexToRgb(hex: string): readonly [number, number, number] {
  const h = hex.replace("#", "").trim();
  if (h.length < 6) return [128, 128, 128];
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function rgbaStr(r: number, g: number, b: number, a: number): string {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/** Build a canvas-ready Palette by reading the active CSS custom properties. */
function buildPaletteFromCSS(isDark: boolean): Palette {
  const style = getComputedStyle(document.documentElement);
  const [ar, ag, ab] = hexToRgb(
    style.getPropertyValue("--color-accent").trim(),
  );
  const [hr, hg, hb] = hexToRgb(
    style.getPropertyValue("--color-highlight").trim(),
  );
  const [tr, tg, tb] = hexToRgb(
    style.getPropertyValue("--color-tertiary").trim(),
  );
  const [qr, qg, qb] = hexToRgb(
    style.getPropertyValue("--color-quaternary").trim(),
  );

  return {
    clinical: {
      fill: rgbaStr(tr, tg, tb, isDark ? 0.12 : 0.14),
      stroke: rgbaStr(tr, tg, tb, isDark ? 0.28 : 0.32),
      glow: rgbaStr(tr, tg, tb, isDark ? 0.06 : 0.08),
    },
    tech: {
      fill: rgbaStr(ar, ag, ab, isDark ? 0.14 : 0.18),
      stroke: rgbaStr(ar, ag, ab, isDark ? 0.3 : 0.38),
      glow: rgbaStr(ar, ag, ab, isDark ? 0.06 : 0.07),
    },
    core: {
      fill: rgbaStr(qr, qg, qb, isDark ? 0.2 : 0.24),
      stroke: rgbaStr(qr, qg, qb, isDark ? 0.4 : 0.48),
      glow: rgbaStr(qr, qg, qb, isDark ? 0.08 : 0.1),
    },
    hover: {
      fill: rgbaStr(ar, ag, ab, isDark ? 0.26 : 0.36),
      stroke: rgbaStr(ar, ag, ab, isDark ? 0.6 : 0.75),
    },
    glowHover: rgbaStr(ar, ag, ab, isDark ? 0.14 : 0.15),
    connection: isDark
      ? "rgba(140, 140, 150, 0.06)"
      : "rgba(120, 120, 130, 0.08)",
    connectionHover: isDark
      ? "rgba(140, 140, 150, 0.18)"
      : "rgba(120, 120, 130, 0.22)",
    label: isDark ? "rgba(161, 161, 170, 0.92)" : "rgba(55, 65, 81, 0.92)",
    labelHover: isDark ? "rgba(250, 250, 250, 0.95)" : "rgba(15, 23, 42, 0.95)",
    shadow: isDark ? "rgba(24, 24, 27, 0.95)" : "rgba(255, 255, 255, 0.95)",
  };
}

function getNodeStyle(nodeId: string, p: Palette): NodeStyle {
  const group = NODE_GROUP[nodeId] ?? "clinical";
  return p[group];
}

/* ------------------------------------------------------------------ */
/*  Physics & layout constants                                         */
/* ------------------------------------------------------------------ */

const FORCE_ITERATIONS = 80;
const REPULSION_STRENGTH = 2200;
const SPRING_STRENGTH = 0.001;
const SPRING_REST_LENGTH = 250;
const GRAVITY_STRENGTH = 0.06;
const FLOAT_AMPLITUDE = 1.8;
const FLOAT_SPEED = 0.0007;
const BOUNDS_PADDING = 25;
const RADIUS_SCALE = 8;
const RADIUS_BASE = 10;
const LABEL_FONT_SIZE = 9.5;
const LABEL_FONT_SIZE_HOVER = 11;

/** Pre-computed shadow offsets — hoisted to avoid per-frame allocation. */
const TEXT_SHADOW_OFFSETS: readonly (readonly [number, number])[] = [
  [0.6, 0.6],
  [-0.6, -0.6],
  [0.6, -0.6],
  [-0.6, 0.6],
  [0, 0.8],
  [0, -0.8],
];

/** Peripheral slot positions as (x%, y%) of the canvas.
 *  Pre-PhD nodes use indices 0–2, PhD nodes use indices 3–6.
 *  Arranged to frame the hero content rather than overlap it. */
const PRE_PHD_SLOT_COUNT = 3;
const SLOTS: readonly { x: number; y: number }[] = [
  /* Pre-PhD — left & top */
  { x: 0.07, y: 0.2 },
  { x: 0.26, y: 0.07 },
  { x: 0.1, y: 0.83 },
  /* PhD — right & bottom */
  { x: 0.56, y: 0.05 },
  { x: 0.93, y: 0.22 },
  { x: 0.91, y: 0.74 },
  { x: 0.7, y: 0.93 },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function nodeRadius(size: number): number {
  return size * RADIUS_SCALE + RADIUS_BASE;
}

function buildConnectionPairs(
  nodes: readonly ResearchNode[],
): readonly [number, number][] {
  const idToIndex = new Map<string, number>();
  nodes.forEach((n, i) => idToIndex.set(n.id, i));

  const seen = new Set<string>();
  const pairs: [number, number][] = [];

  for (let i = 0; i < nodes.length; i++) {
    for (const connId of nodes[i].connections) {
      const j = idToIndex.get(connId);
      if (j === undefined) continue;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push(i < j ? [i, j] : [j, i]);
    }
  }

  return pairs;
}

/** Pre-wrap label text at a given font; result is cached on SimNode. */
function computeLabelLines(
  text: string,
  maxWidth: number,
  ctx: CanvasRenderingContext2D,
): string[] {
  const words = text.split(" ");
  if (words.length === 1) return [text];

  const lines: string[] = [];
  let current = words[0];

  for (let i = 1; i < words.length; i++) {
    const test = current + " " + words[i];
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  return lines;
}

function initSimNodes(
  nodes: readonly ResearchNode[],
  width: number,
  height: number,
  ctx: CanvasRenderingContext2D,
): SimNode[] {
  let preIdx = 0;
  let phdIdx = PRE_PHD_SLOT_COUNT;

  // Set font once for label measurement
  ctx.font = `600 ${LABEL_FONT_SIZE}px "Plus Jakarta Sans", system-ui, sans-serif`;

  return nodes.map((data) => {
    const isPhd = data.category === "phd";
    const slotIdx = isPhd ? phdIdx++ : preIdx++;

    if (slotIdx >= SLOTS.length) {
      console.warn(
        `ResearchNetwork: no slot for node "${data.id}"; add more SLOTS entries`,
      );
    }

    const slot = SLOTS[Math.min(slotIdx, SLOTS.length - 1)];
    const targetX = slot.x * width;
    const targetY = slot.y * height;
    const jitter = 20;
    const r = nodeRadius(data.size);

    return {
      data,
      x: targetX + (Math.random() - 0.5) * jitter,
      y: targetY + (Math.random() - 0.5) * jitter,
      vx: 0,
      vy: 0,
      radius: r,
      targetX,
      targetY,
      labelLines: computeLabelLines(data.label, r * 1.5, ctx),
    };
  });
}

function runForceSimulation(
  simNodes: SimNode[],
  pairs: readonly [number, number][],
  iterations: number,
  width: number,
  height: number,
): SimNode[] {
  // Mutable working copies — only x/y/vx/vy are mutated during the loop.
  const nodes = simNodes.map((n) => ({ ...n }));

  for (let iter = 0; iter < iterations; iter++) {
    // Repulsion
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distSq = dx * dx + dy * dy;
        const minDist = nodes[i].radius + nodes[j].radius + 20;
        const dist = Math.max(Math.sqrt(distSq), 1);

        if (dist < minDist * 3) {
          const force = REPULSION_STRENGTH / (distSq + 100);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          nodes[i].vx += fx;
          nodes[i].vy += fy;
          nodes[j].vx -= fx;
          nodes[j].vy -= fy;
        }
      }
    }

    // Springs between connected nodes
    for (const [i, j] of pairs) {
      const dx = nodes[j].x - nodes[i].x;
      const dy = nodes[j].y - nodes[i].y;
      const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const displacement = dist - SPRING_REST_LENGTH;
      const force = SPRING_STRENGTH * displacement;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      nodes[i].vx += fx;
      nodes[i].vy += fy;
      nodes[j].vx -= fx;
      nodes[j].vy -= fy;
    }

    // Gravity toward assigned peripheral slot
    for (const node of nodes) {
      node.vx += (node.targetX - node.x) * GRAVITY_STRENGTH;
      node.vy += (node.targetY - node.y) * GRAVITY_STRENGTH;
    }

    // Integrate with damping
    const damping = 0.82;
    for (const node of nodes) {
      node.vx *= damping;
      node.vy *= damping;
      node.x += node.vx;
      node.y += node.vy;

      node.x = Math.max(
        BOUNDS_PADDING + node.radius,
        Math.min(width - BOUNDS_PADDING - node.radius, node.x),
      );
      node.y = Math.max(
        BOUNDS_PADDING + node.radius,
        Math.min(height - BOUNDS_PADDING - node.radius, node.y),
      );
    }
  }

  return nodes.map((n) => ({ ...n, vx: 0, vy: 0 }));
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ResearchNetwork() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const simNodesRef = useRef<SimNode[]>([]);
  const pairsRef = useRef<readonly [number, number][]>([]);
  const hoveredIndexRef = useRef<number>(-1);
  const timeRef = useRef<number>(0);
  const prefersReducedRef = useRef<boolean>(false);
  const isDarkRef = useRef<boolean>(false);
  const paletteRef = useRef<Palette | null>(null);
  const dimensionsRef = useRef<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    node: null,
  });

  /* ---------- Initialize layout ---------- */

  const initLayout = useCallback(
    (width: number, height: number, ctx: CanvasRenderingContext2D) => {
      const pairs = buildConnectionPairs(researchNodes);
      pairsRef.current = pairs;

      const initial = initSimNodes(researchNodes, width, height, ctx);
      const settled = runForceSimulation(
        initial,
        pairs,
        FORCE_ITERATIONS,
        width,
        height,
      );
      simNodesRef.current = settled;
    },
    [],
  );

  /* ---------- Canvas drawing ---------- */

  const draw = useCallback((ctx: CanvasRenderingContext2D, time: number) => {
    const { width, height } = dimensionsRef.current;
    if (width === 0 || height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, width * dpr, height * dpr);
    ctx.save();
    ctx.scale(dpr, dpr);

    const p = paletteRef.current ?? buildPaletteFromCSS(isDarkRef.current);
    const nodes = simNodesRef.current;
    const pairs = pairsRef.current;
    const hoveredIdx = hoveredIndexRef.current;

    // Floating offsets — reuse loop instead of .map() allocation
    const isReduced = prefersReducedRef.current;

    // ── Curved connections ──
    for (const [i, j] of pairs) {
      const phaseI = i * 1.3;
      const phaseJ = j * 1.3;
      const x1 =
        nodes[i].x +
        (isReduced
          ? 0
          : Math.sin(time * FLOAT_SPEED + phaseI) * FLOAT_AMPLITUDE);
      const y1 =
        nodes[i].y +
        (isReduced
          ? 0
          : Math.cos(time * FLOAT_SPEED * 0.7 + phaseI) * FLOAT_AMPLITUDE);
      const x2 =
        nodes[j].x +
        (isReduced
          ? 0
          : Math.sin(time * FLOAT_SPEED + phaseJ) * FLOAT_AMPLITUDE);
      const y2 =
        nodes[j].y +
        (isReduced
          ? 0
          : Math.cos(time * FLOAT_SPEED * 0.7 + phaseJ) * FLOAT_AMPLITUDE);

      const isHighlighted = i === hoveredIdx || j === hoveredIdx;
      ctx.strokeStyle = isHighlighted ? p.connectionHover : p.connection;
      ctx.lineWidth = isHighlighted ? 1.4 : 0.8;

      // Quadratic bezier with perpendicular curvature
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      const curvature = len * 0.08;
      const cpx = mx + (-dy / Math.max(len, 1)) * curvature;
      const cpy = my + (dx / Math.max(len, 1)) * curvature;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.quadraticCurveTo(cpx, cpy, x2, y2);
      ctx.stroke();
    }

    // ── Nodes ──
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const phase = i * 1.3;
      const x =
        node.x +
        (isReduced
          ? 0
          : Math.sin(time * FLOAT_SPEED + phase) * FLOAT_AMPLITUDE);
      const y =
        node.y +
        (isReduced
          ? 0
          : Math.cos(time * FLOAT_SPEED * 0.7 + phase) * FLOAT_AMPLITUDE);
      const isHovered = i === hoveredIdx;
      const displayRadius = isHovered ? node.radius * 1.12 : node.radius;
      const ns = getNodeStyle(node.data.id, p);

      // Soft glow halo
      const glowRadius = displayRadius * 2;
      const glow = ctx.createRadialGradient(
        x,
        y,
        displayRadius * 0.4,
        x,
        y,
        glowRadius,
      );
      glow.addColorStop(0, isHovered ? p.glowHover : ns.glow);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Fill
      ctx.fillStyle = isHovered ? p.hover.fill : ns.fill;
      ctx.beginPath();
      ctx.arc(x, y, displayRadius, 0, Math.PI * 2);
      ctx.fill();

      // Stroke
      ctx.strokeStyle = isHovered ? p.hover.stroke : ns.stroke;
      ctx.lineWidth = isHovered ? 1.8 : 1;
      ctx.beginPath();
      ctx.arc(x, y, displayRadius, 0, Math.PI * 2);
      ctx.stroke();

      // ── Multi-line label (lines pre-computed in initSimNodes) ──
      const fontSize = isHovered ? LABEL_FONT_SIZE_HOVER : LABEL_FONT_SIZE;
      ctx.font = `600 ${fontSize}px "Plus Jakarta Sans", system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const lines = node.labelLines;
      const lineHeight = fontSize + 3;
      const totalTextHeight = lines.length * lineHeight;
      const startY = y - totalTextHeight / 2 + fontSize / 2;

      for (let l = 0; l < lines.length; l++) {
        const ly = startY + l * lineHeight;

        // Text shadow for readability
        ctx.fillStyle = p.shadow;
        for (const off of TEXT_SHADOW_OFFSETS) {
          ctx.fillText(lines[l], x + off[0], ly + off[1]);
        }

        // Actual text
        ctx.fillStyle = isHovered ? p.labelHover : p.label;
        ctx.fillText(lines[l], x, ly);
      }
    }

    ctx.restore();
  }, []);

  /* ---------- Animation loop ---------- */

  const animate = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      timeRef.current = performance.now();
      draw(ctx, timeRef.current);

      if (!prefersReducedRef.current) {
        animFrameRef.current = requestAnimationFrame(() => animate(ctx));
      }
    },
    [draw],
  );

  /* ---------- Hit-testing ---------- */

  const findNodeAtPosition = useCallback(
    (clientX: number, clientY: number): number => {
      const canvas = canvasRef.current;
      if (!canvas) return -1;

      const rect = canvas.getBoundingClientRect();
      const mx = clientX - rect.left;
      const my = clientY - rect.top;
      const time = timeRef.current;
      const nodes = simNodesRef.current;
      const isReduced = prefersReducedRef.current;

      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        const phase = i * 1.3;
        const ox = isReduced
          ? 0
          : Math.sin(time * FLOAT_SPEED + phase) * FLOAT_AMPLITUDE;
        const oy = isReduced
          ? 0
          : Math.cos(time * FLOAT_SPEED * 0.7 + phase) * FLOAT_AMPLITUDE;

        const dx = mx - (node.x + ox);
        const dy = my - (node.y + oy);

        if (dx * dx + dy * dy <= node.radius * node.radius) {
          return i;
        }
      }

      return -1;
    },
    [],
  );

  /* ---------- Mouse handlers ---------- */

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const idx = findNodeAtPosition(e.clientX, e.clientY);
      hoveredIndexRef.current = idx;

      const canvas = canvasRef.current;
      if (canvas) canvas.style.cursor = idx >= 0 ? "pointer" : "default";

      if (idx >= 0) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltip({
            visible: true,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            node: simNodesRef.current[idx].data,
          });
        }
      } else {
        setTooltip((prev) =>
          prev.visible ? { visible: false, x: 0, y: 0, node: null } : prev,
        );
      }

      // Redraw immediately in reduced-motion mode
      if (prefersReducedRef.current) {
        const ctx = canvas?.getContext("2d");
        if (ctx) draw(ctx, performance.now());
      }
    },
    [findNodeAtPosition, draw],
  );

  const handleMouseLeave = useCallback(() => {
    hoveredIndexRef.current = -1;
    setTooltip({ visible: false, x: 0, y: 0, node: null });

    const canvas = canvasRef.current;
    if (canvas) canvas.style.cursor = "default";

    if (prefersReducedRef.current) {
      const ctx = canvas?.getContext("2d");
      if (ctx) draw(ctx, performance.now());
    }
  }, [draw]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const idx = findNodeAtPosition(e.clientX, e.clientY);
      if (idx >= 0) {
        document
          .getElementById("journey")
          ?.scrollIntoView({ behavior: "smooth" });
      }
    },
    [findNodeAtPosition],
  );

  /* ---------- Setup effect ---------- */

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Reduced motion — listen for live changes
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedRef.current = motionQuery.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedRef.current = e.matches;
      if (!e.matches) animate(ctx);
    };
    motionQuery.addEventListener("change", onMotionChange);

    // Dark mode + color scheme detection — rebuild canvas palette on change
    const syncTheme = () => {
      isDarkRef.current = document.documentElement.classList.contains("dark");
      paletteRef.current = buildPaletteFromCSS(isDarkRef.current);
    };
    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const resize = () => {
      // FIX: cancel current animation frame before reconfiguring canvas
      cancelAnimationFrame(animFrameRef.current);

      // FIX: read DPR fresh on each resize (handles multi-display setups)
      const dpr = window.devicePixelRatio || 1;

      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      dimensionsRef.current = { width: w, height: h };
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      initLayout(w, h, ctx);

      // Restart animation or draw static frame
      if (!prefersReducedRef.current) {
        animate(ctx);
      } else {
        draw(ctx, performance.now());
      }
    };

    resize();
    window.addEventListener("resize", resize);

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      motionQuery.removeEventListener("change", onMotionChange);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("click", handleClick);
    };
  }, [
    initLayout,
    draw,
    animate,
    handleMouseMove,
    handleMouseLeave,
    handleClick,
  ]);

  /* ---------- Tooltip positioning ---------- */

  const tooltipStyle = (): React.CSSProperties => {
    if (!tooltip.visible || !tooltip.node) return { display: "none" };

    return {
      position: "absolute",
      left: `${tooltip.x + 16}px`,
      top: `${tooltip.y - 12}px`,
      transform: "translateY(-100%)",
      pointerEvents: "none" as const,
      zIndex: 20,
    };
  };

  /* ---------- Render ---------- */

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full hidden md:block"
    >
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />

      {/* Tooltip */}
      {tooltip.visible && tooltip.node && (
        <div
          style={tooltipStyle()}
          className="bg-[var(--color-surface)]/95 backdrop-blur-sm border border-[var(--color-border)] rounded-lg shadow-lg px-4 py-3 max-w-[220px]"
        >
          <p className="text-xs font-semibold text-[var(--color-heading)] mb-1">
            {tooltip.node.label}
          </p>
          <p className="text-xs text-[var(--color-body)] leading-snug mb-1.5">
            {tooltip.node.description}
          </p>
          {tooltip.node.publicationCount > 0 && (
            <p className="text-[10px] text-[var(--color-muted)]">
              {tooltip.node.publicationCount} publication
              {tooltip.node.publicationCount !== 1 ? "s" : ""}
            </p>
          )}
          <p className="text-[10px] text-[var(--color-quaternary)] mt-1">
            {tooltip.node.category === "phd"
              ? "PhD Research"
              : "Pre-PhD Research"}
          </p>
        </div>
      )}
    </div>
  );
}
