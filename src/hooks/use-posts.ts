"use client"

import { useState, useEffect, useCallback } from "react"
import PostService from "@/services/PostService"

export function usePosts() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { getMyPosts } = PostService()

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const values = {
                page: 1,
                size: 10,
            }

            const response = await getMyPosts(values)

            console.log(response, "response")

            if (response?.responseRequestModel?.responseList?.items) {
                setPosts(response.responseRequestModel.responseList.items)
            } else if (response?.data) {
                setPosts(response.data)
            }
        } catch (err) {
            setError("Không thể tải danh sách bài đăng")
            console.error("Error fetching posts:", err)
        } finally {
            setLoading(false)
        }
    }, [getMyPosts])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    const refreshPosts = useCallback(() => {
        return fetchPosts()
    }, [fetchPosts])

    return {
        posts,
        loading,
        error,
        refreshPosts,
        fetchPosts,
    }
}
