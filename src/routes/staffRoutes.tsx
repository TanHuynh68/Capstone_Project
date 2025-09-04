import StaffLayout from "@/components/layouts/staff-layout";
import { PATH, STAFF_ROUTES } from "./path";
import ManagerUsersByStaff from "@/pages/staff/manage-users/get-users";
import ManagerWalletOrderByStaff from "@/pages/staff/manager-wallet-order/get-wallet-order";
import { ProtectedRouteByRole } from "./protect";
import { ROLE } from "@/constants";
import GetWalletTransaction from "@/pages/staff/manager-wallet-order/get-wallet-transaction/get-wallet-transaction";
import {
  StaffDeliveryDetail,
  StaffManageOrdersUser,
  StaffManagePostsPage,
  StaffManageReportsPage,
  StaffMangeUserDeliveriesPage,
  StaffOrderDetailPage,
  StaffReportDetailPage,
  StaffUserDetailsPage,
} from "@/pages";

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
        path: PATH.STAFF_DASHBOARD_MANAGER_USERS,
        element: <ManagerUsersByStaff />,
      },
      {
        path:
          STAFF_ROUTES.STAFF_DASHBOARD +
          "/" +
          STAFF_ROUTES.STAFF_MANAGER_WITHDRAWAL,
        element: <ManagerWalletOrderByStaff />,
      },
      {
        path:
          STAFF_ROUTES.STAFF_DASHBOARD +
          "/" +
          STAFF_ROUTES.STAFF_MANAGER_WALLET_TRANSACTION,
        element: <GetWalletTransaction />,
      },
      {
        path: STAFF_ROUTES.STAFF_MANAGE_REPORT,
        element: <StaffManageReportsPage />,
      },
      {
        path: STAFF_ROUTES.STAFF_MANAGE_POSTS,
        element: <StaffManagePostsPage />,
      },
      {
        path: STAFF_ROUTES.STAFF_REPORT_DETAIL,
        element: <StaffReportDetailPage />,
      },
      {
        path: STAFF_ROUTES.STAFF_GET_ORDERS_USER,
        element: <StaffManageOrdersUser />,
      },
      {
        path: STAFF_ROUTES.STAFF_GET_ORDER_DETAIL,
        element: <StaffOrderDetailPage />,
      },
      {
        path: STAFF_ROUTES.STAFF_GET_DELIVERIES,
        element: <StaffMangeUserDeliveriesPage />,
      },
      {
        path: STAFF_ROUTES.STAFF_GET_DELIVERY_DETAIL,
        element: <StaffDeliveryDetail />,
      },
      {
        path: STAFF_ROUTES.STAFF_GET_USER_DETAILS,
        element: <StaffUserDetailsPage />,
      },
    ],
  },
];
