import HandwrittenText from "@/components/handwritten-text";
import TaglineBanner from "@/components/tagline-banner";
import TypewriterText from "@/components/typewriter-text";

export default function HeroCopy() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-24 flex flex-col max-w-3xl items-start text-left gap-5 px-6 sm:top-28 sm:px-10 lg:px-16">
      <HandwrittenText text="AHMER" />

      <TypewriterText text="SOFTWARE ENGINEER" />

      <TaglineBanner />

      <p className="max-w-lg text-muted-foreground">
        I build full-stack web and mobile products using React, Next.js, and
        React Native up front, with Express, Nest.js, MongoDB, and Postgres
        underneath.
      </p>
    </div>
  );
}
