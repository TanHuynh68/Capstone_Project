import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { API_ROUTES, HTTP_METHOD, MESSAGE } from "@/constants";

const FeedbackService = () => {
    const { callApi } = useApiService();
    const getFeedbacks = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(
                    HTTP_METHOD.GET,
                    API_ROUTES.GET_FEEDBACK,
                    values
                );
                return res;
            } catch (err: any) {
                console.log(err?.response?.data || MESSAGE.GET_ADDRESS_FAILED)
            }
        },
        [callApi]
    );
    return { getFeedbacks };
};

export default FeedbackService;
