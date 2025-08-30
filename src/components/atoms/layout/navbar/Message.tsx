"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { USER_ROUTES } from "@/routes/path";
import ChatService from "@/services/ChatService";
import { useCurrentUser } from "@/utils";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Message = () => {
  const { getRoomList } = ChatService();
  const currentUser = useCurrentUser();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
  }, [currentUser]);

  const fetchUnreadCount = async () => {
    try {
      const response = await getRoomList();
      if (
        response &&
        response.responseRequestModel &&
        response.responseRequestModel.chatRooms
      ) {
        const chatRooms = response.responseRequestModel.chatRooms;
        let count = 0;

        chatRooms.forEach((room: any) => {
          // Determine if current user is account1 or account2
          const isAccount1 = currentUser?.id === room.account1.accountID;
          const isAccount2 = currentUser?.id === room.account2.accountID;

          // Check if current user has unread messages
          if (isAccount1 && !room.account1IsRead) {
            count++;
          } else if (isAccount2 && !room.account2IsRead) {
            count++;
          }
        });
        setUnreadCount(count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  return (
    <Button variant="ghost" size="icon" className="hidden md:flex relative">
      <Link to={USER_ROUTES.CHAT}>
        <MessageSquare className="h-5 w-5" />
        <span className="sr-only">Chat</span>
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
};

export default Message;
