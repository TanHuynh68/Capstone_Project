"use client";

import { useState } from "react";
import { MainLayout } from "@/components/templates/post-offer/PostOfferTemplate";
import { PostFeed } from "@/components/organisms/post/post-feed";
import { OfferList } from "@/components/organisms/offer/offer-list";
import { usePosts } from "@/hooks/use-posts";
import { useOffers } from "@/hooks/use-offers";

export default function PostOfferPage() {
  const [selectedPostId, setSelectedPostId] = useState<string | undefined>();

  const { posts, loading: postsLoading, refreshPosts } = usePosts();
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
        <PostFeed
          posts={posts}
          loading={postsLoading}
          onViewOffers={handleViewOffers}
          onRefresh={refreshPosts}
        />
      }
      rightColumn={
        <OfferList
          offers={offers}
          loading={offersLoading}
          selectedPostId={selectedPostId}
          onAcceptOffer={handleAcceptOffer}
          onRejectOffer={handleRejectOffer}
        />
      }
    />
  );
}
