import PostCustomerHeader from "@/components/organisms/post/post-customer-2/PostCustomerHeader";
import PostCustomerContent from "@/components/organisms/post/post-customer-2/PostCustomerContent";
import PostService from "@/services/PostService";
import { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useOffers } from "@/hooks/use-offers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ApiErrorResponse {
  isSuccess: boolean;
  message: string;
  statusCode: number;
}

interface PostCustomerTemplateProps {
  post: Post;
  onBack?: () => void;
  className?: string;
  onViewOffers?: () => void;
  isSelected?: boolean;
  postNumber: number;
  onDataChange?: (post: Post | null) => void;
}

export default function PostCustomerTemplate({
  post,
  onBack,
  onViewOffers,
  isSelected = false,
  postNumber,
  onDataChange,
}: PostCustomerTemplateProps) {
  const { deletePost } = PostService();
  const { offers, fetchOffers } = useOffers();
  const [showOfferWarningModal, setShowOfferWarningModal] = useState(false);

  // Kiểm tra offers khi component mount và khi post thay đổi
  useEffect(() => {
    fetchOffers(post.projectPostID);
  }, [post.projectPostID, fetchOffers]);

  const hasUnresolvedOffers = offers.some(
    (offer) => offer.offerStatus !== 1 && offer.offerStatus !== 3 // 2: ACCEPTED, 3: REJECTED
  );

  const handleDeleteClick = () => {
    if (hasUnresolvedOffers) {
      setShowOfferWarningModal(true);
      return;
    }
    handleDeletePost(post);
  };

  const handleDeletePost = async (postToDelete: Post) => {
    try {
      await deletePost(postToDelete.projectPostID);
      if (onDataChange) {
        onDataChange(null);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (
        axiosError.response?.data?.message?.includes(
          "còn Offer chưa giải quyết"
        )
      ) {
        setShowOfferWarningModal(true);
      }
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Bài đăng của tôi ({postNumber})</h2>
      </div>

      {/* <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-1 ${isRefreshing ? "animate-spin" : ""}`}
              />
              Làm mới
            </Button> */}
      {/* Nội dung chính */}
      <div className="lg:col-span-2 space-y-6">
        <PostCustomerHeader
          post={post}
          onBack={onBack}
          onViewOffers={onViewOffers}
          isSelected={isSelected}
          onDelete={handleDeletePost}
          onDeleteClick={handleDeleteClick}
          hasUnresolvedOffers={hasUnresolvedOffers}
        />
        <PostCustomerContent post={post} />
      </div>

      {/* Modal cảnh báo có offers chưa giải quyết */}
      <Dialog
        open={showOfferWarningModal}
        onOpenChange={setShowOfferWarningModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Không thể xóa bài đăng</DialogTitle>
            <DialogDescription className="space-y-4">
              <p>
                Bài đăng này còn có offers chưa được giải quyết. Vui lòng xử lý
                các offers trước khi xóa bài đăng.
              </p>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowOfferWarningModal(false)}
                >
                  Đóng
                </Button>
                {onViewOffers && (
                  <Button
                    onClick={() => {
                      setShowOfferWarningModal(false);
                      onViewOffers();
                    }}
                  >
                    Xem offers
                  </Button>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
