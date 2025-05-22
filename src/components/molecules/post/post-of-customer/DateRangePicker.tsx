// components/posts/molecules/date-range-picker.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  onChange: (range: { from: Date | null; to: Date | null }) => void;
  placeholder?: string;
}

export function DateRangePicker({
  dateRange,
  onChange,
  placeholder = "Chọn khoảng thời gian",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // const handleSelect = (date: Date | null) => {
  //   if (!date) return;

  //   const { from, to } = dateRange;

  //   if (!from) {
  //     onChange({ from: date, to: null });
  //   } else if (!to && date > from) {
  //     onChange({ from, to: date });
  //     setIsOpen(false);
  //   } else {
  //     onChange({ from: date, to: null });
  //   }
  // };

  const handleClear = () => {
    onChange({ from: null, to: null });
    setIsOpen(false);
  };

  const formatDateRange = () => {
    if (!dateRange.from) return placeholder;

    if (!dateRange.to) {
      return `Từ ${format(dateRange.from, "dd/MM/yyyy", { locale: vi })}`;
    }

    return `${format(dateRange.from, "dd/MM/yyyy", { locale: vi })} - ${format(
      dateRange.to,
      "dd/MM/yyyy",
      { locale: vi }
    )}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger >
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !dateRange.from && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={{
            from: dateRange.from || undefined,
            to: dateRange.to || undefined,
          }}
          onSelect={(range) => {
            onChange({
              from: range?.from || null,
              to: range?.to || null,
            });
            if (range?.to) setIsOpen(false);
          }}
          locale={vi}
          numberOfMonths={2}
        />
        <div className="flex items-center justify-end gap-2 p-3 border-t">
          <Button variant="outline" size="sm" onClick={handleClear}>
            Xóa
          </Button>
          <Button size="sm" onClick={() => setIsOpen(false)}>
            Áp dụng
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}