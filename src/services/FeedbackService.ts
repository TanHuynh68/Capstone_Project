import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { API_ROUTES, HTTP_METHOD} from "@/constants";

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
                console.log(err?.response?.data)
            }
        },
        [callApi]
    );

    const createFeedback = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(
                    HTTP_METHOD.POST,
                    API_ROUTES.CREATE_FEEDBACK,
                    values
                );
                return res;
            } catch (err: any) {
                console.log(err?.response?.data)
            }
        },
        [callApi]
    );

    const createFeedbackResponse = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(
                    HTTP_METHOD.POST,
                    API_ROUTES.CREATE_FEEDBACK_RESPONSE,
                    values
                );
                return res;
            } catch (err: any) {
                console.log(err?.response?.data)
            }
        },
        [callApi]
    );

    return { getFeedbacks, createFeedback, createFeedbackResponse };
};

export default FeedbackService;
