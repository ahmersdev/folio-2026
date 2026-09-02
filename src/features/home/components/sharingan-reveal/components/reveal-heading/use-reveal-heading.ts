import { useMotionValueEvent, type MotionValue } from "motion/react";
import { useState } from "react";
import {
  HEADING_COPY,
  HEADING_PHASE_END,
  HEADING_PHASE_START,
} from "../../sharingan-reveal.data";

// How many characters' worth of scroll progress each individual character
// takes to fade from 0 to 1 opacity. Keeping several characters mid-fade at
// once (rather than a hard per-character on/off cutoff) is what reads as a
// soft "fading in" cascade instead of a blunt pop-in.
const FADE_SPAN_CHARS = 4;

const CHAR_COUNT = HEADING_COPY.length;
const PER_CHAR_SPAN = (HEADING_PHASE_END - HEADING_PHASE_START) / CHAR_COUNT;

function computeCharOpacities(progressValue: number) {
  return Array.from({ length: CHAR_COUNT }, (_, i) => {
    const start = HEADING_PHASE_START + i * PER_CHAR_SPAN;
    const end = start + PER_CHAR_SPAN * FADE_SPAN_CHARS;
    return Math.min(1, Math.max(0, (progressValue - start) / (end - start)));
  });
}

export default function useRevealHeading(progress: MotionValue<number>) {
  // The full HEADING_COPY is always rendered (see index.tsx) — only each
  // character's opacity changes — so the paragraph's line-wrapping and
  // text-center alignment are always based on the complete, final string.
  // That's what keeps already-revealed text from shifting: there's no
  // shorter partial string ever being laid out/re-centered mid-reveal.
  const [charOpacities, setCharOpacities] = useState(() =>
    computeCharOpacities(progress.get()),
  );

  // use-sharingan-reveal.ts swaps which MotionValue "progress" actually is
  // (e.g. scrubProgress -> staticProgress once the reduced-motion flag
  // resolves post-hydration) — a value that's never .set() again (like a
  // static progress pinned at 1) never fires "change", so the subscription
  // below alone would leave charOpacities stuck at whatever the *previous*
  // source's value was. Detecting the swap during render and resyncing
  // immediately is the React-endorsed pattern for resetting derived state
  // when an identity changes — not a useEffect (which would only run
  // *after* a stale paint, and wouldn't be the sanctioned
  // setState-in-effect exception either).
  const [lastProgress, setLastProgress] = useState(progress);
  if (progress !== lastProgress) {
    setLastProgress(progress);
    setCharOpacities(computeCharOpacities(progress.get()));
  }

  useMotionValueEvent(progress, "change", (value) => {
    setCharOpacities(computeCharOpacities(value));
  });

  return { charOpacities };
}
