import * as z from "zod";

// Schema for update post (without file validation)
export const updatePostSchema = z.object({
  projectPostId: z.string().optional(),
  title: z
    .string()
    .min(1, { message: "Tiêu đề không được để trống" })
    .max(50, { message: "Tiêu đề không được dài quá 50 ký tự" }),
  description: z
    .string()
    .min(1, "Mô tả không được để trống")
    .max(350, { message: "Mô tả không được dài quá 350 ký tự" }),
  //   ItemValue: z.coerce,
  itemValue: z.coerce
    .number()
    .min(1000, "Giá trị sản phẩm phải lớn hơn 1000")
    .refine((val) => val % 1000 === 0, {
      message: "Giá trị sản phẩm phải chia hết cho 1000",
    }),
  suggestedPrice: z.coerce
    .number()
    .min(1000, {
      message: `Giá đề xuất phải lớn hơn hoặc bằng ${1000}`,
    })
    .refine((val) => val % 1000 === 0, {
      message: "Giá đề xuất phải chia hết cho 1000",
    }),
  finishDate: z
    .date({
      required_error: "Vui lòng chọn ngày kết thúc",
      invalid_type_error: "Ngày kết thúc không hợp lệ",
    })
    .refine((date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, "Ngày kết thúc phải từ hôm nay trở đi"),
  originalAttachmentFiles: z
    .array(z.instanceof(File))
    .min(1, "Cần ít nhất 1 ảnh gốc")
    .max(3, "Tối đa 3 ảnh gốc"),
  requestedAttachmentFiles: z
    .array(z.instanceof(File))
    .min(1, "Cần ít nhất 1 ảnh yêu cầu")
    .max(3, "Tối đa 3 ảnh yêu cầu"),
  length: z.coerce
    .number()
    .min(1, { message: "Chiều dài phải lớn hơn hoặc bằng 1" }),
  width: z.coerce
    .number()
    .min(1, { message: "Chiều rộng phải lớn hơn hoặc bằng 1" }),
  height: z.coerce
    .number()
    .min(1, { message: "Chiều cao phải lớn hơn hoặc bằng 1" }),
  weight: z.coerce
    .number()
    .min(1, { message: "Cân nặng phải lớn hơn hoặc bằng 1" }),
})

export type UpdatePostFormValues = z.infer<typeof updatePostSchema>;
