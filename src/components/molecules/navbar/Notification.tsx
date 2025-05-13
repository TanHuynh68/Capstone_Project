import { NotificationDropdown } from "@/components/atoms/notification/notification-dropdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/use-notifications";
import { Bell } from "lucide-react";

const Notification = () => {
  const { unreadCount } = useNotifications()
  return (
    <div>
      {/* Notification Icon */}
      <NotificationDropdown >
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </NotificationDropdown>
    </div>
  )
}

export default Notification
