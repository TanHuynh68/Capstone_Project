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
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Hành động</h2>

      <div className="space-y-3">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Liên hệ ngay
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="border-green-300 text-green-700 hover:bg-green-50"
          >
            <Phone className="mr-2 h-4 w-4" />
            Gọi điện
          </Button>

          <Button
            variant="outline"
            className="border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
        </div>

        <Button
          variant="outline"
          className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50"
        >
          <Star className="mr-2 h-4 w-4" />
          Đánh giá bài đăng
        </Button>

        {role?.trim().toLowerCase() === "designer" && (
          <Button
            onClick={() => setShowModal(true)}
            variant="outline"
            className="w-full border-cyan-300 text-cyan-700 hover:bg-cyan-50"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo offer
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
