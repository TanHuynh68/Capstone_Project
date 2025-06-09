import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/redux/userSlice";
import { DESIGNER_ROUTES, USER_ROUTES } from "@/routes/path";
import { User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/components/utils";
import { ROLE } from "@/constants";

const UserOption = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useCurrentUser();

  const handleNavigateToProfile = (tab?: string) => {
    navigate(`/${USER_ROUTES.PROFILE}`, {
      state: { activeTab: tab },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-50">
        <DropdownMenuItem onClick={() => handleNavigateToProfile("profile")}>
          <span className="w-full cursor-pointer">Hồ sơ</span>
        </DropdownMenuItem>
        {user.role === ROLE.DESIGNER && (
          <DropdownMenuItem>
            <Link to={DESIGNER_ROUTES.PORTFOLIO} className="w-full">
              Thiết kế của tôi
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleNavigateToProfile("orders")}>
          <span className="w-full cursor-pointer">Lịch sử đơn hàng</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigateToProfile("requests")}>
          <span className="w-full cursor-pointer">Lịch sử đặt hàng</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to={USER_ROUTES.DEPOSIT_MONEY} className="w-full">
            Ví
          </Link>
        </DropdownMenuItem>
        {user.role === ROLE.CUSTOMER && (
          <DropdownMenuItem>
            <Link to={USER_ROUTES.MY_POST_PAGE} className="w-full">
              Bài đăng của tôi
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => {
            dispatch(logout());
            navigate("/auth/login");
          }}
        >
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserOption;
