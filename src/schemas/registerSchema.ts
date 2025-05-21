import * as z from "zod";
export const passwordCriteria = [
  {
    id: "length",
    label: "Ít nhất 8 ký tự",
    test: (pass: string) => pass.length >= 8,
  },
  {
    id: "lowercase",
    label: "Một chữ cái thường",
    test: (pass: string) => /[a-z]/.test(pass),
  },
  {
    id: "uppercase",
    label: "Một chữ cái hoa",
    test: (pass: string) => /[A-Z]/.test(pass),
  },
  {
    id: "number",
    label: "Một chữ số",
    test: (pass: string) => /[0-9]/.test(pass),
  },
  {
    id: "special",
    label: "Một ký tự đặc biệt",
    test: (pass: string) => /[^A-Za-z0-9]/.test(pass),
  },
];

export const registerSchema = z
  .object({
    fullName: z.string().min(1, { message: "Họ và tên không được để trống" }),
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
      .regex(/[a-z]/, { message: "Mật khẩu phải có ít nhất 1 chữ cái thường" })
      .regex(/[A-Z]/, { message: "Mật khẩu phải có ít nhất 1 chữ cái hoa" })
      .regex(/[0-9]/, { message: "Mật khẩu phải có ít nhất 1 chữ số" })
      .regex(/[^A-Za-z0-9]/, {
        message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Vui lòng xác nhận mật khẩu" }),
    phoneNumber: z
      .string()
      .min(1, { message: "Số điện thoại không được để trống" })
      .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/, {
        message: "Số điện thoại không hợp lệ",
      }),
    email: z
      .string()
      .min(1, { message: "Email không được để trống" })
      .email({ message: "Email không hợp lệ" }),
    gender: z.string().min(1, { message: "Vui lòng chọn giới tính" }),
    role: z.string().min(1, { message: "Vui lòng chọn vai trò" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
