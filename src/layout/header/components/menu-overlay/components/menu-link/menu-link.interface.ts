import { INavLink } from "@/interfaces";

export interface IMenuLinkProps extends INavLink {
  onNavigate: () => void;
}
