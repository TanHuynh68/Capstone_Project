"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  formatCurrencyVND,
  isAcceptedVariant,
  offerStatusVariant,
  offerStatusVN,
  useCurrentUser,
} from "@/components/utils";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import ChatCreateOfferPhase from "../chat-form/ChatCreateOfferPhase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import OfferPhasesDialog from "./offerPhasesDialog";
import { ROLE } from "@/constants";
import ImageGallery from "@/components/molecules/post/post-detail/ImageGallery";
import { CustomBadge } from "./Badge";
import { Badge } from "@/components/ui/badge";
import OfferService from "@/services/OfferService";

export interface ChatPostCardProps {
  post: OfferDetail;
  setOffersPhase: any;
  fetchOfferPhase: any;
  offersPhase: any;
  fetchOffers: any;
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
  const { offerConfirm } = OfferService();

  const handleConfirm = async () => {
    const reponse = await offerConfirm({ offerID: post?.offer?.offerID });
    console.log("offerConfirm: ", reponse);
    if (reponse) {
      await fetchOffers();
    }
    console.log("post?.offer?.offerID: ", post?.offer?.offerID);
    console.log("reponse: ", reponse);
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

  return (
    <div>
      {/* Main Card - No longer clickable */}
      <Card className="w-full p-2 hover:shadow-md transition-shadow duration-300">
        <div className="grid grid-cols-2 gap-4">
          <img
            className="rounded-lg w-[300px] h-[215px] object-cover object-left-top"
            src={post?.offer?.sampleImage || "/placeholder.svg"}
            alt={post?.post?.title}
          />
          <div className="space-y-1">
            <div className="truncate font-semibold text-xl">
              {post?.post.title}
            </div>
            <div className="flex items-center gap-2 mt-2">
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
                    className="h-8 w-8 p-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-40" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails();
                        fetchOffers();
                      }}
                    >
                      Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewPhases();
                      }}
                    >
                      Xem giai đoạn
                    </DropdownMenuItem>

                    {currentUser?.role === ROLE.DESIGNER &&
                      post?.offer?.offerStatus != "Accepted" && (
                        <DropdownMenuItem onClick={handleCreatePhaseClick}>
                          Tạo giai đoạn
                        </DropdownMenuItem>
                      )}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {currentUser?.role === ROLE.CUSTOMER &&
              post.offer?.isAcceptedByCus === false && (
                <div className=" gap-4">
                  <Button onClick={handleConfirm}>Chấp nhận</Button>
                </div>
              )}
            {currentUser?.role === ROLE.DESIGNER &&
              post.offer?.isAcceptedByDes === false && (
                <div className=" gap-4">
                  <Button onClick={handleConfirm}>Chấp nhận</Button>
                </div>
              )}
            <div>
              Giá cuối cùng:{" "}
              {post?.offer?.finalPrice === null
                ? "Chưa có"
                : formatCurrencyVND(post?.offer?.finalPrice)}
            </div>
            <div className="flex gap-2">
              <div>Khách hàng:</div>
              <Badge
                className="ml-2"
                variant={isAcceptedVariant(post?.offer?.isAcceptedByCus)}
              >
                {post?.offer?.isAcceptedByCus === true
                  ? "Đồng ý"
                  : "Chưa đồng ý"}
              </Badge>
            </div>
            <div className="flex gap-2 mt-2">
              <div>Nhà thiết kế:</div>
              <Badge
                className="ml-1"
                variant={isAcceptedVariant(post?.offer?.isAcceptedByDes)}
              >
                {post?.offer?.isAcceptedByDes === true
                  ? "Đồng ý"
                  : "Chưa đồng ý"}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Details Dialog */}
      <Dialog open={isMainDialogOpen} onOpenChange={setIsMainDialogOpen}>
        <DialogContent className="min-w-[1200px] h-[750px]">
          <div className="grid grid-cols-2 gap-4 justify-center items-center">
            <div className="">
              <div className="border rounded-md bg-gray-50/80 p-4 h-[700px] overflow-y-auto">
                {/* Header với avatar và thông tin cơ bản */}
                <div className="flex items-start gap-3 mb-3">
                  {post.post.avatar && (
                    <img
                      src={post.post.avatar || "/placeholder.svg"}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1 mb-1">
                      Bài viết
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-600">
                      <span className="font-semibold text-gray-700">
                        {post.post.fullName}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>
                        {new Date(post.post.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mô tả và hình ảnh */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      {post.post.description && (
                        <div className="bg-white/50 rounded-md px-3 py-2 border border-gray-100">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-sm text-gray-600">Mô tả:</div>
                            <div className="text-sm text-gray-600 font-semibold border-gray-100 truncate">
                              {post.post.description}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="">
                      <div className="bg-white/50 rounded-md px-3 py-2 border border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Tiêu đề:
                          </span>
                          <span className="text-sm text-gray-600 font-semibold border-gray-100">
                            {post.post.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Cột thông tin giá */}
                      <div className="space-y-2">
                        <div className="bg-white/50 rounded-md px-3 py-2 border border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Giá trị sản phẩm
                            </span>
                            <span className="text-sm font-semibold text-blue-600">
                              {post.post.itemValue.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white/50 rounded-md px-3 py-2 border border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Giá đề xuất
                            </span>
                            <span className="text-sm font-semibold text-green-600">
                              {post.post.suggestedPrice.toLocaleString(
                                "vi-VN",
                                {
                                  style: "currency",
                                  currency: "VND",
                                }
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Cột thông tin thời hạn */}
                      <div className="space-y-2">
                        <div className="bg-white/50 rounded-md px-3 py-2 border border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Thời hạn hoàn thành
                            </span>
                            <span className="text-sm font-semibold text-amber-600">
                              {post.post.finishDate
                                ? new Date(
                                    post.post.finishDate
                                  ).toLocaleDateString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })
                                : "Chưa có"}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white/50 rounded-md px-3 py-2 border border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Trạng thái
                            </span>
                            <span
                              className={`text-sm font-semibold ${
                                post.post.postStatus === 1
                                  ? "text-green-600"
                                  : post.post.postStatus === 2
                                  ? "text-blue-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {post.post.postStatus === 1
                                ? "Đang hoạt động"
                                : post.post.postStatus === 2
                                ? "Đang thực hiện"
                                : "Đã đóng"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Gallery */}
                  {(post.post.originalImages?.length > 0 ||
                    post.post.requestedImages?.length > 0) && (
                    <div className="relative w-full">
                      {post.post.originalImages?.length > 0 && (
                        <ImageGallery
                          images={post.post.originalImages}
                          title="Hình ảnh gốc"
                          className="mt-2"
                        />
                      )}
                      {post.post.requestedImages?.length > 0 && (
                        <ImageGallery
                          images={post.post.requestedImages}
                          title="Hình ảnh yêu cầu"
                          className="mt-2"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* offer */}
            <div className="">
              <div className="border rounded-md bg-gray-50/80 p-4 h-[700px] overflow-y-auto">
                {/* Header với avatar và thông tin cơ bản */}
                <div className="flex items-start gap-3 mb-3">
                  {post.offer.avatar && (
                    <img
                      src={post.offer.avatar || "/placeholder.svg"}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1 mb-1">
                      Đề xuất
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 text-sm text-gray-600">
                      <span className="font-semibold text-gray-700">
                        {post.offer.designerName}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span>
                        {new Date(post.offer.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewPhases();
                    }}
                  >
                    Xem giai đoạn
                  </Button>
                </div>

                {/* Mô tả và hình ảnh */}
                <div className="space-y-3">
                  <div className="">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Cột thông tin giá */}
                      <div className="space-y-2">
                        <div className="bg-white/50 rounded-md px-3 py-2 border border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Giá trị ban đầu
                            </span>
                            <span className="text-sm font-semibold text-blue-600">
                              {post.offer.initPrice.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white/50 rounded-md px-3 py-2 border border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Tiền cọc
                            </span>
                            <span className="text-sm font-semibold text-green-600">
                              {post?.offer?.designerDepositPrice
                                ? post?.offer?.designerDepositPrice.toLocaleString(
                                    "vi-VN",
                                    {
                                      style: "currency",
                                      currency: "VND",
                                    }
                                  )
                                : "Chưa có"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Cột thông tin thời hạn */}
                      <div className="space-y-2">
                        <div className="bg-white/50 rounded-md px-3 py-2 border border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Thời hạn hoàn thành
                            </span>
                            <span className="text-sm font-semibold text-amber-600">
                              {post.post.finishDate
                                ? new Date(
                                    post.offer.deadlineEndAt
                                  ).toLocaleDateString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })
                                : "Chưa có"}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white/50 rounded-md px-3 py-2 border border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Trạng thái
                            </span>
                            <span
                              className={`text-sm font-semibold ${
                                post.post.postStatus === 1
                                  ? "text-green-600"
                                  : post.post.postStatus === 2
                                  ? "text-blue-600"
                                  : "text-gray-600"
                              }`}
                            >
                              {offerStatusVN(post?.offer?.offerStatus)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/50 rounded-md px-3 py-2 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Tiền cuối cùng
                        </span>
                        <span className="text-sm font-semibold text-green-600">
                          {post?.offer?.finalPrice
                            ? post?.offer?.finalPrice.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              })
                            : "Chưa có"}
                        </span>
                      </div>
                    </div>
                    <div>
                      {post.offer.note && (
                        <div className="bg-white/50 rounded-md px-3 py-2 border border-gray-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 truncate">
                              Ghi chú
                            </span>
                            <span className="text-sm text-gray-600 font-semibold border-gray-100">
                              {post.offer.note}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {post.offer.sampleImage?.length > 0 && (
                    <div className="">
                      <div className="flex w-full h-[400px] justify-center items-center">
                        <img
                          className="max-w-full max-h-full object-contain"
                          src={post.offer.sampleImage || "/placeholder.svg"}
                          alt=""
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Separate dialog for creating offer phases */}
      <Dialog
        open={isCreatePhaseDialogOpen}
        onOpenChange={setIsCreatePhaseDialogOpen}
      >
        <DialogContent
          className="min-w-[610px]"
          onKeyDown={(e) => {
            // Prevent spacebar from bubbling up and triggering other dialogs
            e.stopPropagation();
          }}
        >
          <DialogHeader className="font-bold text-xl items-center">
            Tạo giai đoạn
          </DialogHeader>
          <ChatCreateOfferPhase
            deadline={post?.offer?.deadlineEndAt}
            fetchOffers={fetchOffers}
            fetchOfferPhase={fetchOfferPhase}
            offerID={post?.offer?.offerID}
          />
        </DialogContent>
      </Dialog>

      {/* Separate dialog for offer phases */}
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
