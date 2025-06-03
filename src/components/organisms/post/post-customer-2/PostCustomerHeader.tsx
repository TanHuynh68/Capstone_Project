"use client";

import { Button } from "@/components/ui/button";
import {  Eye, Trash2, Pencil } from "lucide-react";
import DateDisplay from "@/components/atoms/post/post-detail/DateDisplay";
import UserInfo from "@/components/molecules/post/post-detail/UserInfo";
import StatusBadge from "@/components/atoms/post/post-list/StatusBadge";
import { Breadcrumb } from "../../custom/breadcrumb/Breadcrumb";
import { useState, useCallback, useEffect } from "react";
import { useDeleteConfirmation } from "@/hooks/useDeleteConfirmation";
import DeleteConfirmationModal from "@/components/molecules/delete/DeleteConfirmationModal";
import { toast } from "sonner";
import { DialogUpdatePost } from "@/components/molecules/post/customer-update-post/DialogUploadPost";
import { Switch } from "@/components/ui/switch";
import PostService from "@/services/PostService";

// Global state to track offer visibility for each post
const offerVisibilityMap = new Map<string, boolean>();

interface PostCustomerHeaderProps {
  post: Post;
  onBack?: () => void;
  className?: string;
  onViewOffers?: () => void;
  isSelected?: boolean;
  onDelete?: (post: Post) => Promise<void>;
  onRefresh?: () => void;
  hasUnresolvedOffers?: boolean;
  fetchPosts: any;
}

