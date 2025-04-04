export enum USER_ROUTES {
    HOME = "/",
    HOME_PAGE = "", // Đảm bảo rằng đường dẫn này không gây xung đột
    AUTH = "/auth",
}

export enum AUTH_ROUTES {
    AUTH = "/auth",
    LOGIN_IN = "login",
    REGISTER = "register",
}

export enum ADMIN_ROUTES {
    ADMIN = "/admin", // Đảm bảo có dấu "/" ở đầu
    ADMIN_DASHBOARD = "dashboard",
}