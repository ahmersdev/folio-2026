import { Logo } from "@/assets/images";
import Image from "next/image";
import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl rounded-full border border-border/60 bg-background/80 px-6 py-3 shadow-lg backdrop-blur">
      <Link
        href="/"
        className="font-protest-revolution text-2xl tracking-normal flex items-baseline w-fit"
      >
        <Image
          src={Logo}
          alt="A"
          width={2370}
          height={4084}
          className="h-[0.89em] w-auto translate-y-[0.06em]"
          priority
        />
        hmer<span className="text-primary">.</span>
      </Link>
    </header>
  );
}
