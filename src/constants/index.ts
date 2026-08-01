import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon, WhatsappIcon } from "@/assets/icons";

export const SOCIAL_LINKS = [
  { href: "https://github.com/ahmersdev", label: "GitHub", Icon: GithubIcon },
  {
    href: "https://www.linkedin.com/in/ahmersdev/",
    label: "LinkedIn",
    Icon: LinkedinIcon,
  },
  { href: "mailto:hello.ahmersdev@gmail.com", label: "Email", Icon: Mail },
  {
    href: "https://wa.me/+923154806474",
    label: "WhatsApp",
    Icon: WhatsappIcon,
  },
];
