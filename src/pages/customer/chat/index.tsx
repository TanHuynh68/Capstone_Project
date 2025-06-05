"use client";

import { useEffect, useRef, useState } from "react";
import ChatTemplate from "@/components/templates/chat/ChatTemplate";
import ChatService from "@/services/ChatService";
import {
  detectInputType,
  reverseArray,
  useCurrentUser,
} from "@/components/utils";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import axiosInstance from "@/config/axios";
import { toast } from "sonner";
import { MESSAGE, ROLE } from "@/constants";
import OfferService from "@/services/OfferService";

const Chat = () => {
  const { deleteMessage, updateMessage } = ChatService();
  const [chatRoomID, setChatRoomId] = useState<string>("");
  const [chats, setChats] = useState<Message[]>([]);
  const [usersNeedToChat, setUsersNeedToChat] = useState<UserChat[]>([]);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
  const { getRoomList, getMessage, createChat } = ChatService();
  const { offerFind } = OfferService();
  const [posts, setPosts] = useState<OfferDetail[]>([]);
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    if (usersNeedToChat.length != 0) {
      fetchOffers();
    }
  }, [usersNeedToChat]);

  useEffect(() => {
    fetchOffers();
    console.log("fetchOffers");
  }, [chatRoomID]);

  const userMain = useCurrentUser();

  const fetchOffers = async () => {
    if (userMain?.role === ROLE.CUSTOMER) {
      //tìm user  đang chat
      let user = usersNeedToChat.filter(
        (item) => item.chatRoomID === chatRoomID
      )[0];
      console.log("run");
      const response = await offerFind({
        customerID: userMain?.id,
        // nếu khác customer thì là desginer
        designerID:
          userMain?.id != user.account1.accountID
            ? user.account1.accountID
            : user.account2.accountID,
      });
      if (response && response.responseRequestModel.responseList) {
        console.log("usersNeedToChat: ", usersNeedToChat);
        console.log("response: ", response.responseRequestModel.responseList);
        setPosts(response.responseRequestModel.responseList);
      }else {
        setPosts([]);
      }
      // nếu là role là designer
    } else {
      //tìm user  đang chat
      let user = usersNeedToChat.filter(
        (item) => item.chatRoomID === chatRoomID
      )[0];
      const response = await offerFind({
        // nếu bằng nhau là designer, khác nhau thì là customer
        customerID:
          userMain?.id != user.account1.accountID
            ? user.account1.accountID
            : user.account2.accountID,
        // nếu khác  customer thì là desginer
        designerID: userMain?.id,
      });
      if (response && response.responseRequestModel.responseList) {
        setPosts(response.responseRequestModel.responseList);
        console.log("response2: ", response.responseRequestModel.responseList);
      } else {
        setPosts([]);
      }
    }
  };
  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        console.log("🔌 Ngắt kết nối SignalR khi unmount");
      }
    };
  }, []);

  // Lấy danh sách người cần chat
  useEffect(() => {
    getUsersNeedToChat();
  }, []);

  // Khi chatRoomID thay đổi → kết nối lại và tham gia phòng mới
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

    // Ngắt kết nối cũ nếu có
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
      console.log("📩 Nhận sự kiện ReceiveMessage");
      if (roomId) {
        await getMessageOfChat(roomId);
      }
    });

    try {
      await connection.start();
      console.log("✅ Kết nối SignalR thành công");
      connectionRef.current = connection;
      await joinChatRoom(roomId);
    } catch (error) {
      console.error("❌ Lỗi kết nối SignalR:", error);
    }
  };

  // Tham gia phòng chat
  const joinChatRoom = async (roomId: string) => {
    try {
      console.log("🚪 Tham gia phòng:", roomId);
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

  // Lấy danh sách user cần chat
  const getUsersNeedToChat = async () => {
    try {
      const response = await getRoomList();
      const rooms = response?.responseRequestModel?.chatRooms ?? [];
      setUsersNeedToChat(rooms);
      if (rooms.length > 0) {
        setChatRoomId(rooms[0].chatRoomID); // auto chọn room đầu
      }
    } catch (error) {
      console.error("❌ Lỗi lấy danh sách chat:", error);
    }
  };

  // Lấy tin nhắn theo phòng
  const getMessageOfChat = async (roomId: string) => {
    if (!roomId) return;
    try {
      setShouldScroll(true);
      const response = await getMessage(roomId);
      const messages =
        response?.responseRequestModel?.responseList?.items ?? [];
      const sortedMessages: Message[] = reverseArray(messages);
      setChats(sortedMessages);
      // setIsChatOpen(true);
    } catch (error) {
      console.error("❌ Lỗi lấy tin nhắn:", error);
    } finally {
      setLoadingMessage(false);
    }
  };

  // Gửi tin nhắn
  const handleSendMessage = async (messageContent: string) => {
    console.log("messageContent: ", messageContent);
    console.log("chatRoomID: ", chatRoomID);
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
        await getMessageOfChat(chatRoomID);
      }
    } catch (error) {
      console.error("❌ Lỗi gửi tin nhắn:", error);
    }
  };

  // Chọn người cần chat
  const handleSelectChat = async (newChatRoomID: string) => {
    if (newChatRoomID === chatRoomID) return;
    // fettch offer when select other user

    console.log("🧑‍💬 Chọn người chat:", newChatRoomID);
    setChatRoomId(newChatRoomID);
  };

  //
  const handleDeleteMessage = async (messageID: string) => {
    console.log("messageID: ", messageID);
    const response = await deleteMessage(messageID);
    console.log("handleDeleteMessage: ", response);
    if (response) {
      await getMessageOfChat(chatRoomID);
      toast.success(MESSAGE.DELETE_MESSAGE_SUCCESSFULLY);
    }
  };

  // Xử lý chỉnh sửa tin nhắn
  const handleEditMessage = async (messageId: string, newContent: string) => {
    console.log("handleEditMessage: ", {
      messageID: messageId,
      content: newContent,
    });
    const response = await updateMessage({
      messageID: messageId,
      content: newContent,
    });
    console.log("response", response);
    if (response) {
      await getMessageOfChat(chatRoomID);
    }
  };
  return (
    <div className="h-screen w-full">
      <ChatTemplate
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
