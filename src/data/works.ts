import {
  FeaturedWork1Img,
  FeaturedWork2Img,
  FeaturedWork3Img,
  FeaturedWork4Img,
} from "@/assets/images";
import { ROUTES } from "@/constants/routes";
import { IFeaturedWork } from "@/interfaces";

export const FEATURED_WORKS: IFeaturedWork[] = [
  {
    title: "Drink Different Web Design WITH WP",
    description:
      "Drink Different Web Design with WP delivers bold, refreshing WordPress sites featuring custom layouts, vibrant visuals, smooth interactions, and a playful brand style experience.",
    image: FeaturedWork1Img,
    href: ROUTES.WORKS,
    paneColor: "#ab9bff",
    imagePaneColor: "#8673ee",
  },
  {
    title: "Push Past Pack Design in New Style",
    description:
      "Push Past Pack Design in New Style delivers bold, modern packaging concepts that redefine visuals, elevate branding, and introduce fresh creative energy.",
    image: FeaturedWork2Img,
    href: ROUTES.WORKS,
    paneColor: "#ff905f",
    imagePaneColor: "#ff7d44",
  },
  {
    title: "Packaging Design with On-Demand Experts",
    description:
      "Packaging Design with On-Demand Experts delivers tailored, high-quality packaging solutions created by skilled specialists who craft standout visuals, smart layouts",
    image: FeaturedWork3Img,
    href: ROUTES.WORKS,
    paneColor: "#ff767a",
    imagePaneColor: "#ff5b60",
  },
  {
    title: "Plenova Web Design & Development",
    description:
      "Plenova Web Design & Development builds modern, high-performing websites with clean UX, custom features, responsive layouts, and seamless functionality crafted to elevate brands",
    image: FeaturedWork4Img,
    href: ROUTES.WORKS,
    paneColor: "#b8c56f",
    imagePaneColor: "#9fae4b",
  },
];
