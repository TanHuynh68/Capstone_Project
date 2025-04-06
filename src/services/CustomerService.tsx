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

const CustomerService = () => {
  const { callApi, loading, setIsLoading } = useApiService();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const getAddresses = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          API_ROUTES.GET_ADDRESSES,
          values
        );
        



        toast.success("Lấy địa chỉ thành công");
       

        return res;
      } catch (err: any) {
        toast.error(err?.response?.data || "Lấy địa chỉ thất bại");
      }
    },
    [callApi]
  );

  return { getAddresses, loading, setIsLoading };
};

export default CustomerService;
