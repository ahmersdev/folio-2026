import HandwrittenText from "@/components/handwritten-text";
import TaglineBanner from "@/components/tagline-banner";
import TypewriterText from "@/components/typewriter-text";
import { cn } from "@/lib/utils";

export default function HeroCopy() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-24 flex flex-col max-w-3xl items-start text-left gap-5 px-6 sm:top-28 sm:px-10 lg:px-16">
      <HandwrittenText text="AHMER" />

      <TypewriterText text="SOFTWARE ENGINEER" />

      <TaglineBanner />

      <p
        className={cn(
          "text-muted-foreground font-normal leading-relaxed",
          "text-base sm:text-lg max-w-lg",
          "[text-shadow:0_1px_4px_rgba(0,0,0,0.8)]",
        )}
      >
        I build full-stack web and mobile products using{" "}
        <span className="text-foreground font-medium">React</span>,{" "}
        <span className="text-foreground font-medium">Next.js</span>, and{" "}
        <span className="text-foreground font-medium">React Native</span> up
        front, with <span className="text-foreground font-medium">Express</span>
        , <span className="text-foreground font-medium">NestJS</span>,{" "}
        <span className="text-foreground font-medium">MongoDB</span>, and{" "}
        <span className="text-foreground font-medium">Postgres</span>{" "}
        underneath.
      </p>
    </div>
  );
}
