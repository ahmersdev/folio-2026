import { useEffect, useRef, useState } from "react";
import { CURTAIN_TEXT } from "../../easter-egg.data";
import { StringChimeVoice } from "./string-curtain.chimes";
import {
  CANVAS_PADDING_PX,
  CELL_SIZE_PX,
  CHIME_RADIUS_PX,
  CHIME_THEMES,
  COMPRESS_FACTOR,
  CONTENT_HEIGHT_SCALE,
  CONTENT_TOP_OFFSET_PX,
  DAMPING,
  GATE_IMAGE_W_PX,
  GATE_OPENING_HEIGHT_PX,
  GATE_OPENING_LEFT_PX,
  GATE_OPENING_TOP_PX,
  GATE_OPENING_WIDTH_PX,
  GLYPH_FONT_FAMILY,
  GLYPH_FONT_SIZE_PX,
  GRAB_RADIUS,
  GRAVITY,
  ITERATIONS_PER_FRAME,
  MAX_GRID_H,
  MAX_GRID_W,
  MIN_GRID_H,
  MIN_GRID_W,
  MOUSE_RADIUS,
  MOUSE_STRENGTH,
  SPACER_COMPRESS_FACTOR,
  SPACER_STRETCH_FACTOR,
  STRETCH_FACTOR,
} from "./string-curtain.data";
import { Constraint, Particle, Vec2 } from "./string-curtain.physics";
import {
  charForCell,
  getPointID,
  sizeCanvas,
  smoothstep,
} from "./string-curtain.utils";

const MOUSE_RADIUS_SQ = MOUSE_RADIUS ** 2;
const CHIME_RADIUS_SQ = CHIME_RADIUS_PX ** 2;
// Second smoothstep edge for the pointer-repel falloff — a shape constant
// (how sharply the force ramps up approaching the pointer), not a literal
// distance; kept as the reference implementation tuned it.
const MOUSE_FALLOFF_EDGE = -2000;

// Particle ids are column-major (see getPointID), so the column is
// recoverable without storing it on the particle itself — as long as the
// same gridH the id was built with is passed back in.
function columnTForParticle(particle: Particle, gridW: number, gridH: number) {
  const col = Math.floor(particle.id / gridH);
  return gridW > 1 ? col / (gridW - 1) : 0;
}

// Column count from measured width — narrower viewports get fewer, not
// smaller, columns.
function computeGridW(width: number) {
  return Math.round(
    Math.min(MAX_GRID_W, Math.max(MIN_GRID_W, width / CELL_SIZE_PX)),
  );
}

// Row count from the doorway's actual pixel height (already known exactly
// once the image's displayed width is known — see rebuild()) using the
// same cell size the columns use, so cells stay square-ish rather than
// stretching/squashing across breakpoints.
function computeGridH(
  contentWidth: number,
  gridW: number,
  contentHeight: number,
) {
  const cellWidth = contentWidth / (gridW - 1);
  const rows = Math.round(contentHeight / cellWidth) + 1;
  return Math.min(MAX_GRID_H, Math.max(MIN_GRID_H, rows));
}

// Settle a fresh grid under gravity for this many fixed-timestep ticks
// before the first paint, so it starts hanging naturally instead of as a
// flat, obviously-just-spawned grid. Also what reduced-motion renders as its
// single static frame (no rAF loop after this).
const SETTLE_TICKS = 90;
const SETTLE_DT_MS = 16;

type TGrid = {
  particles: Particle[];
  constraints: Constraint[];
  gridW: number;
  gridH: number;
  originX: number;
  originY: number;
};

