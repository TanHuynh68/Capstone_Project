import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD } from "@/constants";
import { ReportFormData } from "@/schemas/report/reportSchema";

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


    const createReport = useCallback(
        async (data: ReportFormData) => {
            try {
                const formData = new FormData()

                // Add basic fields
                if (data.targetID) {
                    formData.append("TargetID", data.targetID)
                }
                formData.append("ReportType", data.reportType.toString())
                formData.append("Title", data.title)
                formData.append("Content", data.content)

                // Add images
                if (data.images && data.images.length > 0) {
                    data.images.forEach((image) => {
                        formData.append("Images", image)
                    })
                }

                // Add image descriptions
                if (data.imagesDescriptions && data.imagesDescriptions.length > 0) {
                    data.imagesDescriptions.forEach((description) => {
                        formData.append("ImagesDescriptions", description)
                    })
                }
                const res = await callApi(HTTP_METHOD.POST, `${API_ROUTES.CUSTOMER_CREATE_REPORT}`, formData);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data);
            }
        },
        [callApi]
    );

    return { getCustomerReports, deleteReport, getReportDetail, createReport };
};


export default CustomerReportService;
