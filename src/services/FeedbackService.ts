import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const FeedbackService = () => {
    const { callApi } = useApiService();
    const getFeedbacks = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(
                    HTTP_METHOD.GET,
                    `${API_ROUTES.GET_FEEDBACK}?orderID=${values}`,
                );
                return res;
            } catch (err: any) {
                console.log(err?.response?.data)
            }
        },
        [callApi]
    );

    const getMyFeedbacks = useCallback(
        async () => {
            try {
                const res = await callApi(
                    HTTP_METHOD.GET,
                    API_ROUTES.GET_MY_FEEDBACKS
                );
                return res;
            } catch (err: any) {
                console.log(err?.response?.data)
            }
        },
        [callApi]
    );

    const getFeedbacksDesigner = useCallback(
        async () => {
            try {
                const res = await callApi(
                    HTTP_METHOD.GET,
                    API_ROUTES.GET_FEEDBACKS_DESIGNER
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
                 console.log('createFeedback; ', values)
            try {
                const formData = new FormData()
                formData.append("OrderId", String(values.orderID));
                formData.append("Rating", values.rating);
                formData.append("Comment", String(values.comment));
                formData.append("Image", values.image);
                const res = await callApi(
                    HTTP_METHOD.POST,
                    API_ROUTES.CREATE_FEEDBACK,
                    formData
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

    return { getFeedbacks, getMyFeedbacks, getFeedbacksDesigner, createFeedback, createFeedbackResponse };
};

export default FeedbackService;
