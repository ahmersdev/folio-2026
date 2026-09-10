import { DecorativeLines } from "@/components";
import { FOOTER_LINE_GAP_PX, FOOTER_LINE_HEIGHTS_PX } from "./footer-main.data";

export default function FooterMain() {
  return (
    <section className="relative">
      <DecorativeLines
        heights={FOOTER_LINE_HEIGHTS_PX}
        gap={FOOTER_LINE_GAP_PX}
        className="w-full"
      />

      <div className="mt-1 bg-jet-black">FooterMain</div>
    </section>
  );
}
