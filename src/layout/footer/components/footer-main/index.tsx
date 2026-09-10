import { DecorativeLines } from "@/components";
import { FOOTER_LINE_GAP_PX, FOOTER_LINE_HEIGHTS_PX } from "./footer-main.data";
import { BottomBar, TitleBar } from "./components";

export default function FooterMain() {
  return (
    <section className="relative">
      <DecorativeLines
        heights={FOOTER_LINE_HEIGHTS_PX}
        gap={FOOTER_LINE_GAP_PX}
        className="w-full"
      />

      <div className="mt-1 bg-jet-black px-[5%] pt-[clamp(4rem,calc(12.8vw-2.140625rem),9.375rem)]">
        <TitleBar />
        <BottomBar />
      </div>
    </section>
  );
}
