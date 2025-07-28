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

      if (data.OriginalAttachmentFiles?.length) {
        data.OriginalAttachmentFiles.forEach((file: File) => {
          formData.append("OriginalAttachmentFiles", file);
        });
      }

      if (data.RequestedAttachmentFiles?.length) {
        data.RequestedAttachmentFiles.forEach((file: File) => {
          formData.append("RequestedAttachmentFiles", file);
        });
      }
      formData.append("FinishDate", new Date(data.FinishDate).toISOString());
      try {
        console.log("data: ", data);
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

  const getMyPosts = useCallback(
    async (values: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.GET,
          API_ROUTES.GET_MY_POSTS,
          values
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const getPosts = useCallback(async () => {
    try {
      const res = await callApi(HTTP_METHOD.GET, `${API_ROUTES.GET_POSTS}`);
      return res;
    } catch (err: any) {
      console.error(err?.response?.data);
    }
  }, [callApi]);

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

  const updatePost = useCallback(
    async (data: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.PUT,
          `${API_ROUTES.UPDATE_POST}`,
          data
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const disablePost = useCallback(
    async (data: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.PUT,
          `${API_ROUTES.DISABLE_POST}`,
          data
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );

  const enablePost = useCallback(
    async (data: any) => {
      try {
        const res = await callApi(
          HTTP_METHOD.PUT,
          `${API_ROUTES.ENABLE_POST}`,
          data
        );
        return res;
      } catch (err: any) {
        console.error(err?.response?.data);
      }
    },
    [callApi]
  );
const staffGetAllPosts = useCallback(async () => {
    try {
      const res = await callApi(HTTP_METHOD.GET, `${API_ROUTES.STAFF_GET_POSTS_ALL}`);
      return res;
    } catch (err: any) {
      console.error(err?.response?.data);
    }
  }, [callApi]);
  return {
    enablePost,
    createPost,
    getPosts,
    getMyPosts,
    deletePost,
    getPostDetail,
    updatePost,
    disablePost,
    staffGetAllPosts
  };
};

export default PostService;
