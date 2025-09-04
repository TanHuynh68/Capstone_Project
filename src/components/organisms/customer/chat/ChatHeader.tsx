import { Info } from "lucide-react";
import ChatButton from "@/components/atoms/customer/chat/ChatButton";
import UserHeader from "@/components/molecules/customer/chat/UserHeader";
import { useCurrentUser } from "@/utils";
import { useNavigate } from "react-router-dom";
import { PATH } from "@/routes/path";
import { ROLE } from "@/constants";

interface ChatHeaderProps {
  user?: UserChat[];
  setIsOpen: () => void;
}

export default function ChatHeader({ user, setIsOpen }: ChatHeaderProps) {
  const navigate = useNavigate();
  const userMain = useCurrentUser();
  if (!user) return null;
  console.log("user: ", user);

  const handleNavigateToPortfolio = (id: string) => {
    if (id) {
      navigate(`${PATH.PORTFOLIO}/${id}`);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-200 p-2 ">
        <div
          className="cursor-pointer"
          onClick={() => {
            if (userMain.role !== ROLE.CUSTOMER) {
              navigate(PATH.PORTFOLIO);
              return;
            }
            const otherParticipant =
              user[0].account1.accountID !== userMain.id
                ? user[0].account1
                : user[0].account2;
            const designerId =
              otherParticipant.role === ROLE.DESIGNER ? otherParticipant.accountID : "";
            handleNavigateToPortfolio(designerId);
          }}
        >
          <UserHeader
            name={
              userMain.id != user[0].account1.accountID
                ? user[0].account1.accountName
                : user[0].account2.accountName
            }
            role={
              userMain.id != user[0].account1.accountID
                ? user[0].account1.role
                : user[0].account2.role
            }
            avatar={
              userMain.id != user[0].account1.accountID
                ? user[0].account1.avatar
                : user[0].account2.avatar
            }
          />
        </div>
        <div className="flex gap-1">
          <ChatButton onClick={setIsOpen}>
            <Info className="h-5 w-5 text-primary" />
            <span className="sr-only">Thông tin</span>
          </ChatButton>
        </div>
      </div>
    </>
  );
}
