import { forwardRef, SVGProps } from "react";

const HamburgerIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  function HamburgerIcon(props, ref) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 32 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <rect
          data-hamburger-bar="side"
          x="8"
          y="0"
          width="16"
          height="2"
          rx="1"
          fill="currentColor"
        />
        <rect x="0" y="10" width="32" height="2" rx="1" fill="currentColor" />
        <rect
          data-hamburger-bar="side"
          x="8"
          y="20"
          width="16"
          height="2"
          rx="1"
          fill="currentColor"
        />
      </svg>
    );
  },
);

export default HamburgerIcon;
