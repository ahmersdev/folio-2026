import Image from "next/image";
import Link from "next/link";
import { CustomButton } from "@/components";
import { cn } from "@/lib";
import { WORKS_CTA_LABEL } from "../../featured-works.data";
import { IWorkCardProps } from "./work-card.interface";
import { RADIUS_CLASS } from "./work-card.data";

export default function WorkCard(props: IWorkCardProps) {
  const { work, index, total } = props;

  return (
    // Pinned (768px+, motion allowed): every card after the first overlaps it
    // from the top, earlier cards stacked higher (zIndex), and the hook
    // offsets/peels them. Otherwise cards sit in normal flow and the zIndex
    // has no effect.
    <article
      style={{ backgroundColor: work.paneColor, zIndex: total - index }}
      className={cn(
        "group relative mx-auto grid w-full max-w-370 grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] overflow-clip min-[768px]:grid-cols-2",
        RADIUS_CLASS,
        index > 0 &&
          "motion-safe:min-[768px]:absolute motion-safe:min-[768px]:inset-x-0 motion-safe:min-[768px]:top-0",
      )}
    >
      <div className="flex flex-col items-start justify-center px-5 py-8 min-[480px]:px-8 min-[480px]:py-10 min-[768px]:py-15 min-[992px]:px-15 min-[992px]:py-20">
        <h3 className="max-w-none text-(length:--_typography---font-sizes--heading--h4) leading-none font-normal tracking-[-0.01em] text-black-secondary uppercase min-[768px]:max-w-[18ch]">
          <Link
            href={work.href}
            className="underline decoration-transparent decoration-[3px] transition-[text-decoration-color] duration-300 hover:decoration-black-secondary"
          >
            {work.title}
          </Link>
        </h3>

        <p className="mt-4 mb-8 max-w-130 text-base leading-6 text-black-secondary min-[480px]:mt-5 min-[480px]:mb-12 min-[992px]:mt-6 min-[992px]:mb-15 min-[992px]:text-xl min-[992px]:leading-7.5 min-[1920px]:max-w-151.75">
          {work.description}
        </p>

        <CustomButton
          label={WORKS_CTA_LABEL}
          href={work.href}
          notchColor={work.paneColor}
        />
      </div>

      <div
        style={{ backgroundColor: work.imagePaneColor }}
        className="flex items-center justify-center p-6 min-[480px]:px-8 min-[480px]:py-13 min-[768px]:p-8 min-[1440px]:py-20"
      >
        <div
          className={cn(
            "relative aspect-square w-full max-w-125 overflow-clip",
            RADIUS_CLASS,
          )}
        >
          <Image
            src={work.image}
            alt={work.title}
            fill
            sizes="(min-width: 768px) 500px, 90vw"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
          />
        </div>
      </div>
    </article>
  );
}
