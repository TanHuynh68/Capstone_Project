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
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
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

  // useEffect(() => {
  //  if(chats.length != 0){
  //   setShouldScroll(true)
  //   setTimeout(()=>(setShouldScroll(false), 1000))
  //  }
  // }, [chats]);

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
    setLoadingMessage(false);
  };

  const handleSendMessage = async (values: any) => {
    setShouldScroll(true);
    const valuesSubmit = {
      roomChatID: chatRoomID,
      message: values,
      messageType: 0,
    };
    const response = await createChat(valuesSubmit);
    if (response) {
      getMessageOfChat();
      setTimeout(() => setShouldScroll(false), 100);
    }
  };

  return (
    <ChatTemplate
      loadingMessage={loadingMessage}
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
