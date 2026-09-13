import { FOOTER_LINE_GAP_PX, FOOTER_LINE_HEIGHTS_PX } from "./footer-main.data";
import { BottomBar, TitleBar } from "./components";
import { MENU_NAV_LINKS } from "@/constants";
import { DecorativeLines, MenuLink } from "@/layout/components";

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
        <nav aria-label="Footer">
          <ul className="flex flex-col pt-12 pb-[clamp(4rem,calc(14.5833vw-3rem),10.125rem)]">
            {MENU_NAV_LINKS.map(({ label, href }, index) => (
              <MenuLink key={label} label={label} href={href} index={index} />
            ))}
          </ul>
        </nav>
        <BottomBar />
      </div>
    </section>
  );
}
