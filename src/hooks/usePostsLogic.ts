import PostService from "@/services/PostService"
import { useState, useCallback, useEffect, useMemo } from "react"
import { toast } from "sonner"

export const usePostsLogic = () => {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
    const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
    const [actionType, setActionType] = useState<boolean>(true)
    const [detailLoading, setDetailLoading] = useState(false)
    const { staffGetAllPosts, enablePost, disablePost } = PostService()

    const [filters, setFilters] = useState<PostsTableFilters>({
        searchTerm: "",
        isActive: "all",
        sortBy: "createdAt",
        sortOrder: "desc",
        page: 1,
    })

    const fetchPosts = useCallback(async () => {
        setLoading(true)
        try {
            const response = await staffGetAllPosts()
            if (response) {
                setPosts(response.responseRequestModel.responseList.items || [])
                setTotalPages(response.responseRequestModel.responseList.totalPages||1)
            }
        } catch (error) {
            console.error("Fetch posts error:", error)
            //   toast.error("Lấy danh sách bài đăng thất bại")
        } finally {
            setLoading(false)
        }
    }, [filters])

    const handleViewDetail = useCallback((post: Post) => {
        setDetailLoading(true)
        setSelectedPost(post)
        setIsDetailDialogOpen(true)
        setDetailLoading(false)
    }, [])

    const handleToggleStatus = useCallback((post: Post) => {
        setSelectedPost(post)
        // Nếu postStatus === 1 thì sẽ disable, ngược lại sẽ enable
        setActionType(post.postStatus === 1 ? true : false)
        setIsActionDialogOpen(true)
    }, [])

    const handleActionSubmit = useCallback(
        async (data: PostActionData) => {
            try {
                console.log("Action data:", data)

                if (actionType === true) {
                    const response = await disablePost(data)
                    if (response.isSuccess) {
                        toast.success(`Vô hiệu hóa bài đăng thành công`)
                        setIsActionDialogOpen(false)
                        setSelectedPost(null)
                        fetchPosts()
                        return true
                    }
                } else if (actionType === false) {
                    const response = await enablePost(data)
                    if (response.isSuccess) {
                        toast.success(`Kích hoạt bài đăng thành công`)
                        setIsActionDialogOpen(false)
                        setSelectedPost(null)
                        fetchPosts()
                        return true
                    }
                }
                return false
            } catch (error) {
                console.error("Action error:", error)
                toast.error(`${actionType === true ? "Kích hoạt" : "Vô hiệu hóa"} bài đăng thất bại`)
                return false
            }
        },
        [actionType, fetchPosts, disablePost, enablePost],
    )

    const handleSearch = useCallback((searchTerm: string) => {
        setFilters((prev: any) => ({ ...prev, searchTerm, page: 1 }))
    }, [])

    const handleFilterChange = useCallback((newFilters: Partial<PostsTableFilters>) => {
        setFilters((prev: any) => ({ ...prev, ...newFilters, page: 1 }))
    }, [])

    const handlePageChange = useCallback((page: number) => {
        setFilters((prev: any) => ({ ...prev, page }))
    }, [])

    const handleCloseDetailDialog = useCallback(() => {
        setIsDetailDialogOpen(false)
        setSelectedPost(null)
    }, [])

    const handleCloseActionDialog = useCallback(() => {
        setIsActionDialogOpen(false)
        setSelectedPost(null)
    }, [])

    // Filter posts based on search term and filters
    const filteredPosts = useMemo(() => {
        let filtered = posts

        // Search filter
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase()
            filtered = filtered.filter(
                (post) => post.title.toLowerCase().includes(searchLower) || post.fullName.toLowerCase().includes(searchLower),
            )
        }

        // Active status filter
        if (filters.isActive !== "all") {
            filtered = filtered.filter((post) => post.isActive === (filters.isActive === "true"))
        }

        // Sort
        filtered?.sort((a: any, b: any) => {
            let aValue: any
            let bValue: any

            switch (filters.sortBy) {
                case "createdAt":
                    aValue = new Date(a.createdAt).getTime()
                    bValue = new Date(b.createdAt).getTime()
                    break
                case "title":
                    aValue = a.title.toLowerCase()
                    bValue = b.title.toLowerCase()
                    break
                case "fullName":
                    aValue = a.fullName.toLowerCase()
                    bValue = b.fullName.toLowerCase()
                    break
                default:
                    return 0
            }

            if (filters.sortOrder === "asc") {
                return aValue > bValue ? 1 : -1
            } else {
                return aValue < bValue ? 1 : -1
            }
        })

        return filtered
    }, [posts, filters])

    useEffect(() => {
        fetchPosts()
    }, [])

    return {
        // State
        posts: filteredPosts,
        loading,
        totalPages,
        filters,
        selectedPost,
        isDetailDialogOpen,
        isActionDialogOpen,
        actionType,
        detailLoading,

        // Actions
        fetchPosts,
        handleViewDetail,
        handleToggleStatus,
        handleActionSubmit,
        handleSearch,
        handleFilterChange,
        handlePageChange,
        handleCloseDetailDialog,
        handleCloseActionDialog,
    }
}
