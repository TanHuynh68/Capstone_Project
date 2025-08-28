import {
    CameraIcon,
    ClipboardListIcon,
    DatabaseIcon,
    FileCodeIcon,
    FileIcon,
    FileTextIcon,
    GavelIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    SettingsIcon,
    SearchIcon,
} from "lucide-react";
import { ADMIN_ROUTES, PATH } from "@/routes/path";

export const appSidebarData = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
        {
            title: "Tổng quan",
            url: PATH.ADMIN_DASHBOARD,
            icon: LayoutDashboardIcon,
        },
        {
            title: "Quản lý chính sách",
            url: `${ADMIN_ROUTES.ADMIN}/${ADMIN_ROUTES.ADMIN_MANAGER_BENEFIT}`,
            icon: GavelIcon,
        },
        {
            title: "Cài đặt hệ thống",
            url: `${ADMIN_ROUTES.ADMIN}/${ADMIN_ROUTES.ADMIN_SETTING_SYSTEM}`,
            icon: GavelIcon,
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
            title: "Get Help 2",
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
