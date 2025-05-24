import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ReactNode } from "react";
import { PATH } from "./path";
import { ROLE } from "@/constants";
import { toast } from "sonner";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const user = useSelector((state: RootState) => state.user);

  // Nếu đã đăng nhập → chuyển về home
  if (user && user.id) {
    toast.info('Bạn đã đăng nhập')
    switch (user.role) {
      case ROLE.CUSTOMER:
        return <Navigate to={PATH.HOME} replace />;
      case ROLE.STAFF:
        return <Navigate to={PATH.STAFF_DASHBOARD} replace />;
      case ROLE.DESIGNER:
        return <Navigate to={PATH.HOME} replace />;
      case ROLE.ADMIN:
        return <Navigate to={PATH.ADMIN_DASHBOARD} replace />;
    }
  }

  return children;
};

export default PublicRoute;
