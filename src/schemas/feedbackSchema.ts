import { z } from "zod"

// Customer feedback creation schema
export const createFeedbackSchema = z.object({
  orderID: z.string().uuid("ID đơn hàng không hợp lệ"),
  rating: z
    .number()
    .min(1, "Vui lòng chọn ít nhất 1 sao")
    .max(5, "Đánh giá tối đa 5 sao")
    .int("Đánh giá phải là số nguyên"),
  comment: z.string().min(1, "Vui lòng nhập nhận xét").max(100, "Nhận xét không được vượt quá 100 ký tự").trim(),
  image: z
    .custom<File>((file) => {
      if (!(file instanceof File)) return false
      return true
    }, {
      message: "Vui lòng chọn hình ảnh"
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Kích thước file không được vượt quá 5MB"
    })
    .refine((file) => file.type.startsWith("image/"), {
      message: "File phải là định dạng ảnh"
    })
})

// Designer response schema
export const createFeedbackResponseSchema = z.object({
  feedbackID: z.string().uuid("ID feedback không hợp lệ"),
  response: z.string().min(1, "Vui lòng nhập phản hồi").max(100, "Phản hồi không được vượt quá 100 ký tự").trim(),
})

// Feedback data schema (for API responses)
export const feedbackDataSchema = z.object({
  feedbackID: z.string().uuid(),
  customerName: z.string(),
  designerName: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  imageURL: z.string().url().nullable(),
  createdAt: z.string().datetime(),
  response: z.string().nullable(),
  responseAt: z.string().datetime().nullable(),
})

// Form data types
export type CreateFeedbackFormData = z.infer<typeof createFeedbackSchema>
export type CreateFeedbackResponseFormData = z.infer<typeof createFeedbackResponseSchema>
export type FeedbackData = z.infer<typeof feedbackDataSchema>

// Validation helper functions
export const validateCreateFeedback = (data: unknown) => {
  return createFeedbackSchema.safeParse(data)
}

export const validateCreateFeedbackResponse = (data: unknown) => {
  return createFeedbackResponseSchema.safeParse(data)
}

export const validateFeedbackData = (data: unknown) => {
  return feedbackDataSchema.safeParse(data)
}
