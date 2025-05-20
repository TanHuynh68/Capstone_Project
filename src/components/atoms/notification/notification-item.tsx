"use client";
import { Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { NotificationProps } from "@/types/notification";
import { formatFullDateWithDistance } from "@/components/utils/date";

interface NotificationItemProps {
  notification: NotificationProps;
  onMarkAsRead: () => void;
  onDelete: () => void;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationItemProps) {
  const { title, message, createdAt, isRead } = notification;


  return (
    <div
      className={cn(
        "flex flex-col p-3 border-b last:border-b-0 transition-colors",
        "hover:bg-primary/50 dark:hover:bg-primary",
        !isRead && "bg-muted dark:bg-muted/15"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className={cn("text-sm font-medium", !isRead && "font-semibold")}>
            {title}
          </h4>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {message}
          </p>
          <span className="text-xs text-muted-foreground mt-1 block">
            {formatFullDateWithDistance(createdAt)}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          {!isRead && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 cursor-pointer"
              onClick={onMarkAsRead}
            >
              <Check className="h-3.5 w-3.5" />
              <span className="sr-only">Đã đọc</span>
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive cursor-pointer"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">Xóa</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
