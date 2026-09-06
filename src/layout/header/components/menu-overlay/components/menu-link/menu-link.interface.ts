import { INavLink } from "@/layout/header/header.interface";

export interface IMenuLinkProps extends INavLink {
  onNavigate: () => void;
}
