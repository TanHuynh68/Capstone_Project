import { Home, Moon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatButton from "@/components/atoms/customer/chat/ChatButton";
import ChatListItem from "@/components/molecules/customer/chat/ChatListItem";
import { useCurrentUser } from "@/components/utils";
import { Link } from "react-router-dom";
import { USER_ROUTES } from "@/routes/path";

interface ChatSidebarProps {
  users: UserChat[];
  messages: Message[];
  activeChat: string;
  onSelectChat: any;
}

export default function ChatSidebar({ users, onSelectChat }: ChatSidebarProps) {
  const userMain = useCurrentUser();
  console.log("users: ", users);
  return (
    <div className="flex w-80 flex-col">
      <div className="flex items-center justify-between  p-4 sticky top-0 z-10 ">
        <h1 className="text-xl font-bold text-indigo-400">Trò Chuyện</h1>
        <div className="flex gap-2">
          <Link to={USER_ROUTES.HOME_PAGE}>
            <ChatButton>
              <Home className="h-5 w-5" />
            </ChatButton>
          </Link>
          <ChatButton>
            <Moon className="h-5 w-5" />
          </ChatButton>
        </div>
      </div>

      <div className="flex items-center justify-between p-4">
        <h2 className="text-lg font-semibold">
          Cuộc trò chuyện ({users?.length})
        </h2>
      </div>

      <ScrollArea className="flex-1">
        {users?.map((user) => {
          return (
            <ChatListItem
              lastMessage={""}
              key={user.chatRoomID}
              id={user.chatRoomID}
              name={
                userMain.id != user.account1.accountID
                  ? user.account1.accountName
                  : user.account2.accountName
              }
              avatar={
                userMain.id != user.account1.accountID ? user.account1.avatar : user.account2.avatar
              }
              onClick={onSelectChat}
            />
          );
        })}
      </ScrollArea>
    </div>
  );
}
