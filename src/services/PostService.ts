import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const PostService = () => {
    const { callApi } = useApiService();
    const createPost = useCallback(
        async (data: any) => {
            const formData = new FormData();
            formData.append("Title", data.Title);
            formData.append("Description", data.Description);
            formData.append("ItemValue", String(data.ItemValue));
            formData.append("SuggestedPrice", String(data.SuggestedPrice));
            formData.append("AttachmentFile", data.AttachmentFile);
            formData.append("AttachmentFiles", data.AttachmentFiles);
            console.log('formData: ', formData)
            try {
                const res = await callApi(
                    HTTP_METHOD.POST,
                    API_ROUTES.CREATE_POST,
                    formData
                );
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data);
            }
        },
        [callApi]
    );

    return { createPost };
};

export default PostService;
