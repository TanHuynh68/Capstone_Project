"use client";

import { useEffect, useRef, useState } from "react";
import ChatTemplate from "@/components/templates/chat/ChatTemplate";
import ChatService from "@/services/ChatService";
import OfferService from "@/services/OfferService";
import { detectInputType, reverseArray, useCurrentUser } from "@/utils";
import {
  type HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import axiosInstance from "@/config/axios";
import { toast } from "sonner";
import { MESSAGE, ROLE } from "@/constants";
import { useStateValue } from "@/context/stateProvider";

const Chat = () => {
  const { deleteMessage, updateMessage } = ChatService();
  const [chatRoomID, setChatRoomId] = useState<string>("");
  const [chats, setChats] = useState<Message[]>([]);
  const [usersNeedToChat, setUsersNeedToChat] = useState<UserChat[]>([]);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
  const { getRoomList, getMessage, createChat } = ChatService();
  const { offerFind, getOfferPhase } = OfferService();
  const [posts, setPosts] = useState<OfferDetail[]>([]);
  const connectionRef = useRef<HubConnection | null>(null);
  const [offersPhase, setOffersPhase] = useState<OfferPhase[]>([]);
  const userMain = useCurrentUser();

  // ✅ Lấy idRoomChat từ context
  const { idRoomChat, setIdRoomChat } = useStateValue();

  // ✅ Khi idRoomChat từ context thay đổi -> set vào chatRoomID
  useEffect(() => {
    if (idRoomChat) {
      console.log('idRoomChat: ', idRoomChat)
      setChatRoomId(idRoomChat);
      setIdRoomChat(""); // reset lại để tránh lần sau tự động nhảy
    }
  }, [idRoomChat, setIdRoomChat]);

  const fetchOfferPhase = async (offerID: string) => {
    const response = await getOfferPhase(offerID);
    if (response) {
      setOffersPhase(response.responseRequestModel.responseList);
    }
  };

  useEffect(() => {
    if (usersNeedToChat.length !== 0) {
      fetchOffers();
    }
  }, [usersNeedToChat]);

  useEffect(() => {
    fetchOffers();
  }, [chatRoomID]);

  const fetchOffers = async () => {
    if (userMain?.role === ROLE.CUSTOMER) {
      const user = usersNeedToChat.find(
        (item) => item.chatRoomID === chatRoomID
      );
      if (!user) return;

      const response = await offerFind({
        customerID: userMain?.id,
        designerID:
          userMain?.id !== user.account1.accountID
            ? user.account1.accountID
            : user.account2.accountID,
      });

      if (response?.responseRequestModel?.responseList) {
        setPosts(response.responseRequestModel.responseList);
      } else {
        setPosts([]);
      }
    } else {
      const user = usersNeedToChat.find(
        (item) => item.chatRoomID === chatRoomID
      );
      if (!user) return;

      const response = await offerFind({
        customerID:
          userMain?.id !== user.account1.accountID
            ? user.account1.accountID
            : user.account2.accountID,
        designerID: userMain?.id,
      });

      if (response?.responseRequestModel?.responseList) {
        setPosts(response.responseRequestModel.responseList);
      } else {
        setPosts([]);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        console.log("🔌 Ngắt kết nối SignalR khi unmount");
      }
    };
  }, []);

  useEffect(() => {
    getUsersNeedToChat();
  }, []);

  useEffect(() => {
    if (chatRoomID) {
      initChatHub(chatRoomID);
    }
  }, [chatRoomID]);

  const initChatHub = async (roomId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ Không tìm thấy token");
      return;
    }

    if (connectionRef.current) {
      await connectionRef.current.stop();
      console.log("🔁 Ngắt kết nối cũ trước khi tạo kết nối mới");
    }

    const connection = new HubConnectionBuilder()
      .withUrl("https://pdcbackendapi.tlog.website/chatHub", {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    connection.on("ReceiveMessage", async () => {
      if (roomId) {
        await getMessageOfChat(roomId);
        await getUsersNeedToChat();
      }
    });

    try {
      await connection.start();
      connectionRef.current = connection;
      await joinChatRoom(roomId);
    } catch (error) {
      console.error("❌ Lỗi kết nối SignalR:", error);
    }
  };

  const joinChatRoom = async (roomId: string) => {
    try {
      await axiosInstance.post(
        `https://pdcbackendapi.tlog.website/api/v1/chat`,
        {
          roomChatID: roomId,
          message: "[JOIN_ROOM]",
          messageType: 0,
        }
      );
      await getMessageOfChat(roomId);
    } catch (error) {
      console.error("❌ Lỗi khi join room:", error);
    }
  };

  const getUsersNeedToChat = async () => {
  try {
    const response = await getRoomList();
    const rooms = response?.responseRequestModel?.chatRooms ?? [];

    const sortedRooms = rooms.sort((a: UserChat, b: UserChat) => {
      if (a.updatedAt && b.updatedAt) {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      }
      return 0;
    });

    setUsersNeedToChat(sortedRooms);

    // ✅ Chỉ set phòng mặc định nếu KHÔNG có idRoomChat từ context
    if (sortedRooms.length > 0 && !chatRoomID && !idRoomChat) {
      setChatRoomId(sortedRooms[0].chatRoomID);
    }
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách chat:", error);
  }
};


  const getMessageOfChat = async (roomId: string) => {
    if (!roomId) return;

    try {
      setShouldScroll(true);
      const response = await getMessage(roomId);
      const messages =
        response?.responseRequestModel?.responseList?.items ?? [];
      const sortedMessages: Message[] = reverseArray(messages);
      setChats(sortedMessages);
    } catch (error) {
      console.error("❌ Lỗi lấy tin nhắn:", error);
    } finally {
      setLoadingMessage(false);
    }
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!chatRoomID || !messageContent.trim()) return;

    try {
      const msgTypeNumber = detectInputType(messageContent);

      const messageData = {
        roomChatID: chatRoomID,
        message: messageContent.trim(),
        messageType: msgTypeNumber,
      };

      const response = await createChat(messageData);

      if (response) {
        await Promise.all([getMessageOfChat(chatRoomID), getUsersNeedToChat()]);
      }
    } catch (error) {
      console.error("❌ Lỗi gửi tin nhắn:", error);
    }
  };

  const handleSelectChat = async (newChatRoomID: string) => {
    if (newChatRoomID === chatRoomID) return;
    setChatRoomId(newChatRoomID);
  };

  const handleDeleteMessage = async (messageID: string) => {
    const response = await deleteMessage(messageID);
    if (response) {
      await getMessageOfChat(chatRoomID);
      toast.success(MESSAGE.DELETE_MESSAGE_SUCCESSFULLY);
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    const response = await updateMessage({
      messageID: messageId,
      content: newContent,
    });

    if (response) {
      await getMessageOfChat(chatRoomID);
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <ChatTemplate
        fetchOffers={fetchOffers}
        offersPhase={offersPhase}
        fetchOfferPhase={fetchOfferPhase}
        setOffersPhase={setOffersPhase}
        posts={posts}
        onDeletMessage={handleDeleteMessage}
        onEditMessage={handleEditMessage}
        loadingMessage={loadingMessage}
        setShouldScroll={setShouldScroll}
        shouldScrollToBottom={shouldScroll}
        message={chats}
        users={usersNeedToChat}
        chatRoomID={chatRoomID}
        onSelectChat={handleSelectChat}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Chat;
