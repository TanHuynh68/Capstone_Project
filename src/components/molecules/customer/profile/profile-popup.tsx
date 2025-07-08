import { useCurrentUser } from "@/utils";
import { PATH } from "@/routes/path";
import ChatService from "@/services/ChatService";
import { useNavigate } from "react-router-dom";

interface ProfilePopupProps {
  fullName: string;
  avatar?: string;
  location?: string;
  appreciations?: string | number;
  followers?: string | number;
  views?: string | number;
  designerID: string;
}

export function ProfilePopup({
  designerID,
  fullName,
  avatar,
  location = "Vietnam",
  appreciations = "51.6K",
  followers = "12.8K",
  views = "527.4K",
}: ProfilePopupProps) {
  const { createChatRoom } = ChatService();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const createChatRoomByCustomer = async () => {
    console.log("designerID: ", designerID);
    const response = await createChatRoom(designerID);
    console.log("createChatRoom: ", response);
    if (response) {
      navigate(PATH.CHAT_PAGE);
    }
  };

  const handleViewProfile = () => {
    navigate(PATH.DESIGNER_PORTFOLIO_PAGE.replace(":id", designerID));
  };

  return (
    <div className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-1 w-[300px] bg-popover text-popover-foreground rounded-2xl shadow-xl p-4 border border-border opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-top pointer-events-none group-hover:pointer-events-auto">
      {/* Top images */}
      <div className="grid grid-cols-3 gap-1 mb-3 overflow-hidden rounded">
        <img
          src={"/images/labubu-3.png"}
          alt="ảnh giới thiệu"
          className="w-full h-[60px] object-contain"
        />
        <img
          src={"/images/labubu-4.png"}
          alt="ảnh giới thiệu"
          className="w-full h-[60px] object-contain"
        />
        <img
          src={"/images/labubu-5.png"}
          alt="ảnh giới thiệu"
          className="w-full h-[60px] object-contain"
        />
      </div>

      {/* Avatar and info */}
      <div className="flex flex-col items-center text-center mb-3">
        <img
          src={avatar || "/unknown-user.png"}
          alt={fullName}
          className="w-16 h-16 rounded-full border-2 border-background -mt-8 shadow-md"
        />
        <div className="font-semibold text-base mt-2">{fullName}</div>
        <div className="text-sm text-muted-foreground">{location}</div>
        <span className="mt-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
          Freelance
        </span>
      </div>

      {/* Stats */}
      <div className="flex justify-center text-center text-sm text-muted-foreground mb-4">
        {[
          { label: "Yêu thích", value: appreciations },
          { label: "Theo dõi", value: followers },
          { label: "Lượt xem", value: views },
        ].map((item, index, array) => (
          <div
            key={index}
            className={`relative px-4 ${
              index !== array.length - 1
                ? "after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-px after:h-5 after:bg-border"
                : ""
            }`}
          >
            <div className="font-semibold text-foreground">{item.value}</div>
            <div className="text-xs">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleViewProfile}
          className="flex-1 border border-border text-sm rounded-full py-1.5 font-medium text-primary hover:bg-accent/5 dark:hover:bg-accent/10 transition-colors"
        >
          Hồ sơ
        </button>
        {user?.id != designerID && (
          <button
            onClick={createChatRoomByCustomer}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-1.5 rounded-full text-sm font-semibold transition-colors"
          >
            Nhắn tin
          </button>
        )}
      </div>

      {/* Dropdown triangle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-4 h-4 rotate-45 bg-popover border-l border-t border-border"></div>
    </div>
  );
}
