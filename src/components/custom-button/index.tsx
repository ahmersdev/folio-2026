"use client";

import { cn } from "@/lib/utils";
import { ICustomButton } from "./custom-button.interface";
import useCustomButton from "./use-custom-button";

export default function CustomButton(props: ICustomButton) {
  const { label, href, target = "_self", className } = props;

  const {
    containerRef,
    dashRef,
    notch1Ref,
    notch2Ref,
    notch3Ref,
    text1Ref,
    text2Ref,
    onMouseEnter,
    onMouseLeave,
  } = useCustomButton();

  return (
    <a
      ref={containerRef}
      href={href}
      target={target}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        `relative inline-flex items-center gap-3 rounded-full border-2 border-black-secondary
        bg-transparent py-4 px-5.5
        md:px-7.5
        lg:py-5.75 lg:px-10`,
        className,
      )}
    >
      {/* Notch marks: small white stitches sitting on the border itself —
          only make sense against a visible border, so they shrink and
          slide off toward the nearest edge once the button fills on
          hover. Positioned off the button's own padding/dash tokens
          rather than the reference's literal pixels, which were tuned to
          its own (differently sized) button. */}
      <span
        ref={notch1Ref}
        aria-hidden
        className="absolute -top-0.5 left-5.5 h-0.5 w-5 rounded-full bg-white
          md:left-7.5
          lg:left-10
          sm:w-6.25"
      />
      <span
        ref={notch2Ref}
        aria-hidden
        className="absolute -bottom-0.5 right-5.5 h-0.5 w-5 rounded-full bg-white
          md:right-7.5
          lg:right-10
          sm:w-6.25"
      />
      <span
        ref={notch3Ref}
        aria-hidden
        className="absolute right-14.5 -bottom-0.5 h-0.5 w-2.5 rounded-full bg-white
          md:right-16.5
          lg:right-19"
      />

      <span
        ref={dashRef}
        className="h-0.5 w-5 shrink-0 rounded-full bg-black-secondary
          sm:w-6.25"
      />
      <span
        className="relative block h-5 overflow-clip
          md:h-6"
      >
        <span
          ref={text1Ref}
          className="block text-[20px] leading-5 font-heading text-black-secondary
            md:text-[24px] md:leading-6"
        >
          {label}
        </span>
        <span
          ref={text2Ref}
          aria-hidden
          className="block text-[20px] leading-5 font-heading text-black-secondary
            md:text-[24px] md:leading-6"
        >
          {label}
        </span>
      </span>
    </a>
  );
}
