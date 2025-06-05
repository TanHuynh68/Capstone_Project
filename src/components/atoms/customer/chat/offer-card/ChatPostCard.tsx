import { Badge } from "@/components/atoms/badge/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  formatCurrencyVND,
  isAcceptedVariant,
  offerStatusVariant,
  offerStatusVN,
  useCurrentUser,
} from "@/components/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ChatCreateOfferPhase from "../chat-form/ChatCreateOfferPhase";
export interface ChatPostCardProps {
  post: OfferDetail;
  setOffersPhase: any;
  fetchOfferPhase: any;
  offersPhase: any;
}
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import OfferPhaseCard from "./OfferPhaseCard";
import { ROLE } from "@/constants";
import ImageGallery from "@/components/molecules/post/post-detail/ImageGallery";

export function ChatPostCard({
  post,
  fetchOfferPhase,
  setOffersPhase,
  offersPhase,
}: ChatPostCardProps) {
  const currentUser = useCurrentUser();
  console.log("ChatPostCard: ", post);
  return (
    <div>
      <Dialog>
        <DialogTrigger className="text-left">
          <Card className="w-full p-2 ">
            <div className="grid grid-cols-2 gap-4">
              <img
                className="rounded-lg"
                src={post?.offer?.sampleImage}
                alt={post?.post?.title}
              />
              <div className="space-y-1">
                <div className="truncate font-semibold text-xl">
                  {post?.post.title}
                </div>
                <div>
                  <Badge variant={offerStatusVariant(post?.offer?.offerStatus)}>
                    {offerStatusVN(post?.offer?.offerStatus)}
                  </Badge>
                  {/* show dialog create offer phase */}
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button variant="outline">Open</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-24" align="start">
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <div
                            className=""
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent dialog from opening
                              fetchOfferPhase(post?.offer?.offerID);
                            }}
                          >
                            Xem giai đoạn
                          </div>
                        </DropdownMenuItem>
                        {/* ✅ Cách khắc phục Dialog bị đóng ngay khi mở */}
                        {currentUser?.role === ROLE.DESIGNER && (
                          <DropdownMenuItem
                            onSelect={(e) => {
                              e.preventDefault(); // Prevent menu from closing
                            }}
                          >
                            <div
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent dialog from opening
                              }}
                            >
                              <Dialog>
                                <DialogTrigger>
                                  <div className="w-full cursor-pointer">
                                    Tạo giai đoạn
                                  </div>
                                </DialogTrigger>
                                <DialogContent className="min-w-[610px]">
                                  <ChatCreateOfferPhase
                                    fetchOfferPhase={fetchOfferPhase}
                                    offerID={post?.offer?.offerID}
                                  />
                                </DialogContent>
                              </Dialog>
                            </div>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div>
                  Giá ban đầu: {formatCurrencyVND(post?.offer?.initPrice)}
                </div>
                <div>
                  Giá ban đề nghị:{" "}
                  {formatCurrencyVND(post?.post?.suggestedPrice)}
                </div>
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
                <div></div>
              </div>
            </div>
          </Card>
        </DialogTrigger>
        <DialogContent className="min-w-[1200px] h-[750px]">
          <div className="grid grid-cols-2 gap-4  justify-center items-center">
            <div className="">
              <div className="border rounded-md bg-gray-50/80 p-4 h-[700px]">
                {/* Header với avatar và thông tin cơ bản */}
                <div className="flex items-start gap-3 mb-3">
                  {post.post.avatar && (
                    <img
                      src={post.post.avatar}
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
                  {post.post.description && (
                    <div className="bg-white/50 rounded-md px-3 py-2 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          Mô tả sản phẩm
                        </span>
                        <span className="text-sm text-gray-600 font-semibold  border-gray-100">
                          {post.post.description}
                        </span>
                      </div>
                    </div>
                  )}

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

                {/* Thông tin giá và thời hạn */}
              </div>
            </div>
            {/* offer */}
            <div className="">
              <div className="border rounded-md bg-gray-50/80 p-4 h-[700px]">
                {/* Header với avatar và thông tin cơ bản */}
                <div className="flex items-start gap-3 mb-3">
                  {post.offer.avatar && (
                    <img
                      src={post.offer.avatar}
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
                </div>

                {/* Mô tả và hình ảnh */}
                <div className="space-y-3">
                  {post.offer.note && (
                    <div className="bg-white/50 rounded-md px-3 py-2 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Ghi chú</span>
                        <span className="text-sm text-gray-600 font-semibold  border-gray-100">
                          {post.offer.note}
                        </span>
                      </div>
                    </div>
                  )}

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

                  {post.offer.sampleImage?.length > 0 && (
                    <div className="">
                      <div className=" flex w-[533px] h-[480px] justify-center  items-center">
                      <img
                          className="w-[400px] h-[400px] object-cover object-left-top"
                          src={post.offer.sampleImage}
                          alt=""
                        />
                    </div>
                    </div>
                  )}
                </div>

                {/* Thông tin giá và thời hạn */}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {offersPhase.length !== 0 && (
        <div>
          {offersPhase.map((item: any) => (
            <div key={item.offerPhaseID} className="p-2">
              <OfferPhaseCard
                fetchOfferPhase={fetchOfferPhase}
                offerPhase={item}
              />
            </div>
          ))}
        </div>
      )}
      {offersPhase.length !== 0 && (
        <div className="flex justify-end">
          <Button onClick={() => setOffersPhase([])}>Đóng</Button>
        </div>
      )}
    </div>
  );
}
