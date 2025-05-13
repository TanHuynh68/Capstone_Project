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

    const getRules = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(
                    HTTP_METHOD.GET,
                    API_ROUTES.GET_RULE,
                    values
                );
                // toast.success(MESSAGE.GET_ADDRESS_SUCCESSFULLY);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || MESSAGE.GET_RULES_FAILED);
            }
        },
        [callApi]
    );

    const getRuleById = useCallback(
        async (values: any) => {
            try {
                const url = API_ROUTES.GET_RULE_BY_ID.replace(":id", values.ruleID);
                const res = await callApi(HTTP_METHOD.GET, url, values);
                // toast.success(MESSAGE.DELETE_ADDRESS_SUCCESSFULLY);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || MESSAGE.GET_RULE_BY_ID_FAILED);
            }
        },
        [callApi]
    );

    const postRule = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(
                    HTTP_METHOD.POST,
                    API_ROUTES.CREATE_RULE,
                    values
                );
                toast.success(MESSAGE.CREATE_RULE_SUCCESSFULLY);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || MESSAGE.CREATE_RULE_FAILED);
            }
        },
        [callApi]
    );

    // const putAddresses = useCallback(
    //     async (values: any) => {
    //         try {
    //             const url = API_ROUTES.UPDATE_ADDRESS.replace(":id", values.addressID);
    //             const res = await callApi(HTTP_METHOD.PUT, url, values);
    //             toast.success(MESSAGE.UPDATE_ADDRESS_SUCCESSFULLY);
    //             return res;
    //         } catch (err: any) {
    //             toast.error(err?.response?.data || MESSAGE.UPDATE_ADDRESS_FAILED);
    //         }
    //     },
    //     [callApi]
    // );

    // const deleteAddresses = useCallback(
    //     async (values: any) => {
    //         try {
    //             const url = API_ROUTES.DELETE_ADDRESS.replace(":id", values.addressID);
    //             const res = await callApi(HTTP_METHOD.DELETE, url, values);
    //             // toast.success(MESSAGE.DELETE_ADDRESS_SUCCESSFULLY);
    //             return res;
    //         } catch (err: any) {
    //             toast.error(err?.response?.data || MESSAGE.DELETE_ADDRESS_FAILED);
    //         }
    //     },
    //     [callApi]
    // );




    return { getRules, getRuleById, loading, setIsLoading, postRule };
};

export default AdminService;
