import { formatDayAndTime } from "@/utils";
import { Calendar, Clock } from "lucide-react";

interface DateDisplayProps {
  date: string;
  label: string;
  icon?: "calendar" | "clock";
  className?: string;
}

export default function DateDisplay({
  date,
  label,
  icon = "calendar",
  className = "",
}: DateDisplayProps) {

  const IconComponent = icon === "calendar" ? Calendar : Clock;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <IconComponent className="h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">
          {formatDayAndTime(date)}
        </p>
      </div>
    </div>
  );
}
