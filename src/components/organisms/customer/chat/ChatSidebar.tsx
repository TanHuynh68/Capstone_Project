import { Home, Moon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatButton from "@/components/atoms/customer/chat/ChatButton";
import ChatListItem from "@/components/molecules/customer/chat/ChatListItem";
import { useCurrentUser  } from "@/components/utils";
import { Link } from "react-router-dom";
import { USER_ROUTES } from "@/routes/path";

interface ChatSidebarProps {
  users: UserChat[];
  messages: Message[];
  activeChat: string;
  onSelectChat: (chatId: string) => void; // Specify the type for onSelectChat
}

export default function ChatSidebar({
  users,
  onSelectChat,
  messages,
}: ChatSidebarProps) {
  const userMain = useCurrentUser ();
  console.log("ChatSidebar_users: ", users);
  console.log("ChatSidebar_messages: ", messages);

  return (
    <div className="flex w-80 flex-col">
      <div className="flex items-center justify-between p-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold">Trò Chuyện</h1>
        <div className="flex gap-2">
          <Link to={USER_ROUTES.HOME_PAGE} aria-label="Home">
            <ChatButton>
              <Home className="h-5 w-5" />
            </ChatButton>
          </Link>
          <ChatButton aria-label="Toggle Dark Mode">
            <Moon className="h-5 w-5" />
          </ChatButton>
        </div>
      </div>

      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">
          Cuộc trò chuyện ({users?.length || 0})
        </h2>
      </div>

      <ScrollArea className="flex-1">
        {users?.length > 0 ? (
          users.map((user) => (
            <ChatListItem
              usersInChatSection={user}
              key={user.chatRoomID}
              id={user.chatRoomID}
              name={
                userMain.id !== user.account1.accountID
                  ? user.account1.accountName
                  : user.account2.accountName
              }
              avatar={
                userMain.id !== user.account1.accountID
                  ? user.account1.avatar
                  : user.account2.avatar
              }
              onClick={onSelectChat}
            />
          ))
        ) : (
          <div className="p-4 text-gray-500">Không có cuộc trò chuyện nào.</div>
        )}
      </ScrollArea>
    </div>
  );
}
