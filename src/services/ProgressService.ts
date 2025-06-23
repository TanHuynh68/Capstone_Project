import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const ProgressService = () => {
  const { callApi } = useApiService();
  const getProgress = useCallback(
    async (orderID: string, offerPhaseID: string) => {
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          `${API_ROUTES.GET_PROGRESS}?orderID=${orderID}&offerPhaseID=${offerPhaseID}`
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const getProgressReviewDetail = useCallback(
    async (id: string) => {
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          `${API_ROUTES.GET_PROGRESS_REVIEW_DETAIL}=${id}`
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const createProgressStep = useCallback(
    async (data: any) => {
      console.log('createProgressStep: ', data)
      const formData = new FormData();
      formData.append("OrderID", data.orderID);
      formData.append("OfferPhaseID", data.offerPhaseID);
      formData.append("StepTitle", data.stepTitle);
      formData.append("Description", data.description);

       if (data.imagesDescriptions?.length) {
        data.imagesDescriptions.forEach((string: string) => {
          formData.append("ImagesDescriptions", string);
        });
      }

      if (data.images?.length) {
        data.images.forEach((file: File) => {
          formData.append("Images", file);
        });
      }
      console.log('formData: ', formData)
      try {
        const res = await callApi(
          HTTP_METHOD.POST,
          `${API_ROUTES.CREATE_PROGRESS}`,
          formData
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const createProgressReview = useCallback(
    async (data: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.POST,
          `${API_ROUTES.CREATE_PROGRESS_REVIEW}`,
          data
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  return {
    getProgress,
    getProgressReviewDetail,
    createProgressStep,
    createProgressReview,
  };
};

export default ProgressService;
