import { BellOff } from "lucide-react"

export function EmptyNotifications() {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <BellOff className="h-10 w-10 text-muted-foreground mb-3" />
      <h3 className="text-sm font-medium">Không có thông báo</h3>
      <p className="text-xs text-muted-foreground mt-1">Bạn sẽ nhận được thông báo khi có hoạt động mới.</p>
    </div>
  )
}
