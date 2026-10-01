import { IStep } from "./steps.interface";

export const STEPS_TITLE = "PLAN, ALIGN, AND SHIP";
export const STEPS_SUBTITLE =
  "I stay with you from the first call to launch day, and the fixes that come after.";

export const STEPS: IStep[] = [
  {
    count: "01",
    title: "COLLECT BRIEF",
    description:
      "We start with a call so I understand the real problem, then I write it up as a clear requirements doc.",
  },
  {
    count: "02",
    title: "LOCK THE SCOPE",
    description:
      "If you have Figma designs, I build from them. If not, the requirements doc guides the interface.",
  },
  {
    count: "03",
    title: "BUILD IN MILESTONES",
    description:
      "I break the work into milestones with clear estimates, and you see real progress at every stage.",
  },
  {
    count: "04",
    title: "SHIP & SUPPORT",
    description:
      "I handle deployment, store submission, and handover docs, then stay around for post-launch fixes.",
  },
];

// The open/close toggle only exists at Tailwind's `lg` and up (the line,
// markers and buttons are hidden below it, and every description is always
// visible). Must equal `lg` (1024px): matchMedia can't read the breakpoint
// from the `lg:` classes in steps/index.tsx and step-card/index.tsx.
export const STEPS_DESKTOP_QUERY = "(min-width: 1024px)";

// Open/close — height, title swap and chevron rotation run together on one
// shared duration/ease (pulled from the reference's interaction data). Keep
// the ease free of overshoot: a back-style curve on an auto-height tween would
// bounce the card's bottom edge.
export const STEP_TOGGLE_DURATION_S = 0.7;
export const STEP_TOGGLE_EASE = "power3.out";
// Reduced motion lands the toggle near-instantly. Not 0: a zero-duration tween
// renders its end state the moment it is created, which would start every
// card open.
export const STEP_TOGGLE_REDUCED_DURATION_S = 0.001;

// Toggle button hover (scale only). Source used the CSS-standard "ease"
// keyword; "power1.inOut" is GSAP's closest named equivalent, same as
// custom-button.
export const STEP_BUTTON_HOVER_SCALE = 1.05;
export const STEP_BUTTON_HOVER_DURATION_S = 0.5;
export const STEP_BUTTON_HOVER_EASE = "power1.inOut";

// Header reveal — title then subtitle, char by char through SplitText masks,
// played once when the header's top reaches 90% of the viewport. Eases match
// the hero's title / description values (same reference preset ids), kept
// local so each section can be tuned on its own.
export const STEPS_REVEAL_SCROLL_START = "top 90%";

export const STEPS_TITLE_REVEAL_DURATION_S = 1;
export const STEPS_TITLE_REVEAL_STAGGER_AMOUNT_S = 0.5;
export const STEPS_TITLE_REVEAL_EASE = "back.inOut";

export const STEPS_SUBTITLE_REVEAL_START_S = 0.2;
export const STEPS_SUBTITLE_REVEAL_DURATION_S = 0.8;
export const STEPS_SUBTITLE_REVEAL_STAGGER_AMOUNT_S = 0.4;
export const STEPS_SUBTITLE_REVEAL_EASE = "power3.out";
