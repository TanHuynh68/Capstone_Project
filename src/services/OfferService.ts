import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const OfferService = () => {
    const { callApi } = useApiService();
    const createOffer = useCallback(
        async (data: any) => {
            const formData = new FormData();
            formData.append("ProjectPostID ", data.ProjectPostID);
            formData.append("InitPrice", String(data.InitPrice));
            formData.append("Note ", data.Note);
            formData.append("SampleImage", data.SampleImage);
            formData.append("DeadlineEndAt ", data.DeadlineEndAt);
            
            try {
                const res = await callApi(
                    HTTP_METHOD.POST,
                    API_ROUTES.CREATE_OFFER,
                    formData
                );
                return res;
            } catch (err: any) {
                console.error(err?.response?.data);
            }
        },
        [callApi]
    );

    const getAllOffersInPost = useCallback(async (values: any) => {
        try {
            const res = await callApi(HTTP_METHOD.GET, API_ROUTES.GET_OFFERS_IN_POST, values);
            return res;
        } catch (err: any) {
            console.error(err?.response?.data);
        }
    }, [callApi]);

    const getOfferToken = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(HTTP_METHOD.GET, `${API_ROUTES.GET_OFFER_TOKEN, values}`);
                return res;
            } catch (err: any) {
                console.error(err?.response?.data);
            }
        },
        [callApi]
    );

    return { createOffer, getOfferToken, getAllOffersInPost};
};

export default OfferService;
