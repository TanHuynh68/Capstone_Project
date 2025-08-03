"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import StaffService from "@/services/StaffService";
import { MESSAGE } from "@/constants/message";
import { toast } from "sonner";
import { Lock, LockOpen } from "lucide-react";
import { cn } from "@/utils";

interface Props {
  accountID: string;
  isActive: boolean;
  onSuccess?: () => void;
}

const ChangeActiveUserButton: React.FC<Props> = ({
  accountID,
  isActive,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const { changeActiveUserByStaff } = StaffService();

  const handleConfirm = async () => {
    try {
      await changeActiveUserByStaff({
        accountID,
        isActive: !isActive,
      });
      toast.success(MESSAGE.CHANGE_ACTIVE_USER_SUCCESSFULLY);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data || MESSAGE.CHANGE_ACTIVE_USER_FAILED);
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex gap-2">
          {isActive ? (
            <div
              className={cn(
                "w-full hover:bg-gray-100 focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              )}
            >
              <Lock className="h-4 w-4 mr-2" />
              <div className="cursor-pointer">Khóa người dùng</div>
            </div>
          ) : (
            <div
              className={cn(
                "w-full hover:bg-gray-100 focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
              )}
            >
              <LockOpen className="h-4 w-4 mr-2" />
              Mở khóa
            </div>
          )}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isActive
              ? "Xác nhận khóa tài khoản?"
              : "Xác nhận mở khóa tài khoản?"}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex justify-end space-x-0.5">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            variant={isActive ? "destructive" : "default"}
            onClick={handleConfirm}
          >
            {isActive ? "Khóa" : "Mở"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeActiveUserButton;