export default function PostCustomerHeader({
  post,
  className = "",
  onViewOffers,
  isSelected = false,
  onDelete,
  onRefresh,
  hasUnresolvedOffers = false,
  fetchPosts,
}: PostCustomerHeaderProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { enablePost, disablePost } = PostService();
  const [localIsSelected, setLocalIsSelected] = useState(() => {
    // Initialize from global state or prop, but invert the logic
    // isSelected = true means offers are visible, so button should show "Ẩn offers"
    return offerVisibilityMap.has(post.projectPostID)
      ? offerVisibilityMap.get(post.projectPostID) ?? false
      : isSelected;
  });

  // Update global state when local state changes
  useEffect(() => {
    // Store the actual visibility state (true = offers visible)
    offerVisibilityMap.set(post.projectPostID, localIsSelected);
  }, [localIsSelected, post.projectPostID]);

  // Update local state when prop changes (only if not already set in global state)
  useEffect(() => {
    if (!offerVisibilityMap.has(post.projectPostID)) {
      setLocalIsSelected(isSelected);
    }
  }, [isSelected, post.projectPostID]);

  // Listen for offer visibility changes from any source
  useEffect(() => {
    const handleOfferVisibilityChange = (e: CustomEvent) => {
      if (e.detail.postId === post.projectPostID) {
        // Only update if the change didn't come from this button
        // This prevents double updates when clicking the button
        if (e.detail.source !== "button") {
          setLocalIsSelected(e.detail.isVisible);
          offerVisibilityMap.set(post.projectPostID, e.detail.isVisible);
        }
      }
    };

    window.addEventListener(
      "offer-visibility-change",
      handleOfferVisibilityChange as EventListener
    );
    return () => {
      window.removeEventListener(
        "offer-visibility-change",
        handleOfferVisibilityChange as EventListener
      );
    };
  }, [post.projectPostID]);

  const {
    isOpen: isDeleteModalOpen,
    status: deleteStatus,
    errorMessage: deleteErrorMessage,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
  } = useDeleteConfirmation<Post>({
    onDelete: async (postToDelete) => {
      try {
        if (onDelete) {
          await onDelete(postToDelete);
          // Show success toast
          toast.success("Xóa bài đăng thành công");
          // Refresh posts if refresh function is provided
          if (onRefresh) {
            onRefresh();
          }
        } else {
          throw new Error("Delete function not implemented");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error("Có lỗi xảy ra khi xóa bài đăng");
        throw error;
      }
    },
    onSuccess: () => {
      // Close the modal after successful deletion
      closeDeleteModal();
    },
  });

  const handleViewOffers = useCallback(() => {
    if (onViewOffers && !isTransitioning) {
      setIsTransitioning(true);

      // Determine new state based on current button state
      const willShowOffers = !localIsSelected;

      // Update button state immediately
      setLocalIsSelected(willShowOffers);
      offerVisibilityMap.set(post.projectPostID, willShowOffers);

      if (willShowOffers) {
        // When showing offers:
        // 1. Update button to "Ẩn offers" immediately
        // 2. Show offers
        onViewOffers();
        setTimeout(() => {
          setIsTransitioning(false);
        }, 300);
      } else {
        // When hiding offers:
        // 1. Update button to "Xem offers" immediately
        // 2. Hide offers with animation
        setTimeout(() => {
          onViewOffers();
          setTimeout(() => {
            setIsTransitioning(false);
          }, 100);
        }, 400);
      }

      // Notify about visibility change after state update
      window.dispatchEvent(
        new CustomEvent("offer-visibility-change", {
          detail: {
            postId: post.projectPostID,
            isVisible: willShowOffers,
            source: "button", // Add source to identify button clicks
          },
        })
      );
    }
  }, [onViewOffers, localIsSelected, isTransitioning, post.projectPostID]);

  const items = [
    { href: "/", title: "Trang chủ" },
    { href: "/post", title: "Bài đăng" },
    { href: "", title: "Bài đăng chi tiết" },
  ];
  const handleUpdateActive = async (value: boolean) => {
    console.log("value; ", value);
    if (value === true) {
      const res = await disablePost({ projectPostID: post?.projectPostID });
      console.log("res: ", res);
    } else if (value === false) {
      await enablePost({ projectPostID: post?.projectPostID });
    }
  };

  return (
    <div
      className={`bg-card text-card-foreground rounded-lg shadow-sm border p-6 ${className}`}
    >
      {/* Navigation và Actions */}
      <div className="flex items-center justify-between mb-6">
        <Breadcrumb items={items} />
        <div className="flex items-center gap-2">
          {onViewOffers && (
            <Button
              variant={localIsSelected ? "default" : "outline"}
              onClick={handleViewOffers}
              disabled={isTransitioning}
              className={`flex items-center gap-2 transition-all duration-300 ${
                isTransitioning ? "opacity-50" : ""
              }`}
            >
              <Eye
                className={`h-4 w-4 transition-transform duration-300 ${
                  localIsSelected ? "rotate-180" : ""
                }`}
              />
              {localIsSelected ? "Ẩn đề xuất" : "Xem đề xuất"}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => openDeleteModal(post)}
            className={`text-destructive hover:text-destructive/90 ${
              hasUnresolvedOffers ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={hasUnresolvedOffers}
            title={
              hasUnresolvedOffers
                ? "Không thể xóa bài đăng khi còn offers chưa giải quyết"
                : "Xóa bài đăng"
            }
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <div className="flex items-center space-x-2">
              <Switch
                onClick={() => handleUpdateActive(post?.isActive)}
                defaultChecked={post?.isActive === true ? true : false}
                id="airplane-mode"
              />
            </div>
          </Button>
          <DialogUpdatePost
            fetchPosts={fetchPosts}
            projectPostId={post.projectPostID}
            children={
              <Button variant="ghost" size="icon">
                <Pencil />
              </Button>
            }
            data={{
              Title: post.title,
              Description: post.description,
              FinishDate: new Date(post.finishDate),
              ItemValue: post.itemValue,
              SuggestedPrice: post.suggestedPrice,
            }}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        status={deleteStatus}
        errorMessage={deleteErrorMessage}
        title="Xóa bài đăng"
        description="Bạn có chắc chắn muốn xóa bài đăng này? Hành động này không thể hoàn tác."
      />

      {/* Thông tin chính */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {post.title}
            </h1>
            <StatusBadge status={post.postStatus} />
          </div>
        </div>

        {/* Thông tin người đăng */}
        <UserInfo
          fullName={post.fullName}
          avatar={post.avatar}
          accountID={post.accountID}
        />

        {/* Thông tin thời gian */}
        <div className="flex flex-wrap gap-6">
          <DateDisplay date={post.createdAt} label="Ngày tạo" icon="calendar" />
          <DateDisplay
            date={post.finishDate}
            label="Ngày hoàn thành:"
            icon="clock"
          />
        </div>
      </div>
    </div>
  );
}
