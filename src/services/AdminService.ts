import { useCallback } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD, MESSAGE } from "@/constants";

const AdminService = () => {
    const { callApi, loading, setIsLoading } = useApiService();
    //   const navigate = useNavigate();
    //   const dispatch = useDispatch();

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

    const getBenefits = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(
                    HTTP_METHOD.GET,
                    API_ROUTES.GET_BENEFIT,
                    values
                );
                // toast.success(MESSAGE.GET_ADDRESS_SUCCESSFULLY);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || MESSAGE.GET_BENEFIT_FAILED);
            }
        },
        [callApi]
    );

    const getBenefitById = useCallback(
        async (id: string) => {
            try {
                const url = API_ROUTES.GET_BENEFIT_BY_ID.replace(":id", id);
                const res = await callApi(HTTP_METHOD.GET, url, {});
                // toast.success(MESSAGE.DELETE_ADDRESS_SUCCESSFULLY);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || MESSAGE.GET_BENEFIT_BY_ID_FAILED);
            }
        },
        [callApi]
    );

    const postBenefit = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(
                    HTTP_METHOD.POST,
                    API_ROUTES.CREATE_BENEFIT,
                    values
                );
                toast.success(MESSAGE.CREATE_BENEFIT_SUCCESSFULLY);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || MESSAGE.CREATE_BENEFIT_FAILED);
            }
        },
        [callApi]
    );

    return { getBenefits, getBenefitById, loading, setIsLoading, postBenefit, createStaff };
};

export default AdminService;
