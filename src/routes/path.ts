export enum USER_ROUTES {
    HOME = "/",
    HOME_PAGE = "", // Đảm bảo rằng đường dẫn này không gây xung đột
    AUTH = "/auth",
    CHANGE_PASSWORD = "change-password",
    PROFILE = "profile",
}

export enum AUTH_ROUTES {
    AUTH = "/auth",
    LOGIN_IN = "login",
    REGISTER = "register",
    FORGOT_PASSWORD = "forgot-password",
    
}

export enum ADMIN_ROUTES {
    ADMIN = "/admin", // Đảm bảo có dấu "/" ở đầu
    ADMIN_DASHBOARD = "dashboard",
}

export enum PATH {
    FORGOT_PASSWORD = AUTH_ROUTES.AUTH + "/" + AUTH_ROUTES.FORGOT_PASSWORD,
    LOGIN_IN = AUTH_ROUTES.AUTH + "/" + AUTH_ROUTES.LOGIN_IN,
    CHANGE_PASSWORD = AUTH_ROUTES.AUTH + "/" + USER_ROUTES.CHANGE_PASSWORD,
}