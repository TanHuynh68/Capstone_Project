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

  const postAddresses = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.POST,
          API_ROUTES.CREATE_ADDRESS,
          values
        );
        toast.success(MESSAGE.CREATE_ADDRESS_SUCCESSFULLY);
        return res;
      } catch (err: any) {
        toast.error(err?.response?.data || MESSAGE.CREATE_ADDRESS_FAILED);
      }
    },
    [callApi]
  );

  const putAddresses = useCallback(
    async (values: any) => {
      try {
        const url = API_ROUTES.UPDATE_ADDRESS.replace(":id", values.addressID);
        const res = await callApi(HTTP_METHOD.PUT, url, values);
        toast.success(MESSAGE.UPDATE_ADDRESS_SUCCESSFULLY);
        return res;
      } catch (err: any) {
        toast.error(err?.response?.data || MESSAGE.UPDATE_ADDRESS_FAILED);
      }
    },
    [callApi]
  );



  return { getAddresses, postAddresses, putAddresses, loading, setIsLoading };
};

export default CustomerService;
