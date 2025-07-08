import { Info } from "lucide-react";
import ChatButton from "@/components/atoms/customer/chat/ChatButton";
import UserHeader from "@/components/molecules/customer/chat/UserHeader";
import { useCurrentUser } from "@/utils";

interface ChatHeaderProps {
  user?: UserChat[];
  setIsOpen: any;
}

export default function ChatHeader({ user, setIsOpen }: ChatHeaderProps) {
  if (!user) return null;
  const userMain = useCurrentUser();
  return (
    <div className="flex items-center justify-between border-b border-gray-200 p-2">
      <UserHeader
        name={
          userMain.id != user[0].account1.accountID
            ? user[0].account1.accountName
            : user[0].account2.accountName
        }
        avatar={userMain.id != user[0].account1.accountID
            ? user[0].account1.avatar
            : user[0].account2.avatar}
      />
      <div className="flex gap-1">
        <ChatButton onClick={setIsOpen}>
          <Info className="h-5 w-5" />
          <span className="sr-only">Thông tin</span>
        </ChatButton>
      </div>
    </div>
  );
}
