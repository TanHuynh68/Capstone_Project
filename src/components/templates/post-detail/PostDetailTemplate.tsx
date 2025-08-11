"use client";

import PostDetailHeader from "@/components/organisms/post/post-detail/PostDetailHeader";
import PostDetailContent from "@/components/organisms/post/post-detail/PostDetailContent";
import PostDetailActions from "@/components/organisms/post/post-detail/PostDetailActions";
import { OfferInAllPost } from "@/components/organisms/offer/offer-in-all-post";
import { useOffersAll } from "@/hooks/use-offers-all";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Link } from "react-router-dom";
import { useCallback, useState } from "react";

interface PostDetailTemplateProps {
  post: Post;
  onBack?: () => void;
  className?: string;
  onOfferCreated?: () => void;
}

export default function PostDetailTemplate({
  post,
  onBack,
  className = "",
  onOfferCreated,
}: PostDetailTemplateProps) {
  const { offers, loading, refetch } = useOffersAll(post.projectPostID);
  const role = useSelector((state: RootState) => state.user.role);
  const [isCreatingOffer, setIsCreatingOffer] = useState(false);

  const handleOfferCreated = useCallback(() => {
    setIsCreatingOffer(true);
    refetch();
    onOfferCreated?.();
    // Reset loading state after a delay
    setTimeout(() => setIsCreatingOffer(false), 2000);
  }, [refetch, onOfferCreated]);

  const isAuthorizedRole = ["Customer", "Designer", "Staff", "Admin"].includes(
    role
  );

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Nội dung chính */}
          <div className="lg:col-span-2 space-y-6">
            <PostDetailHeader post={post} onBack={onBack} />
            <PostDetailContent post={post} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {!loading && (
                <PostDetailActions
                  post={post}
                  onOfferCreated={handleOfferCreated}
                  onOfferCreating={() => setIsCreatingOffer(true)}
                  loading={loading}
                  offers={offers}
                />
              )}
              <div className="mt-4">
                {isAuthorizedRole ? (
                  <OfferInAllPost
                    offers={offers}
                    loading={loading}
                    selectedPostId={post.projectPostID}
                    onDeleteOffer={() => refetch()}
                    onUpdateOffer={() => refetch()}
                    postFinishDate={post.finishDate}
                    isCreatingOffer={isCreatingOffer}
                  />
                ) : (
                  <div className="bg-card text-card-foreground p-4 rounded-lg shadow border border-border">
                    <p className="text-muted-foreground mb-4 text-center">
                      Vui lòng đăng nhập để xem các đề xuất
                    </p>
                    <Link
                      to="/auth/login"
                      className="block w-full text-center bg-primary text-primary-foreground py-2 px-4 rounded hover:bg-primary/90 transition-colors"
                    >
                      Đăng nhập
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
