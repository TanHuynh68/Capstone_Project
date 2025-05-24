import { useCurrentUser } from "@/components/utils";
import { ROLE } from "@/constants";
import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteByRoleProps {
  children: ReactNode;
  allowedRoles: Array<ROLE.ADMIN | ROLE.DESIGNER | ROLE.CUSTOMER | ROLE.STAFF>; // Các vai trò cho phép
}

export const ProtectedRouteByRole: React.FC<ProtectedRouteByRoleProps> = ({
  children,
  allowedRoles,
}) => {
  const user = useCurrentUser();
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="*" replace />;
  }
  return children;
};
