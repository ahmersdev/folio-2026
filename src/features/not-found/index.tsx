import Image from "next/image";
import { NotFoundImg } from "@/assets/images";
import { Caption, CustomButton } from "@/components";
import {
  NOT_FOUND_CAPTION_EMPHASIS,
  NOT_FOUND_CAPTION_PREFIX,
  NOT_FOUND_CAPTION_SUFFIX,
  NOT_FOUND_CTA_HREF,
  NOT_FOUND_CTA_LABEL,
} from "./not-found.data";

export default function NotFound() {
  return (
    <section className="flex h-dvh flex-col items-center justify-center gap-[clamp(32px,4.17vw,60px)] px-[5%] text-center text-black-secondary">
      <Caption
        prefix={NOT_FOUND_CAPTION_PREFIX}
        emphasis={NOT_FOUND_CAPTION_EMPHASIS}
        suffix={NOT_FOUND_CAPTION_SUFFIX}
      />

      <div className="max-w-[clamp(260px,42.78vw,616px)]">
        <Image src={NotFoundImg} alt="Not Found" preload />
      </div>

      <CustomButton label={NOT_FOUND_CTA_LABEL} href={NOT_FOUND_CTA_HREF} />
    </section>
  );
}
