"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { Calendar } from "../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DateTimePickerProps {
  date?: Date;
  setDate: (date: Date) => void;
  minDate?: Date;
}

export function DateTimePicker({
  date,
  setDate,
  minDate,
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date
  );

  // Time related state
  const [selectedHour, setSelectedHour] = React.useState<string>(
    date ? String(date.getHours()).padStart(2, "0") : "00"
  );
  const [selectedMinute, setSelectedMinute] = React.useState<string>(
    date ? String(date.getMinutes()).padStart(2, "0") : "00"
  );

  // Update the parent's state when date or time changes
  React.useEffect(() => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(selectedHour));
      newDate.setMinutes(parseInt(selectedMinute));
      setDate(newDate);
    }
  }, [selectedDate, selectedHour, selectedMinute, setDate]);

  // Generate hours and minutes for the select components
  const hours = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            initialFocus
            disabled={minDate ? { before: minDate } : undefined}
          />
        </PopoverContent>
      </Popover>

      <div className="flex gap-2">
        <Select value={selectedHour} onValueChange={setSelectedHour}>
          <SelectTrigger className="w-20">
            <SelectValue placeholder="Hour" />
          </SelectTrigger>
          <SelectContent>
            {hours.map((hour) => (
              <SelectItem key={hour} value={hour}>
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span className="flex items-center">:</span>

        <Select value={selectedMinute} onValueChange={setSelectedMinute}>
          <SelectTrigger className="w-20">
            <SelectValue placeholder="Min" />
          </SelectTrigger>
          <SelectContent>
            {minutes.map((minute) => (
              <SelectItem key={minute} value={minute}>
                {minute}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
