import { ComponentType, SVGProps } from "react";

export interface IHeroSocialLink {
  label: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export interface IHeroStat {
  value: string;
  label: string;
}
