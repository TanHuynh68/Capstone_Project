import * as z from "zod";
const minNumber = 1000;

export const uploadPostSchema = z.object({
  Title: z
    .string()
    .min(1, { message: "Tiêu đề không được để trống" })
    .max(50, { message: "Tiêu đề không được dài quá 50 ký tự" }),
  Description: z
    .string()
    .min(1, { message: "Mô tả không được để trống" })
    .max(350, { message: "Mô tả không được dài quá 350 ký tự" }),
  ItemValue: z.coerce
    .number()
    .min(minNumber, {
      message: `Giá trị sản phẩm phải lớn hơn hoặc bằng ${minNumber}`,
    })
    .refine((val) => val % 1000 === 0, {
      message: "Giá trị sản phẩm phải chia hết cho 1000",
    }),

  SuggestedPrice: z.coerce
    .number()
    .min(minNumber, {
      message: `Giá đề xuất phải lớn hơn hoặc bằng ${minNumber}`,
    })
    .refine((val) => val % 1000 === 0, {
      message: "Giá đề xuất phải chia hết cho 1000",
    }),
  FinishDate: z
    .date({
      required_error: "Vui lòng chọn ngày kết thúc",
      invalid_type_error: "Ngày kết thúc không hợp lệ",
    })
    .refine((date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, "Ngày kết thúc phải từ hôm nay trở đi"),
});

export type UploadPostFormValues = z.infer<typeof uploadPostSchema>;

export const createPostSchema = z.object({
  Title: z
    .string()
    .min(1, { message: "Tiêu đề không được để trống" })
    .max(50, { message: "Tiêu đề không được dài quá 50 ký tự" }),
  Description: z
    .string()
    .min(1, "Mô tả không được để trống")
    .max(350, { message: "Mô tả không được dài quá 350 ký tự" }),
  //   ItemValue: z.coerce,
  ItemValue: z.coerce
    .number()
    .min(1000, "Giá trị sản phẩm phải lớn hơn 1000")
    .refine((val) => val % 1000 === 0, {
      message: "Giá trị sản phẩm phải chia hết cho 1000",
    }),
  SuggestedPrice: z.coerce
    .number()
    .min(1000, {
      message: `Giá đề xuất phải lớn hơn hoặc bằng ${1000}`,
    })
    .refine((val) => val % 1000 === 0, {
      message: "Giá đề xuất phải chia hết cho 1000",
    }),
  FinishDate: z
    .date({
      required_error: "Vui lòng chọn ngày kết thúc",
      invalid_type_error: "Ngày kết thúc không hợp lệ",
    })
    .refine((date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, "Ngày kết thúc phải từ hôm nay trở đi"),
  OriginalAttachmentFiles: z
    .array(z.instanceof(File))
    .min(1, "Cần ít nhất 1 ảnh gốc")
    .max(3, "Tối đa 3 ảnh gốc"),
  RequestedAttachmentFiles: z
    .array(z.instanceof(File))
    .min(1, "Cần ít nhất 1 ảnh yêu cầu")
    .max(3, "Tối đa 3 ảnh yêu cầu"),
  Length: z.coerce
    .number()
    .min(1, { message: "Chiều dài phải lớn hơn hoặc bằng 1" }),
  Width: z.coerce
    .number()
    .min(1, { message: "Chiều rộng phải lớn hơn hoặc bằng 1" }),
  Height: z.coerce
    .number()
    .min(1, { message: "Chiều cao phải lớn hơn hoặc bằng 1" }),
  Weight: z.coerce
    .number()
    .min(1, { message: "Cân nặng phải lớn hơn hoặc bằng 1" }),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
