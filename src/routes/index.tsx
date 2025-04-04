
import {  createBrowserRouter } from "react-router-dom";
import { adminRoutes } from "./adminRoutes";
import { userRoutes } from "./userRoutes";
import { authRoutes } from "./authRoutes";


// Kết hợp cả Admin & User routes
export const router = createBrowserRouter([
  ...adminRoutes, // Lấy danh sách routes từ `adminRoutes`
  ...userRoutes, 
  ...authRoutes, 
]);

