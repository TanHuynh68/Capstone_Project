import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const ChatService = () => {
  const { callApi } = useApiService();
  const getRoomList = useCallback(async () => {
    try {
      const res = await callApi(HTTP_METHOD.GET, API_ROUTES.GET_ROOMLIST);
      return res;
    } catch (err: any) {
      console.error(err?.response?.data);
    }
  }, [callApi]);

  const getMessage = useCallback(
    async (chatRoomID: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          `${API_ROUTES.GET_MESSAGE}?chatRoomID=${chatRoomID}&page=1&size=100`
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const createChatRoom = useCallback(
    async (account2ID: string) => {
      try {
        const res = await callApi(
          HTTP_METHOD.POST,
          API_ROUTES.CREATE_CHAT_ROOM,
          account2ID
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const createChat = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.POST,
          API_ROUTES.CREATE_CHAT,
          values
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const uploadImageMessage = useCallback(
    async (file: any) => {
      const formData = new FormData();
      formData.append("ImageFile", file);

      try {
        console.log("ImageFile: ", file);
        const res = await callApi(
          HTTP_METHOD.POST,
          API_ROUTES.CHAT_UPLOAD_IMAGE,
          formData
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );
  const updateMessage = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.PUT,
          API_ROUTES.UPDATE_MESSAGE_CHAT,
          values
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );
  const deleteMessage = useCallback(
    async (messageID: string) => {
      try {
        const res = await callApi(
          HTTP_METHOD.DELETE,
          `${API_ROUTES.DELETE_MESSAGE_CHAT}?messageID=${messageID}`,
          messageID
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  return {
    getRoomList,
    getMessage,
    createChatRoom,
    createChat,
    updateMessage,
    deleteMessage,
    uploadImageMessage,
  };
};

export default ChatService;
