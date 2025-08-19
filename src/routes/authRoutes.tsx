import { AUTH_ROUTES } from "./path";
import {
  ForgotPasswordPage,
  LoginPage,
  PrivacyPolicyPage,
  RegisterPage,
  TermPage,
  VerifyAccountPage,
} from "@/pages";
import PublicRoute from "./public";
import RereverifyAccount from "@/pages/auth/reverify-account";

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
      {
        path: AUTH_ROUTES.REVERIFY_ACCOUNT,
        element: (
          <PublicRoute>
            <RereverifyAccount />
          </PublicRoute>
        ),
      },
      {
        path: AUTH_ROUTES.PRIVACY_POLICY,
        element: (
          <PublicRoute>
            <PrivacyPolicyPage />
          </PublicRoute>
        ),
      },
      {
        path: AUTH_ROUTES.TERM,
        element: (
          <PublicRoute>
            <TermPage />
          </PublicRoute>
        ),
      },
    ],
  },
];
