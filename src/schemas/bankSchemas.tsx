import * as z from "zod"

export const bankCardSchema = z.object({
  bankAccountNumber: z
    .string()
    .min(1, { message: "Số tài khoản không được để trống" })
    .regex(/^\d+$/, { message: "Số tài khoản chỉ được chứa các chữ số" })
    .min(8, { message: "Số tài khoản phải có ít nhất 8 chữ số" })
    .max(20, { message: "Số tài khoản không được vượt quá 20 chữ số" }),

  bankName: z.string().min(1, { message: "Vui lòng chọn ngân hàng" }),

  accountHolderName: z
    .string()
    .min(1, { message: "Tên chủ tài khoản không được để trống" })
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, {
      message: "Tên chủ tài khoản chỉ được chứa chữ cái và khoảng trắng",
    })
    .min(3, { message: "Tên chủ tài khoản phải có ít nhất 3 ký tự" })
    .max(100, { message: "Tên chủ tài khoản không được vượt quá 100 ký tự" }),
})

export type BankCardFormValues = z.infer<typeof bankCardSchema>
