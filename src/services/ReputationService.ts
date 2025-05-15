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

  return { getReputation };
};

export default ReputationService;
