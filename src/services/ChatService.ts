import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const ChatService = () => {
  const { callApi} = useApiService();
  const getRoomList = useCallback(
    async () => {
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          API_ROUTES.GET_ROOMLIST
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

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

  return { getRoomList, getMessage, createChatRoom, createChat};
};

export default ChatService;
