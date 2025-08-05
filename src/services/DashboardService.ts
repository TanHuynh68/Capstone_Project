import { useCallback } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const DashboardService = () => {
  const { callApi } = useApiService();

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

  const getGrowthRates = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.POST,
          API_ROUTES.GET_GROWTH_RATE,
          values
        );
        return res;
      } catch (err: any) {
        toast.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const adminGetStaffs = useCallback(
    async (filters: StaffFilters) => {
      try {
        const queryParams = new URLSearchParams({
          page: filters.page.toString(),
          size: filters.size.toString(),
          ...(filters.fullName && { fullName: filters.fullName }),
        })
        const res = await callApi(
          HTTP_METHOD.GET,
          `${API_ROUTES.ADMIN_GET_STAFF}?${queryParams}`,
        );
        return res;
      } catch (err: any) {
        toast.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const adminChangeActiveStaff = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.PUT,
          `${API_ROUTES.ADMIN_CHANGE_STAFF}`,
          values
        );
        return res;
      } catch (err: any) {
        toast.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const createStaff = useCallback(
    async (values: any) => {
      try {
        const response = await callApi(HTTP_METHOD.POST, API_ROUTES.SIGN_UP, {
          ...values,
        });
        return response;
      } catch (e: any) {
        toast.error(e?.response?.data);
      }
    },
    [callApi]
  );
  return {
    getDashboard,
    getGrowthRates,
    adminGetStaffs,
    adminChangeActiveStaff,
    createStaff
  };
};

export default DashboardService;
