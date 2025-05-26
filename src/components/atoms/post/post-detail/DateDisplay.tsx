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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const IconComponent = icon === "calendar" ? Calendar : Clock;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <IconComponent className="h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">
          {formatDate(date)}
        </p>
      </div>
    </div>
  );
}
