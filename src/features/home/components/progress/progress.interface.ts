import { StaticImageData } from "next/image";

export interface IProgressItem {
  year: string;
  badgeLabel: string;
  badgeColor: string;
  description: string;
  image: StaticImageData;
}
