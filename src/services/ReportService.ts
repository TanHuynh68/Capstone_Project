import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const ReportService = () => {
  const { callApi } = useApiService();
  const getReportsByStaff = async (query: ReportsApiQuery) => {
    try {
      const params = new URLSearchParams()
      if (query.search) params.append("search", query.search)
      if (query.reportType !== undefined) params.append("reportType", query.reportType.toString())
      if (query.reportStatus !== undefined) params.append("reportStatus", query.reportStatus.toString())
      params.append("page", query.page.toString())
      params.append("size", query.size.toString())
      const res = await callApi(
        HTTP_METHOD.GET,
        `${API_ROUTES.GET_REPORT}?${params.toString()}`
      );
      return res
    } catch (error) {
      console.error("Error fetching reports:", error)
      throw error
    }
  }
  const processReport = useCallback(
    async (data: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.PUT,
          `${API_ROUTES.UPDATE_REPORT}`,
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
    getReportsByStaff,
    processReport
  };
};

export default ReportService;
