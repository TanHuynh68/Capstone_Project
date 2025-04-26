import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD } from "@/constants";
import ENV from "@/config/env";

const WalletService = () => {
  const { callApi, loading, setIsLoading } = useApiService();

  const getWallet = useCallback(async () => {
    try {
      const res = await callApi(HTTP_METHOD.GET, API_ROUTES.GET_WALLET);
      return res;
    } catch (err: any) {
      toast.error(err?.response?.data);
    }
  }, [callApi]);

  const getStaffWalletTransaction = useCallback(async () => {
    try {
      const res = await callApi(HTTP_METHOD.GET, API_ROUTES.STAFF_WALLET_TRANSACTION);
      return res;
    } catch (err: any) {
      toast.error(err?.response?.data);
    }
  }, [callApi]);

  const getWalletTransaction = useCallback(async () => {
    try {
      const res = await callApi(HTTP_METHOD.GET, API_ROUTES.WALLET_TRANSACTION);
      return res;
    } catch (err: any) {
      toast.error(err?.response?.data);
    }
  }, [callApi]);

  const getStaffWalletOrder = useCallback(async () => {
    try {
      const res = await callApi(HTTP_METHOD.GET, API_ROUTES.STAFF_WALLET_ORDER);
      return res;
    } catch (err: any) {
      toast.error(err?.response?.data);
    }
  }, [callApi]);

  const getWalletOrder = useCallback(async () => {
    try {
      const res = await callApi(HTTP_METHOD.GET, API_ROUTES.WALLET_ORDER);
      return res;
    } catch (err: any) {
      toast.error(err?.response?.data);
    }
  }, [callApi]);

  const placeDeposit = useCallback(async (data: any) => {
    try {
      const res = await callApi(HTTP_METHOD.POST, API_ROUTES.PLACE_DEPOSIT, data);
      return res;
    } catch (err: any) {
      toast.error(err?.response?.data);
    }
  }, [callApi]);

  const refundDeposit = useCallback(async (data: any) => {
    try {
      const res = await callApi(HTTP_METHOD.POST, API_ROUTES.REFUND_DEPOSIT, data);
      return res;
    } catch (err: any) {
      toast.error(err?.response?.data);
    }
  }, [callApi]);

  const createVnpayLink = useCallback(async (data: any) => {
    try {
      const res = await callApi(HTTP_METHOD.POST, `${API_ROUTES.VNPAY_LINK}=${data}`, {
        amount: data, redirectUrl: ENV.PAYMENT_REDIRECT_URL
      });
      return res;
    } catch (err: any) {
      toast.error(err?.response?.data);
    }
  }, [callApi]);

  const getVnpayCallback = useCallback(async () => {
    try {
      const res = await callApi(HTTP_METHOD.GET, API_ROUTES.VNPAY_CALLBACK);
      return res;
    } catch (err: any) {
      toast.error(err?.response?.data);
    }
  }, [callApi]);

  const createPayosLink = useCallback(async (data: any) => {
    try {
      const res = await callApi(HTTP_METHOD.POST, API_ROUTES.PAYOS_LINK, data);
      return res;
    } catch (err: any) {
      toast.error(err?.response?.data);
    }
  }, [callApi]);

  const getPayosCallback = useCallback(async () => {
    try {
      const res = await callApi(HTTP_METHOD.GET, API_ROUTES.PAYOS_CALLBACK);
      return res;
    } catch (err: any) {
      toast.error(err?.response?.data);
    }
  }, [callApi]);

  const webhookPayos = useCallback(async (data: any) => {
    try {
      const res = await callApi(HTTP_METHOD.POST, API_ROUTES.PAYOS_WEBHOOK, data);
      return res;
    } catch (err: any) {
      toast.error(err?.response?.data);
    }
  }, [callApi]);

  const getPayosPaymentInfo = useCallback(async (id: string) => {
    try {
      const url = `${API_ROUTES.PAYOS_PAYMENT_INFO}/${id}`;
      const res = await callApi(HTTP_METHOD.GET, url);
      return res;
    } catch (err: any) {
      toast.error(err?.response?.data);
    }
  }, [callApi]);

  const cancelPayos = useCallback(async (id: string) => {
    try {
      const url = `${API_ROUTES.PAYOS_CANCEL}/${id}`;
      const res = await callApi(HTTP_METHOD.GET, url);
      return res;
    } catch (err: any) {
      toast.error(err?.response?.data);
    }
  }, [callApi]);

  return {
    getWallet,
    getStaffWalletTransaction,
    getWalletTransaction,
    getStaffWalletOrder,
    getWalletOrder,
    placeDeposit,
    refundDeposit,
    createVnpayLink,
    getVnpayCallback,
    createPayosLink,
    getPayosCallback,
    webhookPayos,
    getPayosPaymentInfo,
    cancelPayos,
    loading,
    setIsLoading,
  };
};

export default WalletService;
