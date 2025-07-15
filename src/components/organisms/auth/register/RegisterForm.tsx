"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import RegisterFormField from "@/components/molecules/auth/register/FormField";
import FormFieldController from "@/components/molecules/auth/register/FormFieldController";
import PasswordInput from "@/components/molecules/auth/register/PasswordInput";
import SelectField from "@/components/molecules/auth/register/SelectField";
import { PATH } from "@/routes/path";
import {
  type RegisterFormValues,
  registerSchema,
} from "@/schemas/registerSchema";
import LogoWeb from "@/components/atoms/custom/logo/LogoWeb";
import { Card, CardContent } from "@/components/ui/card";
import RegisterVideo from "@/components/atoms/auth/register/RegisterVideo";

interface RegisterFormProps {
  onSubmit: (data: RegisterFormValues) => Promise<void>;
}

export default function RegisterForm({ onSubmit }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);

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
  });

  const handleSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const genderOptions = [
    { value: "0", label: "Nam" },
    { value: "1", label: "Nữ" },
    { value: "2", label: "Khác" },
  ];

  const roleOptions = [
    { value: "0", label: "Khách hàng" },
    { value: "1", label: "Nhà thiết kế" },
  ];

  return (
    <Form {...form}>
      <div className="flex flex-col gap-6 justify-center items-center">
        <div className="w-full max-w-xl md:max-w-5xl">
          <Card className="overflow-hidden w-full max-w-[1200px] mx-auto py-0">
            <CardContent className="grid h-full p-0 md:grid-cols-2">
              {/* Cột trái: Video */}
              <div className="relative hidden h-full bg-muted md:block">
                <RegisterVideo />
              </div>
              {/* Cột phải: Form đăng ký */}
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex h-full flex-col justify-center p-6 md:p-8"
              >
                <div className="flex flex-col gap-4 pt-4 pb-4">
                  <div className="flex flex-col items-center text-center">
                    <LogoWeb logoSize={{ width: 260, height: 50 }} />
                    <p className="text-balance text-muted-foreground mt-2">
                      Đăng ký tài khoản PlushDollCustom
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormFieldController
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <RegisterFormField
                          field={field}
                          label="Họ và tên"
                          placeholder="Họ và tên"
                          required
                        />
                      )}
                    />
                    <FormFieldController
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <RegisterFormField
                          field={field}
                          label="Số điện thoại"
                          type="tel"
                          placeholder="Số điện thoại"
                          required
                        />
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormFieldController
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <PasswordInput
                          field={field}
                          label="Mật khẩu"
                          placeholder="Mật khẩu"
                          showStrengthMeter
                          required
                        />
                      )}
                    />
                    <FormFieldController
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <PasswordInput
                          field={field}
                          label="Xác nhận mật khẩu"
                          placeholder="Xác nhận mật khẩu"
                          required
                        />
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormFieldController
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <RegisterFormField
                          field={field}
                          label="Email"
                          type="email"
                          placeholder="Địa chỉ email"
                          required
                        />
                      )}
                    />
                    <div className="flex flex-row w-full gap-4">
                      <div className="w-full">
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
                      <div className="w-full">
                        <FormFieldController
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <SelectField
                              field={field}
                              label="Vai trò"
                              options={roleOptions}
                              placeholder="Chọn vai trò"
                              required
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Nút tạo tài khoản full width, tách hàng riêng */}
                  <div>
                    <Button
                      className="w-full mt-2"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
                    </Button>
                  </div>
                  <div className="mt-0 text-center text-sm">
                    <p className="text-gray-600">
                      Bạn đã có tài khoản?{" "}
                      <Link
                        to={PATH.LOGIN_IN}
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Đăng nhập
                      </Link>
                    </p>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Form>
  );
}
