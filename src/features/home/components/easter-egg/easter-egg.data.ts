// Every string in the curtain shares one long ribbon of text that flows
// through the grid column-by-column and wraps (see charForCell in
// string-curtain.utils.ts) — so instead of a single fixed phrase, this pulls
// together the site's own real copy from across the page (name, role,
// tagline, bio, the sharingan reveal's line, and the social labels) rather
// than duplicating placeholder text here.
const CURTAIN_SOURCES = [
  "AHMER",
  "SOFTWARE ENGINEER",
  "I SEE THE WHOLE SYSTEM BEFORE I WRITE A LINE.",
  "I BUILD FULL-STACK WEB AND MOBILE PRODUCTS USING REACT.JS, NEXT.JS, AND REACT NATIVE UP FRONT, WITH EXPRESS, NESTJS, MONGODB, AND POSTGRES UNDERNEATH.",
  "A SYSTEM'S OUTCOME IS DECIDED BEFORE THE FIRST LINE IS WRITTEN. I MAKE SURE I'M THE ONE WHO SAW IT COMING.",
  "GITHUB · LINKEDIN · EMAIL · WHATSAPP",
];

export const CURTAIN_TEXT = CURTAIN_SOURCES.join("·");

export const HINT_COPY = "pull a string";
