import StaffLayout from "@/components/layouts/staff-layout";
import { STAFF_ROUTES } from "./path";
import StaffDashboard from "@/pages/staff";
import ManagerUsersByStaff from "@/pages/staff/manage-users/get-users";

export const staffRoutes = [
  {
    path: STAFF_ROUTES.STAFF,
    element: <StaffLayout />,
    children: [
      {
        path: STAFF_ROUTES.STAFF_DASHBOARD,
        element: <StaffDashboard />,
      },
      {
        path: STAFF_ROUTES.STAFF_MANAGER_USERS,
        element: <ManagerUsersByStaff />,
      },
    ],
  },
];