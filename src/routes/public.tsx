import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ReactNode } from "react";
import { PATH } from "./path";
import { ROLE } from "@/constants";
// import { toast } from "sonner";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const user = useSelector((state: RootState) => state.user);

  if (user && user.id) {
    switch (user.role) {
      case ROLE.CUSTOMER:
      case ROLE.DESIGNER:
        // Cho phép render trang public (vd: HomePage)
        return <>{children}</>;
      case ROLE.STAFF:
        return <Navigate to={PATH.STAFF_DASHBOARD_MANAGER_USERS} replace />;
      case ROLE.ADMIN:
        return <Navigate to={PATH.ADMIN_DASHBOARD} replace />;
    }
  }

  // chưa login thì vẫn render
  return children;
};


export default PublicRoute;
