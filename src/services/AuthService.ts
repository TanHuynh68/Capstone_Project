import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { API_ROUTES, HTTP_METHOD, MESSAGE, ROLE } from "@/constants";
import { loginSuccess } from "@/redux/userSlice";
import { normalizeDecodedUser } from "@/components/utils/jwt";

const useAuthService = () => {
  const { callApi, loading, setIsLoading } = useApiService();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const register = useCallback(async (values: any) => {
    try {
      const response = await callApi(HTTP_METHOD.POST, API_ROUTES.SIGN_UP, {
        ...values
      });
      return response;
    } catch (e: any) {
      toast.error(e?.response?.data || MESSAGE.REGISTER_FAILED);
    }
  }, [callApi]);

  const login = useCallback(async (values: any) => {
    const res = await callApi(HTTP_METHOD.POST, API_ROUTES.SIGN_IN, values);
    const jwtToken = res?.responseRequestModel?.jwtToken;
    const token = jwtToken?.accessToken;
    const refreshToken = jwtToken?.refreshToken;

    if (jwtToken) {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      const decoded = jwtDecode<DecodedUserRaw>(token);
      const user = normalizeDecodedUser(decoded);
      dispatch(loginSuccess(user));
      toast.success(MESSAGE.LOGIN_SUCCESSFULLY);

      switch (user.role) {
        case ROLE.ADMIN:
          navigate("/admin");
          break;
        case ROLE.STAFF:
          navigate("/staff");
          break;
        default:
          navigate("/");
          break;
      }
    }

    return res;
  }, [callApi, dispatch, navigate]);


  const changePassword = useCallback(
    async (values: any) => {
      try {
        const response = await callApi(HTTP_METHOD.PUT, API_ROUTES.CHANGE_PASSWORD, values);
        toast.success(MESSAGE.CHANGE_PASSWORD_SUCCESSFULLY);
        return response;
      } catch (err: any) {
        toast.error(err?.response?.data || MESSAGE.CHANGE_PASSWORD_FAILED);
      }
    },
    [callApi]
  );

  const getProfile = useCallback(
    async () => {
      try {
        const response = await callApi(
          HTTP_METHOD.GET,
          API_ROUTES.GET_PROFILE,
        );
        return response;
      } catch (err: any) {
        toast.error(err?.response?.data || MESSAGE.GET_ADDRESS_FAILED);
      }
    },
    [callApi]
  );

  const verifyAccount = useCallback(
    /**
     * 
     * @param values {
     * "email": "user@example.com",
     *  "otp": "383562" 
     * }
     * @returns 
     */
    async (values: any) => {
      try {
        const response = await callApi(HTTP_METHOD.PUT, API_ROUTES.VERIFY_ACCOUNT, values);
        if (response) {
          toast.success(MESSAGE.VERIFY_ACCOUNT_SUCCESSFULLY);
        }
        return response;
      } catch (err: any) {
        toast.error(err?.response?.data || MESSAGE.VERIFY_ACCOUNT_FAILED);
      }
    },
    [callApi]
  );

  const resendOTP = useCallback(
    /**
     * 
     * @param values {
     * "email": "user@example.com",
     * }
     * @returns 
     */
    async (values: any) => {
      try {
        const response = await callApi(HTTP_METHOD.POST, API_ROUTES.RESEND_OTP, values);
        // if (response) {
        //   toast.success(MESSAGE.RESEND_OTP_SUCCESSFULLY);
        // }
        return response;
      } catch (err: any) {
        toast.error(err?.response?.data || MESSAGE.RESEND_OTP_FAILED);
      }
    },
    [callApi]
  );

  const forgotPassword = useCallback(
    /**
     * 
     * @param values {
     * "email": "user@example.com",
     *  "otp": "383562" 
     * }
     * @returns 
     */
    async (values: any) => {
      try {
        const response = await callApi(HTTP_METHOD.PUT, API_ROUTES.FORGOT_PASSWORD, values);
        if (response) {
          toast.success(MESSAGE.FORGOT_PASSWORD_SUCCESSFULLY);
        }
        return response;
      } catch (err: any) {
        toast.error(err?.response?.data || MESSAGE.FORGOT_PASSWORD_FAILED);
      }
    },
    [callApi]
  );

  const sendResetPasswordEmail = useCallback(
    /**
     * 
     * @param values {
     * "email": "user@example.com",
     * }
     * @returns 
     */
    async (values: any) => {
      try {
        const response = await callApi(HTTP_METHOD.POST, API_ROUTES.SEND_RESET_PASSWORD_MAIL, values);
        // if (response) {
        //   toast.success(MESSAGE.RESEND_OTP_SUCCESSFULLY);
        // }
        return response;
      } catch (err: any) {
        toast.error(err?.response?.data || MESSAGE.RESEND_OTP_FAILED);
      }
    },
    [callApi]
  );

  const resetPassword = useCallback(
    /**
     * 
     * @param values {
     * {
  "email": "user@example.com",
  "newPassword": "FgQa!)(YfZg\"cLPt5IBfsQkdTuS_w)ilf}Nit&j4.j,W]s[-&G{5q|z{i{qT_7%Sx'%M+K1c}+6",
  "confirmPassword": "hB1jLS@WLsC5YB'V7Xn#uL+[~,C"
}
     * }
     * @returns 
     */
    async (values: any) => {
      try {
        const response = await callApi(HTTP_METHOD.PUT, API_ROUTES.RESET_PASSWORD, values);
        // if (response) {
        //   toast.success(MESSAGE.RESEND_OTP_SUCCESSFULLY);
        // }
        return response;
      } catch (err: any) {
        toast.error(err?.response?.data || MESSAGE.RESEND_OTP_FAILED);
      }
    },
    [callApi]
  );
  return { login, register, loading, setIsLoading, changePassword, getProfile, verifyAccount, resendOTP, forgotPassword, sendResetPasswordEmail, resetPassword };
};

export default useAuthService;
