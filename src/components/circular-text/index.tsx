import { cn } from "@/lib/utils";
import { ICircularText } from "./circular-text.interface";

export default function CircularText(props: ICircularText) {
  const { text, className } = props;

  const characters = text.split("");
  // Rotate characters evenly across a full 360deg circle
  const degreeStep = 360 / characters.length;

  return (
    <div className={cn("relative size-full", className)}>
      {characters.map((char, index) => {
        const rotation = index * degreeStep;
        return (
          <span
            key={index}
            className="absolute left-1/2 top-1/2 origin-center font-cinzel text-[12px] font-bold uppercase tracking-normal text-muted-foreground transition-colors duration-300 group-hover:text-foreground"
            style={{
              transform: `translate(-50%, -50%) rotate(${rotation}deg) translateY(-64px)`,
            }}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}
