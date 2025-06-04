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


    const getPortfolioDesignerForAll = useCallback(
        async (values: { DesignerID: string }) => {
            try {
                const res = await callApi(
                    HTTP_METHOD.GET,
                    `${API_ROUTES.GET_PORTFOLIO_DESIGNER_FOR_ALL}?DesignerID=${values.DesignerID}`
                );
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || "Đã xảy ra lỗi khi lấy thông tin hồ sơ.");
            }
        },
        [callApi]
    );

    const createPortfolio = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(HTTP_METHOD.POST, API_ROUTES.CREATE_PORTFOLIO, values);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || "Đã xảy ra lỗi khi tạo dự án.");
            }
        },
        [callApi]
    );

    const editPortfolio = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(HTTP_METHOD.PUT, API_ROUTES.EDIT_PORTFOLIO, values);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || "Đã xảy ra lỗi khi sửa dự án.");
            }
        },
        [callApi]
    );

    const editImagePortfolio = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(HTTP_METHOD.PUT, API_ROUTES.EDIT_IMAGE_PORTFOLIO, values);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || "Đã xảy ra lỗi khi sửa ảnh dự án.");
            }
        },
        [callApi]
    );

    return { getMyProfile, getMyPortfolio, createPortfolio, editPortfolio, editImagePortfolio, getPortfolioDesignerForAll };
};


export default PortfolioService;
