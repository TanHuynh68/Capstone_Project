"use client";

import RegisterForm from "@/components/organisms/auth/register/RegisterForm";
import { useNavigate } from "react-router-dom";
import { RegisterFormValues } from "@/schemas/registerSchema";
import { toast } from "sonner";
import { PATH } from "@/routes/path";
import { MESSAGE } from "@/constants";
import useAuthService from "@/services/AuthService";
import { Card, CardContent } from "@/components/ui/card";
import bgImage from "@/assets/login-bg.jpg";
import RegisterVideo from "@/components/atoms/auth/register/RegisterVideo";
import LogoWeb from "@/components/atoms/custom/logo/LogoWeb";

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
    <div
      className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-sm md:max-w-5xl">
        <RegisterForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
