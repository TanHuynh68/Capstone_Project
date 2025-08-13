import { z } from "zod"

export const processReportSchema = z.object({
    reportID: z.string().min(1, "Report ID là bắt buộc"),
    processNote: z
        .string()
        .min(10, "Nội dung phải có ít nhất 10 ký tự").max(100, "Nội dung không được vượt quá 100 ký tự"),
    accept: z.boolean(),
    benefitID: z.string().min(1, "Vui lòng chọn quyền lợi áp dụng"),
})

export type ProcessReportFormData = z.infer<typeof processReportSchema>
