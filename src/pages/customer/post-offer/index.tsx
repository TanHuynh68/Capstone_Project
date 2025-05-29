"use client";

import { useState } from "react";
import { MainLayout } from "@/components/templates/post-offer/PostOfferTemplate";
import { OfferList } from "@/components/organisms/offer/offer-list";
import { usePosts } from "@/hooks/use-posts";
import { useOffers } from "@/hooks/use-offers";
import PostCustomerTemplate from "@/components/templates/post-customer-2/PostCustomerTemplate";

export default function PostOfferPage() {
  const [selectedPostId, setSelectedPostId] = useState<string | undefined>();

  const { posts } = usePosts();
  const {
    offers,
    loading: offersLoading,
    fetchOffers,
    updateOfferStatus,
  } = useOffers();

  const handleViewOffers = (postId: string) => {
    const newPostId = selectedPostId === postId ? undefined : postId;
    setSelectedPostId(newPostId);
    fetchOffers(newPostId);
  };

  const handleAcceptOffer = (offerId: string) => {
    updateOfferStatus(offerId, 1); // 1 = accepted
    // TODO: Call API to actually accept the offer
  };

  const handleRejectOffer = (offerId: string) => {
    updateOfferStatus(offerId, 2); // 2 = rejected
    // TODO: Call API to actually reject the offer
  };

  return (
    <MainLayout
      leftColumn={
        posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post, index) => (
              <PostCustomerTemplate
                key={post.projectPostID}
                post={post}
                onViewOffers={() => handleViewOffers(post.projectPostID)}
                isSelected={selectedPostId === post.projectPostID}
                postNumber={index + 1}
                isFirstPost={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Không có bài đăng nào</p>
          </div>
        )
      }
      rightColumn={
        <OfferList
          offers={offers}
          loading={offersLoading}
          selectedPostId={selectedPostId}
          onAcceptOffer={handleAcceptOffer}
          onRejectOffer={handleRejectOffer}
          isVisible={!!selectedPostId}
        />
      }
    />
  );
}
