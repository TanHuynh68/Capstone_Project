"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostDetailTemplate from "@/components/templates/post-detail/PostDetailTemplate";
import PostService from "@/services/PostService";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getPostDetail } = PostService();
  
  useEffect(() => {
    getPost();
  }, [id]);

  const getPost = async () => {
    if (!id) {
      setError("ID bài đăng không hợp lệ");
      setLoading(false);
      return;
    }
    setLoading(true);
    const response = await getPostDetail(id);
    if (response) {
      setPost(response.responseRequestModel);
    } else {
      setError("Không thể tải thông tin bài đăng");
    }
    setLoading(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin bài đăng...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error || "Không tìm thấy bài đăng"}
          </p>
          <button
            onClick={handleBack}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return <PostDetailTemplate post={post} onBack={handleBack} />;
}
