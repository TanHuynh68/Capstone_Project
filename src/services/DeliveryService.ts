import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD } from "@/constants";
import { GetDeliveriesParams } from "@/types/delivery";

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

    const getDeliveryDetail = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(HTTP_METHOD.GET, API_ROUTES.GET_DELIVERY_DETAIL, values);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || "Đã xảy ra lỗi khi lấy thông tin giao hàng.");
            }
        },
        [callApi]
    );

    const createDelivery = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(HTTP_METHOD.POST, API_ROUTES.CREATE_DELIVERY, values);
                return res;
            }
            catch (err: any) {
                toast.error(err?.response?.data || "Đã xảy ra lỗi khi tạo giao hàng.");
            }
        },
        [callApi]
    );

    const uploadDeliveryImage = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(HTTP_METHOD.POST, API_ROUTES.UPLOAD_DELIVERY_IMAGE, values);
                return res;
            }
            catch (err: any) {
                toast.error(err?.response?.data || "Đã xảy ra lỗi khi tải lên ảnh giao hàng.");
            }
        },
        [callApi]
    );

    const postNotifyMissing = useCallback(
        async (values: any) => {
            try {
                const { receiverID, orderID } = values;
                const url = `${API_ROUTES.POST_NOTIFY_MISSING}?receiverID=${receiverID}&orderID=${orderID}`;
                const res = await callApi(HTTP_METHOD.POST, url);
                return res;
            }
            catch (err: any) {
                toast.error(err?.response?.data || "Đã xảy ra lỗi khi gửi thông báo cho người nhận thiếu địa chỉ giao hàng.");
            }
        },
        [callApi]
    );

    const staffGetUserDelivery = useCallback(
        async ( params: GetDeliveriesParams,) => {
            try {
                const queryParams = new URLSearchParams()

                if (params.page !== undefined) queryParams.append("page", params.page.toString())
                if (params.size !== undefined) queryParams.append("size", params.size.toString())
                if (params.accountID) queryParams.append("accountID", params.accountID)
                if (params.orderID) queryParams.append("orderID", params.orderID)
                if (params.deliveryStatus !== undefined) queryParams.append("deliveryStatus", params.deliveryStatus.toString())
                const url = `${API_ROUTES.STAFF_GET_USER_DELIVERIES}?${queryParams.toString()}`;
                const res = await callApi(HTTP_METHOD.GET, url);
                return res
            } catch (error) {
                console.error("Error fetching staff deliveries:", error)
                return null
            }
        },
        [callApi]
    );

    return { staffGetUserDelivery, getDeliveryByToken, getDeliveryByOrderID, createDelivery, getDeliveryDetail, uploadDeliveryImage, postNotifyMissing };
};


export default DeliveryService;
