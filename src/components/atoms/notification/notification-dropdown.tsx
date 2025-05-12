"use client"

import type React from "react"
import { Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/hooks/use-notifications"
import { NotificationItem } from "./notification-item"
import { EmptyNotifications } from "./empty-notifications"

interface NotificationDropdownProps {
  children: React.ReactNode
}

export function NotificationDropdown({ children }: NotificationDropdownProps) {
  const { notifications, markAllAsRead, markAsRead, deleteNotification, hasNotifications } = useNotifications()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger >{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Thông báo</span>
          {hasNotifications && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 px-2 text-xs">
              <Check className="mr-1 h-3.5 w-3.5" />
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {hasNotifications ? (
            <ScrollArea className="h-[300px]">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => markAsRead(notification.id)}
                  onDelete={() => deleteNotification(notification.id)}
                />
              ))}
            </ScrollArea>
          ) : (
            <EmptyNotifications />
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem >
          <a href="/notifications" className="cursor-pointer justify-center text-center">
            Xem tất cả thông báo
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
