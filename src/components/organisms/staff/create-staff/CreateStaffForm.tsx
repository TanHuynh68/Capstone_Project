"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import RegisterFormField from "@/components/molecules/auth/register/FormField";
import FormFieldController from "@/components/molecules/auth/register/FormFieldController";
import PasswordInput from "@/components/molecules/auth/register/PasswordInput";
import SelectField from "@/components/molecules/auth/register/SelectField";
import {
  type RegisterFormValues,
  registerSchema,
} from "@/schemas/registerSchema";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus } from "lucide-react";

interface CreateStaffFormProps {
  onSubmit: any;
  onSuccess?: () => void;
}

export default function CreateStaffForm({
  onSubmit,
  onSuccess,
}: CreateStaffFormProps) {
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
      role: "3",
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const handleSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const success = await onSubmit(data);
      if (success) {
        form.reset();
        onSuccess?.();
      }
    } catch (error) {
      console.error("Create staff error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const genderOptions = [
    { value: "0", label: "Nam" },
    { value: "1", label: "Nữ" },
    { value: "2", label: "Khác" },
  ];

  const roleOptions = [{ value: "3", label: "Nhân viên" }];

  return (
    <Card className="shadow-sm border-0 bg-gradient-to-t from-primary/5 to-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Thông tin nhân viên</CardTitle>
        <CardDescription>
          Điền đầy đủ thông tin để tạo tài khoản nhân viên mới
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Thông tin cá nhân
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="min-h-[76px] flex flex-col justify-start">
                  <FormFieldController
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <RegisterFormField
                        field={field}
                        label="Họ và tên"
                        placeholder="Nhập họ và tên đầy đủ"
                        required
                      />
                    )}
                  />
                </div>
                <div className="min-h-[76px] flex flex-col justify-start">
                  <FormFieldController
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <RegisterFormField
                        field={field}
                        label="Số điện thoại"
                        type="tel"
                        placeholder="Nhập số điện thoại"
                        required
                      />
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="min-h-[76px] flex flex-col justify-start">
                  <FormFieldController
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <RegisterFormField
                        field={field}
                        label="Email"
                        type="email"
                        placeholder="Nhập địa chỉ email"
                        required
                      />
                    )}
                  />
                </div>
                <div className="min-h-[76px] flex flex-col justify-start">
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
              </div>
            </div>

            {/* Account Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Thông tin tài khoản
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="min-h-[76px] flex flex-col justify-start">
                  <FormFieldController
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <PasswordInput
                        field={field}
                        label="Mật khẩu"
                        placeholder="Tạo mật khẩu mạnh"
                        showStrengthMeter
                        required
                      />
                    )}
                  />
                </div>
                <div className="min-h-[76px] flex flex-col justify-start">
                  <FormFieldController
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <PasswordInput
                        field={field}
                        label="Xác nhận mật khẩu"
                        placeholder="Nhập lại mật khẩu"
                        required
                      />
                    )}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/2">
                <div className="min-h-[76px] flex flex-col justify-start">
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 sm:flex-none"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Tạo tài khoản nhân viên
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="flex-1 sm:flex-none"
              >
                Làm mới form
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
