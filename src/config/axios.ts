import axios from "axios";
import { toast } from "sonner";
import ENV from "./env";
import { logout } from "@/redux/userSlice";
import { store } from "@/redux/store";

const axiosInstance = axios.create({
  baseURL: ENV.BASE_URL,
});

let isTokenExpired = false;

// ✅ Request Interceptor - Add token
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
      const { data } = error.response;
      console.log(error.response);
      if (data.message) {
        toast.error(`${data.message}`);
      } else {
        if (!isTokenExpired) {
          isTokenExpired = true;
          toast.error(data.message || 'Có lỗi xảy ra!');
          setTimeout(() => {
            window.location.href = '/';
            localStorage.clear();
            isTokenExpired = false;
            store.dispatch(logout());
          }, 1300);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
