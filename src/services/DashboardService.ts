import { useCallback } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const DashboardService = () => {
  const { callApi} = useApiService();

  const getDashboard = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.POST,
          API_ROUTES.GET_DASHBOARD,
          values
        );
        return res;
      } catch (err: any) {
        toast.error(err?.response?.data);
      }
    },
    [callApi]
  );

  return {
    getDashboard,
  };
};

export default DashboardService;
