
import { createBrowserRouter } from "react-router-dom";
import { adminRoutes } from "./adminRoutes";
import { userRoutes } from "./userRoutes";
import { authRoutes } from "./authRoutes";
import { staffRoutes } from "./staffRoutes";
import { guestRoutes } from "./guestRoutes";
import { errorRoutes } from "./errorRoutes";

// Kết hợp cả Admin & User routes
export const router = createBrowserRouter([
  ...adminRoutes,
  ...staffRoutes,
  ...userRoutes , 
  ...authRoutes, 
  ...guestRoutes,
  ...errorRoutes
]);

