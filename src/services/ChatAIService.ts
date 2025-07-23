import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { toast } from "sonner";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const ChatAIService = () => {
    const { callApi } = useApiService();

    const postChatAI = useCallback(
        async (values: any) => {
            try {
                const res = await callApi(
                    HTTP_METHOD.POST,
                    API_ROUTES.POST_CHAT_AI,
                    values
                );
                console.log(res, "res");
                return res;
            } catch (err: any) {
                toast.error(err?.response?.data || "Đã xảy ra lỗi khi tải ảnh.");
            }
        },
        [callApi]
    );

    return { postChatAI };
};


export default ChatAIService;
