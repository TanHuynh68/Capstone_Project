import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const DeliveryService = () => {
    const { callApi } = useApiService();

    const getDeliveryByToken = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(HTTP_METHOD.GET, API_ROUTES.GET_DELIVERY_BY_TOKEN, values);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || "Đã xảy ra lỗi khi lấy thông tin giao hàng.");
            }
        },
        [callApi]
    );

    const getDeliveryByOrderID = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(HTTP_METHOD.GET, API_ROUTES.GET_DELIVERY_BY_ORDER_CODE, values);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || "Đã xảy ra lỗi khi lấy thông tin giao hàng.");
            }
        },
        [callApi]
    );

    return { getDeliveryByToken, getDeliveryByOrderID };
};


export default DeliveryService;
