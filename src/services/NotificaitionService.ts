import { API_ROUTES } from "@/constants"
import { HTTP_METHOD } from "@/constants/enum"
import useApiService from "@/hooks/useApi"
import { useCallback } from "react"
import { toast } from "sonner"


const NotificationService = () => {
  const { callApi, loading, setIsLoading } = useApiService();

  // Lấy danh sách notification
  const getNotifications = useCallback(async () => {
    try {
      const res = await callApi(
        HTTP_METHOD.GET,
        API_ROUTES.GET_NOTIFICATION,
      );
      return res;
    } catch (err: any) {
      toast.error(err?.response?.data || "Lỗi khi lấy thông báo");
    }
  }, [callApi]);

  // Tạo notification mới
  const postNotification = useCallback(async (values: any) => {
    try {
      const res = await callApi(
        HTTP_METHOD.POST,
        API_ROUTES.CREATE_NOTIFICATION,
        values
      );
      toast.success("Tạo thông báo thành công!");
      return res;
    } catch (err: any) {
      toast.error(err?.response?.data || "Tạo thông báo thất bại!");
    }
  }, [callApi]);

  // Cập nhật notification
  const markNotificationAsRead = useCallback(async (notificationID: string) => {
    try {
      // console.log({ notificationID: notificationID }, "notificationID")
      const res = await callApi(
        HTTP_METHOD.PUT,
        API_ROUTES.READ_NOTIFICATION,
        { notificationID: notificationID }
      );
      toast.success("Đã đánh dấu thông báo đã đọc!");
      return res;
    } catch (err: any) {
      toast.error(err?.response?.data || "Đánh dấu thông báo thất bại!");
    }
  }, [callApi]);

  // Xóa notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      const url = API_ROUTES.DELETE_NOTIFICATION.replace(":id", id);
      const res = await callApi(
        HTTP_METHOD.DELETE,
        url
      );
      toast.success("Đã xóa thông báo!");
      return res;
    } catch (err: any) {
      toast.error(err?.response?.data || "Xóa thông báo thất bại!");
    }
  }, [callApi]);

  return {
    getNotifications,
    postNotification,
    markNotificationAsRead,
    deleteNotification,
    loading,
    setIsLoading,
  };
};

export default NotificationService;