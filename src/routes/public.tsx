import { Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { ReactNode } from "react"
import { PATH } from "./path"

interface PublicRouteProps {
  children: ReactNode
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const user = useSelector((state: RootState) => state.user)

  // Nếu đã đăng nhập → chuyển về home
  if (user && user.id) {
    return <Navigate to={PATH.HOME} replace />
  }

  return children
}

export default PublicRoute
