import { z } from "zod"

export const processReportSchema = z.object({
    reportID: z.string().min(1, "Report ID là bắt buộc"),
    processNote: z
        .string()
        .min(10, "Ghi chú xử lý phải có ít nhất 10 ký tự")
        .max(1000, "Ghi chú xử lý không được vượt quá 1000 ký tự"),
    accept: z.boolean(),
})

export type ProcessReportFormData = z.infer<typeof processReportSchema>