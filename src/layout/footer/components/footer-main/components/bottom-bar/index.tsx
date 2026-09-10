import { BRAND_NAME, BRAND_TEXT } from "@/constants";

export default function BottomBar() {
  return (
    <div className="mx-auto flex flex-col items-center gap-6 pb-10 lg:flex-row lg:items-end lg:justify-between">
      <p
        style={{
          background: "var(--gradient-heading)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
        className="overflow-hidden font-heading text-(length:--brand-text-size) leading-[0.8] tracking-[-0.03em] whitespace-nowrap opacity-30"
      >
        {BRAND_TEXT}
      </p>

      <div className="flex flex-col items-center gap-2 text-center text-white/80 lg:items-end lg:text-right">
        <p className="text-(length:--_typography---font-sizes--body--md)">
          © {new Date().getFullYear()} {BRAND_NAME}.
        </p>
        <p className="text-(length:--_typography---font-sizes--body--md)">
          ALL RIGHTS RESERVED.
        </p>
      </div>
    </div>
  );
}
