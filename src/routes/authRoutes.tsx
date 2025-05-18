import { AUTH_ROUTES } from "./path";
import {
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  VerifyAccountPage,
} from "@/pages";
import PublicRoute from "./public";

export const authRoutes = [
  {
    path: AUTH_ROUTES.AUTH,
    children: [
      {
        path: AUTH_ROUTES.LOGIN_IN,
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: AUTH_ROUTES.REGISTER,
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
      {
        path: AUTH_ROUTES.FORGOT_PASSWORD,
        element: (
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        ),
      },
      {
        path: AUTH_ROUTES.VERIFY_ACCOUNT,
        element: (
          <PublicRoute>
            <VerifyAccountPage />
          </PublicRoute>
        ),
      },
    ],
  },
];
