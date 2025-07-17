import {
    CameraIcon,
    ClipboardListIcon,
    DatabaseIcon,
    FileCodeIcon,
    FileIcon,
    FileTextIcon,
    HelpCircleIcon,
    LayoutDashboardIcon,
    SearchIcon,
    SettingsIcon,
    UsersIcon,
    Wallet,
} from "lucide-react";
import { PATH } from "@/routes/path";

export const staffSidebarData = {
    navMain: [
        {
            title: "Dashboard",
            url: `${PATH.STAFF_DASHBOARD}`,
            icon: LayoutDashboardIcon,
        },
        {
            title: "Quản lý người dùng",
            url: `${PATH.STAFF_DASHBOARD_MANAGER_USERS}`,
            icon: UsersIcon,
        },
        {
            title: "Quản lý tố cáo",
            url: `${PATH.STAFF_MANAGE_REPORT}`,
            icon: Wallet,
        },
        {
            title: "Lịch sử giao dịch ví",
            url: `${PATH.STAFF_MANAGER_WALLET_TRANSACTION}`,
            icon: Wallet,
        },
        {
            title: "Đơn giao dịch",
            url: `${PATH.STAFF_MANAGER_WITHDRAWAL}`,
            icon: ClipboardListIcon,
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
            name: "Word Assistant",
            url: "#",
            icon: FileIcon,
        },
    ],
}; 