import { AUTH_ROUTES } from "./path";
import { ForgotPasswordPage, LoginPage, RegisterPage, VerifyAccountPage } from "@/pages";

export const authRoutes = [
  {
    path: AUTH_ROUTES.AUTH,
    children: [
      {
        path: AUTH_ROUTES.LOGIN_IN,
        element: <LoginPage />,
      },
      {
        path: AUTH_ROUTES.REGISTER,
        element: <RegisterPage />,
      },
      {
        path: AUTH_ROUTES.FORGOT_PASSWORD,
        element: <ForgotPasswordPage />,
      },
      {
        path: AUTH_ROUTES.VERIFY_ACCOUNT,
        element: <VerifyAccountPage />,
      },
    ],
  },
];