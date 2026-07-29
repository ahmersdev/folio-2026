import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="font-display text-2xl tracking-normal">
          Ahmer<span className="text-primary">.</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
