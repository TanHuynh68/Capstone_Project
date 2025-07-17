import { Outlet, useLocation } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { staffSidebarData } from "./sidebar-data";
import { SiteHeader } from "./site-header";

export default function StaffLayout() {
  const location = useLocation();

  // Gộp tất cả các mảng lại
  const allNavItems = [
    ...staffSidebarData.navMain,
    ...staffSidebarData.navClouds,
    ...staffSidebarData.navSecondary,
    ...staffSidebarData.documents,
  ];

  // Tìm item khớp url
  const currentNavItem = allNavItems.find(
    (item) => item.url === location.pathname
  );
  const currentName =
    (currentNavItem as { title?: string; name?: string })?.title ||
    (currentNavItem as { title?: string; name?: string })?.name;

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader name={currentName} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-4">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
