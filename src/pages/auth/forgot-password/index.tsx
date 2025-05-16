"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Check, X } from "lucide-react";
import { Button } from "@/components/atoms/login/Button";
import { Input } from "@/components/atoms/login/Input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import useAuthService from "@/services/AuthService";
import { PATH } from "@/routes/path";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { sendResetPasswordEmail, forgotPassword, resetPassword } =
    useAuthService();
  const navigate = useNavigate();

  // --- Password Strength Criteria ---
  const passwordCriteria = [
    {
      id: "length",
      label: "Ít nhất 8 ký tự",
      test: (pass: string) => pass.length >= 8,
    },
    {
      id: "lowercase",
      label: "1 chữ thường",
      test: (pass: string) => /[a-z]/.test(pass),
    },
    {
      id: "uppercase",
      label: "1 chữ hoa",
      test: (pass: string) => /[A-Z]/.test(pass),
    },
    {
      id: "number",
      label: "1 số",
      test: (pass: string) => /[0-9]/.test(pass),
    },
    {
      id: "special",
      label: "1 ký tự đặc biệt",
      test: (pass: string) => /[^A-Za-z0-9]/.test(pass),
    },
  ];

  const getPasswordStrength = () =>
    passwordCriteria.filter((c) => c.test(newPassword)).length;

  const isPasswordStrong = () =>
    getPasswordStrength() === passwordCriteria.length;

  const handleSendOtp = async () => {
    if (!email || !email.includes("@")) {
      toast("Email không hợp lệ", {
        description: "Vui lòng nhập đúng định dạng email.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendResetPasswordEmail({ email });
      if (res) {
        toast("Đã gửi OTP", {
          description: (
            <span>
              Mã xác thực đã được gửi đến <strong>{email}</strong>
            </span>
          ),
        });
        setStep(2);
      }
    } catch {
      toast("Lỗi gửi OTP", {
        description: "Không thể gửi OTP. Vui lòng thử lại.",
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

    setIsLoading(true);
    try {
      const res = await forgotPassword({ email, otp });
      if (res?.statusCode === 200) {
        setStep(3);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!isPasswordStrong()) {
      toast("Mật khẩu yếu", {
        description:
          "Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast("Mật khẩu không khớp", {
        description: "Vui lòng nhập lại cho khớp.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword({ email, newPassword, confirmPassword });
      if (res?.statusCode === 200) {
        toast.success("Đặt lại mật khẩu thành công. Hãy đăng nhập lại.");
        navigate(PATH.LOGIN_IN);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      const res = await sendResetPasswordEmail({ email });
      if (res) {
        toast("Đã gửi lại OTP", {
          description: (
            <span>
              Mã OTP mới đã được gửi đến <strong>{email}</strong>
            </span>
          ),
        });
      }
    } catch {
      toast("Lỗi khi gửi lại OTP", {
        description: "Không thể gửi lại mã OTP.",
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
            {step === 1
              ? "Quên mật khẩu"
              : step === 2
              ? "Nhập mã OTP"
              : "Đặt lại mật khẩu"}
          </h2>
          <p className="text-sm text-gray-600">
            {step === 1 && "Nhập email của bạn để nhận mã xác thực."}
            {step === 2 && (
              <>
                Mã xác thực gồm 6 chữ số đã được gửi đến{" "}
                <strong>{email}</strong>.
              </>
            )}
            {step === 3 && "Vui lòng nhập mật khẩu mới của bạn."}
          </p>
        </div>

        {step === 1 && (
          <>
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendOtp}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Đang gửi..." : "Gửi mã OTP"}
            </Button>
          </>
        )}

        {step === 2 && (
          <>
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
          </>
        )}

        {step === 3 && (
          <>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                className="pr-10"
              />
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            {/* Password strength UI */}
            {newPassword && (
              <div className="mt-2 space-y-2">
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      getPasswordStrength() <= 1
                        ? "bg-red-500"
                        : getPasswordStrength() <= 3
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${
                        (getPasswordStrength() / passwordCriteria.length) * 100
                      }%`,
                    }}
                  />
                </div>
                <ul className="space-y-1 text-xs">
                  {passwordCriteria.map((criterion) => (
                    <li key={criterion.id} className="flex items-center">
                      {criterion.test(newPassword) ? (
                        <Check className="h-3 w-3 text-green-500 mr-2" />
                      ) : (
                        <X className="h-3 w-3 text-red-500 mr-2" />
                      )}
                      <span
                        className={
                          criterion.test(newPassword)
                            ? "text-green-700"
                            : "text-gray-500"
                        }
                      >
                        {criterion.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="pr-10"
              />
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <Button
              onClick={handleResetPassword}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
            </Button>
          </>
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

export default ForgotPassword;
