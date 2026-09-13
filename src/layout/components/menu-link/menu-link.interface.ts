import { INavLink } from "@/interfaces";

export interface IMenuLinkProps extends INavLink {
  index?: number;
  onNavigate?: () => void;
}
