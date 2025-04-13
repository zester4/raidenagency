
import * as React from "react";
import { DateRange } from "react-day-picker";
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
        selected={date}
        onSelect={onSelect}
        numberOfMonths={2}
      />
    </div>
  );
}
