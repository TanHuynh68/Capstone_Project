import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { logout } from "@/redux/userSlice";
import { USER_ROUTES } from "@/routes/path";
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

const UserOption = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
        <DropdownMenuItem>
          <Link to={USER_ROUTES.PROFILE} className="w-full">
            Hồ sơ
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/orders" className="w-full">
            Đơn đặt hàng
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/settings" className="w-full">
            Cài đặt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to={USER_ROUTES.DEPOSIT_MONEY} className="w-full">
            Ví
          </Link>
        </DropdownMenuItem>
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
