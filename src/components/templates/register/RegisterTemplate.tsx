"use client";

import FormHeader from "@/components/atoms/register/FormHeader";
import FormFooter from "@/components/atoms/register/FormFooter";
import RegisterForm from "@/components/organisms/register/RegisterForm";
import { Link, useNavigate } from "react-router-dom";
import { RegisterFormValues } from "@/schemas/registerSchema";
import { toast } from "sonner";
import { PATH } from "@/routes/path";
import { MESSAGE } from "@/constants";
import useAuthService from "@/services/AuthService";

export default function RegisterTemplate() {
  const { register } = useAuthService();
  const navigate = useNavigate();
  const handleSubmit = async (data: RegisterFormValues) => {
    // Chuyển đổi giá trị từ string sang number cho gender và role
    const valuesSubmit = {
      email: data.email,
      fullName: data.fullName,
      password: data.password,
      phoneNumber: data.phoneNumber,
      role: Number.parseInt(data.role),
      gender: Number.parseInt(data.gender),
    };

    console.log("valuesSubmit:", valuesSubmit);

    const response = await register(valuesSubmit);
    if (response) {
      toast.success(MESSAGE.REGISTER_SUCCESSFULLY);
      navigate(PATH.VERIFY_ACCOUNT, {
        state: { email: data.email },
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <FormHeader title="Tạo tài khoản" />

        <div className="mt-8 bg-white p-8 shadow sm:rounded-lg">
          <RegisterForm onSubmit={handleSubmit} />
        </div>

        <FormFooter>
          Bằng cách nhấp vào tiếp tục, bạn đồng ý với chúng tôi{" "}
          <Link
            to="/terms"
            className="font-medium text-gray-900 hover:underline"
          >
            Điều khoản dịch vụ
          </Link>{" "}
          và{" "}
          <Link
            to="/privacy"
            className="font-medium text-gray-900 hover:underline"
          >
            Chính sách bảo mật
          </Link>
          .
        </FormFooter>
      </div>
    </div>
  );
}
