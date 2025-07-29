import { DESIGNER_ROUTES, USER_ROUTES } from "./path";
import { CustomerLayout } from "../components/layouts";

import { ROLE } from "@/constants";
import { ProtectedRouteByRole } from "./protect";
import { MyPortfolioLayout } from "@/components/templates/portfolio/portfolio-layout";
import TimelineLayout from "@/components/templates/timeline/TimelineLayout";

export const designerRoutes = [
  {
    path: USER_ROUTES.HOME,
    element: (
      <ProtectedRouteByRole allowedRoles={[ROLE.DESIGNER]}>
        <CustomerLayout />
      </ProtectedRouteByRole>
    ),
    children: [
      {
        path: DESIGNER_ROUTES.PORTFOLIO,
        element: <MyPortfolioLayout />,
      },
      {
        path: DESIGNER_ROUTES.TIMELINE,
        element: <TimelineLayout />,
      },
    ],
  },
];
