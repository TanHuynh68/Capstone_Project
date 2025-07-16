import { Settings, Check, Info, Banknote, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineIconType =
  | "info"
  | "banknote"
  | "ship"
  | "progress"
  | "check"
  | "calendar";
  

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
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "info":
        return "bg-blue-600";
      case "banknote":
        return "bg-blue-600";
      case "ship":
        return "bg-blue-600";
      case "progress":
        return "bg-blue-600";
      case "check":
        return "bg-blue-600";
      case "calendar":
        return "bg-blue-600";
      default:
        return "bg-blue-600";
    }
  };

  return (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full text-white",
        getBackgroundColor(),
        className
      )}
    >
      {getIcon()}
    </div>
  );
}
