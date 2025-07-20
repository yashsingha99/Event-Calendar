// components/ColorPickerPopover.tsx
"use client"

import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { cn } from "../lib/utils"
import { colorOptions } from "../lib/colors"
import { Button } from "./ui/button"

export function ColorPicker({
  value,
  onChange,
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className=" w-24 border-2"
          style={{ backgroundColor: value.color || "#3174AD" }}
        >  {value.name || "Azure Blue"} </Button>
      </PopoverTrigger>

      <PopoverContent className="overflow-y-auto p-2 w-full rounded-xl shadow-lg border">
        <div className="grid grid-cols-6 gap-2 text-[10%]" >
          {colorOptions.map((colorData) => (
            <Button
              key={colorData.name}
              className={cn(
                "w-24 border-2 transition-all",
                value.color === colorData.color ? "border-black" : "border-muted"
              )}
              style={{ backgroundColor: colorData.color }}
              onClick={() => onChange(colorData)}
            >  {colorData.name}
          </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
