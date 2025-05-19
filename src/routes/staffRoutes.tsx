import StaffLayout from "@/components/layouts/staff-layout";
import { STAFF_ROUTES } from "./path";
import StaffDashboard from "@/pages/staff";
import ManagerUsersByStaff from "@/pages/staff/manage-users/get-users";
import ManagerWalletOrderByStaff from "@/pages/staff/manager-wallet-order/get-wallet-order";
import { ProtectedRouteByRole } from "./protect";
import { ROLE } from "@/constants";

export const staffRoutes = [
  {
    path: STAFF_ROUTES.STAFF,
    element: (
      <ProtectedRouteByRole allowedRoles={[ROLE.STAFF]}>
        <StaffLayout />
      </ProtectedRouteByRole>
    ),
    children: [
      {
        path: STAFF_ROUTES.STAFF_DASHBOARD,
        element: <StaffDashboard />,
      },
      {
        path:
          STAFF_ROUTES.STAFF_DASHBOARD + "/" + STAFF_ROUTES.STAFF_MANAGER_USERS,
        element: <ManagerUsersByStaff />,
      },
      {
        path:
          STAFF_ROUTES.STAFF_DASHBOARD +
          "/" +
          STAFF_ROUTES.STAFF_MANAGER_WITHDRAWAL,
        element: <ManagerWalletOrderByStaff />,
      },
    ],
  },
];
