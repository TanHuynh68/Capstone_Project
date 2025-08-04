"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/atoms/auth/login/Button";
import useAuthService from "@/services/AuthService";
import { PATH } from "@/routes/path";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";

const RereverifyAccount = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);

  const { verifyAccount, resendOTP } = useAuthService();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      toast("Vui lòng nhập email", {
        description: "Email không được để trống.",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast("Email không hợp lệ", {
        description: "Vui lòng nhập email đúng định dạng.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await resendOTP({ email });
      if (response) {
        setShowOtpInput(true);
        toast("Đã gửi OTP", {
          description: (
            <span>
              Mã OTP đã được gửi đến <strong>{email}</strong>
            </span>
          ),
        });
      }
    } catch (err) {
      toast("Lỗi khi gửi OTP", {
        description: `Không thể gửi mã OTP. ${err}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast("Mã OTP không hợp lệ", {
        description: "Vui lòng nhập đúng 6 chữ số.",
      });
      return;
    }

    if (!email) {
      toast("Thiếu thông tin email", {
        description: "Vui lòng nhập email trước.",
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 shadow rounded-lg space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {showOtpInput ? "Nhập mã OTP" : "Xác thực tài khoản"}
          </h2>
          <p className="text-sm text-gray-600">
            {showOtpInput
              ? `Mã xác thực gồm 6 chữ số đã được gửi đến ${email}.`
              : "Nhập email để nhận mã xác thực."}
          </p>
        </div>

        {!showOtpInput ? (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <Button
              onClick={handleSendOtp}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Đang gửi OTP..." : "Gửi mã OTP"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
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
                      className="w-12 h-12 text-lg"
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

            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowOtpInput(false);
                  setOtp("");
                }}
                className="text-sm text-gray-600 hover:text-gray-500"
              >
                Thay đổi email
              </Button>

              <Button
                variant="ghost"
                onClick={handleResendOtp}
                className="text-sm text-blue-600 hover:text-blue-500"
                disabled={isResending}
              >
                {isResending ? "Đang gửi lại..." : "Gửi lại mã OTP"}
              </Button>
            </div>
          </div>
        )}

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

export default RereverifyAccount;
