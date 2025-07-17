import {
    BarChartIcon,
    CameraIcon,
    ClipboardListIcon,
    DatabaseIcon,
    FileCodeIcon,
    FileIcon,
    FileTextIcon,
    FolderIcon,
    GavelIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    ListIcon,
    SettingsIcon,
    UsersIcon,
    SearchIcon,
} from "lucide-react";
import { ADMIN_ROUTES } from "@/routes/path";

export const appSidebarData = {
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
