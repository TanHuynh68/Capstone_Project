import axios from "axios";
import { toast } from "sonner";
import ENV from "./env";
import { logout } from "@/redux/userSlice";
import { useDispatch } from "react-redux";

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
      const dispatch = useDispatch();
      console.log(error.response);
      if (data.message === null && data.errors && data.errors.length > 0) {
        data.errors.forEach((error: { field: string, message: string }) => {
          toast.error(`${error.field}: ${error.message}`);
        });
      } else {
        if (!isTokenExpired) {
          isTokenExpired = true
          toast.error(data.message);
          setTimeout(() => {
            window.location.href = '/'
            localStorage.clear();
            isTokenExpired = false;
            dispatch(logout())
          }, 1300);
        }
      }
    }
  })

export default axiosInstance;
