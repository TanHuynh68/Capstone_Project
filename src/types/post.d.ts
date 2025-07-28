interface Post {
  projectPostID: string;
  accountID: string;
  fullName: string | null;
  avatar: string | null;
  title: string;
  description: string;
  postStatus: number;
  itemValue: number;
  suggestedPrice: number;
  createdAt: string;
  endAt: string;
  finishDate: string;
  isActive: boolean;
  originalImages: ProjectImage[];
  requestedImages: ProjectImage[];
}

interface ProjectImage {
  projectImageID: string;
  imageUrl: string;
  imageType: "Original" | "Requested";
  createdBy: string;
}

interface PostsResponse {
  data: Post[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

interface PostsParams {
  page: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: any;
}

type SortDirection = "asc" | "desc";

interface FilterState {
  search: string;
  status: string;
  dateRange: { from: Date | null; to: Date | null };
  endDateRange: { from: Date | null; to: Date | null };
  isActive?: boolean;
}

interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

interface SortState {
  column: string | null;
  direction: "asc" | "desc";
}

// for staff manage post
interface PostsTableFilters {
  searchTerm: string
  isActive: string // "all" | "true" | "false"
  sortBy: string // "createdAt" | "title" | "fullName"
  sortOrder: "asc" | "desc"
  page: number
}
// for staff manage post
interface PostsApiQuery {
  search?: string
  isActive?: boolean
  sortBy?: string
  sortOrder?: string
  page: number
  size: number
}
// for staff manage post
interface PostActionData {
  projectPostID: string
  reason: string
}
// for staff manage post
interface PostsTableActions {
  onViewDetail: (post: ProjectPost) => void
  onToggleStatus: (post: ProjectPost) => void
  onSearch: (searchTerm: string) => void
  onFilterChange: (filters: Partial<PostsTableFilters>) => void
  onPageChange: (page: number) => void
}
