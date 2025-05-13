"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface SuccessLoginModalProps {
  open: boolean;
  userId: string;
  onClose: () => void;
}

const SuccessLoginModal: React.FC<SuccessLoginModalProps> = ({
  open,
  userId,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>🎉 Đăng nhập thành công!</DialogTitle>
          <DialogDescription>
            Xin chào <strong>{userId}</strong>, bạn đã đăng nhập thành công 👋
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessLoginModal;
