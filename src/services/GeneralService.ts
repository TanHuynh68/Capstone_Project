import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const GeneralService = () => {
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

    return { uploadAvatar };
};


export default GeneralService;
