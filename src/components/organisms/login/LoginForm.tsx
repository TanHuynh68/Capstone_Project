import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginImage from "../../atoms/login/LoginImage";
import { PATH } from "@/routes/path";
import useAuthService from "@/services/AuthService";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import AnimatedText from "../../utils/animateText";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuthService();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const values = { username, password };
    console.log("Dữ liệu gửi đi:", values);
    try {
      const response = await login(values);
      if (response) {
        console.log("Đăng nhập thành công: ", response);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden max-w-4xl w-full py-0">
        <CardContent className="grid h-full p-0  md:grid-cols-2">
          <form
            className="flex h-full flex-col justify-center p-6 md:p-8"
            onSubmit={handleLogin}
          >
            <div className="flex flex-col gap-6 pt-16 pb-16">
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center text-2xl font-bold gap-1">
                  <AnimatedText
                    text="Chào mừng bạn quay lại"
                    loop
                    speed={80}
                    eraseSpeed={40}
                    delayBetweenLoops={500}
                  />
                  <span className="cursor">|</span>
                </div>

                <p className="text-balance text-muted-foreground mt-2">
                  Đăng nhập tài khoản PlushDollCustom
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="username">Email</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="m@example.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
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
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Đăng nhập
              </Button>

              <div className="text-center text-sm">
                Chưa có tài khoản?{" "}
                <Link
                  to="/auth/register"
                  className="underline underline-offset-4"
                >
                  Đăng ký
                </Link>
              </div>
            </div>
          </form>

          <div className="relative hidden h-full bg-muted md:block">
            <LoginImage />
          </div>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Khi tiếp tục, bạn đồng ý với <Link to="#">Điều khoản dịch vụ</Link> và{" "}
        <Link to="#">Chính sách bảo mật</Link> của chúng tôi.
      </div>
    </div>
  );
}
