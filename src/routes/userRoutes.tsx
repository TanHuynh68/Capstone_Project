
import { USER_ROUTES } from "./path";
import { CustomerLayout } from "../components/layouts";
import {
  ChangePasswordPage,
  CustomerEditProfile,
  CustomerProfilePage,
  HomePage,
  PaymentFailedPage,
  DepositMoneyPage,
  PaymentResultPage,
  PaymentSuccessPage,
  Chat,
  AboutPage,
} from "../pages";
import PayOsPaymentResult from "@/pages/customer/manage-wallet/payos-payment-result";
import QRLoginPage from "@/pages/auth/login-qr";
import PlushDollDesign from "@/pages/customer/plushdoll-design";
//
export const userRoutes = [
  {
    path: USER_ROUTES.HOME,
    element: <CustomerLayout />,
    children: [
      {
        path: USER_ROUTES.HOME_PAGE,
        element: <HomePage />,
      },
      {
        path: USER_ROUTES.CHANGE_PASSWORD,
        element: <ChangePasswordPage />,
      },
      {
        path: USER_ROUTES.PROFILE,
        element: <CustomerProfilePage />,
      },
      {
        path: USER_ROUTES.EDIT_PROFILE,
        element: <CustomerEditProfile />,
      },
      {
        path: USER_ROUTES.DEPOSIT_MONEY,
        element: <DepositMoneyPage />,
      },
      {
        path: USER_ROUTES.PAYMENT_RESULT,
        element: <PaymentResultPage />,
      },
      {
        path: USER_ROUTES.PAYMENT_SUCCESS,
        element: <PaymentSuccessPage />,
      },
      {
        path: USER_ROUTES.PAYMENT_FAILED,
        element: <PaymentFailedPage />,
      },
      {
        path: USER_ROUTES.PAYOS_PAYMENT_RESULT,
        element: <PayOsPaymentResult />,
      },
      {
        path: USER_ROUTES.CHAT,
        element: <Chat />,
      },
      {
        path: USER_ROUTES.LOGIN_QR,
        element: <QRLoginPage />,
      },
      {
        path: USER_ROUTES.PLUSHDOLL_DESIGN,
        element: <PlushDollDesign />,
      },
      {
        path: USER_ROUTES.ABOUT_PAGE,
        element: <AboutPage/>,
      },
    ],
  },
];