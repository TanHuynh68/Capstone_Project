import { createBrowserRouter } from "react-router-dom";
import { AdminLayout } from "../components/layouts";
import { ADMIN_ROUTES } from "./path";
import { AdminDashboard } from "@/pages";

export const adminRoutes = [
  {
    path: ADMIN_ROUTES.ADMIN,
    element: <AdminLayout />,
    children: [
      {
        path: ADMIN_ROUTES.ADMIN_DASHBOARD,
        element: <AdminDashboard />,
      },
    ],
  },
]