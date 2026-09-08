"use client";

import Link from "next/link";
import { cn } from "@/lib";
import { ICustomButton } from "./custom-button.interface";
import useCustomButton from "./use-custom-button";

export default function CustomButton(props: ICustomButton) {
  const {
    label,
    href,
    target = "_self",
    className,
    icon: Icon,
    filled = false,
    size = "default",
  } = props;

  const isLg = size === "lg";

  const {
    containerRef,
    dashRef,
    notch1Ref,
    notch2Ref,
    notch3Ref,
    text1Ref,
    text2Ref,
    iconRowRef,
    onMouseEnter,
    onMouseLeave,
  } = useCustomButton({ filled, hasIcon: !!Icon, isLg });

  return (
    <Link
      ref={containerRef}
      href={href}
      target={target}
      rel={target === "_blank" ? "noreferrer" : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
      className={cn(
        "relative inline-flex items-center rounded-full border-2 border-white-secondary",
        filled ? "bg-rose" : "bg-transparent",
        isLg
          ? `gap-[clamp(4px,1.39vw,20px)] py-[clamp(8px,1.94vw,28px)]
            pr-[clamp(8px,4.17vw,60px)] pl-[clamp(16px,4.17vw,60px)]`
          : `gap-3 py-4 px-5.5
            md:px-7.5
            lg:py-5.75 lg:px-10`,
        className,
      )}
    >
      {/* Notch marks: small white stitches sitting on the border itself —
          only make sense against a visible border, so they shrink and
          slide off toward the nearest edge once the button fills (or,
          for a filled button, on hover regardless). Positioned off the
          button's own padding tokens rather than literal pixels, which
          would be tuned to one specific button size. */}
      <span
        ref={notch1Ref}
        aria-hidden
        className={cn(
          "absolute -top-0.5 h-0.5 rounded-full bg-background",
          isLg
            ? "left-[clamp(16px,4.17vw,60px)] w-[clamp(20px,3.33vw,48px)]"
            : `left-5.5 w-5
              md:left-7.5
              lg:left-10
              sm:w-6.25`,
        )}
      />
      <span
        ref={notch2Ref}
        aria-hidden
        className={cn(
          "absolute -bottom-0.5 h-0.5 rounded-full bg-background",
          isLg
            ? "right-[clamp(46px,7.64vw,110px)] w-[clamp(20px,3.33vw,48px)]"
            : `right-5.5 w-5
              md:right-7.5
              lg:right-10
              sm:w-6.25`,
        )}
      />
      <span
        ref={notch3Ref}
        aria-hidden
        className={cn(
          "absolute -bottom-0.5 h-0.5 rounded-full bg-background",
          isLg
            ? "right-[clamp(30px,4.86vw,70px)] w-[clamp(12px,2.08vw,30px)]"
            : `right-14.5 w-2.5
              md:right-16.5
              lg:right-19`,
        )}
      />

      {/* No equivalent element in the icon variant's reference button —
          dropped whenever an icon is passed rather than always shown. */}
      {!Icon && (
        <span
          ref={dashRef}
          className={cn(
            "h-0.5 shrink-0 rounded-full bg-white-secondary",
            isLg ? "w-[clamp(20px,3.33vw,48px)]" : "w-5 sm:w-6.25",
          )}
        />
      )}

      <span
        className={cn(
          "relative block overflow-clip",
          isLg ? "h-[clamp(22px,4.17vw,60px)]" : "h-5 md:h-6",
        )}
      >
        <span
          ref={text1Ref}
          className={cn(
            "block font-heading text-white-secondary",
            isLg
              ? "text-[clamp(22px,4.17vw,60px)] leading-none"
              : "text-[20px] leading-5 md:text-[24px] md:leading-6",
          )}
        >
          {label}
        </span>
        <span
          ref={text2Ref}
          aria-hidden
          className={cn(
            "block font-heading text-white-secondary",
            isLg
              ? "text-[clamp(22px,4.17vw,60px)] leading-none"
              : "text-[20px] leading-5 md:text-[24px] md:leading-6",
          )}
        >
          {label}
        </span>
      </span>

      {Icon && (
        <span
          className={cn(
            "shrink-0 overflow-clip rounded-full bg-black-secondary",
            isLg ? "size-[clamp(28px,4.86vw,70px)]" : "size-8 md:size-9.5",
          )}
        >
          <span ref={iconRowRef} className="flex">
            <span
              className={cn(
                "flex shrink-0 items-center justify-center",
                isLg ? "size-[clamp(28px,4.86vw,70px)]" : "size-8 md:size-9.5",
              )}
            >
              <Icon
                className={cn(
                  "text-white-secondary",
                  isLg ? "size-[clamp(12px,2.22vw,32px)]" : "size-4",
                )}
              />
            </span>
            <span
              aria-hidden
              className={cn(
                "flex shrink-0 items-center justify-center",
                isLg ? "size-[clamp(28px,4.86vw,70px)]" : "size-8 md:size-9.5",
              )}
            >
              <Icon
                className={cn(
                  "text-white-secondary",
                  isLg ? "size-[clamp(12px,2.22vw,32px)]" : "size-4",
                )}
              />
            </span>
          </span>
        </span>
      )}
    </Link>
  );
}
