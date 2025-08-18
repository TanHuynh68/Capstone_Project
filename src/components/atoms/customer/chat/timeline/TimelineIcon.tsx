import {
  Settings,
  Check,
  Info,
  Banknote,
  Truck,
  TriangleAlert,
  RefreshCw,
  XCircle,
  ListCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineIconType =
  | "info"
  | "banknote"
  | "deposit"
  | "withdraw"
  | "refund"
  | "ship"
  | "progress"
  | "check"
  | "pending"
  | "done"
  | "rework"
  | "fail";

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
      case "deposit":
        return <Banknote className="h-4 w-4" />;
      case "withdraw":
        return <Banknote className="h-4 w-4" />;
      case "refund":
        return <Banknote className="h-4 w-4" />;
      case "ship":
        return <Truck className="h-4 w-4" />;
      case "progress":
        return <Settings className="h-4 w-4" />;
      case "check":
        return <ListCheck className="h-4 w-4" />;
      case "done":
        return <Check className="h-4 w-4" />;
      case "pending":
        return <TriangleAlert className="h-4 w-4" />;
      case "rework":
        return <RefreshCw className="h-4 w-4" />;
      case "fail":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "info":
        return "bg-blue-500";
      case "banknote":
        return "bg-emerald-500";
      case "deposit":
        return "bg-green-500";
      case "withdraw":
        return "bg-orange-500";
      case "refund":
        return "bg-rose-500";
      case "ship":
        return "bg-cyan-500";
      case "progress":
        return "bg-amber-500";
      case "check":
        return "bg-sky-500";
      case "pending":
        return "bg-yellow-500";
      case "done":
        return "bg-green-600";
      case "rework":
        return "bg-purple-500";
      case "fail":
        return "bg-red-600";
      default:
        return "bg-gray-500";
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
