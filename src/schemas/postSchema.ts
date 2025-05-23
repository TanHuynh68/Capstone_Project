import * as z from "zod";
const minNumber = 1000;

export const uploadPostSchema = z.object({
  Title: z.string().min(1, { message: "Tiêu đề không được để trống" }),
  Description: z.string().min(1, { message: "Mô tả không được để trống" }),
  ItemValue: z.coerce
    .number()
    .min(minNumber, { message: `Giá trị sản phẩm phải lớn hơn hoặc bằng ${minNumber}` }),
  SuggestedPrice: z.coerce
    .number()
    .min(minNumber, { message: `Giá đề xuất phải lớn hơn hoặc bằng ${minNumber}` }),
});

export type UploadPostFormValues = z.infer<typeof uploadPostSchema>;
