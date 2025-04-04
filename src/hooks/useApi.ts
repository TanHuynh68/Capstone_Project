/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import api from "../config/axios";

const useApiService = () => {
  const [loading, setIsLoading] = useState<boolean>(false);
  const callApi = useCallback(
    async (
      method: "get" | "post" | "put" | "delete",
      url: string,
      data?: any
    ) => {
      try {
        setIsLoading(true);
        const response = await api[method](url, data);
        console.log(response);
        return response.data;
      } catch (e: any) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { loading, callApi, setIsLoading };
};

export default useApiService;
