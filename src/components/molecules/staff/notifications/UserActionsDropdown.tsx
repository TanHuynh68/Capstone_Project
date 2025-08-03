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
import { MoreHorizontal, Bell } from "lucide-react";
import CreateNotificationDialog from "../notifications/CreateNotificationDialog";
import ChangeActiveUserButton from "@/pages/staff/manage-users/change-active-user";

interface User {
  accountID: string;
  fullName: string;
  email: string;
  isActive: boolean;
}

interface UserActionsDropdownProps {
  user: User;
  onSuccess: () => void;
  onCreateNotification: (data: any) => Promise<boolean>;
}

export default function UserActionsDropdown({
  user,
  onSuccess,
  onCreateNotification,
}: UserActionsDropdownProps) {
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger >
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => setNotificationDialogOpen(true)}
            className="cursor-pointer"
          >
            <Bell className="h-4 w-4 mr-2" />
            Tạo thông báo
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="">
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
    </>
  );
}
