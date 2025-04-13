
import * as React from "react";
import { DateRange } from "@/types/date-range";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DateRangePickerProps {
  date: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
}

export function DateRangePicker({ date, onSelect }: DateRangePickerProps) {
  return (
    <div className="grid gap-2">
      <Calendar
        initialFocus
        mode="range"
        defaultMonth={date?.from}
        selected={date as any}
        onSelect={onSelect as any}
        numberOfMonths={2}
        className={cn("p-3 pointer-events-auto")}
      />
    </div>
  );
}
