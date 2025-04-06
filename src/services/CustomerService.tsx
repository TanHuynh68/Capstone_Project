import { useCallback } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD, MESSAGE } from "@/constants";

const CustomerService = () => {
  const { callApi, loading, setIsLoading } = useApiService();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

  const getAddresses = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          API_ROUTES.GET_ADDRESSES,
          values
        ); 
        toast.success(MESSAGE.GET_ADDRESS_SUCCESSFULLY);    
        return res;
      } catch (err: any) {
        toast.error(err?.response?.data || MESSAGE.GET_ADDRESS_FAILED);
      }
    },
    [callApi]
  );

  return { getAddresses, loading, setIsLoading };
};

export default CustomerService;
