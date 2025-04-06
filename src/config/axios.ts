import axios from "axios";
import { toast } from "sonner";
import ENV from "./env";
import { store } from "@/redux/store";
import { logout } from "@/redux/userSlice";

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

// ✅ Response Interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { data } = error.response;

      // Case: Multiple validation errors
      if (!data.message && data.errors && data.errors.length > 0) {
        data.errors.forEach((err: { field: string; message: string }) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        if (!isTokenExpired) {
          isTokenExpired = true;

          // Token expired / unauthorized
          toast.error(data.message || "Something went wrong");

          setTimeout(() => {
            localStorage.clear();
            store.dispatch(logout());
            window.location.href = "/auth/login"; 
            isTokenExpired = false;
          }, 1300);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
