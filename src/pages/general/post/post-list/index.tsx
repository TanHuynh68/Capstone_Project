"use client";

import { useState, useEffect } from "react";
import PostManagementTemplate from "@/components/templates/post-page/PostManagementTemplate";
import PostService from "@/services/PostService";

export default function PostManagementPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { getPosts } = PostService();

  useEffect(() => {
    // Simulate API call
    const fetchPosts = async () => {
      const response = await getPosts();
      setLoading(true);
      console.log('fetchPosts: ',response )
      if (response) {
        console.log()
        setPosts(response?.responseRequestModel?.responseList?.items);
      }
      setLoading(false);
    };

    fetchPosts();
  }, []);

  return <PostManagementTemplate initialPosts={posts} isLoading={loading} />;
}
