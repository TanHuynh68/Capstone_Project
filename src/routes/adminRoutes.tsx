import RuleManager from "@/pages/admin/dashboard/manager-rule";
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
      {
        path: `${ADMIN_ROUTES.ADMIN_DASHBOARD}/${ADMIN_ROUTES.ADMIN_MANAGER_RULE}`,
        element: <RuleManager />,
      },
    ],
  },
];
