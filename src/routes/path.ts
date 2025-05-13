export enum USER_ROUTES {
    HOME = "/",
    HOME_PAGE = "", // Đảm bảo rằng đường dẫn này không gây xung đột
    AUTH = "/auth",
    CHANGE_PASSWORD = "change-password",
    PROFILE = "profile",
    EDIT_PROFILE = "edit-profile",
    VERIFY_ACCOUNT = "verify-account",
    DEPOSIT_MONEY = "deposit-money",
    PAYMENT_RESULT = "api/v1/wallet/vnpay-callback",
    PAYOS_PAYMENT_RESULT = "api/v1/wallet/payos-callback",
    PAYMENT = 'payment',
    PAYMENT_SUCCESS = 'payment/success',
    PAYMENT_PAYOS_SUCCESS = 'payment/success?code=00&status=PAID',
    PAYMENT_FAILED = 'payment/failed',
    TRANSACTION_HISTORY = 'transaction-history',
    DEPOSIT_WITHDRAWAL_HISTORY = 'deposit-withdrawal-history',
    LOGIN_QR = 'login-qr',
    CHAT = 'chat',
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
    ADMIN_MANAGER_RULE = "manager-rules",

}

export enum STAFF_ROUTES {
    STAFF = "/staff", // Đảm bảo có dấu "/" ở đầu
    STAFF_DASHBOARD = "dashboard",
    STAFF_MANAGER_USERS = "manager-users",
}


export enum PATH {
    HOME = "/",
    FORGOT_PASSWORD = AUTH_ROUTES.AUTH + "/" + AUTH_ROUTES.FORGOT_PASSWORD,
    LOGIN_IN = AUTH_ROUTES.AUTH + "/" + AUTH_ROUTES.LOGIN_IN,
    REGISTER = AUTH_ROUTES.AUTH + "/" + AUTH_ROUTES.REGISTER,
    CHANGE_PASSWORD = USER_ROUTES.AUTH + "/" + USER_ROUTES.CHANGE_PASSWORD,
    EDIT_PROFILE = USER_ROUTES.AUTH + "/" + USER_ROUTES.EDIT_PROFILE,
    VERIFY_ACCOUNT = USER_ROUTES.AUTH + "/" + USER_ROUTES.VERIFY_ACCOUNT,
    //VNPAY
    PAYMENT_SUCCESS = USER_ROUTES.PAYMENT + "/" + 'success',
    //PAYOS
    PAYMENT_PAYOS_SUCCESS = USER_ROUTES.PAYMENT + "/" + 'success?code=00&status=PAID',
    PAYMENT_FAILED = USER_ROUTES.PAYMENT + "/" + 'failed',

    STAFF_MANAGER_USERS = STAFF_ROUTES.STAFF + "/" + 'account' + STAFF_ROUTES.STAFF_MANAGER_USERS
}