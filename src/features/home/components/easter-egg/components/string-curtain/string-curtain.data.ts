import { TChimeProfile } from "./string-curtain.interface";

// Verlet solver tuning — values start from the reference implementation
// (marinabudarina/chimes, itself adapted from Liam Egan's "Strings physics"
// CodePen) and are trimmed for a portfolio easter egg rather than a
// full-viewport hero piece.

// Downward acceleration applied to every unpinned particle each frame.
export const GRAVITY = 0.25;

// Velocity retained per frame (Verlet drag) — closer to 1 swings longer.
export const DAMPING = 0.985;

// Constraint-solve passes per frame. Reference uses 5; kept lower here since
// this section competes with the rest of the page for main-thread time and
// doesn't need cloth-grade rigidity, just believable string sway.
export const ITERATIONS_PER_FRAME = 4;

// Vertical ("string") constraints: how far a segment can compress/stretch
// before the solver corrects it, as a fraction of its rest length.
export const COMPRESS_FACTOR = 0.02;
export const STRETCH_FACTOR = 1.1;

// Horizontal "spacer" constraints between columns — deliberately loose so
// columns keep roughly even spacing without behaving like real cloth.
export const SPACER_COMPRESS_FACTOR = 0.6;
export const SPACER_STRETCH_FACTOR = 4;

// Pointer-repel field: particles within MOUSE_RADIUS px of the pointer get
// pushed away, falling off smoothly (smoothstep) rather than as a hard edge.
export const MOUSE_RADIUS = 90;
export const MOUSE_STRENGTH = 4;

// A pointerdown within this radius of a particle grabs it (pins it to the
// pointer until release) instead of just disturbing it.
export const GRAB_RADIUS = 24;

// Target CSS-pixel spacing between columns, used to derive a responsive
// gridW from the measured container width — narrower viewports get fewer,
// not smaller, columns. Also sets row spacing (cellHeight === cellWidth in
// use-string-curtain.ts) and, via that, how many rows fit the doorway's
// locked aspect ratio — so this is still the one knob for "how dense the
// curtain reads" overall.
export const CELL_SIZE_PX = 18;
export const MIN_GRID_W = 14;
// Raised alongside the smaller CELL_SIZE_PX above — otherwise wide
// viewports (container capped at max-w-6xl) would hit this ceiling before
// reaching the target spacing and the density change wouldn't show there.
export const MAX_GRID_W = 72;

// Row count is derived per-resize from the measured width and the gate
// image's doorway aspect ratio (see GATE_OPENING_* below and rebuild() in
// use-string-curtain.ts) rather than fixed, so the content box's shape
// matches the doorway at every viewport width. Clamped to these bounds as
// a safety net for degenerate container sizes.
export const MIN_GRID_H = 10;
export const MAX_GRID_H = 60;

// Extra canvas space beyond the pinned top row's span, in CSS px, so a
// swinging string never gets clipped at the canvas edge. The section
// wrapper clips this back down with overflow-hidden. Padded generously
// (not just enough for the nominal rest length) because the physics
// settle pass (SETTLE_TICKS below) lets gravity stretch each segment up
// to STRETCH_FACTOR before the solver corrects it, so the actual settled
// chain can hang measurably longer than gridH-1 * cellHeight — too little
// padding here was clipping the bottom row.
export const CANVAS_PADDING_PX = 130;

// Background gate illustration (easter-egg-one.png, via the EasterEggBgImg
// barrel export) — pixel measurements taken directly from the source PNG
// (not eyeballed; this version has an opaque black fill rather than
// transparency, so measured by color-thresholding rather than alpha). The
// doorway is the gap between the two doors, below the lintel arch, open to
// the bottom edge of the canvas. The image itself now renders at its
// natural size (capped at max-w-6xl, never scaled/cropped) and the
// curtain's content box is derived from these to fit inside wherever the
// doorway lands — see rebuild() in use-string-curtain.ts. Re-measure these
// if the source file is ever replaced/re-cropped again.
export const GATE_IMAGE_W_PX = 1254;
export const GATE_IMAGE_H_PX = 1254;
export const GATE_OPENING_LEFT_PX = 321;
export const GATE_OPENING_TOP_PX = 427;
export const GATE_OPENING_WIDTH_PX = 611;
export const GATE_OPENING_HEIGHT_PX = 827;

// Fine adjustment on top of the raw doorway measurements above — strings
// a bit shorter than the full doorway height, and started a bit further
// down from the lintel, reads better than filling the opening exactly.
export const CONTENT_HEIGHT_SCALE = 0.75;
export const CONTENT_TOP_OFFSET_PX = 10;

// Glyph font — Cinzel is loaded site-wide (layout.tsx) but otherwise unused
// at body scale, so reusing it here needs no new font and keeps this
// visually distinct from the Protest Revolution headings and the Cinzel
// Decorative sharingan line.
export const GLYPH_FONT_FAMILY = 'var(--font-cinzel), "Cinzel", Georgia, serif';
export const GLYPH_FONT_SIZE_PX = 15;

