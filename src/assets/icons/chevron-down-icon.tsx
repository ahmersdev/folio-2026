import { SVGProps } from "react";

export default function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M24 12L16 20L8 12" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
