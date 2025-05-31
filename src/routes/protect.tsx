import { useCurrentUser } from "@/components/utils";
import { ROLE } from "@/constants";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { PATH } from "./path";

interface ProtectedRouteByRoleProps {
  children: ReactNode;
  allowedRoles: Array<ROLE.ADMIN | ROLE.DESIGNER | ROLE.CUSTOMER | ROLE.STAFF>; // Các vai trò cho phép
}

export const ProtectedRouteByRole: React.FC<ProtectedRouteByRoleProps> = ({
  children,
  allowedRoles,
}) => {
  const user = useCurrentUser();
  if (!user?.role) {
    return <Navigate to={PATH.LOGIN_IN} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};
