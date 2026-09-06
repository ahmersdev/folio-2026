import { ComponentType, SVGProps } from "react";

export interface ISocialLink {
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}
