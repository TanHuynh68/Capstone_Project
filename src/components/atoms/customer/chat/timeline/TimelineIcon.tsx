import {
  Calendar,
  Settings,
  Check,
  Clock,
  AlertCircle,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineIconType =
  | "pending"
  | "progress"
  | "completed"
  | "cancelled"
  | "warning"
  | "user"
  | "calendar";

interface TimelineIconProps {
  type: TimelineIconType;
  className?: string;
}

export default function TimelineIcon({ type, className }: TimelineIconProps) {
  const getIcon = () => {
    switch (type) {
      case "pending":
        return <Calendar className="h-4 w-4" />;
      case "progress":
        return <Settings className="h-4 w-4" />;
      case "completed":
        return <Check className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      case "warning":
        return <Clock className="h-4 w-4" />;
      case "user":
        return <User className="h-4 w-4" />;
      case "calendar":
        return <Calendar className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "pending":
        return "bg-gray-600";
      case "progress":
        return "bg-blue-600";
      case "completed":
        return "bg-green-600";
      case "cancelled":
        return "bg-red-600";
      case "warning":
        return "bg-yellow-600";
      case "user":
        return "bg-purple-600";
      case "calendar":
        return "bg-indigo-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full text-white",
        getBackgroundColor(),
        className
      )}
    >
      {getIcon()}
    </div>
  );
}
