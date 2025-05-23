interface Post {
  projectPostID: string;
  title: string;
  description: string;
  fullName: string | null;
  avatar: string | null;
  itemValue: number;
  suggestedPrice: number;
  createdAt: string;
  endAt: string;
  postStatus: string;
  originalImage:OriginalImage;
  requestedImages: RequestedImages[];
}

interface RequestedImages {
  createdBy: string;
  projectImageID: string;
  imageType: string;
  imageUrl: string;
}

interface OriginalImage {
  createdBy: string;
  projectImageID: string;
  imageType: string;
  imageUrl: string;
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

interface SortState {
  column: keyof Post | null;
  direction: SortDirection;
}

interface FilterState {
  search: string;
  status: any;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  endDateRange: {
    from: Date | null;
    to: Date | null;
  };
}

interface PaginationState {
  pageIndex: number;
  pageSize: number;
}
