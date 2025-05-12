"use client"

import { useNotificationContext } from "@/components/atoms/notification/notification-context"
import { notificationService } from "@/services/NotificaitionService"
import { useEffect } from "react"


export function useNotifications() {
  const { notifications, setNotifications, addNotification, markAsRead, markAllAsRead, deleteNotification } =
    useNotificationContext()

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length
  const hasNotifications = notifications.length > 0

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await notificationService.getNotifications()
      setNotifications(data)
    }

    fetchNotifications()
  }, [setNotifications])

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% chance to get a new notification every 30 seconds
      if (Math.random() < 0.1) {
        const newNotification = notificationService.generateRandomNotification()
        addNotification(newNotification)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [addNotification])

  return {
    notifications,
    unreadCount,
    hasNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  }
}
