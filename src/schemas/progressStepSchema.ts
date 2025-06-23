import { z } from "zod"

export const createProgressStepSchema = z
  .object({
    orderID: z.string().min(1, "OrderID là bắt buộc"),
    offerPhaseID: z.string().min(1, "OfferPhaseID là bắt buộc"),
    stepTitle: z.string().min(1, "Tiêu đề bước là bắt buộc"),
    description: z.string().min(1, "Mô tả là bắt buộc"),
    imagesDescriptions: z
      .array(z.string().min(1, "Mô tả ảnh không được để trống"))
      .min(3, "Cần ít nhất 3 mô tả ảnh")
      .max(6, "Tối đa 6 mô tả ảnh"),
    images: z
      .array(z.instanceof(File))
      .min(3, "Cần ít nhất 3 ảnh")
      .max(6, "Tối đa 6 ảnh")
      .refine((files) => files.every((file) => file.type.startsWith("image/")), {
        message: "Tất cả file phải là ảnh",
      })
      .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), {
        message: "Kích thước ảnh không được vượt quá 5MB",
      }),
  })
  .refine((data) => data.images.length === data.imagesDescriptions.length, {
    message: "Số lượng ảnh phải bằng số lượng mô tả",
    path: ["images"],
  })

export type CreateProgressStepFormData = z.infer<typeof createProgressStepSchema>
