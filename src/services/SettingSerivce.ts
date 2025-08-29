import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const SettingService = () => {
    const { callApi } = useApiService();
    const getSettings = useCallback(
        async () => {
            try {
                const res = await callApi(
                    HTTP_METHOD.GET,
                    API_ROUTES.GET_SETTING
                );
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data);
            }
        },
        [callApi]
    );

    const createSetting = useCallback(
        async (data: any) => {
            try {
                const res = await callApi(
                    HTTP_METHOD.POST,
                    API_ROUTES.CREATE_SETTING,
                    data
                );
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data);
            }
        },
        [callApi]
    );

    const updateSetting = useCallback(
        async (data: any) => {
            try {
                const res = await callApi(
                    HTTP_METHOD.PUT,
                    API_ROUTES.UPDATE_SETTING,
                    data
                );
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data);
            }
        },
        [callApi]
    );
    return { getSettings, createSetting, updateSetting };
};

export default SettingService;
