import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";

interface PostActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  actionType: boolean;
  onSubmit: (data: PostActionData) => Promise<boolean>;
}

export default function PostActionDialog({
  isOpen,
  onClose,
  post,
  actionType,
  onSubmit,
}: PostActionDialogProps) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!post) return;

    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do");
      return;
    }

    setLoading(true);
    try {
      const success = await onSubmit({
        projectPostID: post.projectPostID,
        reason: reason.trim(),
      });

      if (success) {
        setReason("");
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  if (!post) return null;

  const isDisable = actionType === true;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isDisable ? (
              <>
                <PowerOff className="h-5 w-5 text-red-600" />
                Vô hiệu hóa bài đăng
              </>
            ) : (
              <>
                <Power className="h-5 w-5 text-green-600" />
                Kích hoạt bài đăng
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Warning */}
          <div
            className={`p-4 rounded-lg border ${
              isDisable
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle
                className={`h-5 w-5 mt-0.5 ${
                  isDisable ? "text-red-600" : "text-green-600"
                }`}
              />
              <div>
                <h3
                  className={`font-medium ${
                    isDisable ? "text-red-800" : "text-green-800"
                  }`}
                >
                  {isDisable ? "Xác nhận vô hiệu hóa" : "Xác nhận kích hoạt"}
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    isDisable ? "text-red-700" : "text-green-700"
                  }`}
                >
                  Bạn có chắc chắn muốn{" "}
                  {isDisable ? "vô hiệu hóa" : "kích hoạt"} bài đăng "
                  {post.title}"?
                </p>
              </div>
            </div>
          </div>

          {/* Post Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Bài đăng:</div>
            <div className="font-medium">{post.title}</div>
            <div className="text-sm text-gray-600 mt-1">
              Người đăng: {post.fullName}
            </div>
          </div>

          {/* Reason */}
          <div>
            <Label htmlFor="reason" className="text-sm font-medium">
              Lý do {isDisable ? "vô hiệu hóa" : "kích hoạt"} *
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={`Nhập lý do ${
                isDisable ? "vô hiệu hóa" : "kích hoạt"
              } bài đăng này...`}
              className="mt-1 min-h-[100px]"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {reason.length}/500 ký tự
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 bg-transparent"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={loading || !reason.trim()}
              className={`flex-1 ${
                isDisable
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading
                ? "Đang xử lý..."
                : isDisable
                ? "Vô hiệu hóa"
                : "Kích hoạt"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
