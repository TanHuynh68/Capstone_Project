import { Badge } from "@/components/atoms/badge/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  formatCurrencyVND,
  isAcceptedVariant,
  offerStatusVariant,
  offerStatusVN,
} from "@/components/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ChatCreateOfferPhase from "../chat-form/ChatCreateOfferPhase";
export interface ChatPostCardProps {
  post: ChatPostCard;
}
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OfferService from "@/services/OfferService";
import { useState } from "react";
import OfferPhaseCard from "./OfferPhaseCard";
export function ChatPostCard({ post }: ChatPostCardProps) {
  const { getOfferPhase } = OfferService();
  const [offers, setOffers] = useState<OfferPhase[]>([]);
  const fetchOfferPhase = async () => {
    const response = await getOfferPhase(post?.offerID);
    console.log("fetchOfferPhase: ", response);
    if (response) {
      setOffers(response.responseRequestModel.responseList);
    }
  };
  return (
    <div>
      <Card className="w-full p-2 ">
        <div className=" grid grid-cols-2 gap-4">
          <img
            className="rounded-lg"
            src={post?.sampleImage}
            alt={post?.title}
          />
          <div className="space-y-1">
            <div className="truncate font-semibold text-xl">{post?.title}</div>
            <div>
              <Badge variant={offerStatusVariant(post?.offerStatus)}>
                {offerStatusVN(post?.offerStatus)}
              </Badge>
              {/* show dialog create offer phase */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline">Open</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-24" align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <div className="" onClick={() => fetchOfferPhase()}>
                        Xem giai đoạn
                      </div>
                    </DropdownMenuItem>
                    {/* ✅ Cách khắc phục Dialog bị đóng ngay khi mở */}
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault(); // ✅ Ngăn menu đóng
                      }}
                    >
                      <Dialog>
                        <DialogTrigger>
                          <div className="w-full cursor-pointer">
                            Tạo giai đoạn
                          </div>
                        </DialogTrigger>
                        <DialogContent className="min-w-[610px]">
                          <ChatCreateOfferPhase offerID={post?.offerID} />
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>Giá ban đầu: {formatCurrencyVND(post?.initPrice)}</div>
            <div>
              Giá ban đề nghị: {formatCurrencyVND(post?.suggestedPrice)}
            </div>
            <div>
              Giá cuối cùng:{" "}
              {post.finalPrice === null
                ? "Chưa có"
                : formatCurrencyVND(post?.finalPrice)}
            </div>
            <div className="flex gap-2">
              <div>Khách hàng:</div>
              <Badge
                className="ml-2"
                variant={isAcceptedVariant(post?.isAcceptedByCus)}
              >
                {post?.isAcceptedByCus === true ? "Đồng ý" : "Chưa đồng ý"}
              </Badge>
            </div>
            <div className="flex gap-2 mt-2">
              <div>Nhà thiết kế:</div>
              <Badge
                className="ml-1"
                variant={isAcceptedVariant(post?.isAcceptedByDes)}
              >
                {post?.isAcceptedByDes === true ? "Đồng ý" : "Chưa đồng ý"}
              </Badge>
            </div>
            <div></div>
          </div>
        </div>
      </Card>
      {offers.length != 0 && (
        <div>
          {offers.map((item) => (
            <div key={item.offerPhaseID} className="p-2">
              <OfferPhaseCard offerPhase={item} />
            </div>
          ))}
        </div>
      )}
      {offers.length != 0 && (
        <div className="flex justify-end">
          <Button onClick={() => setOffers([])}>Đóng</Button>
        </div>
      )}
    </div>
  );
}
