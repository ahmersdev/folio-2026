import { useSyncExternalStore } from "react";
import { prefersReducedMotion } from "./easter-egg.utils";

// Doesn't need to react to a live change (matches the one-shot convention
// elsewhere in this codebase), so subscribe is a no-op — but
// useSyncExternalStore is still what's needed here, not useState+useEffect:
// its getServerSnapshot is used for both the SSR pass *and* the client's
// first hydration render, so the two always agree and React never flags a
// hydration mismatch. Mirrors use-sharingan-reveal.ts.
const noSubscription = () => () => {};
const getServerSnapshotFalse = () => false;

export default function useEasterEgg() {
  const reducedMotion = useSyncExternalStore(
    noSubscription,
    prefersReducedMotion,
    getServerSnapshotFalse,
  );

  return { reducedMotion };
}
