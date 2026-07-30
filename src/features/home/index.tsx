"use client";

import dynamic from "next/dynamic";
import { HandwrittenText, HeroCopy } from "./components";

const RedMoonScene = dynamic(() => import("./components/red-moon-scene"), {
  ssr: false,
});

export default function HeroV2() {
  return (
    <div className="relative h-screen w-full">
      <RedMoonScene />

      <div className="pointer-events-none absolute inset-x-0 top-[38%] flex flex-col items-center gap-6 px-6 py-16 [background:radial-gradient(ellipse_65%_75%_at_50%_45%,rgba(0,0,0,0.6),transparent_75%)]">
        <HandwrittenText
          text="Software Engineer"
          className="text-4xl sm:text-5xl"
        />
        <HeroCopy />
      </div>
    </div>
  );
}
