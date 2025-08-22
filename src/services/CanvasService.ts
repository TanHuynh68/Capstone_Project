import { useCallback } from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD, MESSAGE } from "@/constants";

// Types for the new canvas structure
interface CreateCanvasRequest {
    canvasFolderId?: string;
    canvasTitle: string;
    canvasDescription: string;
    canvas3D?: string;
}

interface UpdateCanvasRequest {
    canvasInfoId: string;
    canvasTitle: string;
    canvasDescription: string;
    canvas3D?: string;
    isLatest: boolean;
    canvasFolderId?: string;
}

interface GetCanvasRequest {
    canvasFolderId?: string;
    page?: number;
    size?: number;
    canvasTitle?: string;
}

interface CanvasResponse {
    canvasInfoId: string;
    canvasTitle: string;
    canvasDescription: string;
    canvas3D?: string;
    canvasFolderId?: string;
    isLatest?: boolean;
    createdAt?: string;
    updatedAt?: string;
    versionNumber?: number; // <-- add this line
}

const CanvasService = () => {
    const { callApi, loading, setIsLoading } = useApiService();
    //   const navigate = useNavigate();
    //   const dispatch = useDispatch();

    const getCanvasHistory = useCallback(
        async (values: GetCanvasRequest) => {
            try {
                const res = await callApi(
                    HTTP_METHOD.GET,
                    API_ROUTES.GET_CANVAS,
                    values
                );
                // toast.success(MESSAGE.GET_ADDRESS_SUCCESSFULLY);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || MESSAGE.GET_CANVAS_FAILED);
            }
        },
        [callApi]
    );

    const postCanvas = useCallback(
        async (values: CreateCanvasRequest) => {
            try {
                const res = await callApi(
                    HTTP_METHOD.POST,
                    API_ROUTES.CREATE_CANVAS,
                    values
                );
                // toast.success(MESSAGE.CREATE_CANVAS_SUCCESSFULLY);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || MESSAGE.CREATE_CANVAS_FAILED);
            }
        },
        [callApi]
    );

    const putCanvas = useCallback(
        async (values: UpdateCanvasRequest) => {
            try {
                const res = await callApi(
                    HTTP_METHOD.PUT,
                    API_ROUTES.UPDATE_CANVAS,
                    values
                );
                // toast.success(MESSAGE.CREATE_CANVAS_SUCCESSFULLY);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || MESSAGE.UPDATE_CANVAS_FAILED);
            }
        },
        [callApi]
    );

    const copyCanvas = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(HTTP_METHOD.POST, API_ROUTES.COPY_CANVAS, values);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || MESSAGE.COPY_CANVAS_FAILED);
            }
        },
        [callApi]
    );

    // const deleteAddresses = useCallback(
    //   async (values: any) => {
    //     try {
    //       const url = API_ROUTES.DELETE_ADDRESS.replace(":id", values.addressID);
    //       const res = await callApi(HTTP_METHOD.DELETE, url, values);
    //       // toast.success(MESSAGE.DELETE_ADDRESS_SUCCESSFULLY);
    //       return res;
    //     } catch (err: any) {
    //       toast.error(err?.response?.data || MESSAGE.DELETE_ADDRESS_FAILED);
    //     }
    //   },
    //   [callApi]
    // );

    const deleteCanvas = useCallback(
        async (values: any) => {
            try {
                console.log(values, "sadsa");
                // Use the base URL and pass canvasInfoId as a query parameter
                const url = API_ROUTES.DELETE_CANVAS.replace(":id", values.canvasInfoId);
                const res = await callApi(HTTP_METHOD.DELETE, url, values);

                // toast.success(MESSAGE.DELETE_CANVAS_SUCCESSFULLY);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || MESSAGE.DELETE_CANVAS_FAILED);
            }
        },
        [callApi]
    );

    const getFolderCanvas = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(HTTP_METHOD.GET, API_ROUTES.GET_FOLDER_CANVAS, values);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || MESSAGE.GET_FOLDER_CANVAS_FAILED);
            }
        },
        [callApi]
    );

    const putFolderCanvas = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(HTTP_METHOD.PUT, API_ROUTES.PUT_FOLDER_CANVAS, values);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || MESSAGE.PUT_FOLDER_CANVAS_FAILED);
            }
        },
        [callApi]
    );

    const postFolderCanvas = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(HTTP_METHOD.POST, API_ROUTES.POST_FOLDER_CANVAS, values);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || MESSAGE.POST_FOLDER_CANVAS_FAILED);
            }
        },
        [callApi]
    );

    const deleteFolderCanvas = useCallback(
        async (values: any) => {
            try {
                // console.log(values, "sadsa");
                // Use the base URL and pass canvasInfoId as a query parameter
                const url = API_ROUTES.DELETE_FOLDER_CANVAS.replace(":id", values.id);
                const res = await callApi(HTTP_METHOD.DELETE, url, values);

                // toast.success(MESSAGE.DELETE_FOLDER_CANVAS_SUCCESSFULLY);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || MESSAGE.DELETE_FOLDER_CANVAS_FAILED);
            }
        },
        [callApi]
    );

    const newVersionCanvas = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(HTTP_METHOD.POST, API_ROUTES.NEW_VERSION_CANVAS, values);
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || MESSAGE.NEW_VERSION_CANVAS_FAILED);
            }
        },
        [callApi]
    );

    return {
        getCanvasHistory,
        postCanvas,
        putCanvas,
        deleteCanvas,
        copyCanvas,
        getFolderCanvas,
        postFolderCanvas,
        putFolderCanvas,
        deleteFolderCanvas,
        loading,
        setIsLoading,
        newVersionCanvas
    };
};

export default CanvasService;
export type { CreateCanvasRequest, UpdateCanvasRequest, GetCanvasRequest, CanvasResponse };
