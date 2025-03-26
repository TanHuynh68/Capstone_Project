
import { createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "../components/layouts";
import { USER_ROUTES } from "./path";

export const pubicRoutes = createBrowserRouter([
  {
    path: USER_ROUTES.AUTH,
    element:
      // <ProtectedRouteByRole allowedRoles={["ADMIN"]}>
      <AdminLayout />,
    // </ProtectedRouteByRole>
    // children: [
    //   {
    //     path: USER_ROUTES.REGISTER,
    //     element: <RegisterPage />,
    //   },
    //   {
    //     path: USER_ROUTES.LOGIN,
    //     element: <LoginPage />,
    //   },
    // ],
  },
]);
