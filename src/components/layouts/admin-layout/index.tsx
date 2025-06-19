import { Outlet, useLocation } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { SiteHeader } from "./site-header";
import {
  DatabaseIcon,
  ClipboardListIcon,
  FileIcon,
  LayoutDashboardIcon,
  GavelIcon,
  ListIcon,
  BarChartIcon,
  FolderIcon,
  UsersIcon,
  CameraIcon,
  FileTextIcon,
  FileCodeIcon,
  SettingsIcon,
  HelpCircleIcon,
  SearchIcon,
} from "lucide-react";
import { ADMIN_ROUTES } from "@/routes/path";

// Copy lại mảng documents từ AppSidebar
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Quản lý luật lệ",
      url: `${ADMIN_ROUTES.ADMIN}/${ADMIN_ROUTES.ADMIN_DASHBOARD}/${ADMIN_ROUTES.ADMIN_MANAGER_BENEFIT}`,
      icon: GavelIcon,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: ListIcon,
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChartIcon,
    },
    {
      title: "Projects",
      url: "#",
      icon: FolderIcon,
    },
    {
      title: "Team",
      url: "#",
      icon: UsersIcon,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
};

export default function AdminLayout() {
  const location = useLocation();

  // Gộp tất cả các mảng lại
  const allNavItems = [
    ...data.navMain,
    ...data.navClouds,
    ...data.navSecondary,
    ...data.documents,
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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
