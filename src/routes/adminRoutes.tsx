import RuleManager from "@/pages/admin/dashboard/manager-rule";
import { AdminLayout } from "../components/layouts";
import { ADMIN_ROUTES } from "./path";
import { AdminDashboard } from "@/pages";
import { ProtectedRouteByRole } from "./protect";
import { ROLE } from "@/constants";

export const adminRoutes = [
  {
    path: ADMIN_ROUTES.ADMIN,
    element: (
      <ProtectedRouteByRole allowedRoles={[ROLE.ADMIN]}>
        <AdminLayout />
      </ProtectedRouteByRole>
    ),
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
