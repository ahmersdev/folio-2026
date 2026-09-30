import {
  Progress2022Img,
  Progress2023Img,
  Progress2024Img,
  Progress2025Img,
  Progress2026Img,
} from "@/assets/images";
import { IProgressItem } from "./progress.interface";

export const PROGRESS_ITEMS: IProgressItem[] = [
  {
    year: "2026",
    badgeLabel: "ONE BUILD PROCESS",
    badgeColor: "#BCE70C",
    description:
      "Frontend and backend stopped being two different jobs, they became one continuous build I move through every day, first component to last deployment.",
    image: Progress2026Img,
  },
  {
    year: "2025",
    badgeLabel: "SHIPPED TO BOTH STORES",
    badgeColor: "#FF6EB0",
    description:
      "Built a mobile app end to end, from first commit to the App Store and Play Store, three thousand plus downloads later it stopped being just a project.",
    image: Progress2025Img,
  },
  {
    year: "2024",
    badgeLabel: "STEPPED UP TO LEAD",
    badgeColor: "#C5BAFF",
    description:
      "Two years of reps was enough, twelve developers became my responsibility, leading people got added to writing code.",
    image: Progress2024Img,
  },
  {
    year: "2023",
    badgeLabel: "SCALING UP",
    badgeColor: "#3DECD5",
    description:
      "Multiple projects running at once meant no single piece of the stack to hide behind, state, performance, and SEO all became mine to own, not just interfaces.",
    image: Progress2023Img,
  },
  {
    year: "2022",
    badgeLabel: "STARTING OUT",
    badgeColor: "#FFC145",
    description:
      "No team yet, no say in decisions, just client work and the kind of reps that come before anyone hands you responsibility for other people.",
    image: Progress2022Img,
  },
];

// Smoothing on the scrub itself; same role as about-me's TITLE_REVEAL_SCRUB.
export const PROGRESS_ROW_SCRUB = 0.8;

// The reference ships 6 cards. Its scroll timing and end position are tuned
// for that count, so use-progress.ts scales them to our own card count.
export const PROGRESS_REFERENCE_ITEM_COUNT = 6;

// Matches the `max-width: 991px` tier in globals.css and the sticky classes
// in index.tsx.
export const PROGRESS_TABLET_MAX_WIDTH = 991;

// Measured from the reference (flat 300vh track, 6 cards):
// - endShare: the row stops once it has moved this share of its own width,
//   so the last card rests at a fixed spot (desktop 70%, tablet/phone 84%).
// - start / end: ScrollTrigger positions the scrub runs between.
// - travelVh: scroll distance of that run, in viewport heights, for the
//   reference's 6 cards. Our 9 cards keep the same px-per-px pace by
//   stretching it (see use-progress.ts).
// - tailVh: pinned scroll left after the run ends (track = travel + tail).
export const PROGRESS_SCROLL = {
  desktop: {
    endShare: 0.7,
    start: "top top",
    end: "bottom 130%",
    travelVh: 1.7,
    tailVh: 1.3,
  },
  tablet: {
    endShare: 0.84,
    start: "top 50%",
    end: "bottom bottom",
    travelVh: 2.5,
    tailVh: 0.5,
  },
} as const;
