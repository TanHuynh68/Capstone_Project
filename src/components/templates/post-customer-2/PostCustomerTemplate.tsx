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
import { ChevronDown, ChevronUp } from "lucide-react";

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
  isFirstPost?: boolean;
  fetchPosts: () => Promise<void>;
  totalPosts: number;
}

export default function PostCustomerTemplate({
  post,
  onBack,
  onViewOffers,
  isSelected = false,
  postNumber,
  onDataChange,
  isFirstPost = false,
  fetchPosts,
  totalPosts,
}: PostCustomerTemplateProps) {
  const { deletePost } = PostService();
  const { fetchOffers, resetOffers } = useOffers();
  const [showOfferWarningModal, setShowOfferWarningModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(isFirstPost);
  const [isAnimating, setIsAnimating] = useState(false);
  const [areOffersVisible, setAreOffersVisible] = useState(false);

  // Reset offers when post changes
  useEffect(() => {
    resetOffers();
  }, [post.projectPostID, resetOffers]);

  // Log when component renders
  useEffect(() => {
    console.log(`Post ${postNumber}:`, {
      isFirstPost,
      isExpanded,
      postId: post.projectPostID,
    });
  }, [isFirstPost, isExpanded, postNumber, post.projectPostID]);

  // Reset expanded state when isFirstPost changes
  useEffect(() => {
    console.log(`Post ${postNumber} - isFirstPost changed:`, {
      isFirstPost,
      currentIsExpanded: isExpanded,
    });
    setIsExpanded(isFirstPost);
  }, [isFirstPost]);

  // Fetch offers when component mounts and when post changes
  useEffect(() => {
    if (isExpanded) {
      fetchOffers(post.projectPostID);
    }
  }, [post.projectPostID, fetchOffers, isExpanded]);

  // Handle offer visibility changes
  useEffect(() => {
    const handleOfferVisibilityChange = (e: CustomEvent) => {
      if (e.detail.postId === post.projectPostID) {
        setAreOffersVisible(e.detail.isVisible);
        if (e.detail.isVisible) {
          // Reset and fetch fresh offers when they become visible
          resetOffers();
          fetchOffers(post.projectPostID);
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
  }, [post.projectPostID, fetchOffers, resetOffers]);

  // Effect to handle collapsing when other posts are expanded
  useEffect(() => {
    const handleOtherPostExpand = (e: CustomEvent) => {
      const { postId, isExpanding } = e.detail;
      // If another post is being expanded and this post is actually expanded
      if (postId !== post.projectPostID && isExpanded && isExpanding) {
        // Immediately hide offers
        window.dispatchEvent(
          new CustomEvent("offer-visibility-change", {
            detail: { postId: post.projectPostID, isVisible: false },
          })
        );

        setIsAnimating(true);
        setIsExpanded(false);
        setTimeout(() => {
          setIsAnimating(false);
        }, 800);
      }
    };

    // Listen for post expand events
    window.addEventListener(
      "post-expand",
      handleOtherPostExpand as EventListener
    );

    return () => {
      window.removeEventListener(
        "post-expand",
        handleOtherPostExpand as EventListener
      );
    };
  }, [isExpanded, post.projectPostID]);

  const handleToggleExpand = () => {
    if (isAnimating) return; // Prevent multiple clicks during animation

    setIsAnimating(true);
    const newExpandedState = !isExpanded;

    // If we're expanding this post, notify others to collapse
    if (newExpandedState) {
      // First hide all offers immediately
      window.dispatchEvent(
        new CustomEvent("offer-visibility-change", {
          detail: { postId: post.projectPostID, isVisible: false },
        })
      );

      // Then notify other posts to collapse, but only if they are actually expanded
      window.dispatchEvent(
        new CustomEvent("post-expand", {
          detail: {
            postId: post.projectPostID,
            // Add a flag to indicate this is an expand event
            isExpanding: true,
          },
        })
      );

      // Finally reset and fetch fresh offers for this post
      resetOffers();
      fetchOffers(post.projectPostID);
    } else {
      // When collapsing, only hide offers if they were actually visible
      if (areOffersVisible && onViewOffers) {
        // Simulate clicking the view offers button to hide offers
        onViewOffers();
      }

      // Then dispatch collapse event after a small delay to allow offer animation to start
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("post-collapse", {
            detail: {
              postId: post.projectPostID,
              // Add a flag to indicate this is a collapse event
              isCollapsing: true,
            },
          })
        );
        // Only notify that offers should be hidden if they were visible
        if (areOffersVisible) {
          window.dispatchEvent(
            new CustomEvent("offer-visibility-change", {
              detail: { postId: post.projectPostID, isVisible: false },
            })
          );
        }
      }, 100);
    }

    setIsExpanded(newExpandedState);

    // Reset animating state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);
  };

  // const hasUnresolvedOffers = offers.some(
  //   (offer) => offer.offerStatus !== 1 && offer.offerStatus !== 3 // 2: ACCEPTED, 3: REJECTED
  // );

  // const handleDeleteClick = () => {
  //   if (hasUnresolvedOffers) {
  //     setShowOfferWarningModal(true);
  //     return;
  //   }
  //   handleDeletePost(post);
  // };

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
    <>
      <style>
        {`
          .post-container {
            transition: none;
            transform-origin: top;
            will-change: transform, opacity, filter;
            opacity: 0;
            transform: translateY(-20px);
            animation: fadeInDown 0.8s ease-out forwards;
          }

          @keyframes fadeInDown {
            0% {
              opacity: 0;
              transform: translateY(-20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .post-content {
            transition: none;
            transform-origin: top;
            will-change: transform, opacity, filter;
            position: relative;
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }

          @keyframes expandPost {
            0% {
              opacity: 0;
              transform: translateY(-20px) scale(0.98);
              filter: blur(4px);
            }
            60% {
              opacity: 1;
              transform: translateY(5px) scale(1.01);
              filter: blur(0);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes collapsePost {
            0% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
            40% {
              opacity: 1;
              transform: translateY(5px) scale(1.01);
              filter: blur(0);
            }
            100% {
              opacity: 0;
              transform: translateY(-20px) scale(0.98);
              filter: blur(4px);
            }
          }

          .animate-expand {
            animation: expandPost 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }

          .animate-collapse {
            animation: collapsePost 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            pointer-events: none;
          }

          .post-preview {
            transition: none;
            transform-origin: top;
            will-change: transform, opacity, filter;
            position: relative;
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }

          @keyframes expandPreview {
            0% {
              opacity: 0;
              transform: translateY(20px) scale(0.98);
              filter: blur(4px);
            }
            60% {
              opacity: 1;
              transform: translateY(-5px) scale(1.01);
              filter: blur(0);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          .animate-expand-preview {
            animation: expandPreview 2.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}
      </style>
      <div className="space-y-4 post-container">
        {postNumber === 1 && (
          <h2 className="text-xl font-bold mb-6">
            Bài đăng của tôi ({totalPosts})
          </h2>
        )}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium">
              Bài đăng #{postNumber}
            </div>
            <div className="h-[1px] flex-1 bg-gray-200"></div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleExpand}
            className="flex items-center gap-1.5 ml-4 hover:bg-primary/10 hover:text-primary transition-colors"
            disabled={isAnimating}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span className="text-sm font-medium">Thu gọn</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span className="text-sm font-medium">Mở rộng</span>
              </>
            )}
          </Button>
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
        <div
          className={`post-content ${!isExpanded ? "hidden" : ""} ${
            isAnimating
              ? isExpanded
                ? "animate-expand"
                : "animate-collapse"
              : ""
          }`}
        >
          <PostCustomerHeader
            post={post}
            onBack={onBack}
            onViewOffers={onViewOffers}
            isSelected={isSelected}
            onDelete={handleDeletePost}
            onRefresh={() => onDataChange?.(null)}
            hasUnresolvedOffers={false}
            fetchPosts={fetchPosts}
          />
          <PostCustomerContent post={post} />
        </div>

        {/* Show a preview when collapsed */}
        {!isExpanded && (
          <div
            className={`post-preview p-4 border rounded-lg bg-card text-card-foreground ${
              isAnimating ? "animate-expand-preview" : ""
            }`}
          >
            <div className="space-y-2">
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Tiêu đề: </span>
                <h3 className="font-medium break-words overflow-hidden whitespace-normal leading-relaxed max-w-full inline">
                  {post.title}
                </h3>
              </div>
              <div>
                <span className="text-sm font-semibold text-muted-foreground">Mô tả: </span>
                <p className="text-sm text-muted-foreground line-clamp-2 break-words overflow-hidden whitespace-normal inline">
                  {post.description}
                </p>
              </div>
            </div>
          </div>
        )}

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
                  Bài đăng này còn có đề xuất chưa được giải quyết. Vui lòng xử
                  lý các đề xuất trước khi xóa bài đăng.
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
                      Xem đề xuất
                    </Button>
                  )}
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
