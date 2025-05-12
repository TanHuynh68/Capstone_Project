

interface NotificationProps {
    id: string
    title: string
    message: string
    type: NotificationType
    read: boolean
    createdAt: string
}

interface NotificationArray {
    notification: Notification[]
}
