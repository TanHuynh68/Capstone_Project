"use client";
import { Check, Trash2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { NotificationProps } from "./notification-context";
import { formatVietnamDateHoursWithSuffix } from "@/utils/date";
import { useNavigate } from "react-router-dom";

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
  const { title, message, createdAt, redirectLink, isRead } = notification;
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    if (redirectLink) {
      navigate(redirectLink);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col p-3 border-b last:border-b-0 transition-colors",
        "hover:bg-primary/50 dark:hover:bg-primary",
        !isRead && "bg-muted dark:bg-muted/15",
        redirectLink &&
          "cursor-pointer bg-primary/10 dark:bg-primary/20 border-l-4 border-l-primary/30",
        redirectLink &&
          !isRead &&
          "bg-primary/15 dark:bg-primary/25 border-l-primary/50",
        redirectLink && "hover:border-l-primary/60"
      )}
      onClick={redirectLink ? handleNotificationClick : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4
              className={cn("text-sm font-medium", !isRead && "font-semibold")}
            >
              {title}
            </h4>
            {redirectLink && (
              <ArrowRight className="h-3.5 w-3.5 text-primary flex-shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-4">
            {message}
          </p>
          <span className="text-xs text-muted-foreground mt-1 block">
            {formatVietnamDateHoursWithSuffix(createdAt)}
          </span>
        </div>
        <div
          className="flex items-center space-x-1"
          onClick={(e) => e.stopPropagation()}
        >
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
