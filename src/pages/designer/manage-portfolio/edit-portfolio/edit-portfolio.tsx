"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PortfolioService from "@/services/PortfolioService";
import { toast } from "sonner";

interface EditPortfolioProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioData: {
    yearOfExperience?: string;
    content?: string;
    expertIn?: string;
  } | null;
  onSuccess: () => void;
}

const EditPortfolio = ({
  isOpen,
  onClose,
  portfolioData,
  onSuccess,
}: EditPortfolioProps) => {
  const { editPortfolio } = PortfolioService();
  const [formData, setFormData] = useState({
    yearOfExperience: "",
    content: "",
    expertIn: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (portfolioData) {
      setFormData({
        yearOfExperience: portfolioData.yearOfExperience || "",
        content: portfolioData.content || "",
        expertIn: portfolioData.expertIn || "",
      });
    }
  }, [portfolioData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await editPortfolio({
        yearOfExperience: formData.yearOfExperience,
        content: formData.content,
        expertIn: formData.expertIn,
      });

      if (response) {
        toast.success("Cập nhật thông tin dự án thành công");
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error updating portfolio:", error);
      toast.error("Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin dự án</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="yearOfExperience">Số năm kinh nghiệm</Label>
            <Input
              id="yearOfExperience"
              name="yearOfExperience"
              value={formData.yearOfExperience}
              onChange={handleChange}
              placeholder="Nhập số năm kinh nghiệm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expertIn">Chuyên môn</Label>
            <Input
              id="expertIn"
              name="expertIn"
              value={formData.expertIn}
              onChange={handleChange}
              placeholder="Nhập chuyên môn của bạn"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Giới thiệu</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Nhập giới thiệu về bản thân"
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPortfolio;
