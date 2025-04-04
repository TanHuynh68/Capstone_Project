
import axios from "axios";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices";
import { toast } from "sonner";
import ENV from "./env";

const axiosInstance = axios.create({
  baseURL: ENV.BASE_URL,
});

let isTokenExpired = false;

axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
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

