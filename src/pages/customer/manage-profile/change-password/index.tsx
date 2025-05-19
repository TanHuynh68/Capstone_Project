import type React from "react";
import { useState } from "react";
import { Eye, EyeOff, Check, X, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import useAuthService from "@/services/AuthService";
import { toast } from "sonner";
import { MESSAGE } from "@/constants";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/userSlice";
import { PATH } from "@/routes/path";

const ChangePassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { changePassword } = useAuthService();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password strength criteria
  const passwordCriteria = [
    {
      id: "length",
      label: "Ít nhất 8 ký tự",
      test: (pass: string) => pass.length >= 8,
    },
    {
      id: "lowercase",
      label: "Ít nhất 1 chữ thường",
      test: (pass: string) => /[a-z]/.test(pass),
    },
    {
      id: "uppercase",
      label: "Ít nhất 1 chữ hoa",
      test: (pass: string) => /[A-Z]/.test(pass),
    },
    {
      id: "number",
      label: "Ít nhất 1 chữ số",
      test: (pass: string) => /[0-9]/.test(pass),
    },
    {
      id: "special",
      label: "Ít nhất 1 ký tự đặc biệt",
      test: (pass: string) => /[^A-Za-z0-9]/.test(pass),
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    let isValid = true;

    // Current password validation
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Mật khẩu hiện tại là bắt buộc";
      isValid = false;
    }

    // New password validation
    if (!formData.newPassword) {
      newErrors.newPassword = "Cần có mật khẩu mới";
      isValid = false;
    } else {
      const failedCriteria = passwordCriteria.filter(
        (c) => !c.test(formData.newPassword)
      );
      if (failedCriteria.length > 0) {
        newErrors.newPassword = "Mật khẩu không đáp ứng yêu cầu";
        isValid = false;
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu mới của bạn";
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
      isValid = false;
    }

    // Check if new password is the same as current password
    if (
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword === formData.newPassword
    ) {
      newErrors.newPassword =
        "New password must be different from current password";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  //api
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    console.log("formData: ", formData);
    const response = await changePassword(formData);
    if (response) {
      toast.success(MESSAGE.CHANGE_PASSWORD_SUCCESSFULLY);
      dispatch(logout());
      navigate(PATH.LOGIN_IN);
    }
    setIsLoading(false);
  };

  const getPasswordStrength = () => {
    if (!formData.newPassword) return 0;
    return passwordCriteria.filter((c) => c.test(formData.newPassword)).length;
  };

  const passwordStrength = getPasswordStrength();
  const strengthPercentage = (passwordStrength / passwordCriteria.length) * 100;

  return (
    <div className="container max-w-md mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <div className="flex items-center mb-2">
            <Link
              to="/profile"
              className="text-muted-foreground hover:text-foreground mr-2"
            >
              <ArrowLeft size={18} />
            </Link>
            <CardTitle>Đổi mật khẩu</CardTitle>
          </div>
          <CardDescription>
            Cập nhật mật khẩu của bạn để giữ an toàn cho tài khoản của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className={
                    errors.currentPassword ? "border-red-500 pr-10" : "pr-10"
                  }
                  placeholder="Nhập mật khẩu hiện tại của bạn"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-xs text-red-500">{errors.currentPassword}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={
                    errors.newPassword ? "border-red-500 pr-10" : "pr-10"
                  }
                  placeholder="Nhập mật khẩu mới của bạn"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-red-500">{errors.newPassword}</p>
              )}

              {/* Password strength meter */}
              {formData.newPassword && (
                <div className="mt-2 space-y-2">
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        passwordStrength <= 1
                          ? "bg-red-500"
                          : passwordStrength <= 3
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${strengthPercentage}%` }}
                    />
                  </div>
                  <ul className="space-y-1 text-xs">
                    {passwordCriteria.map((criterion) => (
                      <li key={criterion.id} className="flex items-center">
                        {criterion.test(formData.newPassword) ? (
                          <Check className="h-3 w-3 text-green-500 mr-2" />
                        ) : (
                          <X className="h-3 w-3 text-red-500 mr-2" />
                        )}
                        <span
                          className={
                            criterion.test(formData.newPassword)
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={
                    errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"
                  }
                  placeholder="Xác nhận mật khẩu mới của bạn"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Lock className="mr-2 h-4 w-4" />
                    Cập nhật mật khẩu
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-6">
          <p className="text-xs text-muted-foreground">
            Vì lý do bảo mật, bạn sẽ được yêu cầu đăng nhập lại sau khi thay đổi
            mật khẩu.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChangePassword;
