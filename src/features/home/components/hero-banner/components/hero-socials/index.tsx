import { ArrowUpRight } from "lucide-react";
import { SOCIAL_LINKS } from "@/constants";
import { cn } from "@/lib/utils";
import { SharinganIrisIcon } from "@/assets/icons";

export default function HeroSocials() {
  return (
    <div
      className={cn(
        "pointer-events-auto fixed right-6 bottom-8 z-10 flex flex-col sm:right-10 sm:bottom-10 sm:w-48",
        "divide-y divide-border/60 rounded-xl border border-border/40 p-2",
        "backdrop-blur-md shadow-2xl transition-all duration-300",
      )}
    >
      {SOCIAL_LINKS.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "group relative flex items-center justify-between gap-3 px-3 py-2.5 sm:py-3",
            "font-cinzel text-sm font-bold text-foreground tracking-wider transition-all duration-300",
            "hover:text-primary",
            "first:rounded-t-lg last:rounded-b-lg",
          )}
        >
          <span className="flex items-center gap-2.5">
            <Icon className="size-4 shrink-0 transition-colors duration-300 group-hover:text-primary" />
            <span>{label}</span>
          </span>

          <div className="relative flex size-4.5 items-center justify-center shrink-0">
            <ArrowUpRight
              className={cn(
                "size-4.5 transition-all duration-300",
                "group-hover:opacity-0 group-hover:scale-75",
              )}
              aria-hidden="true"
            />

            <SharinganIrisIcon
              className={cn(
                "absolute inset-0 size-4 opacity-0 transition-all duration-500 ease-out scale-50",
                "group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-360",
                "filter-[drop-shadow(0_0_6px_var(--primary))]",
              )}
            />
          </div>
        </a>
      ))}
    </div>
  );
}
