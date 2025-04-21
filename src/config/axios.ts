import axios from "axios";
import { toast } from "sonner";
import ENV from "./env";
import { logout } from "@/redux/userSlice";
import { store } from "@/redux/store";

const axiosInstance = axios.create({
  baseURL: ENV.BASE_URL,
});

let isTokenExpired = false;

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status, data, config } = error.response;

      const isLoginRequest = config?.url?.includes('/auth/login');
      const isAuthError = status === 401 || status === 403;
      const token = localStorage.getItem("token");

      if ((status === 400 || status === 401) && data.errors) {
        const messages = Object.values(data.errors).flat() as string[];
        messages.forEach((msg) => toast.error(msg));
      } else if (data.message) {
        toast.error(data.message as string);
      }

      if (isAuthError && !isLoginRequest && token) {
        if (!isTokenExpired) {
          isTokenExpired = true;
          toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
          setTimeout(() => {
            localStorage.clear();
            store.dispatch(logout());
            window.location.href = '/';
            isTokenExpired = false;
          }, 1300);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
