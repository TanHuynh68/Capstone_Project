import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PATH } from "@/routes/path";
import useAuthService from "@/services/AuthService";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import LoginVideo from "@/components/atoms/auth/login/LoginVideo";
import LogoWeb from "@/components/atoms/custom/logo/LogoWeb";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuthService();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameShake, setUsernameShake] = useState(false);
  const [passwordShake, setPasswordShake] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const values = { username, password };
    // console.log("Dữ liệu gửi đi:", values);
    try {
      const response = await login(values);
      if (response) {
        // console.log("Đăng nhập thành công: ", response);
      }
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = (
    setShake: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 500); // Reset after animation completes
  };

  const validate = () => {
    let valid = true;

    if (!username.trim()) {
      setUsernameError("Vui lòng nhập email hoặc số điện thoại");
      triggerShake(setUsernameShake);
      valid = false;
    } else {
      setUsernameError("");
    }

    if (!password.trim()) {
      setPasswordError("Vui lòng nhập mật khẩu");
      triggerShake(setPasswordShake);
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 justify-center items-center",
        className
      )}
      {...props}
    >
      <div className="w-full max-w-sm md:max-w-3xl">
        <Card className="overflow-hidden w-full max-w-[1200px] mx-auto py-0">
          <CardContent className="grid h-full p-0 md:grid-cols-2">
            <form
              className="flex h-full flex-col justify-center p-6 md:p-8"
              onSubmit={handleLogin}
            >
              <div className="flex flex-col gap-6 pt-12 pb-12">
                <div className="flex flex-col items-center text-center">
                  <LogoWeb path={PATH.HOME} logoSize={{ width: 260, height: 50 }} />
                  <p className="text-balance text-muted-foreground mt-2">
                    Đăng nhập tài khoản PlushDollCustom
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="username">Email/Số điện thoại</Label>
                  <Input
                    key={usernameShake ? "username-shake" : "username"} // ép re-render
                    id="username"
                    type="text"
                    placeholder="Email hoặc số điện thoại"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (usernameError) setUsernameError("");
                    }}
                    onFocus={() => {
                      setUsernameError("");
                      setUsernameShake(false);
                    }}
                    onBlur={() => {
                      if (!username.trim()) {
                        setUsernameError(
                          "Vui lòng nhập email hoặc số điện thoại"
                        );
                        triggerShake(setUsernameShake);
                      } else {
                        setUsernameError("");
                      }
                    }}
                    className={cn(
                      usernameError && "border-red-500",
                      usernameShake && "animate-[shake_0.5s_ease-in-out]"
                    )}
                    disabled={loading}
                  />

                  {usernameError && (
                    <p className="text-red-500 text-sm mt-1">{usernameError}</p>
                  )}
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Link
                      to={PATH.FORGOT_PASSWORD}
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      key={passwordShake ? "password-shake" : "password"} // ép re-render
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      onFocus={() => {
                        setPasswordError("");
                        setPasswordShake(false);
                      }}
                      onBlur={() => {
                        if (!password.trim()) {
                          setPasswordError("Vui lòng nhập mật khẩu");
                          triggerShake(setPasswordShake);
                        } else {
                          setPasswordError("");
                        }
                      }}
                      className={cn(
                        passwordError && "border-red-500",
                        passwordShake && "animate-[shake_0.5s_ease-in-out]"
                      )}
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Đăng nhập
                </Button>

                <div className="text-center text-sm">
                  <p className="text-gray-600">
                    Chưa có tài khoản?{" "}
                    <Link
                      to="/auth/register"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Đăng ký
                    </Link>
                  </p>
                </div>
              </div>
            </form>
            <div className="relative hidden h-full bg-muted md:block">
              <LoginVideo />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
