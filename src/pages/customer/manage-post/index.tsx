// app/posts/page.tsx
"use client";

import { useEffect, useState } from "react";
import { PostManagementTemplate } from "@/components/templates/post-of-customer/PostManagementTemplate";
import PostService from "@/services/PostService";

export default function CustomerManagePost() {
  const { getMyPosts} = PostService();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCustomerPost();
  }, []);

  const getCustomerPost = async () => {
    setIsLoading(true);
    const response = await getMyPosts();
    if (response) {
      console.log(
        "getCustomerPost: ",
        response.responseRequestModel.responseList.items
      );
      setPosts(response.responseRequestModel.responseList.items);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-10">
      {/* Modal xác nhận xóa */}
      <PostManagementTemplate initialPosts={posts} isLoading={isLoading} />
    </div>
  );
}
