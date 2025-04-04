
import { USER_ROUTES } from "./path";
import { CustomerLayout } from "../components/layouts";
import { ChangePasswordPage, HomePage } from "../pages";

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
    ],
  },
]