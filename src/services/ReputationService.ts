import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const ReputationService = () => {
  const { callApi} = useApiService();
  const getReputation = useCallback(
    async () => {
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          API_ROUTES.GET_REPUTATION
        );
        return res;
      } catch (err: any) {
        toast.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const getReputationHistory = useCallback(
    async () => {
      try {
        const res = await callApi(HTTP_METHOD.GET, API_ROUTES.GET_REPUTATION_HISTORY);
        return res;
      } catch (err: any) {
        toast.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const getReputationByAccountID = useCallback(
    async (accountID: string) => {
      try {
        const res = await callApi(HTTP_METHOD.GET, API_ROUTES.GET_REPUTATION_BY_ACCOUNT_ID, { accountID });
        return res;
      } catch (err: any) {
        toast.error(err?.response?.data);
      }
    },
    [callApi]
  );

  return { getReputation, getReputationHistory, getReputationByAccountID };
};

export default ReputationService;
