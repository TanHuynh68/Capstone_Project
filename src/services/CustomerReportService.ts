import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const CustomerReportService = () => {
    const { callApi } = useApiService();

    const getCustomerReports = useCallback(
        async (query: CustomerReportsApiQuery) => {
            const params = new URLSearchParams()
            if (query.reportType !== undefined) params.append("reportType", query.reportType.toString())
            if (query.reportStatus !== undefined) params.append("reportStatus", query.reportStatus.toString())
            params.append("page", query.page.toString())
            params.append("size", query.size.toString())
            try {
                const res = await callApi(HTTP_METHOD.GET, `${API_ROUTES.CUSTOMER_GET_REPORT}?${params.toString()}`);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data);
            }
        },
        [callApi]
    );

    const getReportDetail = useCallback(
        async (reportID: string) => {
            try {
                const res = await callApi(HTTP_METHOD.GET, `${API_ROUTES.CUSTOMER_GET_REPORT_DETAIL}?reportID=${reportID}`);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data);
            }
        },
        [callApi]
    );

    const deleteReport = useCallback(
        async (reportID: string) => {
            try {
                const res = await callApi(HTTP_METHOD.GET, `${API_ROUTES.CUSTOMER_DELETE_REPORT_DETAIL}/${reportID}`);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data);
            }
        },
        [callApi]
    );

    return { getCustomerReports, deleteReport, getReportDetail };
};


export default CustomerReportService;
