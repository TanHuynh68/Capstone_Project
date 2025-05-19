interface Post {
  projectPostID: string
  avatar: string
  title: string
  description: string
  postStatus: number
  itemValue: number
  suggestedPrice: number
  createdAt: string
  endAt: string
  // Thêm các trường khác nếu cần
}

interface PostsResponse {
  data: Post[]
  totalCount: number
  pageSize: number
  currentPage: number
  totalPages: number
}

interface PostsParams {
  page: number
  pageSize: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
  status?: number
}
