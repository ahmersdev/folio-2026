import { TPointerTarget } from "@/features/home/components/eye-mesh/eye-mesh.interface";
import { useRef } from "react";
import type { PointerEvent } from "react";

export default function useHome() {
  const pointer = useRef<TPointerTarget>({ x: 0, y: 0 });

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    pointer.current.x = px * 2 - 1;
    pointer.current.y = py * 2 - 1;
  }

  function handlePointerLeave() {
    pointer.current.x = 0;
    pointer.current.y = 0;
  }

  return { handlePointerMove, handlePointerLeave, pointer };
}
