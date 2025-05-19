import { useCurrentUser } from "@/components/utils";
import { MESSAGE, ROLE } from "@/constants";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
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
  if (!user || !allowedRoles.includes(user.role)) {
    toast.error(MESSAGE.DO_NOT_HAVE_PERMISSION_TO_ACCESS);
    switch (allowedRoles) {
      case [ROLE.CUSTOMER]:
        return <Navigate to={PATH.HOME} replace />;
      case [ROLE.STAFF]:
        return <Navigate to={PATH.STAFF_DASHBOARD} replace />;
      case [ROLE.DESIGNER]:
        return <Navigate to={PATH.HOME} replace />;
      case [ROLE.ADMIN]:
        return <Navigate to={PATH.ADMIN_DASHBOARD} replace />;
    }
  }
 
  return children;
};
