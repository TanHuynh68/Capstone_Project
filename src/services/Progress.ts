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

  const createProgress = useCallback(
    async (data: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.POST,
          `${API_ROUTES.CREATE_PROGRESS}`,
          data
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const getProgressReview = useCallback(async (progressStepID: string) => {
    try {
      const res = await callApi(
        HTTP_METHOD.GET,
        `${API_ROUTES.GET_PROGRESS_REVIEW}?progressStepID=${progressStepID}`
      );
      return res;
    } catch (err: any) {
      console.error(err?.response?.data);
    }
  }, [callApi]);

  return {
    getProgress,
    getProgressReviewDetail,
    createProgress,
    getProgressReview,
  };
};

export default ProgressService;
