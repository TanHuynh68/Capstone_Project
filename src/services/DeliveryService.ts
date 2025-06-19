import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const DeliveryService = () => {
    const { callApi } = useApiService();

    const uploadAvatar = useCallback(
        async (formData: FormData) => {
            try {
                const res = await callApi(
                    HTTP_METHOD.PUT,
                    API_ROUTES.UPLOAD_AVATAR,
                    formData
                );
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || "Đã xảy ra lỗi khi tải ảnh.");
            }
        },
        [callApi]
    );

    const getProfileForAll = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(HTTP_METHOD.GET, API_ROUTES.GET_PROFILE_FOR_ALL, values);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || "Đã xảy ra lỗi khi lấy thông tin hồ sơ.");
            }
        },
        [callApi]
    );

    return { uploadAvatar, getProfileForAll };
};


export default DeliveryService;
