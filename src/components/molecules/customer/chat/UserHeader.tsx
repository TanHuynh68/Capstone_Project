import ChatAvatar from "@/components/atoms/customer/chat/ChatAvatar";
import { ROLE } from "@/constants";

interface UserHeaderProps {
  name: string;
  avatar: string;
  color?: string;
  role: string;
}

export default function UserHeader({
  name,
  avatar,
  color,
  role,
}: UserHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <ChatAvatar size="sm" src={avatar} name={name} color={color} />
      <div>
        <div className="font-medium">{name} {role === ROLE.CUSTOMER ? '(Khách hàng)' : '(Nhà thiết kế)'}</div>
      </div>
    </div>
  );
}
