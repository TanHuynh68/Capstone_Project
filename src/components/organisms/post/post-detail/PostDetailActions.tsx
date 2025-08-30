"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, PlusCircle } from "lucide-react";
import OfferService from "@/services/OfferService";
import CreateOfferModal from "@/pages/designer/manage-offer-designer/CreateOfferModal";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import ChatService from "@/services/ChatService";
import { PATH } from "@/routes/path";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "@/utils";
import { ROLE } from "@/constants";
import { useStateValue } from "@/context/stateProvider";

interface PostDetailActionsProps {
  post: Post;
  className?: string;
  onOfferCreated?: () => void;
  onOfferCreating?: () => void;
  loading?: boolean;
  offers?: Offer[];
}

export default function PostDetailActions({
  post,
  className = "",
  onOfferCreated,
  onOfferCreating,
  loading = true,
  offers = [],
}: PostDetailActionsProps) {
  const { createOffer } = OfferService();
  const { createChatRoom } = ChatService();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const role = useSelector((state: RootState) => state.user.role);
  const currentUser = useCurrentUser();
  const { setIdRoomChat } = useStateValue();
  
  const handleSubmitOffer = useCallback(
    async (formData: FormData) => {
      // Đã bỏ kiểm tra giá khởi điểm phải lớn hơn giá trị sản phẩm
      onOfferCreating?.();
      formData.append("ProjectPostID", post.projectPostID);
      const result = await createOffer(formData);
      console.log("Offer created:", result);
      onOfferCreated?.();
    },
    [createOffer, post.projectPostID, onOfferCreated, onOfferCreating]
  );

  const createChatRoomByDesigner = async () => {
    const response = await createChatRoom(post?.accountID);
    console.log("createChatRoom: ", response);
    setIdRoomChat(response.responseRequestModel.chatRoomID);
    if (response) {
      navigate(PATH.CHAT_PAGE);
    }
  };

  return (
    <>
      {currentUser?.role === ROLE.DESIGNER && (
        <div
          className={`bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6 ${className}`}
        >
          <h2 className="text-xl font-semibold mb-4">Hành động</h2>
          <div
            className={`grid ${
              role?.trim().toLowerCase() === "designer" &&
              !loading &&
              offers.length === 0
                ? "grid-cols-2"
                : "grid-cols-1"
            } gap-3`}
          >
            {currentUser?.role === ROLE.DESIGNER && (
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
                onClick={createChatRoomByDesigner}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Liên hệ ngay
              </Button>
            )}
            {role?.trim().toLowerCase() === "designer" &&
              !loading &&
              offers.length === 0 && (
                <Button
                  onClick={() => setShowModal(true)}
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
      )}
    </>
  );
}
