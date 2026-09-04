import {
  AboutMeBloomFourIcon,
  AboutMeBloomOneIcon,
  AboutMeBloomThreeIcon,
  AboutMeBloomTwoIcon,
} from "@/assets/icons";
import { cn } from "@/lib/utils";
import {
  RING_FOUR_HEIGHT_PCT,
  RING_FOUR_WIDTH_PCT,
  RING_ONE_HEIGHT_PCT,
  RING_ONE_WIDTH_PCT,
  RING_THREE_HEIGHT_PCT,
  RING_THREE_WIDTH_PCT,
  RING_TWO_HEIGHT_PCT,
  RING_TWO_WIDTH_PCT,
} from "./bloom.data";
import { IBloomProps } from "./bloom.interface";
import useBloom from "./use-bloom";

export default function Bloom({ className }: IBloomProps) {
  const { containerRef, ringOneRef, ringTwoRef, ringThreeRef, ringFourRef } =
    useBloom();

  return (
    <div
      ref={containerRef}
      className={cn("relative aspect-309/324", className)}
    >
      {/* Four → One in markup order: later siblings paint on top with no
          z-index needed, so the smallest/innermost ring (One) naturally
          sits above the larger ones as it blooms in last. */}
      <div
        ref={ringFourRef}
        className="absolute inset-0 m-auto"
        style={{
          width: `${RING_FOUR_WIDTH_PCT}%`,
          height: `${RING_FOUR_HEIGHT_PCT}%`,
        }}
      >
        <AboutMeBloomFourIcon className="block h-full w-full" />
      </div>
      <div
        ref={ringThreeRef}
        className="absolute inset-0 m-auto"
        style={{
          width: `${RING_THREE_WIDTH_PCT}%`,
          height: `${RING_THREE_HEIGHT_PCT}%`,
        }}
      >
        <AboutMeBloomThreeIcon className="block h-full w-full" />
      </div>
      <div
        ref={ringTwoRef}
        className="absolute inset-0 m-auto"
        style={{
          width: `${RING_TWO_WIDTH_PCT}%`,
          height: `${RING_TWO_HEIGHT_PCT}%`,
        }}
      >
        <AboutMeBloomTwoIcon className="block h-full w-full" />
      </div>
      <div
        ref={ringOneRef}
        className="absolute inset-0 m-auto"
        style={{
          width: `${RING_ONE_WIDTH_PCT}%`,
          height: `${RING_ONE_HEIGHT_PCT}%`,
        }}
      >
        <AboutMeBloomOneIcon className="block h-full w-full" />
      </div>
    </div>
  );
}
