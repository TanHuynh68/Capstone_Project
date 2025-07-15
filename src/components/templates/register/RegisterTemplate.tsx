"use client";

import RegisterForm from "@/components/organisms/auth/register/RegisterForm";
import { Link, useNavigate } from "react-router-dom";
import { RegisterFormValues } from "@/schemas/registerSchema";
import { toast } from "sonner";
import { PATH } from "@/routes/path";
import { MESSAGE } from "@/constants";
import useAuthService from "@/services/AuthService";
import { Card, CardContent } from "@/components/ui/card";
import AnimatedText from "@/utils/animateText";
import bgImage from "@/assets/login-bg.jpg";
import RegisterVideo from "@/components/atoms/auth/register/RegisterVideo";

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
      <div className="flex flex-col gap-6 justify-center items-center">
        <div className="w-full max-w-sm md:max-w-5xl">
          <Card className="overflow-hidden w-full max-w-[1200px] mx-auto py-0">
            <CardContent className="grid h-full p-0 md:grid-cols-2">
              {/* Cột trái: Video */}
              <div className="relative hidden h-full bg-muted md:block">
                <RegisterVideo />
              </div>
              {/* Cột phải: Form đăng ký */}
              <div className="flex h-full flex-col justify-center p-6 md:p-8">
                <div className="flex flex-col gap-6 pt-8 pb-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="inline-flex items-center text-2xl font-bold gap-1 whitespace-nowrap overflow-hidden text-ellipsis max-w-[800px]">
                      <AnimatedText
                        texts={[
                          "Chào mừng bạn nhé! 🧸",
                          "Cùng tạo điều đáng yêu! ✨",
                          "Đăng ký ngay bạn nhé! 🌞",
                        ]}
                        speed={80}
                        eraseSpeed={40}
                        delayBetweenTexts={1000}
                        delayBetweenLoops={1500}
                      />
                      <span className="cursor">|</span>
                    </div>
                    <p className="text-balance text-muted-foreground mt-2">
                      Đăng ký tài khoản PlushDollCustom
                    </p>
                  </div>
                  <RegisterForm onSubmit={handleSubmit} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="text-balance text-center text-xs text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:text-blue-600 hover:[&_a]:text-blue-800 text-white">
          Khi tiếp tục, bạn đồng ý với <Link to="#">Điều khoản dịch vụ</Link> và{" "}
          <Link to="#">Chính sách bảo mật</Link> của chúng tôi.
        </div>
      </div>
    </div>
  );
}
