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
        filled ? "bg-rose-light" : "bg-transparent",
        isLg
          ? `gap-[clamp(0.25rem,1.39vw,1.25rem)] py-[clamp(0.5rem,1.94vw,1.75rem)]
            pr-[clamp(0.5rem,4.17vw,3.75rem)] pl-[clamp(1rem,4.17vw,3.75rem)]`
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
            ? "left-[clamp(1rem,4.17vw,3.75rem)] w-[clamp(1.25rem,3.33vw,3rem)]"
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
            ? "right-[clamp(2.875rem,7.64vw,6.875rem)] w-[clamp(1.25rem,3.33vw,3rem)]"
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
            ? "right-[clamp(1.875rem,4.86vw,4.375rem)] w-[clamp(0.75rem,2.08vw,1.875rem)]"
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
            isLg ? "w-[clamp(1.25rem,3.33vw,3rem)]" : "w-5 sm:w-6.25",
          )}
        />
      )}

      <span
        className={cn(
          "relative block overflow-clip",
          isLg ? "h-[clamp(1.375rem,4.17vw,3.75rem)]" : "h-5 md:h-6",
        )}
      >
        <span
          ref={text1Ref}
          className={cn(
            "block font-heading text-white-secondary",
            isLg
              ? "text-[clamp(1.375rem,4.17vw,3.75rem)] leading-none"
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
              ? "text-[clamp(1.375rem,4.17vw,3.75rem)] leading-none"
              : "text-[20px] leading-5 md:text-[24px] md:leading-6",
          )}
        >
          {label}
        </span>
      </span>

      {Icon && (
        <span
          aria-hidden
          className={cn(
            "shrink-0 overflow-clip rounded-full bg-black-secondary",
            isLg
              ? "size-[clamp(1.75rem,4.86vw,4.375rem)]"
              : "size-8 md:size-9.5",
          )}
        >
          <span ref={iconRowRef} className="flex">
            <span
              className={cn(
                "flex shrink-0 items-center justify-center",
                isLg
                  ? "size-[clamp(1.75rem,4.86vw,4.375rem)]"
                  : "size-8 md:size-9.5",
              )}
            >
              <Icon
                className={cn(
                  "text-white-secondary",
                  isLg ? "size-[clamp(0.75rem,2.22vw,2rem)]" : "size-4",
                )}
              />
            </span>
            <span
              className={cn(
                "flex shrink-0 items-center justify-center",
                isLg
                  ? "size-[clamp(1.75rem,4.86vw,4.375rem)]"
                  : "size-8 md:size-9.5",
              )}
            >
              <Icon
                className={cn(
                  "text-white-secondary",
                  isLg ? "size-[clamp(0.75rem,2.22vw,2rem)]" : "size-4",
                )}
              />
            </span>
          </span>
        </span>
      )}
    </Link>
  );
}
