"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Bell, Trophy, ShoppingBag, Eye } from "lucide-react";
import CreateNotificationDialog from "../notifications/CreateNotificationDialog";
import ViewReputationDialog from "../reputation/ViewReputationDialog";
import ChangeActiveUserButton from "@/pages/staff/manage-users/change-active-user";
import { useNavigate } from "react-router-dom";

interface User {
  accountID: string;
  fullName: string;
  email: string;
  isActive: boolean;
}

interface UserActionsDropdownProps {
  user: User;
  onSuccess: () => void;
  onCreateNotification: (data: { accountID: string; tille: string; message: string; redirectLink?: string }) => Promise<boolean>;
}

export default function UserActionsDropdown({
  user,
  onSuccess,
  onCreateNotification,
}: UserActionsDropdownProps) {
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [reputationDialogOpen, setReputationDialogOpen] = useState(false);
  const navigate = useNavigate();
  console.log('user: ', user)
  const handleViewOrders = () => {
    // Navigate to staff orders page with user's accountID as query parameter
    navigate(
      `/staff/${user.accountID}/orders`
    );
  };

  const handleViewDeliveries = () => {
    // Navigate to staff orders page with user's accountID as query parameter
    navigate(
      `/staff/${user.accountID}/deliveries`
    );
  };

  const handleViewUserDetails = () => {
    // Navigate to user details page
    navigate(
      `/staff/${user.accountID}/details`
    );
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={handleViewUserDetails}
            className="cursor-pointer"
          >
            <Eye className="h-4 w-4 mr-2" />
            Xem chi tiết
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleViewDeliveries}
            className="cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Xem giao hàng
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleViewOrders}
            className="cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Xem đơn hàng
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setReputationDialogOpen(true)}
            className="cursor-pointer"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Xem quyền lợi
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setNotificationDialogOpen(true)}
            className="cursor-pointer"
          >
            <Bell className="h-4 w-4 mr-2" />
            Tạo thông báo
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="">
            {/* Change active account */}
            <ChangeActiveUserButton
              accountID={user.accountID}
              isActive={user.isActive}
              onSuccess={onSuccess}
            />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateNotificationDialog
        isOpen={notificationDialogOpen}
        onClose={() => setNotificationDialogOpen(false)}
        user={user}
        onSubmit={onCreateNotification}
      />

      <ViewReputationDialog
        isOpen={reputationDialogOpen}
        onClose={() => setReputationDialogOpen(false)}
        accountID={user.accountID}
        accountName={user.fullName}
      />
    </>
  );
}
