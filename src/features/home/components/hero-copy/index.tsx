import { SOCIAL_LINKS } from "@/constants";

export default function HeroCopy() {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <h1 className="font-display text-foreground text-4xl leading-tight normal-case tracking-normal sm:text-5xl">
        I see the whole system{" "}
        <span className="text-primary">before I write a line.</span>
      </h1>

      <p className="max-w-lg text-muted-foreground">
        I build full-stack web and mobile products using React, Next.js, and
        React Native up front, with Express, Nest.js, MongoDB, and Postgres
        underneath.
      </p>

      <div className="pointer-events-auto flex gap-3">
        {SOCIAL_LINKS.map(({ href, label, Icon }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            target="_blank"
            rel="noopener noreferrer"
            className="border-border text-muted-foreground hover:border-primary/50 hover:text-primary flex size-10 items-center justify-center rounded-full border transition-colors"
          >
            <Icon className="size-4" />
          </a>
        ))}
      </div>
    </div>
  );
}
