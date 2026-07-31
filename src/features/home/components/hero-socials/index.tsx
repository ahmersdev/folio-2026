import { ArrowUpRight } from "lucide-react";
import { SOCIAL_LINKS } from "@/constants";

export default function HeroSocials() {
  return (
    <div className="pointer-events-auto fixed right-6 bottom-8 z-10 flex w-40 flex-col divide-y divide-primary sm:right-10 sm:bottom-10 sm:w-48">
      {SOCIAL_LINKS.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-between gap-3 py-2.5 text-sm text-foreground transition-colors hover:text-primary sm:py-3"
        >
          <span className="flex items-center gap-2.5">
            <Icon className="size-4 shrink-0" />
            <span>{label}</span>
          </span>
          <ArrowUpRight
            className="size-3.5 shrink-0 transition-transform duration-200 motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </a>
      ))}
    </div>
  );
}
