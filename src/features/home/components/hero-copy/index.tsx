import HandwrittenText from "@/components/handwritten-text";
import TypewriterText from "@/components/typewriter-text";

export default function HeroCopy() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-24 z-10 flex flex-col max-w-3xl items-start text-left gap-5 px-6 sm:top-28 sm:px-10 lg:px-16">
      <HandwrittenText
        text="AHMER"
        className="text-foreground tracking-[0.2em] text-4xl sm:text-5xl font-bold"
      />

      <TypewriterText
        text="Software Engineer"
        className="text-4xl sm:text-5xl"
      />

      <h1 className="font-display text-foreground text-5xl leading-tight normal-case tracking-normal sm:text-6xl">
        I see the whole system{" "}
        <span className="text-primary">before I write a line.</span>
      </h1>

      <p className="max-w-lg text-muted-foreground">
        I build full-stack web and mobile products using React, Next.js, and
        React Native up front, with Express, Nest.js, MongoDB, and Postgres
        underneath.
      </p>
    </div>
  );
}