function buildGrid(containerWidth: number, gridH: number): TGrid {
  const gridW = computeGridW(containerWidth);
  const cellWidth = containerWidth / (gridW - 1);
  const cellHeight = cellWidth;

  const particles: Particle[] = [];
  for (let col = 0; col < gridW; col++) {
    for (let row = 0; row < gridH; row++) {
      particles.push(
        new Particle({
          x: col * cellWidth,
          y: row * cellHeight,
          pinned: row === 0,
          id: getPointID(row, col, gridH),
          char: charForCell(CURTAIN_TEXT, col, row, gridW),
        }),
      );
    }
  }

  const constraints: Constraint[] = [];
  for (let col = 0; col < gridW; col++) {
    for (let row = 0; row < gridH; row++) {
      const p = particles[getPointID(row, col, gridH)];

      if (row < gridH - 1) {
        const below = particles[getPointID(row + 1, col, gridH)];
        const constraint = new Constraint({
          p1: p,
          p2: below,
          length: cellHeight,
          compressFactor: COMPRESS_FACTOR,
          stretchFactor: STRETCH_FACTOR,
        });
        constraints.push(constraint);
        p.downConstraint = constraint;
      }

      if (col < gridW - 1) {
        const right = particles[getPointID(row, col + 1, gridH)];
        constraints.push(
          new Constraint({
            p1: p,
            p2: right,
            length: cellWidth,
            compressFactor: SPACER_COMPRESS_FACTOR,
            stretchFactor: SPACER_STRETCH_FACTOR,
          }),
        );
      }
    }
  }

  return {
    particles,
    constraints,
    gridW,
    gridH,
    originX: CANVAS_PADDING_PX,
    originY: CANVAS_PADDING_PX,
  };
}

function solve(grid: TGrid, dtMs: number) {
  const dtSquared = dtMs ** 2;
  for (const p of grid.particles) p.update(dtSquared, GRAVITY, DAMPING);
  for (let i = 0; i < ITERATIONS_PER_FRAME; i++) {
    for (const c of grid.constraints) c.solve();
  }
}

