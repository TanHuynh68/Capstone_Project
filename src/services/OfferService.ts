import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const OfferService = () => {
  const { callApi } = useApiService();
  const createOffer = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.POST,
          API_ROUTES.CREATE_OFFER,
          values
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const getAllOffersInPost = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          API_ROUTES.GET_OFFERS_IN_POST,
          values
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const getOfferToken = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          `${(API_ROUTES.GET_OFFER_TOKEN, values)}`
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const updateOffer = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.PUT,
          API_ROUTES.UPDATE_OFFER,
          values
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const editOfferImage = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.PUT,
          API_ROUTES.EDIT_OFFER_IMAGE,
          values
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const deleteOffer = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.DELETE,
          API_ROUTES.DELETE_OFFER,
          values
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const offerFind = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          API_ROUTES.OFFER_FIND,
          values
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  return {
    createOffer,
    getOfferToken,
    getAllOffersInPost,
    deleteOffer,
    updateOffer,
    editOfferImage,
    offerFind
  };
};

export default OfferService;
