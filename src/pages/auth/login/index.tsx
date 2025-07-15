import { LoginForm } from "@/components/organisms/auth/login/LoginForm";
import bgImage from "@/assets/login-bg.jpg";

export default function LoginPage() {
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
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
