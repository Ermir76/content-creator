import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface CustomSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (value: number) => React.ReactNode;
}

const CustomSlider = React.forwardRef<HTMLDivElement, CustomSliderProps>(
  ({ label, value, onChange, leftLabel, rightLabel, className, min = 0, max = 100, step = 1, formatValue = (v) => `${v}%` }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)}>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {formatValue(value)}
          </span>
        </div>
        <SliderPrimitive.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          max={max}
          min={min}
          step={step}
        >
          <SliderPrimitive.Track className="bg-muted relative grow rounded-full h-2">
            <SliderPrimitive.Range className="absolute bg-primary rounded-full h-full" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb className="block w-5 h-5 bg-primary shadow-button rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-transform cursor-grab active:cursor-grabbing" />
        </SliderPrimitive.Root>
        {(leftLabel || rightLabel) && (
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{leftLabel}</span>
            <span>{rightLabel}</span>
          </div>
        )}
      </div>
    );
  }
);

CustomSlider.displayName = "CustomSlider";

export { CustomSlider };
