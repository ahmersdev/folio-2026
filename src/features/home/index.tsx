"use client";

import dynamic from "next/dynamic";
import {
  HandwrittenText,
  HeroCopy,
  ForegroundCrows,
  BackgroundScene,
} from "./components";

const DynamicBackgroundScene = dynamic(() => Promise.resolve(BackgroundScene), {
  ssr: false,
});
const DynamicForegroundCrows = dynamic(() => Promise.resolve(ForegroundCrows), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="relative h-screen w-full">
      <DynamicBackgroundScene />

      <div className="pointer-events-none absolute inset-x-0 top-[30%] flex flex-col items-center gap-6 px-6 py-16">
        <HandwrittenText
          text="Software Engineer"
          className="text-4xl sm:text-5xl"
        />
        <HeroCopy />
      </div>

      <DynamicForegroundCrows />
    </div>
  );
}
