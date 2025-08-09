import {
  Settings,
  Check,
  Info,
  Banknote,
  Truck,
  TriangleAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineIconType =
  | "info"
  | "banknote"
  | "ship"
  | "progress"
  | "check"
  | "calendar"
  | "pending"
  | "done";

interface TimelineIconProps {
  type: TimelineIconType;
  className?: string;
}

export default function TimelineIcon({ type, className }: TimelineIconProps) {
  const getIcon = () => {
    switch (type) {
      case "info":
        return <Info className="h-4 w-4" />;
      case "banknote":
        return <Banknote className="h-4 w-4" />;
      case "ship":
        return <Truck className="h-4 w-4" />;
      case "progress":
        return <Settings className="h-4 w-4" />;
      case "check":
        return <Check className="h-4 w-4" />;
      case "done":
        return <Check className="h-4 w-4" />;
      case "pending":
        return <TriangleAlert className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "info":
        return "bg-primary";
      case "banknote":
        return "bg-primary";
      case "ship":
        return "bg-primary";
      case "progress":
        return "bg-primary";
      case "check":
        return "bg-primary";
      case "calendar":
        return "bg-primary";
      case "pending":
        return "bg-primary";
      case "done":
        return "bg-primary";
      default:
        return "bg-primary";
    }
  };

  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full text-primary-foreground",
        getBackgroundColor(),
        className
      )}
    >
      {getIcon()}
    </div>
  );
}
