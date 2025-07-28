"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import {
  FileText,
  Calendar,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatFullDateWithDistance2 } from "@/utils/date";
import { formatCurrencyVND } from "@/utils";
import { Button } from "@/components/ui/button";

interface PostDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  loading: boolean;
}

export default function PostDetailDialog({
  isOpen,
  onClose,
  post,
  loading,
}: PostDetailDialogProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentImageType, setCurrentImageType] = useState<
    "original" | "requested"
  >("original");

  if (!post && !loading) return null;

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        Đang hoạt động
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
        Đã vô hiệu hóa
      </Badge>
    );
  };

  const getPostStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge className="bg-blue-100 text-blue-800">Đang mở</Badge>;
      case 2:
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Đang thực hiện
          </Badge>
        );
      case 3:
        return (
          <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>
        );
    }
  };

  const currentImages =
    currentImageType === "original"
      ? post?.originalImages || []
      : post?.requestedImages || [];

  const nextImage = () => {
    if (currentImages.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % currentImages.length);
    }
  };

  const prevImage = () => {
    if (currentImages.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + currentImages.length) % currentImages.length
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[1000px] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            Chi tiết bài đăng
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Đang tải...</span>
          </div>
        ) : post ? (
          <div className="space-y- py-2 grid grid-cols-2 gap-4">
            {/* Basic Information */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="text-lg flex items-center gap-2 pt-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex justify-between w-full items-center ">
                    <div>Thông tin cơ bản</div>
                    <div className="flex gap-2 items-center ">
                      {getPostStatusBadge(post.postStatus)}
                      {getStatusBadge(post.isActive)}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Tiêu đề
                  </Label>
                  <p className="text-sm bg-gray-100 p-2 rounded mt-1">
                    {post.title}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Người đăng
                    </Label>
                    <div className="flex items-center gap-2 bg-gray-100 p-2 rounded mt-1">
                      {post.avatar && (
                        <img
                          src={post.avatar || "/placeholder.svg"}
                          alt={post.fullName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      <span className="text-sm">{post.fullName}</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Ngày tạo
                    </Label>
                    <p className="text-sm bg-gray-100 p-2 rounded mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {formatFullDateWithDistance2(post.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Giá trị dự án
                    </Label>
                    <p className="text-sm bg-gray-100 p-2 rounded mt-1 font-semibold text-green-600">
                      {formatCurrencyVND(post.itemValue)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Giá đề xuất
                    </Label>
                    <p className="text-sm bg-gray-100 p-2 rounded mt-1 font-semibold text-blue-600">
                      {formatCurrencyVND(post.suggestedPrice)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Ngày kết thúc
                    </Label>
                    <p className="text-sm bg-gray-100 p-2 rounded mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {formatFullDateWithDistance2(post.endAt)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-700">
                      Ngày hoàn thành
                    </Label>
                    <p className="text-sm bg-gray-100 p-2 rounded mt-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {formatFullDateWithDistance2(post.finishDate)}
                    </p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700">
                    Mô tả
                  </Label>
                  <Textarea
                    className="text-sm bg-gray-100 p-2 rounded mt-1 min-h-[100px]"
                    value={post.description}
                    readOnly
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images Section */}
            {(post.originalImages.length > 0 ||
              post.requestedImages.length > 0) && (
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-t-lg">
                  <CardTitle className="text-lg flex items-center gap-2 pt-2">
                    <ImageIcon className="h-5 w-5 text-orange-600" />
                    Hình ảnh dự án
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Image Type Selector */}
                  <div className="flex gap-2 mb-4">
                    <Button
                      variant={
                        currentImageType === "original" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        setCurrentImageType("original");
                        setCurrentImageIndex(0);
                      }}
                      disabled={post.originalImages.length === 0}
                    >
                      Hình ảnh gốc ({post.originalImages.length})
                    </Button>
                    <Button
                      variant={
                        currentImageType === "requested" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        setCurrentImageType("requested");
                        setCurrentImageIndex(0);
                      }}
                      disabled={post.requestedImages.length === 0}
                    >
                      Hình ảnh yêu cầu ({post.requestedImages.length})
                    </Button>
                  </div>

                  {/* Image Display */}
                  {currentImages.length > 0 && (
                    <div className="relative">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={
                            currentImages[currentImageIndex]?.imageUrl ||
                            "/placeholder.svg"
                          }
                          alt={`${currentImageType} image ${
                            currentImageIndex + 1
                          }`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                      </div>

                      {/* Navigation */}
                      {currentImages.length > 1 && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                            onClick={prevImage}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                            onClick={nextImage}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </>
                      )}

                      {/* Image Counter */}
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                        {currentImageIndex + 1} / {currentImages.length}
                      </div>
                    </div>
                  )}

                  {/* Thumbnails */}
                  {currentImages.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto">
                      {currentImages.map((image, index) => (
                        <button
                          key={image.projectImageID}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                            index === currentImageIndex
                              ? "border-blue-500"
                              : "border-gray-200"
                          }`}
                        >
                          <img
                            src={image.imageUrl || "/placeholder.svg"}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