function buildGlyphCache(dpr: number) {
  const foreground = getComputedStyle(document.documentElement)
    .getPropertyValue("--foreground")
    .trim();

  const glyphs = new Map<string, HTMLCanvasElement>();
  const size = Math.ceil(GLYPH_FONT_SIZE_PX * 1.7);

  for (const ch of new Set(CURTAIN_TEXT)) {
    if (ch === " ") continue;
    const off = document.createElement("canvas");
    off.width = Math.ceil(size * dpr);
    off.height = Math.ceil(size * dpr);
    const ctx = off.getContext("2d");
    if (!ctx) continue;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = `${GLYPH_FONT_SIZE_PX}px ${GLYPH_FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = foreground || "#ede6e4";
    ctx.fillText(ch, size / 2, size / 2);
    glyphs.set(ch, off);
  }

  return { glyphs, glyphSize: size };
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  grid: TGrid,
  glyphs: Map<string, HTMLCanvasElement>,
  glyphSize: number,
  dpr: number,
) {
  const half = glyphSize / 2;

  for (const p of grid.particles) {
    if (p.char === " ") continue;
    const glyph = glyphs.get(p.char);
    if (!glyph) continue;

    let cos = 1;
    let sin = 0;
    if (p.downConstraint) {
      const dx = p.downConstraint.p2.pos.x - p.downConstraint.p1.pos.x;
      const dy = p.downConstraint.p2.pos.y - p.downConstraint.p1.pos.y;
      const angle = Math.atan2(dy, dx) - Math.PI / 2;
      cos = Math.cos(angle);
      sin = Math.sin(angle);
    }

    const x = p.pos.x + grid.originX;
    const y = p.pos.y + grid.originY;
    ctx.setTransform(
      cos * dpr,
      sin * dpr,
      -sin * dpr,
      cos * dpr,
      x * dpr,
      y * dpr,
    );
    ctx.drawImage(glyph, -half, -half, glyphSize, glyphSize);
  }
}

export default function useStringCurtain(reducedMotion: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Lazy useState initializer (not a ref) so the one-time construction
  // happens without touching ref.current during render — the compiler
  // flags that even for a read-then-lazily-init pattern.
  const [chimeEngine] = useState(() => new StringChimeVoice());
  const [muted, setMuted] = useState(false);
  const [themeIndex, setThemeIndex] = useState(0);

  // Separate from the setup effect below (which only reruns on
  // reducedMotion) so toggling mute/switching theme doesn't tear down/
  // rebuild the grid.
  useEffect(() => {
    chimeEngine.setMuted(muted);
  }, [chimeEngine, muted]);

  useEffect(() => {
    chimeEngine.setTheme(CHIME_THEMES[themeIndex]);
  }, [chimeEngine, themeIndex]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const { glyphs, glyphSize } = buildGlyphCache(dpr);

    let grid: TGrid | null = null;
    let rafId: number | null = null;
    let lastFrameTime = 0;
    let grabbedParticle: Particle | null = null;
    const mousePos = new Vec2();
    let canvasCssWidth = 0;
    let canvasCssHeight = 0;
    // Canvas is absolutely positioned (out of normal flow) and the
    // container's height comes from the gate <img>'s own natural block
    // height, not from the canvas — so canvas resizing never feeds back
    // into the observed container box. This just additionally guards
    // against ResizeObserver firing for a same-width change that doesn't
    // actually call for a grid rebuild.
    let lastWidth = -1;

    function paint() {
      if (!grid || !ctx || !canvas) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid(ctx, grid, glyphs, glyphSize, dpr);
    }

    function loop(now: number) {
      if (!grid) return;
      rafId = requestAnimationFrame(loop);
      const dt = Math.min(32, Math.max(1, now - lastFrameTime));
      lastFrameTime = now;
      solve(grid, dt);
      paint();
    }

    // Fraction-of-rect (not a flat clientX - rect.left) so this stays
    // correct under browser zoom, where rect.width can diverge from the CSS
    // px size the canvas was actually laid out at.
    function localPoint(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      return {
        x:
          ((e.clientX - rect.left) / rect.width) * canvasCssWidth -
          grid!.originX,
        y:
          ((e.clientY - rect.top) / rect.height) * canvasCssHeight -
          grid!.originY,
      };
    }

    function handlePointerDown(e: PointerEvent) {
      if (!grid) return;
      const { x, y } = localPoint(e);
      mousePos.reset(x, y);
      for (const p of grid.particles) {
        if (mousePos.subtractNew(p.pos).length < GRAB_RADIUS) {
          grabbedParticle = p;
          p.pinned = true;
          canvas!.setPointerCapture(e.pointerId);
          chimeEngine.pluck({
            particleId: p.id,
            columnT: columnTForParticle(p, grid.gridW, grid.gridH),
            intensity: 1,
            force: true,
          });
          break;
        }
      }
    }

    function handlePointerMove(e: PointerEvent) {
      if (!grid) return;
      const { x, y } = localPoint(e);
      mousePos.reset(x, y);

      if (grabbedParticle) {
        grabbedParticle.pos.reset(x, y);
        grabbedParticle.oldPos.reset(x, y);
      }

      let nearestChime: Particle | null = null;
      let nearestChimeLs = Infinity;

      for (const p of grid.particles) {
        const diff = mousePos.subtractNew(p.pos);
        const ls = diff.lengthSquared;

        if (p !== grabbedParticle && ls < MOUSE_RADIUS_SQ) {
          const angle = diff.angle - Math.PI;
          const strength =
            (smoothstep(MOUSE_RADIUS_SQ, MOUSE_FALLOFF_EDGE, ls) *
              MOUSE_STRENGTH) /
            300;
          p.applyForce(
            new Vec2(Math.cos(angle) * strength, Math.sin(angle) * strength),
          );
        }

        if (ls < CHIME_RADIUS_SQ && ls < nearestChimeLs) {
          nearestChime = p;
          nearestChimeLs = ls;
        }
      }

      if (nearestChime) {
        const closeness = 1 - nearestChimeLs / CHIME_RADIUS_SQ;
        chimeEngine.pluck({
          particleId: nearestChime.id,
          columnT: columnTForParticle(nearestChime, grid.gridW, grid.gridH),
          intensity: 0.2 + closeness * 0.7,
        });
      }
    }

    function releaseGrabbed() {
      if (!grabbedParticle) return;
      grabbedParticle.pinned = grabbedParticle.originalPinnedState;
      grabbedParticle = null;
    }

    function rebuild() {
      // The gate <img> is a normal w-full/h-auto block filling this same
      // container (capped by its max-w-6xl), so the container's measured
      // width IS the image's displayed width — no separate image ref/
      // measurement needed.
      const imageWidth = container!.clientWidth;
      if (imageWidth <= 0 || imageWidth === lastWidth) return;
      lastWidth = imageWidth;

      // Doorway's pixel box at the image's current displayed size —
      // derived from the fixed source-image measurements (GATE_OPENING_*
      // in string-curtain.data.ts), not a target ratio, since the real
      // doorway shape now directly determines both dimensions.
      const scale = imageWidth / GATE_IMAGE_W_PX;
      const contentWidth = GATE_OPENING_WIDTH_PX * scale;
      const contentLeft = GATE_OPENING_LEFT_PX * scale;
      const contentTop = GATE_OPENING_TOP_PX * scale + CONTENT_TOP_OFFSET_PX;
      const contentHeight =
        GATE_OPENING_HEIGHT_PX * scale * CONTENT_HEIGHT_SCALE;

      const gridW = computeGridW(contentWidth);
      const gridH = computeGridH(contentWidth, gridW, contentHeight);
      grid = buildGrid(contentWidth, gridH);

      canvasCssWidth = contentWidth + CANVAS_PADDING_PX * 2;
      canvasCssHeight = contentHeight + CANVAS_PADDING_PX * 2;
      sizeCanvas(canvas!, canvasCssWidth, canvasCssHeight, dpr);
      // Canvas sits inside the doorway, not flush with the container's own
      // top-left — offset by the doorway's position within the image,
      // minus the swing-clearance padding (the canvas's content origin is
      // CANVAS_PADDING_PX in from its own top-left, see buildGrid/originX).
      canvas!.style.left = `${contentLeft - CANVAS_PADDING_PX}px`;
      canvas!.style.top = `${contentTop - CANVAS_PADDING_PX}px`;

      // Run a few fixed-step ticks up front so the curtain starts already
      // hanging under gravity instead of as a flat, just-spawned grid.
      for (let i = 0; i < SETTLE_TICKS; i++) solve(grid, SETTLE_DT_MS);
      paint();

      if (rafId !== null) cancelAnimationFrame(rafId);
      if (!reducedMotion) {
        lastFrameTime = performance.now();
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
      }
    }

    const resizeObserver = new ResizeObserver(() => rebuild());
    resizeObserver.observe(container);
    rebuild();

    // No pointer handlers under reduced motion, so nothing ever plucks a
    // string — skip watching visibility too, there's nothing to silence.
    let intersectionObserver: IntersectionObserver | null = null;

    if (!reducedMotion) {
      canvas.style.touchAction = "none";
      canvas.addEventListener("pointerdown", handlePointerDown);
      canvas.addEventListener("pointermove", handlePointerMove);
      canvas.addEventListener("pointerup", releaseGrabbed);
      canvas.addEventListener("pointercancel", releaseGrabbed);

      // Cuts short anything still ringing once the curtain scrolls out of
      // view, rather than letting a just-plucked note finish off-screen.
      intersectionObserver = new IntersectionObserver(([entry]) => {
        chimeEngine.setActive(entry.isIntersecting);
      });
      intersectionObserver.observe(container);
    }

    return () => {
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", releaseGrabbed);
      canvas.removeEventListener("pointercancel", releaseGrabbed);
    };
  }, [reducedMotion, chimeEngine]);

  return {
    containerRef,
    canvasRef,
    muted,
    toggleMuted: () => setMuted((prev) => !prev),
    theme: CHIME_THEMES[themeIndex],
    cycleTheme: (direction: 1 | -1) =>
      setThemeIndex(
        (prev) =>
          (prev + direction + CHIME_THEMES.length) % CHIME_THEMES.length,
      ),
  };
}
