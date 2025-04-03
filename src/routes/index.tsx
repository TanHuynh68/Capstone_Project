
import {  createBrowserRouter } from "react-router-dom";
import { adminRoutes } from "./adminRoutes";
// import { userRoutes } from "./userRoutes";


// Kết hợp cả Admin & User routes
export const router = createBrowserRouter([
  ...adminRoutes, // Lấy danh sách routes từ `adminRoutes`
  // ...userRoutes,  
  // Lấy danh sách routes từ `userRoutes`
]);

