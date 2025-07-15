export const getCustomerStatusNumber = (status: string): number => {
  switch (status.toLowerCase()) {
    case "pending":
      return 0
    case "inprogress":
      return 1
    case "approved":
      return 2
    case "rejected":
      return 3
    default:
      return 0
  }
}

export const highlightCustomerMatch = (text: string, keyword: string) => {
  if (!text || !keyword) return text
  const parts = text.split(new RegExp(`(${keyword})`, "gi"))
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 text-black px-1 rounded">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

export const formatCustomerReportType = (type: string): string => {
  const typeMap: Record<string, string> = {
    UserReport: "Báo cáo người dùng",
    PostReport: "Báo cáo bài đăng",
    CommentReport: "Báo cáo bình luận",
    GroupReport: "Báo cáo nhóm",
    EventReport: "Báo cáo sự kiện",
    PageReport: "Báo cáo trang",
    StoryReport: "Báo cáo story",
    MessageReport: "Báo cáo tin nhắn",
    GroupPostReport: "Báo cáo bài đăng nhóm",
    GeneralReport: "Báo cáo chung",
  }
  return typeMap[type] || type
}

export const formatCustomerReportStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    Pending: "Đang chờ",
    InProgress: "Đang xử lý",
    Approved: "Đã duyệt",
    Rejected: "Đã từ chối",
  }
  return statusMap[status] || status
}
