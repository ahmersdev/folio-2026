"use client";

import dynamic from "next/dynamic";
import {
  HeroCopy,
  HeroSocials,
  ForegroundCrows,
  BackgroundScene,
} from "./components";
import ScrollIndicator from "@/components/scroll-indicator";

const DynamicBackgroundScene = dynamic(() => Promise.resolve(BackgroundScene), {
  ssr: false,
});
const DynamicForegroundCrows = dynamic(() => Promise.resolve(ForegroundCrows), {
  ssr: false,
});

export default function HeroBanner() {
  return (
    <div className="relative h-screen w-full">
      <DynamicBackgroundScene />

      <HeroCopy />

      <ScrollIndicator />

      <HeroSocials />

      <DynamicForegroundCrows />
    </div>
  );
}
