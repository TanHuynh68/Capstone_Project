import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { API_ROUTES, HTTP_METHOD, ROLE } from "@/constants";
import { loginSuccess } from "@/redux/userSlice";
import { DecodedUserRaw } from "@/types/auth";
import { normalizeDecodedUser } from "@/components/utils/jwt";

const useAuthService = () => {
  const { callApi, loading, setIsLoading } = useApiService();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const register = useCallback(async (values: any) => {
    try {
      const response = await callApi("post", "auth/register", {
        ...values,
        avt: "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
      });
      toast.success("Đăng kí thành công. Vui lòng kiểm tra email!");
      navigate("/auth/login");
      return response;
    } catch (e: any) {
      toast.error(e?.response?.data || "Đăng ký thất bại");
    }
  }, [callApi, navigate]);

  const login = useCallback(async (values: any) => {
    try {
      const res = await callApi(HTTP_METHOD.POST, API_ROUTES.SIGN_IN, values);
      const jwtToken = res?.responseRequestModel?.jwtToken;
      const token = jwtToken?.accessToken;
      const refreshToken = jwtToken?.refreshToken;

      if (!token) throw new Error("Không tìm thấy token");

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      const decoded = jwtDecode<DecodedUserRaw>(token);
      const user = normalizeDecodedUser(decoded);
      dispatch(loginSuccess(user));

      toast.success("Đăng nhập thành công");
      console.log("user.role", user.role);
      switch (user.role) {
        case ROLE.ADMIN:
          navigate("/admin");
          break;
        default:
          navigate("/");
          break;
      }

      return res;
    } catch (err: any) {
      toast.error(err?.response?.data || "Đăng nhập thất bại");
    }
  }, [callApi, dispatch, navigate]);

  return { login, register, loading, setIsLoading };
};

export default useAuthService;
