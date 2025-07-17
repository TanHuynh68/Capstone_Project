import { z } from "zod"

export const reportSchema = z.object({
  targetID: z.string().optional(),
  reportType: z.number().min(0).max(7, "Loại báo cáo phải từ 0-7"),
  title: z.string().min(1, "Tiêu đề là bắt buộc").max(200, "Tiêu đề không được vượt quá 200 ký tự"),
  content: z.string().min(10, "Nội dung phải có ít nhất 10 ký tự").max(1000, "Nội dung không được vượt quá 1000 ký tự"),
  images: z.array(z.instanceof(File)).optional(),
  imagesDescriptions: z.array(z.string()).optional(),
})

export type ReportFormData = z.infer<typeof reportSchema>

export const REPORT_TYPES = [
  { value: 0, label: "Báo cáo người dùng" },
  { value: 1, label: "Báo cáo bài đăng" },
  { value: 2, label: "Báo cáo bình luận" },
  { value: 3, label: "Báo cáo nhóm" },
  { value: 4, label: "Báo cáo sự kiện" },
  { value: 5, label: "Báo cáo trang" },
  { value: 6, label: "Báo cáo story" },
  { value: 7, label: "Báo cáo tin nhắn" },
]
