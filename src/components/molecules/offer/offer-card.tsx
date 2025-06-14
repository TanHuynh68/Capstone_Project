import { useSelector } from "react-redux";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { RootState } from "@/redux/store";
import { Avatar } from "@/components/atoms/avatar/avatar";
import { Badge } from "@/components/atoms/badge/badge";
import { ProfilePopup } from "@/components/molecules/customer/profile/profile-popup";
import SingleImageGallery from "@/components/molecules/post/post-detail/SingleImageGallery";
import useOfferService from "@/services/OfferService";
import { useOffers } from "@/hooks/use-offers";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OfferEditorDialog } from "@/components/organisms/offer/OfferEditorDialog";
import { useState } from "react";
import { formatVietnamDate } from "@/components/utils/date";
import { OfferEditImage } from "@/components/organisms/offer/OfferEditImage";

interface OfferCardProps {
  offer: Offer;
  onClick?: () => void;
  onAccept?: (offerId: string) => void;
  onReject?: (offerId: string) => void;
  onEdit?: (offerId: string) => void;
  onDelete?: (offerId: string) => void;
  onUpdate?: (offerId: string) => void;
  postFinishDate: string;
}

export function OfferCard({
  offer,
  onDelete,
  onUpdate,
  postFinishDate,
}: OfferCardProps) {
  const currentUser = useSelector((state: RootState) => state.user);
  const isCreator = currentUser?.id === offer.designerID;
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const { deleteOffer, updateOffer } = useOfferService();
  const { fetchOffers } = useOffers();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const createdAt = formatVietnamDate(offer.createdAt);
  const deadline = formatVietnamDate(offer.deadlineEndAt);
  const [openEditImageDialog, setOpenEditImageDialog] = useState(false);
  const handleDeleteOffer = async () => {
    try {
      const response = await deleteOffer({ offerID: offer.offerID });
      if (response?.isSuccess === true) {
        toast.success("Xóa đề xuất thành công");
        onDelete?.(offer.offerID);
        await fetchOffers(offer.projectPostID);
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi xóa đề xuất";
      toast.error(errorMessage);
    }
  };

  const handleEdit = () => {
    setSelectedOffer(offer);
    setOpenEditDialog(true);
  };

  const handleSave = async (values: {
    offerID: string;
    note: string;
    initPrice: number;
    deadlineEndAt: string;
  }) => {
    const res = await updateOffer(values);
    if (res?.isSuccess === true) {
      toast.success("Cập nhật thành công");
      console.log(onUpdate?.(offer.offerID), "???");
      onUpdate?.(offer.offerID);
      await fetchOffers(offer.projectPostID);
      setOpenEditDialog(false);
    } else {
      // toast.error("Cập nhật thất bại");
    }
  };

  const handleEditImage = () => {
    setOpenEditImageDialog(true);
  };

  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-accent/5 dark:hover:bg-accent/10">
      {/* Avatar + name + status */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="relative group flex text-center justify-center">
            <div className="flex items-center justify-center">
              <Avatar
                src={offer.avatar || "/unknown-user.png"}
                alt={offer.fullName}
                size="sm"
                className="cursor-pointer"
              />
              <div className="text-sm font-medium ml-2">{offer.fullName}</div>
            </div>
            <ProfilePopup
              designerID={offer.designerID}
              fullName={offer.fullName}
              avatar={offer.avatar}
              location={offer.location}
              appreciations={offer.appreciations}
              followers={offer.followers}
              views={offer.views}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {offer.offerStatus === "Pending" && (
            <div className="relative group w-fit h-fit pl-2">
              <div
                className="w-3 h-3 bg-yellow-400 dark:bg-yellow-500 rounded-full transition-opacity duration-300 group-hover:opacity-0 animate-blink2"
                title="Chờ phản hồi"
              />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-right">
                <Badge
                  variant="warning"
                  className="text-yellow-800 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-500/20 whitespace-nowrap"
                >
                  Chờ phản hồi
                </Badge>
              </div>
            </div>
          )}

          {offer.offerStatus === "Dealing" && (
            <div className="relative group w-fit h-fit pl-2">
              <div
                className="w-3 h-3 bg-blue-400 dark:bg-blue-500 rounded-full transition-opacity duration-300 group-hover:opacity-0 animate-blink2"
                title="Đang thương lượng"
              />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-right">
                <Badge
                  variant="default"
                  className="text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/20 whitespace-nowrap"
                >
                  Đang thương lượng
                </Badge>
              </div>
            </div>
          )}

          {offer.offerStatus === "Accepted" && (
            <div className="relative group w-fit h-fit pl-2">
              <div
                className="w-3 h-3 bg-green-400 dark:bg-green-500 rounded-full transition-opacity duration-300 group-hover:opacity-0 animate-blink2"
                title="Đã chấp nhận"
              />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-2 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 origin-right">
                <Badge
                  variant="success"
                  className="text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-500/20 whitespace-nowrap"
                >
                  Đã chấp nhận
                </Badge>
              </div>
            </div>
          )}

          {isCreator && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-md hover:bg-accent/50 dark:hover:bg-accent/20 cursor-pointer transition-colors">
                  <Ellipsis className="h-4 w-4 text-muted-foreground dark:text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-45 p-1 z-50 rounded-md shadow-md border bg-popover text-popover-foreground border-border dark:bg-zinc-900 dark:text-white dark:border-zinc-700">
                {/* Chỉnh sửa */}
                <DropdownMenuItem
                  onSelect={handleEdit}
                  className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-accent/40 hover:text-primary dark:hover:bg-accent/20 dark:hover:text-primary transition-colors"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Chỉnh sửa đề xuất</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={handleEditImage}
                  className="flex items-center px-3 py-2 rounded-md text-sm hover:bg-accent/40 hover:text-primary dark:hover:bg-accent/20 dark:hover:text-primary transition-colors"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Chỉnh sửa ảnh</span>
                </DropdownMenuItem>

                {/* Xóa đề xuất */}
                <DropdownMenuItem
                  onSelect={handleDeleteOffer}
                  className="flex items-center px-3 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20 transition-colors"
                >
                  <Trash2 className="mr-2 h-4 w-4 text-destructive dark:text-destructive" />
                  <span>Xóa đề xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Giá + deadline */}
      <div className="text-sm font-medium mb-2 space-y-1">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Giá đề xuất:</span>
          <span className="text-primary font-semibold">
            {formatCurrency(offer.initPrice)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Ngày hoàn thành:</span>
          <span className="text-primary font-semibold">{deadline}</span>
        </div>
      </div>

      {/* Ghi chú */}
      <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {offer.note}
      </div>

      {/* Ảnh minh họa */}
      {offer.sampleImage && (
        <div className="mb-3">
          <SingleImageGallery
            imageUrl={offer.sampleImage}
            title=""
            className="!mb-0"
            alt={`Ảnh đề xuất của ${offer.fullName}`}
          />
        </div>
      )}

      {/* Ngày tạo */}
      <div className="text-xs text-muted-foreground italic">
        Đã đăng {createdAt}
      </div>

      <OfferEditorDialog
        open={openEditDialog}
        onOpenChange={setOpenEditDialog}
        initialData={selectedOffer}
        onSave={handleSave}
        postFinishDate={postFinishDate}
      />

      <OfferEditImage
        open={openEditImageDialog}
        onOpenChange={setOpenEditImageDialog}
        offerId={offer.offerID}
        onSuccess={async () => {
          await fetchOffers(offer.projectPostID);
          onUpdate?.(offer.offerID);
        }}
      />
    </div>
  );
}
