"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bell, Send, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface CreateNotificationData {
  accountID: string;
  tille: string;
  message: string;
  redirectLink?: string;
}

interface CreateNotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    accountID: string;
    fullName: string;
    email: string;
  } | null;
  onSubmit: (data: CreateNotificationData) => Promise<boolean>;
}

const REDIRECT_OPTIONS = [
  { value: "none", label: "Không chuyển hướng" },
  { value: "order", label: "Đơn hàng" },
  { value: "blog", label: "Blog" },
  { value: "report", label: "Báo cáo" },
];

export default function CreateNotificationDialog({
  isOpen,
  onClose,
  user,
  onSubmit,
}: CreateNotificationDialogProps) {
  const [formData, setFormData] = useState<CreateNotificationData>({
    accountID: "",
    tille: "",
    message: "",
    redirectLink: "none", // Thay đổi từ "" thành "none"
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when dialog opens/closes or user changes
  useEffect(() => {
    if (user) {
        console.log('user: ', user)
      setFormData({
        accountID: user.accountID,
        tille: "",
        message: "",
        redirectLink: "none", // Thay đổi từ "" thành "none"
      });
      setErrors({});
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.tille.trim()) {
      newErrors.tille = "Tiêu đề là bắt buộc";
    } else if (formData.tille.length > 100) {
      newErrors.tille = "Tiêu đề không được vượt quá 100 ký tự";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Nội dung thông báo là bắt buộc";
    } else if (formData.message.length > 500) {
      newErrors.message = "Nội dung không được vượt quá 500 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof CreateNotificationData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        redirectLink:
          formData.redirectLink === "none" ? undefined : formData.redirectLink, // Convert "none" to undefined
      };

      const success = await onSubmit(submitData);
      if (success) {
        handleClose();
        toast.success("Tạo thông báo thành công!");
      }
    } catch (error) {
      console.error("Error creating notification:", error);
      toast.error("Có lỗi xảy ra khi tạo thông báo");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      accountID: "",
      tille: "",
      message: "",
      redirectLink: "none", // Thay đổi từ "" thành "none"
    });
    setErrors({});
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Tạo thông báo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* User Info */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-800 font-medium">
              Gửi thông báo đến:
            </div>
            <div className="text-sm text-blue-700 mt-1">
              <div className="font-medium">{user.fullName}</div>
              <div className="text-xs">{user.email}</div>
            </div>
          </div>

          {/* tille */}
          <div>
            <Label htmlFor="tille" className="text-sm font-medium">
              Tiêu đề thông báo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="tille"
              value={formData.tille}
              onChange={(e) => handleInputChange("tille", e.target.value)}
              placeholder="Nhập tiêu đề thông báo..."
              className={`mt-1 ${
                errors.tille
                  ? "border-red-500 focus:border-red-500 bg-red-50"
                  : ""
              }`}
              maxLength={100}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.tille && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.tille}</span>
                </div>
              )}
              <div className="text-xs text-gray-500 ml-auto">
                {formData.tille.length}/100
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message" className="text-sm font-medium">
              Nội dung thông báo <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Nhập nội dung thông báo..."
              className={`mt-1 min-h-[100px] resize-none ${
                errors.message
                  ? "border-red-500 focus:border-red-500 bg-red-50"
                  : ""
              }`}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.message && (
                <div className="flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.message}</span>
                </div>
              )}
              <div className="text-xs text-gray-500 ml-auto">
                {formData.message.length}/500
              </div>
            </div>
          </div>

          {/* Redirect Link */}
          <div>
            <Label htmlFor="redirectLink" className="text-sm font-medium">
              Chuyển hướng (tùy chọn)
            </Label>
            <Select
              value={formData.redirectLink}
              onValueChange={(value) =>
                handleInputChange("redirectLink", value)
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Chọn trang chuyển hướng" />
              </SelectTrigger>
              <SelectContent>
                {REDIRECT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-xs text-gray-500 mt-1">
              Người dùng sẽ được chuyển hướng đến trang này khi nhấn vào thông
              báo
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 p-3 rounded-lg border">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Xem trước:
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <div className="font-medium text-gray-900 text-sm">
                {formData.tille || "Tiêu đề thông báo"}
              </div>
              <div className="text-gray-700 text-sm mt-1">
                {formData.message || "Nội dung thông báo sẽ hiển thị ở đây..."}
              </div>
              {formData.redirectLink && formData.redirectLink !== "none" && (
                <div className="text-xs text-blue-600 mt-2">
                  → Chuyển đến:{" "}
                  {
                    REDIRECT_OPTIONS.find(
                      (opt) => opt.value === formData.redirectLink
                    )?.label
                  }
                </div>
              )}
            </div>
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
            onClick={handleSubmit}
            disabled={
              loading || !formData.tille.trim() || !formData.message.trim()
            }
            className="flex-1"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang gửi...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Gửi thông báo
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
