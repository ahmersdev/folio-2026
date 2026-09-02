import { HEADING_COPY } from "../../sharingan-reveal.data";
import { IRevealHeadingProps } from "./reveal-heading.interface";
import useRevealHeading from "./use-reveal-heading";

export default function RevealHeading({ progress }: IRevealHeadingProps) {
  const { charOpacities } = useRevealHeading(progress);

  return (
    <h2 className="mx-auto max-w-2xl text-center font-cinzel-decorative text-xl tracking-wider text-foreground [text-shadow:0_0_20px_rgba(194,36,54,0.5)] sm:text-2xl md:text-3xl">
      <span aria-hidden="true">
        {HEADING_COPY.split("").map((char, i) => (
          <span key={i} style={{ opacity: charOpacities[i] }}>
            {char}
          </span>
        ))}
      </span>
      <span className="sr-only">{HEADING_COPY}</span>
    </h2>
  );
}
