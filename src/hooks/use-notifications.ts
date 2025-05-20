"use client"

import { useNotificationContext } from "@/components/atoms/notification/use-notification"
import NotificationService from "@/services/NotificaitionService"
import { useEffect } from "react"
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr"
import type { NotificationProps } from "@/types/notification"

export function useNotifications() {
  const {
    notifications,
    setNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification: deleteNotificationContext,
  } = useNotificationContext()

  const {
    getNotifications,
    // postNotification,
    markNotificationAsRead,
    deleteNotification: deleteNotificationService,
  } = NotificationService()

  const unreadCount = notifications.filter((n: NotificationProps) => !n.isRead).length
  const hasNotifications = notifications.length > 0

  const fetchNotifications = async () => {
    const data = await getNotifications();
    const allItems = data?.responseRequestModel?.responseList?.items ?? [];

    const sorted = allItems
      .sort((a: NotificationProps, b: NotificationProps) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // mới nhất trước
      .slice(0, 20); // lấy 20 cái đầu

    setNotifications(sorted);
  };


  // Lấy danh sách thông báo khi load
  useEffect(() => {
    fetchNotifications()
  }, [])

  // Kết nối SignalR và nhận thông báo realtime
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("https://pdcbackendapi.tlog.website/notificationHub", {
        accessTokenFactory: () => localStorage.getItem("token") || "",
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build()

    connection
      .start()
      .then(() => {
        // console.log("✅ Kết nối SignalR thành công")
        // console.log(localStorage.getItem("token"), "token")
      })
      .catch((err) => {
        console.error("❌ Lỗi kết nối SignalR:", err)
      })

    // Khi nhận thông báo mới từ backend
    connection.on("ReceiveNotification", async () => {
      await fetchNotifications();
    })

    // connection.onclose(error => {
    //   console.log("SignalR connection closed", error);
    // });

    // connection.onreconnected(connectionId => {
    //   console.log("SignalR reconnected", connectionId);
    // });

    // // Log all events for debugging
    // connection.on("*", (...args) => {
    //   console.log("SignalR event received:", args);
    // });

    return () => {
      connection.stop()
    }
  }, [])

  const handleMarkAsRead = async (id: string) => {
    const result = await markNotificationAsRead(id)
    if (result) {
      markAsRead(id)
      fetchNotifications()
    }
  }

  const handleDeleteNotification = async (id: string) => {
    const result = await deleteNotificationService(id)
    if (result) {
      deleteNotificationContext(id)
      fetchNotifications()
    }
  }

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n: NotificationProps) => !n.isRead)
    const results = await Promise.all(
      unreadNotifications.map((n: NotificationProps) => markNotificationAsRead(n.notificationID))
    )
    if (results.every((r: any) => r)) {
      markAllAsRead()
      await fetchNotifications()
    }
  }

  return {
    notifications,
    unreadCount,
    hasNotifications,
    addNotification,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
  }
}
