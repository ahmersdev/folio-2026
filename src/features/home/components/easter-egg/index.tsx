"use client";

import dynamic from "next/dynamic";
import { StringCurtain } from "./components";
import { HINT_COPY } from "./easter-egg.data";
import useEasterEgg from "./use-easter-egg";

// Canvas 2D + pointer-driven physics are browser-only, same reason
// sharingan-reveal's sequence canvas is dynamically imported with
// ssr: false.
const DynamicStringCurtain = dynamic(() => Promise.resolve(StringCurtain), {
  ssr: false,
});

export default function EasterEgg() {
  const { reducedMotion } = useEasterEgg();

  return (
    <section className="relative w-full overflow-hidden px-6 py-16 sm:px-10 lg:px-16">
      <p className="mb-6 text-center text-sm tracking-[0.3em] text-muted-foreground uppercase">
        {HINT_COPY}
      </p>

      <DynamicStringCurtain reducedMotion={reducedMotion} />
    </section>
  );
}
