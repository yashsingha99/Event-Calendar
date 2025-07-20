"use client";

import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { cn } from "../lib/utils";
import { colorOptions } from "../lib/colors";
import { Button } from "./ui/button";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export function ColorPicker({ value, onChange }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="w-28 border shadow-md rounded-lg"
          style={{ backgroundColor: value?.color || "#3174AD" }}
        >
          <span className="w-full text-xs font-medium text-white drop-shadow-sm">
            {value?.name || "color picker"}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[250px] p-2 rounded-xl shadow-lg border bg-white">
        <ScrollArea className="h-60 w-full pr-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {colorOptions.map((colorData) => (
              <Button
                key={colorData.name}
                className={cn(
                  "h-10 rounded-md border-2 text-xs font-medium px-2 truncate transition-all duration-200 hover:scale-[1.02]",
                  value?.color === colorData.color
                    ? "border-black text-white"
                    : "border-muted text-black"
                )}
                style={{ backgroundColor: colorData.color }}
                onClick={() => onChange(colorData)}
              >
                {colorData.name}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
