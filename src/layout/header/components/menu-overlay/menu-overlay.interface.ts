import { RefObject } from "react";

export type TMenuOverlayPhase = "closed" | "opening" | "open" | "closing";

export interface IMenuOverlayProps {
  phase: TMenuOverlayPhase;
  panelRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

export interface IUseMenuOverlayReturn {
  phase: TMenuOverlayPhase;
  panelRef: RefObject<HTMLDivElement | null>;
  close: () => void;
  toggle: () => void;
}
