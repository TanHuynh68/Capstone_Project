import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/redux/userSlice";
import { DESIGNER_ROUTES, USER_ROUTES } from "@/routes/path";
import {
  User,
  User as UserIcon,
  Palette,
  Wallet,
  LogOut,
  Newspaper,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/utils";
import { ROLE } from "@/constants";
import { useImageCurrentUser } from "@/utils/helpers/helpers";

const menuItemClass =
  "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground text-sm font-medium transition w-full text-foreground";

const iconClass = "h-4 w-4 text-muted-foreground flex-shrink-0";

const UserOption = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useCurrentUser();

  const handleNavigateToProfile = (tab?: string) => {
    navigate(`/${USER_ROUTES.PROFILE}`, {
      state: { activeTab: tab },
    });
  };

  const avatar = useImageCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatar} alt="User" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-36 z-50 px-2 py-2 rounded-xl shadow-lg bg-popover text-popover-foreground border border-border">
        <DropdownMenuItem
          onClick={() => handleNavigateToProfile("profile")}
          className={menuItemClass}
        >
          <UserIcon className={iconClass} />
          <span>Thông tin</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate(USER_ROUTES.MY_WALLET)}
          className={menuItemClass}
        >
          <Wallet className={iconClass} />
          <span>Ví của tôi</span>

        </DropdownMenuItem>

        {user.role === ROLE.CUSTOMER && (
          <DropdownMenuItem
            onClick={() => navigate(USER_ROUTES.MY_POST_PAGE)}
            className={menuItemClass}
          >
            <Newspaper className={iconClass} />
            <span>Bài đăng</span>
          </DropdownMenuItem>
        )}

        {user.role === ROLE.DESIGNER && (
          <DropdownMenuItem
            onClick={() => navigate(DESIGNER_ROUTES.PORTFOLIO)}
            className={menuItemClass}
          >
            <Palette className={iconClass} />
            <span>Thiết kế</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={() => handleNavigateToProfile("orders")}
          className={menuItemClass}
        >
          <ShoppingBag className={iconClass} />
          <span>Đơn hàng</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleNavigateToProfile("delivery")}
          className={menuItemClass}
        >
          <Truck className={iconClass} />
          <span>Giao hàng</span>
        </DropdownMenuItem>

        <div className="my-1 border-t border-border" />

        <DropdownMenuItem
          onClick={() => {
            dispatch(logout());
            navigate("/auth/login");
          }}
          className={menuItemClass}
        >
          <LogOut className={iconClass} />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserOption;
