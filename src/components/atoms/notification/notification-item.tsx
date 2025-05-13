"use client"

import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { Check, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface NotificationItemProps {
  notification: NotificationProps
  onMarkAsRead: () => void
  onDelete: () => void
}

export function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const { title, message, createdAt, read } = notification

  const formattedTime = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: vi,
  })

  return (
    <div className={cn("flex flex-col p-3 border-b last:border-b-0 transition-colors", !read && "bg-muted/40")}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 cursor-pointer" onClick={onMarkAsRead}>
          <h4 className={cn("text-sm font-medium", !read && "font-semibold")}>{title}</h4>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{message}</p>
          <span className="text-xs text-muted-foreground mt-1 block">{formattedTime}</span>
        </div>
        <div className="flex items-center space-x-1">
          {!read && (
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onMarkAsRead}>
              <Check className="h-3.5 w-3.5" />
              <span className="sr-only">Mark as read</span>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
