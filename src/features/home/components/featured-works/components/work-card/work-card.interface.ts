import { IFeaturedWork } from "@/interfaces";

export interface IWorkCardProps {
  work: IFeaturedWork;
  // 0-based position in the stack. The first card sits on top and stays in
  // flow; the rest are overlapped beneath it when the stack is pinned.
  index: number;
  total: number;
}