// --- Audio (string-curtain.chimes.ts) ---
// Two original synthesized "instruments," not ports of any reference
// implementation's timbre and not transcriptions of any melody — each is a
// mood translated into DSP parameters (scale, envelope, harmonic content,
// reverb), not a copy of a recording. Trigger plumbing below (radius,
// throttle, fade) is shared across both since it's UX mechanics, not
// instrument color.

// A pointermove within this radius of a particle plucks it softly (scaled
// by proximity). Deliberately tighter than MOUSE_RADIUS above — the physics
// disturbance field is meant to feel broad, the audio trigger precise, so
// dragging across the curtain doesn't fire a note per particle it brushes.
export const CHIME_RADIUS_PX = 40;

// Floor between plucks so a fast drag across many strings reads as a
// glissando of distinct notes rather than an unmusical buzz.
export const MIN_PLUCK_INTERVAL_MS = 70;

// Fade time used both when the section leaves the viewport and when muted
// — fast enough to read as "stopped," not an abrupt click.
export const VIEWPORT_FADE_S = 0.15;

// "Temple Chimes" — dark, low, mournful. Hirajoshi (in scale) minor
// pentatonic, long decay, heavy reverb, breathy/wavering attack.
const TEMPLE_CHIMES: TChimeProfile = {
  id: "temple",
  label: "Temple Chimes",

  // Hirajoshi pentatonic, semitones from the root. Columns map to
  // quantized scale degrees (not a continuous sweep), so plucking reads as
  // a tuned instrument rather than a siren.
  scaleRootHz: 146.83, // D3 — low/dark register.
  scaleIntervalsSemitones: [0, 2, 3, 7, 8],
  scaleOctaves: 3,

  // Attack is near-instant (a pluck, not a swell); decay is long on
  // purpose — combined with the reverb below, this is most of what gives
  // the voice its mournful, let-it-hang quality rather than a percussive
  // one.
  pluckAttackS: 0.004,
  pluckDecayS: 1.6,
  pluckPeakGain: 0.5,

  // Harmonic partials (unlike a bell's inharmonic overtones, a plucked
  // string's overtones are whole-number multiples of the fundamental),
  // weighted toward the fundamental — warmer, less bright/plucky than an
  // even spread across harmonics.
  pluckPartials: [
    [1, 0.64],
    [2, 0.2],
    [3, 0.1],
    [4, 0.05],
  ],

  // Slow pitch drift via detune — the "yuri" wavering technique on
  // shakuhachi/koto — plus each note bending up into pitch instead of
  // starting on it, a soft breath-instrument attack articulation (same
  // shape every note, not a melodic figure).
  vibratoRateHz: 5.5,
  vibratoDepthCents: 9,
  pitchBendStartCents: -35,
  pitchBendTimeS: 0.07,

  // Wide/low noise burst — reads as breath, not a pick-click.
  breathNoiseDurS: 0.06,
  breathNoiseGain: 0.12,
  breathNoiseFilterHz: 1800,
  breathNoiseQ: 1.8,

  // Long procedural reverb tail (shaped noise, built once per theme — no
  // impulse-response sample file) — pushes this toward "a courtyard/temple
  // space" without touching melody at all.
  reverbDecayS: 2.4,
  reverbWetMix: 0.32,
  masterVolume: 0.3,
};

// "Soaring Flight" — bright, energetic, lively. Major pentatonic, short
// punchy decay, light/short reverb, crisp near-instant attack, minimal
// vibrato. The contrasting mood to Temple Chimes above.
const SOARING_FLIGHT: TChimeProfile = {
  id: "flight",
  label: "Soaring Flight",

  // Major pentatonic, higher root — bright/open rather than dark/minor.
  scaleRootHz: 220, // A3.
  scaleIntervalsSemitones: [0, 2, 4, 7, 9],
  scaleOctaves: 2,

  // Short, punchy — a lively pluck that doesn't linger, the opposite of
  // Temple Chimes' let-it-hang decay.
  pluckAttackS: 0.003,
  pluckDecayS: 0.55,
  pluckPeakGain: 0.55,

  // Brighter partial mix — more energy in the upper harmonics instead of
  // the fundamental-heavy warm stack, reads as crisp/strummed rather than
  // round/mellow.
  pluckPartials: [
    [1, 0.5],
    [2, 0.26],
    [3, 0.14],
    [4, 0.07],
    [5, 0.03],
  ],

  // Minimal wavering and almost no pitch-bend — a precise, immediate
  // attack rather than a breath-instrument scoop into pitch.
  vibratoRateHz: 6.5,
  vibratoDepthCents: 3,
  pitchBendStartCents: -10,
  pitchBendTimeS: 0.025,

  // Short, high, focused noise burst — reads as a pick, not breath.
  breathNoiseDurS: 0.02,
  breathNoiseGain: 0.14,
  breathNoiseFilterHz: 4200,
  breathNoiseQ: 4,

  // Short, subtle reverb — present but immediate/live, not a distant hall.
  reverbDecayS: 1.1,
  reverbWetMix: 0.16,
  masterVolume: 0.32,
};

export const CHIME_THEMES: TChimeProfile[] = [TEMPLE_CHIMES, SOARING_FLIGHT];
