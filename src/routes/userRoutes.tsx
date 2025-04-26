
import { USER_ROUTES } from "./path";
import { CustomerLayout } from "../components/layouts";
import { ChangePasswordPage, CustomerEditProfile, CustomerProfilePage, HomePage, PaymentOptionPage } from "../pages";
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
        path: USER_ROUTES.PAYMENT_OPTION,
        element: <PaymentOptionPage />,
      },
    ],
  },
]