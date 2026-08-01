import { IScrollIndicatorProps } from "./scroll-indicator.interface";

export default function useScrollIndicator(props: IScrollIndicatorProps) {
  const { targetId = "about-me" } = props;

  const handleScroll = () => {
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  return { handleScroll };
}
