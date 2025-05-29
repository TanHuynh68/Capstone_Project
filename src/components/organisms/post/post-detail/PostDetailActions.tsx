import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Mail, Star, PlusCircle } from "lucide-react";
import OfferService from "@/services/OfferService";
import CreateOfferModal from "@/pages/designer/manage-offer-designer/CreateOfferModal";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface PostDetailActionsProps {
  post: Post;
  className?: string;
  onOfferCreated?: () => void;
}

export default function PostDetailActions({
  post,
  className = "",
  onOfferCreated,
}: PostDetailActionsProps) {
  const { createOffer } = OfferService();
  const [showModal, setShowModal] = useState(false);
  const role = useSelector((state: RootState) => state.user.role);
  const handleSubmitOffer = useCallback(
    async (formData: FormData) => {
      const initPrice = Number(formData.get("InitPrice"));
      if (initPrice <= post.itemValue) {
        alert("Giá khởi điểm phải lớn hơn giá trị sản phẩm!");
        return;
      }

      formData.append("ProjectPostID", post.projectPostID);
      const result = await createOffer(formData);
      console.log("Offer created:", result);
      onOfferCreated?.();
    },
    [createOffer, post.projectPostID, post.itemValue, onOfferCreated]
  );

  return (
    <div
      className={`bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6 ${className}`}
    >
      <h2 className="text-xl font-semibold mb-4">Hành động</h2>

      <div className="grid grid-cols-2 gap-3">
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Liên hệ ngay
        </Button>

        {role?.trim().toLowerCase() === "designer" && (
          <Button
            onClick={() => setShowModal(true)}
            // variant="outline"
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo đề xuất
          </Button>
        )}
      </div>

      {/* Modal */}
      <CreateOfferModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitOffer}
        post={post}
      />
    </div>
  );
}
