import { SVGProps } from "react";

export default function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.94 8.5H3.56V20.5H6.94V8.5Z" />
      <path d="M5.25 7.03c1.14 0 2.06-.92 2.06-2.06S6.39 2.9 5.25 2.9 3.19 3.83 3.19 4.97s.92 2.06 2.06 2.06Z" />
      <path d="M13.5 8.5H10.3v12h3.38v-6.29c0-1.66.31-3.27 2.37-3.27 2.03 0 2.06 1.9 2.06 3.38v6.18H21.5v-6.87c0-3.26-.7-5.76-4.5-5.76-1.83 0-3.05.99-3.55 1.94h-.05V8.5Z" />
    </svg>
  );
}
