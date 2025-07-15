import { formatVietnamDateHours } from "@/utils/date";

interface TimelineDateProps {
  date: string;
  className?: string;
}

export default function TimelineDate({
  date,
  className = "",
}: TimelineDateProps) {
  const formatDate = (dateString: string) => {
    try {
      return formatVietnamDateHours(dateString);
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className={`text-sm text-gray-400 font-mono ${className}`}>
      {formatDate(date)}
    </div>
  );
}
