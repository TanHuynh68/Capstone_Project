"use client";

import type * as React from "react";
import { LogOutIcon } from "lucide-react";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
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
import { NavDocuments } from "./nav-documents";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MESSAGE } from "@/constants";
import { logout } from "@/redux/userSlice";
import LogoWeb from "@/components/atoms/custom/logo/LogoWeb";
import { appSidebarData } from "./sidebar-data";
import { RootState } from "@/redux/store";
import { ThemeToggle } from "@/components/themes/ThemeToggle";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    toast.success(MESSAGE.LOGOUT_SUCCESSFULLY);
    navigate("/auth/login");
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton> */}
            <LogoWeb logoSize={{ width: 220, height: 50 }} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={appSidebarData.navMain} />
        <NavDocuments items={appSidebarData.documents} />
        <NavSecondary items={appSidebarData.navSecondary} className="mt-auto" />
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
