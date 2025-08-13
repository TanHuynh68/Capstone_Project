import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const OrderService = () => {
  const { callApi } = useApiService();
  const getOrders = useCallback(async () => {
    try {
      const res = await callApi(
        HTTP_METHOD.GET,
        `${API_ROUTES.GET_ORDERS}?page=1&size=100`
      );
      return res;
    } catch (err: any) {
      console.error(err?.response?.data);
    }
  }, [callApi]);

  const getOrderDetail = useCallback(
    async (id: string) => {
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          `${API_ROUTES.GET_ORDER_DETAIL}=${id}`
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const createOrder = useCallback(
    async (data: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.POST,
          `${API_ROUTES.CREATE_ORDER}`,
          data
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const getOrderActivity = useCallback(
    async (orderID: string) => {
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          `${API_ROUTES.GET_ORDER_ACTIVITY}?orderID=${orderID}`
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const createDepositPhase = useCallback(
    async (data: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.POST,
          `${API_ROUTES.CREATE_DEPOSIT_PHASE}`,
          data
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );
  const createDepositListPhase = useCallback(
    async (data: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.POST,
          `${API_ROUTES.CREATE_DEPOSIT_LIST_PHASE}`,
          data
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );
  const createWithdrawPhase = useCallback(
    async (id: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.POST,
          `${API_ROUTES.CREATE_WITHDRAW_PHASE}`,
          {OfferPhaseIDs: id}
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

   const getOrderDeposited = useCallback(
    async (id: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          `${API_ROUTES.GET_ORDERS_DEPOSITED}?orderId=${id}`
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const getOrderDeliveryValue = useCallback(
    async (id: any) => {
      try {
        const res = await callApi(HTTP_METHOD.GET, `${API_ROUTES.GET_ORDER_DELIVERY_VALUE}?orderId=${id}`);
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );


  return {
    getOrders,
    getOrderDeposited,
    getOrderDetail,
    createOrder,
    getOrderActivity,
    createDepositPhase,
    createDepositListPhase,
    createWithdrawPhase,
    getOrderDeliveryValue
  };
};

export default OrderService;
