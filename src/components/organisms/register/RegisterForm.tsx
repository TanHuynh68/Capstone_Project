"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import RegisterFormField from "@/components/molecules/register/FormField"
import FormFieldController from "@/components/molecules/register/FormFieldController"
import PasswordInput from "@/components/molecules/register/PasswordInput"
import SelectField from "@/components/molecules/register/SelectField"
import { PATH } from "@/routes/path"
import { type RegisterFormValues, registerSchema } from "@/schemas/registerSchema"

interface RegisterFormProps {
  onSubmit: (data: RegisterFormValues) => Promise<void>
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      email: "",
      gender: "0",
      role: "0",
    },
    mode: "onBlur", // Validate khi người dùng rời khỏi trường input
    reValidateMode: "onChange", // Validate lại khi người dùng thay đổi giá trị
  })

  const handleSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    try {
      await onSubmit(data)
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const genderOptions = [
    { value: "0", label: "Nam" },
    { value: "1", label: "Nữ" },
    { value: "2", label: "Khác" },
  ]

  const roleOptions = [
    { value: "0", label: "Khách hàng" },
    { value: "1", label: "Nhà thiết kế" },
  ]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormFieldController
          control={form.control}
          name="fullName"
          render={({ field }) => <RegisterFormField field={field} label="Họ và tên" placeholder="Họ và tên" required />}
        />

        <FormFieldController
          control={form.control}
          name="password"
          render={({ field }) => (
            <PasswordInput field={field} label="Mật khẩu" placeholder="Mật khẩu" showStrengthMeter required />
          )}
        />

        <FormFieldController
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <PasswordInput field={field} label="Xác nhận mật khẩu" placeholder="Xác nhận mật khẩu" required />
          )}
        />

        <FormFieldController
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <RegisterFormField field={field} label="Số điện thoại" type="tel" placeholder="Số điện thoại" required />
          )}
        />

        <FormFieldController
          control={form.control}
          name="email"
          render={({ field }) => (
            <RegisterFormField field={field} label="Email" type="email" placeholder="Địa chỉ email" required />
          )}
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <FormFieldController
              control={form.control}
              name="gender"
              render={({ field }) => (
                <SelectField
                  field={field}
                  label="Giới tính"
                  options={genderOptions}
                  placeholder="Chọn giới tính"
                  required
                />
              )}
            />
          </div>
          <div className="col-span-9">
            <FormFieldController
              control={form.control}
              name="role"
              render={({ field }) => (
                <SelectField field={field} label="Vai trò" options={roleOptions} placeholder="Chọn vai trò" required />
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Bạn đã có tài khoản?{" "}
          <Link to={PATH.LOGIN_IN} className="font-medium text-blue-600 hover:text-blue-500">
            Đăng nhập
          </Link>
        </p>
      </div>
    </Form>
  )
}
