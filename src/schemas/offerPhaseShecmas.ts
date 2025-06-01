import * as z from "zod";
const minNumber = 1000;

export const offerPhaseSchema = z.object({
  //   offerID: z.string().uuid({ message: "Tiêu đề không được để trống" }),
  phaseName: z
    .string()
    .min(1, { message: "Tên giai đoạn không được để trống" }),
  phaseDescription: z.string().min(1, { message: "Mô tả không được để trống" }),
  offerPhasePrice: z.coerce
    .number()
    .min(minNumber, {
      message: `Giá phải lớn hơn hoặc bằng ${minNumber}`,
    })
    .refine((val) => val % 1000 === 0, {
      message: "Giá trị sản phẩm phải chia hết cho 1000",
    }),
  startDate: z
    .date({
      required_error: "Vui lòng chọn ngày bắt đầu",
      invalid_type_error: "Ngày bắt đầu không hợp lệ",
    })
    .refine((date) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, "Ngày bắt đầu phải từ hôm nay trở đi"),
  endDate: z.date({
    required_error: "Vui lòng chọn ngày kết thúc",
    invalid_type_error: "Ngày kết thúc không hợp lệ",
  }),
});

export type OfferPhaseFormValues = z.infer<typeof offerPhaseSchema>;
