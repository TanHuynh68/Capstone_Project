"use client";

import { useState, useEffect } from "react";
import PostManagementTemplate from "@/components/templates/post-page/PostManagementTemplate";
import PostService from "@/services/PostService";

export default function PostManagementPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { getPosts } = PostService();

  const fetchPosts = async () => {
    const response = await getPosts();
    setLoading(true);
    console.log("fetchPosts: ", response);
    if (response) {
      console.log();
      setPosts(response?.responseRequestModel?.responseList?.items);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Simulate API call
    fetchPosts();
  }, []);

  return <PostManagementTemplate fetchPosts={fetchPosts} initialPosts={posts} isLoading={loading} />;
}
