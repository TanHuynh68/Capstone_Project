import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const PortfolioService = () => {
    const { callApi } = useApiService();

    const getMyProfile = useCallback(
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

    const getMyPortfolio = useCallback(
        async () => {
            try {
                const res = await callApi(HTTP_METHOD.GET, API_ROUTES.GET_PORTFOLIO);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || "Đã xảy ra lỗi khi lấy thông tin hồ sơ.");
            }
        },
        [callApi]
    );

    return { getMyProfile, getMyPortfolio };
};


export default PortfolioService;
