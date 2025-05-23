import { useCallback } from "react";
import useApiService from "../hooks/useApi";
import { API_ROUTES, HTTP_METHOD } from "@/constants";

const PostService = () => {
  const { callApi } = useApiService();
  const createPost = useCallback(
    async (data: any) => {
      const formData = new FormData();
      formData.append("Title", data.Title);
      formData.append("Description", data.Description);
      formData.append("ItemValue", String(data.ItemValue));
      formData.append("SuggestedPrice", String(data.SuggestedPrice));
      formData.append("AttachmentFile", data.AttachmentFile);
      formData.append("AttachmentFiles", data.AttachmentFiles);
      try {
        const res = await callApi(
          HTTP_METHOD.POST,
          API_ROUTES.CREATE_POST,
          formData
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const getMyPosts = useCallback(async () => {
    try {
      const res = await callApi(HTTP_METHOD.GET, API_ROUTES.GET_MY_POSTS);
      return res;
    } catch (err: any) {
      console.error(err?.response?.data);
    }
  }, [callApi]);

  const getPosts = useCallback(
    async (params: any) => {
      try {
        const res = await callApi(HTTP_METHOD.GET, `${API_ROUTES.GET_POSTS}`);
        let filteredPosts = [...res.responseRequestModel.responseList.items];

        // Áp dụng tìm kiếm
        if (params.search) {
          const searchLower = params.search.toLowerCase();
          filteredPosts = filteredPosts.filter(
            (post) =>
              post.title.toLowerCase().includes(searchLower) ||
              post.description.toLowerCase().includes(searchLower)
          );
        }

        // Áp dụng lọc theo trạng thái
        if (params.status !== undefined) {
          filteredPosts = filteredPosts.filter(
            (post) => post.postStatus === params.status
          );
        }

        // Áp dụng sắp xếp
        if (params.sortBy) {
          filteredPosts.sort((a: any, b: any) => {
            const aValue = a[params.sortBy!];
            const bValue = b[params.sortBy!];

            if (typeof aValue === "string" && typeof bValue === "string") {
              return params.sortOrder === "asc"
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
            }

            return params.sortOrder === "asc"
              ? aValue - bValue
              : bValue - aValue;
          });
        }

        // Áp dụng phân trang
        const totalCount = filteredPosts.length;
        const totalPages = Math.ceil(totalCount / params.pageSize);
        const startIndex = (params.page - 1) * params.pageSize;
        const endIndex = startIndex + params.pageSize;
        const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

        return {
          data: paginatedPosts,
          totalCount,
          pageSize: params.pageSize,
          currentPage: params.page,
          totalPages,
        };
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const getPostDetail = useCallback(
    async (id: string) => {
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          `${API_ROUTES.GET_POST_DETAIL}=${id}`
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const deletePost = useCallback(
    async (id: string) => {
      try {
        const res = await callApi(
          HTTP_METHOD.DELETE,
          `${API_ROUTES.DELETE_POST}`,
          { projectPostID: id }
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );
  return { createPost, getPosts, getMyPosts, deletePost, getPostDetail };
};

export default PostService;
