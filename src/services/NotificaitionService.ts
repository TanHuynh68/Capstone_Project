
import { API_ROUTES, MESSAGE } from "@/constants"
import { HTTP_METHOD, NotificationType } from "@/constants/enum"
import useApiService from "@/hooks/useApi"
import { useCallback } from "react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"

// Mock notification data
const mockNotifications: NotificationProps[] = [
  {
    id: "1",
    title: "Đơn hàng đã được xác nhận",
    message: "Đơn hàng #12345 của bạn đã được xác nhận và đang được xử lý.",
    type: NotificationType.ORDER,
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
  {
    id: "2",
    title: "Nạp tiền thành công",
    message: "Bạn đã nạp thành công 100,000 VND vào tài khoản.",
    type: NotificationType.PAYMENT,
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
  {
    id: "3",
    title: "Khuyến mãi mới",
    message: "Giảm giá 20% cho tất cả sản phẩm điện tử từ ngày 15/05 đến 20/05.",
    type: NotificationType.PROMOTION,
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "4",
    title: "Cập nhật thông tin tài khoản",
    message: "Thông tin tài khoản của bạn đã được cập nhật thành công.",
    type: NotificationType.ACCOUNT,
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
]

// Notification titles by type
const notificationTitles = {
  [NotificationType.ORDER]: [
    "Đơn hàng đã được xác nhận",
    "Đơn hàng đang được vận chuyển",
    "Đơn hàng đã được giao thành công",
  ],
  [NotificationType.PAYMENT]: ["Nạp tiền thành công", "Thanh toán thành công", "Hoàn tiền thành công"],
  [NotificationType.PROMOTION]: ["Khuyến mãi mới", "Ưu đãi đặc biệt", "Mã giảm giá mới"],
  [NotificationType.ACCOUNT]: ["Cập nhật thông tin tài khoản", "Đăng nhập mới", "Thay đổi mật khẩu thành công"],
  [NotificationType.SYSTEM]: ["Bảo trì hệ thống", "Cập nhật ứng dụng", "Thông báo quan trọng"],
}

// Notification messages by type
const notificationMessages = {
  [NotificationType.ORDER]: [
    "Đơn hàng #ORDER_ID của bạn đã được xác nhận và đang được xử lý.",
    "Đơn hàng #ORDER_ID của bạn đang được vận chuyển và sẽ được giao trong 2-3 ngày tới.",
    "Đơn hàng #ORDER_ID của bạn đã được giao thành công. Cảm ơn bạn đã mua sắm!",
  ],
  [NotificationType.PAYMENT]: [
    "Bạn đã nạp thành công AMOUNT VND vào tài khoản.",
    "Thanh toán AMOUNT VND cho đơn hàng #ORDER_ID đã được xác nhận.",
    "Hoàn tiền AMOUNT VND cho đơn hàng #ORDER_ID đã được xử lý.",
  ],
  [NotificationType.PROMOTION]: [
    "Giảm giá DISCOUNT% cho tất cả sản phẩm điện tử từ ngày START_DATE đến END_DATE.",
    "Ưu đãi đặc biệt: Mua 1 tặng 1 cho tất cả sản phẩm thời trang.",
    "Mã giảm giá mới: CODE - Giảm DISCOUNT% cho đơn hàng từ AMOUNT VND.",
  ],
  [NotificationType.ACCOUNT]: [
    "Thông tin tài khoản của bạn đã được cập nhật thành công.",
    "Phát hiện đăng nhập mới vào tài khoản của bạn từ DEVICE.",
    "Mật khẩu tài khoản của bạn đã được thay đổi thành công.",
  ],
  [NotificationType.SYSTEM]: [
    "Hệ thống sẽ bảo trì từ START_TIME đến END_TIME. Xin lỗi vì sự bất tiện này.",
    "Phiên bản mới của ứng dụng đã sẵn sàng. Vui lòng cập nhật để có trải nghiệm tốt nhất.",
    "Thông báo quan trọng: Chính sách bảo mật của chúng tôi đã được cập nhật.",
  ],
}

// Generate a random order ID
const generateOrderId = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Generate a random amount
const generateAmount = () => {
  return (Math.floor(10000 + Math.random() * 990000) / 1000).toFixed(3) + "000"
}

// Generate a random discount
const generateDiscount = () => {
  return Math.floor(5 + Math.random() * 45).toString()
}

// Generate random dates
const generateDates = () => {
  const start = new Date()
  start.setDate(start.getDate() + Math.floor(Math.random() * 5) + 1)
  const end = new Date(start)
  end.setDate(end.getDate() + Math.floor(Math.random() * 10) + 5)

  return {
    startDate: `${start.getDate()}/${start.getMonth() + 1}`,
    endDate: `${end.getDate()}/${end.getMonth() + 1}`,
  }
}

// Generate a random device
const generateDevice = () => {
  const devices = ["iPhone", "Android", "Windows PC", "MacBook", "iPad"]
  return devices[Math.floor(Math.random() * devices.length)]
}

// Generate a random time range
const generateTimeRange = () => {
  const start = new Date()
  start.setHours(Math.floor(Math.random() * 12) + 8, 0, 0)
  const end = new Date(start)
  end.setHours(end.getHours() + Math.floor(Math.random() * 4) + 2)

  return {
    startTime: `${start.getHours()}:00`,
    endTime: `${end.getHours()}:00`,
  }
}

// Generate a random code
const generateCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let code = ""
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Replace placeholders in message
const replacePlaceholders = (message: string) => {
  let result = message

  if (result.includes("ORDER_ID")) {
    result = result.replace("ORDER_ID", generateOrderId())
  }

  if (result.includes("AMOUNT")) {
    result = result.replace("AMOUNT", generateAmount())
  }

  if (result.includes("DISCOUNT")) {
    result = result.replace("DISCOUNT", generateDiscount())
  }

  if (result.includes("START_DATE") && result.includes("END_DATE")) {
    const { startDate, endDate } = generateDates()
    result = result.replace("START_DATE", startDate).replace("END_DATE", endDate)
  }

  if (result.includes("DEVICE")) {
    result = result.replace("DEVICE", generateDevice())
  }

  if (result.includes("START_TIME") && result.includes("END_TIME")) {
    const { startTime, endTime } = generateTimeRange()
    result = result.replace("START_TIME", startTime).replace("END_TIME", endTime)
  }

  if (result.includes("CODE")) {
    result = result.replace("CODE", generateCode())
  }

  return result
}

export const notificationService = {
  // Get all notifications
  getNotifications: async (): Promise<NotificationProps[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          [...mockNotifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        )
      }, 500)
    })
  },

  // Generate a random notification
  generateRandomNotification: (): NotificationProps => {
    const types = Object.values(NotificationType)
    const type = types[Math.floor(Math.random() * types.length)]

    const titleIndex = Math.floor(Math.random() * notificationTitles[type].length)
    const messageIndex = Math.floor(Math.random() * notificationMessages[type].length)

    const title = notificationTitles[type][titleIndex]
    const message = replacePlaceholders(notificationMessages[type][messageIndex])

    return {
      id: uuidv4(),
      title,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    }
  },
}


const CustomerService = () => {
  const { callApi, loading, setIsLoading } = useApiService();
  const getAddresses = useCallback(
    async () => {
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          API_ROUTES.GET_ADDRESSES,
        );
        return res;
      } catch (err: any) {
        toast.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const postAddresses = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.POST,
          API_ROUTES.CREATE_ADDRESS,
          values
        );
        toast.success(MESSAGE.CREATE_ADDRESS_SUCCESSFULLY);
        return res;
      } catch (err: any) {
        toast.error(err?.response?.data || MESSAGE.CREATE_ADDRESS_FAILED);
      }
    },
    [callApi]
  );

  const putAddresses = useCallback(
    async (values: any) => {
      try {
        const url = API_ROUTES.UPDATE_ADDRESS.replace(":id", values.addressID);
        const res = await callApi(HTTP_METHOD.PUT, url, values);
        toast.success(MESSAGE.UPDATE_ADDRESS_SUCCESSFULLY);
        return res;
      } catch (err: any) {
        toast.error(err?.response?.data || MESSAGE.UPDATE_ADDRESS_FAILED);
      }
    },
    [callApi]
  );

 
  return { getAddresses, postAddresses, putAddresses, loading, setIsLoading };
};

export default CustomerService;

