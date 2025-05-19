import { useCallback } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD, MESSAGE } from "@/constants";

const StaffService = () => {
  const { callApi, loading, setIsLoading } = useApiService();
  //   const navigate = useNavigate();
  //   const dispatch = useDispatch();

  const getUserByStaff = useCallback(
    async (values: any) => {
      // console.log(values, "valuesvaluesvalues");
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          API_ROUTES.GET_USERES,
          values
        );
        // console.log(res, "resresresresres");

        // toast.success(MESSAGE.GET_USERS_SUCCESSFULLY);
        return res;
      } catch (err: any) {
        toast.error(err?.response?.data || MESSAGE.GET_USERS_FAILED);
      }
    },
    [callApi]
  );

  const changeActiveUserByStaff = useCallback(
    async (values: any) => {
      try {
        console.log(values, "valuesvaluesvalues");
        console.log(API_ROUTES.UPDATE_USER, "????");
        const res = await callApi(
          HTTP_METHOD.PUT,
          API_ROUTES.UPDATE_USER,
          values
        );
        toast.success(MESSAGE.CHANGE_ACTIVE_USER_SUCCESSFULLY);
        return res;
      } catch (err: any) {
        toast.error(err?.response?.data || MESSAGE.CHANGE_ACTIVE_USER_FAILED);
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

  const deleteAddresses = useCallback(
    async (values: any) => {
      try {
        const url = API_ROUTES.DELETE_ADDRESS.replace(":id", values.addressID);
        const res = await callApi(HTTP_METHOD.DELETE, url, values);
        // toast.success(MESSAGE.DELETE_ADDRESS_SUCCESSFULLY);
        return res;
      } catch (err: any) {
        toast.error(err?.response?.data || MESSAGE.DELETE_ADDRESS_FAILED);
      }
    },
    [callApi]
  );

  // const getWalletOrderByStaff = useCallback(
  //   async (queryParams: any) => {
  //     try {
  //       const res = await callApi(
  //         HTTP_METHOD.GET,
  //         API_ROUTES.WALLET_ORDER,
  //         undefined, // Không truyền body trong GET
  //         queryParams // Truyền values vào query
  //       );

  //       // toast.success(MESSAGE.GET_USERS_SUCCESSFULLY);
  //       return res;
  //     } catch (err: any) {
  //       toast.error(err?.response?.data || MESSAGE.GET_USERS_FAILED);
  //     }
  //   },
  //   [callApi]
  // );

  const getWalletOrderByStaff = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          API_ROUTES.GET_WALLET_ORDER_BY_STAFF,
          values
        );

        return res;
      } catch (err: any) {
        toast.error(err?.response?.data || "Lấy danh sách đơn ví thất bại.");
      }
    },
    [callApi]
  );

  const putWalletWithdrawByStaff = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.PUT,
          API_ROUTES.PUT_WALLET_WITHDRAW_BY_STAFF,
          values
        );

        return res;
      } catch (err: any) {
        toast.error(err?.response?.data || "Cập nhật rút tiền thất bại.");
      }
    },
    [callApi]
  );

  const getQRWithdrawByStaff = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          API_ROUTES.GET_QR_WITHDRAW_BY_STAFF,
          values
        );

        return res;
      } catch (err: any) {
        toast.error(err?.response?.data || "Lấy QR rút tiền thất bại.");
      }
    },
    [callApi]
  );

  return {
    getUserByStaff,
    changeActiveUserByStaff,
    putAddresses,
    deleteAddresses,
    getWalletOrderByStaff,
    putWalletWithdrawByStaff,
    getQRWithdrawByStaff,
    loading,
    setIsLoading,
  };
};

export default StaffService;
