import { useCurrentUser } from "@/components/utils";
import { ROLE } from "@/constants";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

interface ProtectedRouteByRoleProps {
  children: ReactNode;
  allowedRoles: Array<ROLE.ADMIN | ROLE.ARTIST | ROLE.CUSTOMER | ROLE.STAFF>; // Các vai trò cho phép
}

export const ProtectedRouteByRole: React.FC<ProtectedRouteByRoleProps> = ({
  children,
  allowedRoles,
}) => {
  const user = useCurrentUser();

  if (!user || !allowedRoles.includes(user.role)) {
    toast.error("You do not have permissions to access");
    return <Navigate to="/" replace />;
  }

  return children;
};
