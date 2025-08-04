"use client";

import type * as React from "react";
import {
  // BarChartIcon,
  // CameraIcon,
  // ClipboardListIcon,
  // DatabaseIcon,
  // FileCodeIcon,
  // FileIcon,
  // FileTextIcon,
  // FolderIcon,
  // HelpCircleIcon,
  LogOutIcon,
  // SearchIcon,
  // SettingsIcon,
} from "lucide-react";

import { NavMain } from "./nav-main";
// import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
// import { NavDocuments } from "./nav-documents";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/userSlice";
import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { MESSAGE } from "@/constants";
import LogoWeb from "@/components/atoms/custom/logo/LogoWeb";
import { staffSidebarData } from "./sidebar-data";
import { ThemeToggle } from "@/components/themes/ThemeToggle";
import { PATH } from "@/routes/path";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    // toast.success(MESSAGE.LOGOUT_SUCCESSFULLY);
    navigate("/auth/login");
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <LogoWeb
              path={PATH.STAFF_DASHBOARD_MANAGER_USERS}
              logoSize={{ width: 220, height: 50 }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={staffSidebarData.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between">
          <NavUser
            user={{
              name: user.name || "Chưa cập nhật",
              email: user.role || "",
              avatar: user.avatar || "/public/images/animation_favicon.gif",
            }}
          />

          <ThemeToggle />
        </div>

        <div className="border-t mt-2 pt-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                className="gap-2 hover:bg-muted transition-colors"
              >
                <LogOutIcon className="h-4 w-4" />
                <span>Đăng xuất</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
