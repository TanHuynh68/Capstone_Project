"use client";

import { useState } from "react";
import { MainLayout } from "@/components/templates/post-offer/PostOfferTemplate";
import { OfferList } from "@/components/organisms/offer/offer-list";
import { usePosts } from "@/hooks/use-posts";
import { useOffers } from "@/hooks/use-offers";
import PostCustomerTemplate from "@/components/templates/post-customer-2/PostCustomerTemplate";

export default function PostOfferPage() {
  const [selectedPostId, setSelectedPostId] = useState<string | undefined>();

  const { posts, fetchPosts } = usePosts();
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

  const handlePostDataChange = async (post: Post | null) => {
    // If post is null, it means the post was deleted
    if (post === null) {
      // Clear selected post if it was deleted
      setSelectedPostId(undefined);
      // Refresh the posts list
      await fetchPosts();
    }
  };

  const selectedPost = posts.find(
    (post) => post.projectPostID === selectedPostId
  );

  return (
    <MainLayout
      leftColumn={
        posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post, index) => (
              <PostCustomerTemplate
                fetchPosts={fetchPosts}
                key={post.projectPostID}
                post={post}
                onViewOffers={() => handleViewOffers(post.projectPostID)}
                isSelected={selectedPostId === post.projectPostID}
                postNumber={index + 1}
                totalPosts={posts.length}
                isFirstPost={index === 0}
                onDataChange={handlePostDataChange}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">
                <h2 className="text-xl font-bold">Bài đăng của tôi</h2>
              </div>
            </div>
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">Không có bài đăng nào</p>
            </div>
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
          postFinishDate={selectedPost?.finishDate || ""}
        />
      }
    />
  );
}
