"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Info } from "lucide-react";
import { useState } from "react";
import ChatCreateOfferPhase from "../chat-form/ChatCreateOfferPhase";
import OfferPhasesDialog from "./offerPhasesDialog";
import ImageGallery from "@/components/molecules/post/post-detail/ImageGallery";
import { CustomBadge } from "./Badge";
import {
  formatCurrencyVND,
  isAcceptedVariant,
  offerStatusVariant,
  offerStatusVN,
  useCurrentUser,
} from "@/utils";
import { ROLE } from "@/constants";
import OfferService from "@/services/OfferService";
import SingleImageGallery from "@/components/molecules/post/post-detail/SingleImageGallery";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface ChatPostCardProps {
  post: OfferDetail;
  setOffersPhase: (phases: any[]) => void;
  fetchOfferPhase: any;
  offersPhase: any[];
  fetchOffers: () => Promise<void>;
}

export function ChatPostCard({
  post,
  fetchOfferPhase,
  setOffersPhase,
  offersPhase,
  fetchOffers,
}: ChatPostCardProps) {
  const currentUser = useCurrentUser();
  const [showPhasesDialog, setShowPhasesDialog] = useState(false);
  const [isMainDialogOpen, setIsMainDialogOpen] = useState(false);
  const [isCreatePhaseDialogOpen, setIsCreatePhaseDialogOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { offerConfirm } = OfferService();

  const handleConfirm = async () => {
    try {
      setIsConfirming(true);
      const response = await offerConfirm({ offerID: post?.offer?.offerID });
      if (response) {
        await fetchOffers();
        console.log("Offer confirmed successfully");
      }
    } catch (error) {
      console.error("Error confirming offer:", error);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleViewPhases = () => {
    fetchOfferPhase(post?.offer?.offerID);
    setShowPhasesDialog(true);
  };

  const handleViewDetails = () => {
    setIsMainDialogOpen(true);
  };

  const handleCreatePhaseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCreatePhaseDialogOpen(true);
  };

  const handleCreatePhaseSuccess = () => {
    setIsCreatePhaseDialogOpen(false);
  };

  return (
    <div>
      {/* Main Card */}
      <Card className="w-full p-4 hover:shadow-lg transition-all duration-300 border-l-2">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3 flex items-center">
            <img
              className="rounded-lg w-full h-[200px] object-cover"
              src={post?.offer?.sampleImage || "/placeholder.svg"}
              alt={post?.post?.title}
            />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-bold text-xl text-gray-800 line-clamp-2">
                {post?.post.title}
              </h3>
              <div className="flex items-center gap-3">
                <CustomBadge
                  variant={offerStatusVariant(post?.offer?.offerStatus)}
                >
                  {offerStatusVN(post?.offer?.offerStatus)}
                </CustomBadge>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48" align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails();
                        }}
                      >
                        📋 Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPhases();
                        }}
                      >
                        📊 Xem giai đoạn
                      </DropdownMenuItem>
                      {currentUser?.role === ROLE.DESIGNER &&
                        post?.offer?.offerStatus !== "Accepted" && (
                          <DropdownMenuItem onClick={handleCreatePhaseClick}>
                            ➕ Tạo giai đoạn
                          </DropdownMenuItem>
                        )}
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="space-y-3">
              {currentUser?.role === ROLE.CUSTOMER &&
                post.offer?.isAcceptedByCus === false &&
                post.offer?.offerStatus !== "Rejected" && (
                  <Button
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    className="w-full"
                  >
                    {isConfirming ? "Đang xử lý..." : "Chấp nhận đề xuất"}
                  </Button>
                )}
              {currentUser?.role === ROLE.DESIGNER &&
                post.offer?.isAcceptedByDes === false &&
                post.offer?.offerStatus !== "Rejected" && (
                  <Button
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    className="w-full"
                  >
                    {isConfirming ? "Đang xử lý..." : "Chấp nhận đề xuất"}
                  </Button>
                )}
            </div>
            {/* Price Info */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Giá cuối cùng</div>
              <div className="font-bold text-lg text-green-600">
                {post?.offer?.finalPrice === null
                  ? "Chưa có"
                  : formatCurrencyVND(post?.offer?.finalPrice)}
              </div>
            </div>
            {/* Status Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Khách hàng:</span>
                <Badge
                  variant={isAcceptedVariant(post?.offer?.isAcceptedByCus)}
                >
                  {post?.offer?.isAcceptedByCus === true
                    ? "Đồng ý"
                    : "Chưa đồng ý"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Nhà thiết kế:</span>
                <Badge
                  variant={isAcceptedVariant(post?.offer?.isAcceptedByDes)}
                >
                  {post?.offer?.isAcceptedByDes === true
                    ? "Đồng ý"
                    : "Chưa đồng ý"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Details Dialog */}
      <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
        <DialogContent className="min-w-[1200px] h-[750px]">
          <DialogHeader>
            <h2 className="text-xl font-bold">Chi tiết bài đăng và đề xuất</h2>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 h-full overflow-hidden">
            {/* Post Details */}
            <div className="border rounded-lg bg-gray-50/80 p-4 overflow-y-auto">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Thông tin bài đăng
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  {post.post.avatar && (
                    <img
                      src={post.post.avatar || "/placeholder.svg"}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  )}
                  <div>
                    <div className="font-semibold">{post.post.fullName}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(post.post.createdAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm text-gray-600">
                      Giá trị sản phẩm
                    </div>
                    <div className="font-semibold text-blue-600">
                      {formatCurrencyVND(post.post.itemValue)}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm text-gray-600">Ngân sách</div>
                    <div className="font-semibold text-green-600">
                      {formatCurrencyVND(post.post.suggestedPrice)}
                    </div>
                  </div>
                </div>
                {post.post.description && (
                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm text-gray-600 mb-2">Mô tả</div>
                    <div className="text-sm">{post.post.description}</div>
                  </div>
                )}
                {/* Images */}
                {(post.post.originalImages?.length > 0 ||
                  post.post.requestedImages?.length > 0) && (
                  <div className="space-y-3">
                    {post.post.originalImages?.length > 0 && (
                      <ImageGallery
                        images={post.post.originalImages}
                        title="Hình ảnh gốc"
                      />
                    )}
                    {post.post.requestedImages?.length > 0 && (
                      <ImageGallery
                        images={post.post.requestedImages}
                        title="Hình ảnh yêu cầu"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* Offer Details */}
            <div className="border rounded-lg bg-gray-50/80 p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  Thông tin đề xuất
                </h3>
                <Button variant="outline" size="sm" onClick={handleViewPhases}>
                  Xem giai đoạn
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  {post.offer.avatar && (
                    <img
                      src={post.offer.avatar || "/placeholder.svg"}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  )}
                  <div>
                    <div className="font-semibold">
                      {post.offer.designerName}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(post.offer.createdAt).toLocaleDateString(
                        "vi-VN"
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm text-gray-600">Giá ban đầu</div>
                    <div className="font-semibold text-blue-600">
                      {formatCurrencyVND(post.offer.initPrice)}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      Tiền cọc
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-primary hover:text-gray-600 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            {/* <p>Số tiền cọc mà nhà thiết kế yêu cầu</p> */}
                            <p>
                              Tiền cọc = (Giá cuối cùng + Giá trị vật phẩm ) / 2
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="font-semibold text-green-600">
                      {post?.offer?.designerDepositPrice
                        ? formatCurrencyVND(post.offer.designerDepositPrice)
                        : "Chưa có"}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm text-gray-600">Giá ban đầu</div>
                    <div className="font-semibold text-blue-600">
                      {post.offer.finalPrice != null
                        ? formatCurrencyVND(post.offer.finalPrice)
                        : "Chưa có"}
                    </div>
                  </div>
                </div>
                {post.offer.note && (
                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm text-gray-600 mb-2">Ghi chú</div>
                    <div className="text-sm">{post.offer.note}</div>
                  </div>
                )}
                {post.offer.sampleImage && (
                  <div className="bg-white p-3 rounded border">
                    <div className="text-sm text-gray-600 mb-2">
                      Hình ảnh mẫu
                    </div>
                    <SingleImageGallery
                      imageUrl={post.offer.sampleImage}
                      alt="Ảnh đề xuất"
                      title=""
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Phase Dialog */}
      <Dialog
        open={isCreatePhaseDialogOpen}
        onOpenChange={setIsCreatePhaseDialogOpen}
      >
        <DialogContent
          className="min-w-[1200px]"
          onKeyDown={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <h2 className="font-bold text-xl text-center">Tạo giai đoạn mới</h2>
          </DialogHeader>
          <ChatCreateOfferPhase
            deadline={post?.offer?.deadlineEndAt}
            fetchOffers={fetchOffers}
            fetchOfferPhase={fetchOfferPhase}
            offerID={post?.offer?.offerID}
            onSuccess={handleCreatePhaseSuccess}
          />
        </DialogContent>
      </Dialog>

      {/* Phases Dialog */}
      <OfferPhasesDialog
        isOpen={showPhasesDialog}
        onClose={() => {
          setShowPhasesDialog(false);
          setOffersPhase([]);
        }}
        offersPhase={offersPhase}
        fetchOfferPhase={fetchOfferPhase}
      />
    </div>
  );
}
