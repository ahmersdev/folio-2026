import { LinkedinIcon, WhatsappIcon } from "@/assets/icons";
import { IHeroSocialLink, IHeroStat } from "./hero.interface";

export const HERO_TITLE = "AHMER DOCK";
// Hardcoded line break (not left to max-width auto-wrap): "Digital Agency"
// combined sits right at the edge of the container width, so a font-metrics
// hair's-breadth difference between font builds can tip it onto a 3rd line.
export const HERO_SUBTITLE_LINES = ["BUILT-TO-SHIP", "FULL STACK DEV"];
export const HERO_DESCRIPTION =
  "A FULL STACK DEVELOPER WHO TAKES PRODUCTS FROM IDEA TO LAUNCH, BUILDING THE FRONTEND, BACKEND, AND EVERYTHING IN BETWEEN.";

export const HERO_SOCIAL_LINKS: IHeroSocialLink[] = [
  {
    label: "Whatsapp",
    href: "https://wa.me/+923154806474",
    Icon: WhatsappIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ahmerdock/",
    Icon: LinkedinIcon,
  },
];

export const HERO_STAT: IHeroStat = {
  value: "4+ YRS",
  label: "SHIPPING PRODUCTS",
};

// Image wrapper zooms out into place as the "cover" for the section reveal.
export const IMAGE_REVEAL_START_S = 1.6;
export const IMAGE_REVEAL_DURATION_S = 1.5;
export const IMAGE_REVEAL_SCALE_X_FROM = 0.3;
export const IMAGE_REVEAL_SCALE_Y_FROM = 0.2;
export const IMAGE_REVEAL_EASE = "power1.inOut";

// Title/subtitle/description reveal char-by-char via SplitText masks.
export const TITLE_REVEAL_START_S = 2.57;
export const TITLE_REVEAL_DURATION_S = 1;
export const TITLE_REVEAL_STAGGER_AMOUNT_S = 0.5;
export const TITLE_REVEAL_EASE = "back.inOut";

export const SUBTITLE_REVEAL_START_S = 3.46;
export const SUBTITLE_REVEAL_DURATION_S = 1;
export const SUBTITLE_REVEAL_STAGGER_AMOUNT_S = 0.5;
export const SUBTITLE_REVEAL_EASE = "back.inOut";

export const DESCRIPTION_REVEAL_START_S = 4.06;
export const DESCRIPTION_REVEAL_DURATION_S = 0.8;
export const DESCRIPTION_REVEAL_STAGGER_AMOUNT_S = 0.4;
export const DESCRIPTION_REVEAL_EASE = "power3.out";

// Social links and the stat block fade + rise in as solid blocks (no split).
export const PROOF_AREA_REVEAL_DURATION_S = 0.5;
export const PROOF_AREA_REVEAL_Y_PX = 30;
export const PROOF_AREA_REVEAL_EASE = "power1.out";

export const SOCIAL_LINKS_REVEAL_START_S = 4.89;
export const STAT_REVEAL_START_S = 5.05;

// Cursor-follow parallax on the foreground image (see use-hero.ts's
// startParallax). Max px the image translates toward the cursor at full
// deflection (cursor at the section's own edge). X is kept close to the
// reference design's magnitude; Y is capped noticeably lower so the photo
// never drifts far enough to look unmoored from the rest of the layout, and
// quickTo's power3.out easing never overshoots past this either way.
export const PARALLAX_MAX_OFFSET_X_PX = 18;
export const PARALLAX_MAX_OFFSET_Y_PX = 6;
// Longer than custom-cursor's 0.25s dot-follow: a large background layer
// should read as "heavy"/parallax, not as a second cursor.
export const PARALLAX_QUICK_TO_DURATION_S = 0.6;
export const PARALLAX_QUICK_TO_EASE = "power3.out";
