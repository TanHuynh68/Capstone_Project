"use client";

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import useAuthService from "@/services/useAuthService";
import { PATH } from "@/routes/path";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const VerifyAccount = () => {
  const location = useLocation();
  const email = location.state?.email;
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const { verifyAccount, resendOTP } = useAuthService();
  const navigate = useNavigate();

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast("Mã OTP không hợp lệ", {
        description: "Vui lòng nhập đúng 6 chữ số.",
      });
      return;
    }

    if (!email) {
      toast("Thiếu thông tin email", {
        description: "Vui lòng quay lại bước đăng ký và thử lại.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyAccount({ email, otp });

      if (res.statusCode === 200) {
        navigate(PATH.LOGIN_IN);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      const response = await resendOTP({ email });
      if (response) {
        toast("Đã gửi lại OTP", {
          description: (
            <span>
              Mã OTP mới đã được gửi đến <strong>{email}</strong>
            </span>
          ),
        });
      }
    } catch (err) {
      toast("Lỗi khi gửi lại OTP", {
        description: `Không thể gửi lại mã OTP. ${err}`,
      });
    } finally {
      setIsResending(false);
    }
  };

  if (!email) {
    return (
      <div className="text-center mt-12 text-red-600">
        Không có thông tin email. Vui lòng quay lại trang đăng ký.
        <div className="text-center mt-4">
          <Link
            to="/auth/login"
            className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 shadow rounded-lg space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Nhập mã OTP</h2>
          <p className="text-sm text-gray-600">
            Mã xác thực gồm 6 chữ số đã được gửi đến <strong>{email}</strong>.
          </p>
        </div>

        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            disabled={isLoading}
            autoFocus
          >
            <InputOTPGroup>
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-12 h-12 text-lg" // 👈 tăng chiều rộng/chiều cao và font size
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button
          onClick={handleVerifyOtp}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Đang xác thực..." : "Xác thực"}
        </Button>

        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={handleResendOtp}
            className="text-sm text-blue-600 hover:text-blue-500"
            disabled={isResending}
          >
            {isResending ? "Đang gửi lại OTP..." : "Gửi lại mã OTP"}
          </Button>
        </div>

        <div className="text-center mt-4">
          <Link
            to="/auth/login"
            className="flex items-center justify-center text-sm text-blue-600 hover:text-blue-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
