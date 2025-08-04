export enum USER_ROUTES {
  HOME = "/",
  HOME_PAGE = "/", // Đảm bảo rằng đường dẫn này không gây xung đột
  AUTH = "/auth",
  ORDER = "/order",
  ORDER_HISTORY_PAGE = "order/history",
  ORDER_DETAIL_PAGE = "order/:id",
  CHANGE_PASSWORD = "change-password",
  PROFILE = "profile",
  EDIT_PROFILE = "edit-profile",
  VERIFY_ACCOUNT = "verify-account",
  MY_WALLET = "my-wallet",
  PAYMENT_RESULT = "api/v1/wallet/vnpay-callback",
  PAYOS_PAYMENT_RESULT = "api/v1/wallet/payos-callback",
  PAYMENT = "payment",
  PAYMENT_SUCCESS = "payment/success",
  PAYMENT_PAYOS_SUCCESS = "payment/success?code=00&status=PAID",
  PAYMENT_FAILED = "payment/failed",
  TRANSACTION_HISTORY = "transaction-history",
  DEPOSIT_WITHDRAWAL_HISTORY = "deposit-withdrawal-history",
  LOGIN_QR = "login-qr",
  CHAT = "/chat",
  PLUSHDOLL_DESIGN = "plushdoll-design",
  CANVAS_PAGE = "canvas",
  ABOUT_PAGE = "about",
  CONTACT_PAGE = "contact",
  POST_PAGE = "post",
  MY_POST_PAGE = "my-post",
  POST_DETAIL_PAGE = "post/detail/:id",
  POST_OFFER_PAGE = "post-offer",
  DESIGNER_PORTFOLIO_PAGE = "portfolio/:id",
  CUSTOMER_UPLOAD_PAGE = "post/upload-post",
  CUSTOMER_MANAGE_REPORTS = "manage-reports",

}

export enum AUTH_ROUTES {
  AUTH = "/auth",
  LOGIN_IN = "login",
  REGISTER = "register",
  FORGOT_PASSWORD = "forgot-password",
  VERIFY_ACCOUNT = "verify-account",
  REVERIFY_ACCOUNT = "reverify-account"
}

export enum DESIGNER_ROUTES {
  DESIGNER = "/designer",
  PORTFOLIO = "portfolio",
  PROGRESS = "progress",
  TIMELINE = "schedule",
}

export enum ADMIN_ROUTES {
  ADMIN = "/admin", // Đảm bảo có dấu "/" ở đầu
  ADMIN_DASHBOARD = "dashboard",
  ADMIN_MANAGER_BENEFIT = "manager-benefits",
  ADMIN_CREATE_STAFF = "create-staff",
}

export enum STAFF_ROUTES {
  STAFF = "/staff", // Đảm bảo có dấu "/" ở đầu
  STAFF_DASHBOARD = "dashboard",
  STAFF_MANAGER_USERS = "manager-users",
  STAFF_MANAGE_REPORT = "manage-report",
  STAFF_MANAGER_WITHDRAWAL = "manager-withdrawal",
  STAFF_MANAGER_WALLET_TRANSACTION = "manager-wallet-transaction",
  STAFF_MANAGE_POSTS = "manager-posts",
}

export enum PATH {
  MY_WALLET = "my-wallet",
  MY_POST = "my-post",
  CUSTOMER_UPLOAD_PAGE = "upload-post",
  CUSTOMER_ORDER_HISTORY_PAGE = `${USER_ROUTES.ORDER}/history`,
  CHAT_PAGE = `${USER_ROUTES.CHAT}`,
  POST_DETAIL = "/post/detail",
  ORDER_DETAIL = "/order",
  HOME = "/",
  ABOUT_PAGE = "/about",
  CONTACT_PAGE = "/contact",
  FORGOT_PASSWORD = AUTH_ROUTES.AUTH + "/" + AUTH_ROUTES.FORGOT_PASSWORD,
  LOGIN_IN = AUTH_ROUTES.AUTH + "/" + AUTH_ROUTES.LOGIN_IN,
  REGISTER = AUTH_ROUTES.AUTH + "/" + AUTH_ROUTES.REGISTER,
  CHANGE_PASSWORD = USER_ROUTES.AUTH + "/" + USER_ROUTES.CHANGE_PASSWORD,
  EDIT_PROFILE = USER_ROUTES.AUTH + "/" + USER_ROUTES.EDIT_PROFILE,
  VERIFY_ACCOUNT = USER_ROUTES.AUTH + "/" + USER_ROUTES.VERIFY_ACCOUNT,
  //VNPAY
  PAYMENT_SUCCESS = USER_ROUTES.PAYMENT + "/" + "success",
  //PAYOS
  PAYMENT_PAYOS_SUCCESS = USER_ROUTES.PAYMENT +
  "/" +
  "success?code=00&status=PAID",
  PAYMENT_FAILED = USER_ROUTES.PAYMENT + "/" + "failed",
  STAFF_MANAGER_USERS = STAFF_ROUTES.STAFF +
  "/" +
  "account" +
  STAFF_ROUTES.STAFF_MANAGER_USERS,

  STAFF_DASHBOARD = STAFF_ROUTES.STAFF + "/" + STAFF_ROUTES.STAFF_DASHBOARD,
  STAFF_DASHBOARD_MANAGER_USERS = STAFF_ROUTES.STAFF +
  "/" +
  STAFF_ROUTES.STAFF_DASHBOARD +
  "/" +
  STAFF_ROUTES.STAFF_MANAGER_USERS,
  STAFF_MANAGER_WITHDRAWAL = STAFF_ROUTES.STAFF +
  "/" +
  STAFF_ROUTES.STAFF_DASHBOARD +
  "/" +
  STAFF_ROUTES.STAFF_MANAGER_WITHDRAWAL,

  STAFF_MANAGER_WALLET_TRANSACTION = STAFF_ROUTES.STAFF +
  "/" +
  STAFF_ROUTES.STAFF_DASHBOARD +
  "/" +
  STAFF_ROUTES.STAFF_MANAGER_WALLET_TRANSACTION,

  STAFF_MANAGE_REPORT = STAFF_ROUTES.STAFF +
  "/" +
  STAFF_ROUTES.STAFF_MANAGE_REPORT,
  //Admin
  ADMIN_DASHBOARD = ADMIN_ROUTES.ADMIN + "/" + ADMIN_ROUTES.ADMIN_DASHBOARD,
  ADMIN_CREATE_STAFF = ADMIN_ROUTES.ADMIN + "/" + ADMIN_ROUTES.ADMIN_CREATE_STAFF,
  DESIGNER_PORTFOLIO_PAGE = "/portfolio/:id",
  STAFF_MANAGE_POSTS = STAFF_ROUTES.STAFF + "/" + STAFF_ROUTES.STAFF_MANAGE_POSTS,

  //Designer
  DESIGNER_TIMELINE = DESIGNER_ROUTES.PROGRESS + "/" + DESIGNER_ROUTES.TIMELINE,
}
