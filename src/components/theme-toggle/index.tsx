"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@base-ui/react/switch";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ClosedEye, SharinganEye } from "@/assets/icons";
import { TOGGLE_TRAVEL } from "@/constants";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // next-themes only knows the real theme after the client mounts; this flips
  // once to avoid an SSR/CSR mismatch, not to synchronize with an effect.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-7 w-13 opacity-0" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Switch.Root
      checked={isDark}
      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "relative inline-flex h-7 w-13 shrink-0 items-center rounded-full border border-border bg-secondary p-1 transition-colors duration-500 outline-none",
        "focus-visible:ring-3 focus-visible:ring-ring/50",
      )}
      style={{ perspective: 300 }}
    >
      <motion.span
        className="relative flex size-5 items-center justify-center rounded-full bg-[#fdf5f4] text-[#221415] shadow-[0_2px_5px_rgba(0,0,0,0.4),inset_0_-1px_1px_rgba(0,0,0,0.15)]"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ x: isDark ? TOGGLE_TRAVEL : 0, rotateY: isDark ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 450, damping: 26 }}
      >
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <ClosedEye />
        </span>
        <span
          className="absolute inset-0 flex items-center justify-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <SharinganEye />
        </span>
      </motion.span>
    </Switch.Root>
  );
}
