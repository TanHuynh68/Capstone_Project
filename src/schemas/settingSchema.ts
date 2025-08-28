import { z } from "zod"

export const createSettingSchema = z.object({
    key: z.string().min(1, "Key là bắt buộc").max(100, "Key không được quá 100 ký tự"),
    value: z.number().min(0, "Giá trị phải lớn hơn hoặc bằng 0"),
    description: z.string().min(1, "Mô tả là bắt buộc").max(500, "Mô tả không được quá 500 ký tự"),
})

export const updateSettingSchema = z.object({
    value: z.number().min(0, "Giá trị phải lớn hơn hoặc bằng 0"),
    description: z.string().min(1, "Mô tả là bắt buộc").max(500, "Mô tả không được quá 500 ký tự"),
})

export type CreateSettingFormValues = z.infer<typeof createSettingSchema>
export type UpdateSettingFormValues = z.infer<typeof updateSettingSchema>
