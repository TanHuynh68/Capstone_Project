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
        <Button variant="outline" size="sm">
          {isActive ? "Khóa" : "Mở"}
        </Button>
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
