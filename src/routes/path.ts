export enum USER_ROUTES {
    HOME = "/",
    HOME_PAGE = "", // Đảm bảo rằng đường dẫn này không gây xung đột
    AUTH = "/auth",
    CHANGE_PASSWORD = "change-password",
    PROFILE = "profile",
    EDIT_PROFILE = "edit-profile",
    VERIFY_ACCOUNT = "verify-account",
    PAYMENT_OPTION = "payment-option",
    PAYMENT_RESULT = "api/v1/wallet/vnpay-callback",
    PAYMENT = 'payment',
    PAYMENT_SUCCESS = 'payment/success',
    PAYMENT_FAILED = 'payment/failed'
}

export enum AUTH_ROUTES {
    AUTH = "/auth",
    LOGIN_IN = "login",
    REGISTER = "register",
    FORGOT_PASSWORD = "forgot-password",
    VERIFY_ACCOUNT = "verify-account",
    
}

export enum ADMIN_ROUTES {
    ADMIN = "/admin", // Đảm bảo có dấu "/" ở đầu
    ADMIN_DASHBOARD = "dashboard",
}
//

export enum PATH {
    FORGOT_PASSWORD = AUTH_ROUTES.AUTH + "/" + AUTH_ROUTES.FORGOT_PASSWORD,
    LOGIN_IN = AUTH_ROUTES.AUTH + "/" + AUTH_ROUTES.LOGIN_IN,
    REGISTER = AUTH_ROUTES.AUTH + "/" + AUTH_ROUTES.REGISTER,
    CHANGE_PASSWORD = USER_ROUTES.AUTH + "/" + USER_ROUTES.CHANGE_PASSWORD,
    EDIT_PROFILE = USER_ROUTES.AUTH + "/" + USER_ROUTES.EDIT_PROFILE,
    VERIFY_ACCOUNT = USER_ROUTES.AUTH + "/" + USER_ROUTES.VERIFY_ACCOUNT,
    PAYMENT_SUCCESS = USER_ROUTES.PAYMENT + "/" + 'success',
    PAYMENT_FAILED = USER_ROUTES.PAYMENT + "/" + 'failed',
}