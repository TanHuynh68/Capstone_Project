import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";

const useAuthService = () => {
  const { callApi, loading, setIsLoading } = useApiService();
  const router = useNavigate();
  const dispatch = useDispatch();

  const register = useCallback(
    async (values: any) => {
      try {
        const response = await callApi("post", "auth/register", {
          ...values,
          avt: "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
        });
        toast.success("Đăng kí thành công. Vui lòng kiểm tra email!");
        router("/auth/login");
        return response;
      } catch (e: any) {
        toast.error(e?.response?.data || "Registration failed");
      }
    },
    [callApi, router]
  );

  const login = useCallback(
    async (values: any) => {
      try {
        const response = await callApi("post", "auth/login", values);
        console.log("login: ", response)

        localStorage.setItem("token", response?.token);
        localStorage.setItem('USER', JSON.stringify(response));
        console.log(localStorage.getItem('USER'));
        toast.success("Đăng nhập thành công");
        switch (response?.role) {
          case "doctor":
            router('/doctor')
            break;
          case "nurse":
            router('/nurse')
            break;
          case "admin":
            router('/admin')
            break;
          default:
            router("/");
            break;
        }
        // dispatch(loginRedux(response?.data));
        return response?.data;
      } catch (e: any) {
        toast.error(e?.response?.data || "Đăng nhập thất bại");
      }
    },
    [callApi, dispatch, router]
  );

  return { register, login, loading, setIsLoading };
};

export default useAuthService;
