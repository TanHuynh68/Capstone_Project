import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const BenefitService = () => {
    const { callApi } = useApiService();

    const getBenefits = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(HTTP_METHOD.GET, API_ROUTES.GET_BENEFIT, values);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || "Đã xảy ra lỗi khi lấy thông tin quyền lợi.");
            }
        },
        [callApi]
    );

    const getBenefitDetail = useCallback(
        async (id: any) => {
            try {
                const res = await callApi(HTTP_METHOD.GET, `${API_ROUTES.GET_BENEFIT}/${id}`);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || "Đã xảy ra lỗi khi lấy thông tin quyền lợi.");
            }
        },
        [callApi]
    );

    const getBenefitsLevel = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(HTTP_METHOD.GET, API_ROUTES.GET_BENEFITS_LEVEL, values);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || "Đã xảy ra lỗi khi lấy thông tin quyền lợi.");
            }
        },
        [callApi]
    );

    return { getBenefits, getBenefitsLevel, getBenefitDetail };
};


export default BenefitService;
