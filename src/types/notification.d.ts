// interface NotificationProps {
//     id: string
//     title: string
//     message: string
//     type: NotificationType
//     read: boolean
//     createdAt: string
// }

// API Response interface
export interface NotificationProps {
    notificationID: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

interface NotificationArray {
    notification: NotificationProps[];
}

