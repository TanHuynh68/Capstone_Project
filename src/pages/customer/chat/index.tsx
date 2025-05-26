"use client";

import { useEffect, useState, useRef } from "react";
import ChatTemplate from "@/components/templates/chat/ChatTemplate";
import ChatService from "@/services/ChatService";
import { detectInputType, reverseArray } from "@/components/utils";
import {
  HubConnectionBuilder,
  LogLevel,
  type HubConnection,
} from "@microsoft/signalr";

const Chat = () => {
  const [chatRoomID, setChatRoomId] = useState<string>("");
  const [chats, setChats] = useState<Message[]>([]);
  const { getRoomList, getMessage, createChat } = ChatService();
  const [usersNeedToChat, setUsersNeedToChat] = useState<UserChat[]>([]);
  const [shouldScroll, setShouldScroll] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Disconnected");

  // Sử dụng useRef để lưu trữ connection
  const connectionRef = useRef<HubConnection | null>(null);
  const currentRoomRef = useRef<string>("");

  // Kết nối SignalR khi component mount
  useEffect(() => {
    connectToChatHub();
    getUsersNeedToChat();

    // Cleanup khi component unmount
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
      document.body.style.overflow = "";
    };
  }, []);

  // Xử lý khi chatRoomID thay đổi
  useEffect(() => {
    console.log("chatRoomID: ");
    console.log("connectionRef.current?.state: ");
    if (chatRoomID != "") {
      joinChatRoom(chatRoomID);
      getMessageOfChat();
    }
  }, [chatRoomID]);

  // Xử lý overflow body khi chat mở/đóng
  useEffect(() => {
    if (isChatOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isChatOpen]);

  // Kết nối tới ChatHub
  const connectToChatHub = async () => {
    try {
      const token = localStorage.getItem("token") || "";

      if (!token) {
        console.error("Không tìm thấy token");
        return;
      }

      const connection = new HubConnectionBuilder()
        .withUrl("https://pdcbackendapi.tlog.website/chatHub", {
          accessTokenFactory: () => token,
        })
        .withAutomaticReconnect([0, 2000, 10000, 30000]) // Tự động kết nối lại
        .configureLogging(LogLevel.Information)
        .build();

      // Xử lý các sự kiện connection
      connection.onclose((error) => {
        console.log("❌ SignalR connection closed:", error);
        setConnectionStatus("Disconnected");
      });

      connection.onreconnecting((error) => {
        console.log("🔄 SignalR reconnecting:", error);
        setConnectionStatus("Reconnecting");
      });

      connection.onreconnected((connectionId) => {
        console.log("✅ SignalR reconnected:", connectionId);
        setConnectionStatus("Connected");
        // Rejoin room nếu có
        if (currentRoomRef.current) {
          joinChatRoom(currentRoomRef.current);
        }
      });
      setShouldScroll(true);
      // Lắng nghe tin nhắn mới
      connection.on("ReceiveMessage", (message: any) => {
        console.log("📨 Received message:", message);
        // Cập nhật tin nhắn realtime
        setChats((prevChats) => {
          return prevChats;
        });

        setTimeout(() => setShouldScroll(false), 200);
      });

      // Lắng nghe khi user join room
      connection.on("UserJoinedRoom", (roomId: string, userId: string) => {
        console.log(`👤 User ${userId} joined room ${roomId}`);
      });

      // Lắng nghe khi user leave room
      connection.on("UserLeftRoom", (roomId: string, userId: string) => {
        console.log(`👋 User ${userId} left room ${roomId}`);
      });

      // Lắng nghe lỗi
      connection.on("Error", (error: string) => {
        console.error("❌ SignalR Error:", error);
      });

      // Bắt đầu kết nối
      await connection.start();
      console.log("✅ SignalR Connected successfully");
      setConnectionStatus("Connected");

      connectionRef.current = connection;
    } catch (error) {
      console.error("❌ Error connecting to SignalR:", error);
      setConnectionStatus("Failed");
    }
  };

  // Join vào room chat
  const joinChatRoom = async (roomId: string) => {
    if (!connectionRef.current || connectionRef.current.state !== "Connected") {
      console.warn("SignalR connection not ready");
      return;
    }

    try {
      // Leave room cũ nếu có
      if (currentRoomRef.current && currentRoomRef.current !== roomId) {
        await connectionRef.current.invoke("LeaveRoom", currentRoomRef.current);
        console.log(`👋 Left room: ${currentRoomRef.current}`);
      }

      // Join room mới
      await connectionRef.current.invoke("JoinRoom", roomId);
      console.log(`👤 Joined room: ${roomId}`);
      currentRoomRef.current = roomId;
    } catch (error) {
      console.error("❌ Error joining room:", error);
    }
  };

  // Lấy danh sách user cần chat
  const getUsersNeedToChat = async () => {
    try {
      const response = await getRoomList();
      if (response) {
        setUsersNeedToChat(response.responseRequestModel.chatRooms);
        // Tự động chọn room đầu tiên nếu có
        if (response.responseRequestModel.chatRooms.length > 0) {
          setChatRoomId(response.responseRequestModel.chatRooms[0].chatRoomID);
          console.log(
            "getUsersNeedToChat: ",
            response.responseRequestModel.chatRooms[0].chatRoomID
          );
        }
      }
    } catch (error) {
      console.error("Error getting chat rooms:", error);
    }
  };

  // Lấy tin nhắn của room
  const getMessageOfChat = async () => {
    if (usersNeedToChat.length === 0 || !chatRoomID) return;

    try {
      setLoadingMessage(true);
      const response = await getMessage(chatRoomID);
      if (response) {
        setIsChatOpen(true);
        const sortedMessages: Message[] = reverseArray(
          response.responseRequestModel.responseList.items
        );
        setChats(sortedMessages);
      }
    } catch (error) {
      console.error("Error getting messages:", error);
    } finally {
      setLoadingMessage(false);
    }
  };

  // Gửi tin nhắn qua SignalR
  const handleSendMessage = async (messageContent: string) => {
    setShouldScroll(true);
    if (!connectionRef.current || connectionRef.current.state !== "Connected") {
      console.warn("SignalR connection not ready");
      return;
    }

    if (!chatRoomID || !messageContent.trim()) {
      console.warn("Missing chatRoomID or message content");
      return;
    }

    try {
      // Detect message type
      const msgTypeNumber = detectInputType(messageContent);

      const messageData = {
        RoomChatID: chatRoomID,
        Message: messageContent.trim(),
        MessageType: msgTypeNumber,
      };

      console.log("📤 Sending message:", messageData);

      // Gửi tin nhắn qua SignalR
      await connectionRef.current.invoke("SendMessage", messageData);
    } catch (error) {
      console.error("❌ Error sending message:", error);

      // Fallback: nếu SignalR fail thì dùng API
      try {
        const response = await createChat({
          RoomChatID: chatRoomID,
          Message: messageContent.trim(),
          MessageType: detectInputType(messageContent),
        });

        if (response) {
          getMessageOfChat();
          setShouldScroll(false);
        }
      } catch (apiError) {
        console.error("❌ API fallback also failed:", apiError);
      }
    }
  };

  // Xử lý khi chọn chat room khác
  const handleSelectChat = (newChatRoomID: string) => {
    setChatRoomId(newChatRoomID);
  };

  return (
    <div className="h-screen w-full">
      {/* Hiển thị trạng thái kết nối */}

      <ChatTemplate
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
