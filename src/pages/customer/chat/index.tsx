"use client";

import { useEffect, useState } from "react";
import ChatTemplate from "@/components/templates/chat/ChatTemplate";
import ChatService from "@/services/ChatService";
import { reverseArray } from "@/components/utils";

const Chat = () => {
  const [chatRoomID, setChatRoomId] = useState<string>("");
  const [chats, setChats] = useState<Message[]>([]);
  const { getRoomList, getMessage, createChat } = ChatService();
  const [usersNeedToChat, setUsersNeedToChat] = useState<UserChat[]>([]);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Khi isChatOpen thay đổi, thay đổi overflow của body
  useEffect(() => {
    if (isChatOpen) {
      // Tắt scroll trang
      document.body.style.overflow = "hidden";
    } else {
      // Bật lại scroll trang
      document.body.style.overflow = "";
    }
    // Cleanup khi component unmount hoặc isChatOpen thay đổi
    return () => {
      document.body.style.overflow = "";
    };
  }, [isChatOpen]);

  useEffect(() => {
    getUsersNeedToChat();
  }, []);

  useEffect(() => {
    if (!chatRoomID) return;
    const interval = setInterval(() => {
      getMessageOfChat();
    }, 1000);

    return () => clearInterval(interval); // dọn dẹp khi chatRoomID thay đổi hoặc component unmount
  }, [chatRoomID]);
  console.log("chatRoomID: ", chatRoomID);
  //api
  const getUsersNeedToChat = async () => {
    const response = await getRoomList();
    if (response) {
      setUsersNeedToChat(response.responseRequestModel.chatRooms);
      console.log(
        "getUsersNeedToChat: ",
        response.responseRequestModel.chatRooms
      );
      setChatRoomId(response.responseRequestModel.chatRooms[0].chatRoomID);
    }
  };

  const getMessageOfChat = async () => {
    if (usersNeedToChat.length != 0) {
      const response = await getMessage(chatRoomID);
      if (response) {
        setIsChatOpen(true);
        const sortDes: Message[] = reverseArray(
          response.responseRequestModel.responseList.items
        );
        setChats(sortDes);
      }
    }
  };

  const handleSendMessage = async (values: any) => {
    setShouldScroll(true);
    console.log("values: ", values);
    const valuesSubmit = {
      roomChatID: chatRoomID,
      message: values,
      messageType: 0,
    };
    console.log("valuesSubmit: ", valuesSubmit);
    const response = await createChat(valuesSubmit);
    console.log("createChat: ", response);
    if (response) {
      getMessageOfChat();
      setTimeout(() => setShouldScroll(false), 100);
    }
  };

  return (
    <ChatTemplate
      setShouldScroll={setShouldScroll}
      shouldScrollToBottom={shouldScroll}
      message={chats}
      users={usersNeedToChat}
      chatRoomID={chatRoomID}
      onSelectChat={setChatRoomId}
      onSendMessage={handleSendMessage}
    />
  );
};
export default Chat;
