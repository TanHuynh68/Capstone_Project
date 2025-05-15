
export enum ROLE_ON_LINK {
    CUSTOMER = 'customer',
    STAFF = 'staff',
    ADMIN = 'admin',
    ARTIST = 'artist',
}

export const enum API_ENDPOINTS {
    ADDRESS = 'address',
    RULE = 'rule',
    AUTH = 'auth',
    WALLET = 'wallet',
    ACCOUNT = 'account',
    USER = 'user',
    CHANGE_ACTIVE = 'change-active',
    NOTIFICATION = 'notification',
    CANVAS = 'canvas',
}

export enum API_ROUTES {
    // Address APIs
    CREATE_ADDRESS = `${API_ENDPOINTS.ADDRESS}`,
    GET_ADDRESSES = `${API_ENDPOINTS.ADDRESS}`,
    UPDATE_ADDRESS = `${API_ENDPOINTS.ADDRESS}/:id`,
    DELETE_ADDRESS = `${API_ENDPOINTS.ADDRESS}/:id`,
    //Manager user by staff
    // CREATE_USER = `${ROLE_ON_LINK.STAFF}/${API_ENDPOINTS.ACCOUNT}/${API_ENDPOINTS.USER}`,
    GET_USERES = `${ROLE_ON_LINK.STAFF}/${API_ENDPOINTS.ACCOUNT}/${API_ENDPOINTS.USER}`,
    UPDATE_USER = `${ROLE_ON_LINK.STAFF}/${API_ENDPOINTS.ACCOUNT}/${API_ENDPOINTS.CHANGE_ACTIVE}`,
    // DELETE_USER = `${ROLE_ON_LINK.STAFF}/${API_ENDPOINTS.ACCOUNT}/${API_ENDPOINTS.USER}/:id`,

    GENERATE_ADDRESS_CODE = `${API_ENDPOINTS.ADDRESS}/generate-code`,
    REDEEM_ADDRESS_CODE = `${API_ENDPOINTS.ADDRESS}/redeem-code`,

    // Auth APIs
    SIGN_IN = `${API_ENDPOINTS.AUTH}/sign-in`,
    SIGN_UP = `${API_ENDPOINTS.AUTH}/sign-up`,
    GET_PROFILE = `${API_ENDPOINTS.AUTH}/profile`,
    CHANGE_PASSWORD = `${API_ENDPOINTS.AUTH}/change-password`,
    VERIFY_ACCOUNT = `${API_ENDPOINTS.AUTH}/verify-account`,
    SEND_RESET_PASSWORD_MAIL = `${API_ENDPOINTS.AUTH}/send-reset-password-email`,

    RESET_PASSWORD = `${API_ENDPOINTS.AUTH}/reset-password`,
    FORGOT_PASSWORD = `${API_ENDPOINTS.AUTH}/forgot-password-otp-verify`,

    RESEND_OTP = `${API_ENDPOINTS.AUTH}/resend-verify-account-email`,
    // Test API
    TEST = `/test`,
    GET_WALLET = `${API_ENDPOINTS.WALLET}`,
    UPDATE_WALLET = `${API_ENDPOINTS.WALLET}`,
    STAFF_WALLET_TRANSACTION = `${ROLE_ON_LINK.STAFF}/${API_ENDPOINTS.WALLET}/transaction`,
    WALLET_TRANSACTION = `${API_ENDPOINTS.WALLET}/transaction?page=1&size=100`,
    STAFF_WALLET_ORDER = `${ROLE_ON_LINK.STAFF}/${API_ENDPOINTS.WALLET}/order`,
    WALLET_ORDER = `${API_ENDPOINTS.WALLET}/order?page=1&size=100`,
    PLACE_DEPOSIT = `${API_ENDPOINTS.WALLET}/place-deposit`,
    REFUND_DEPOSIT = `${API_ENDPOINTS.WALLET}/refund-deposit`,
    VNPAY_LINK = `${API_ENDPOINTS.WALLET}/vnpay-link?depositMoney`,
    VNPAY_CALLBACK = `${API_ENDPOINTS.WALLET}/vnpay-callback`,
    PAYOS_LINK = `${API_ENDPOINTS.WALLET}/payos-link`,
    PAYOS_CALLBACK = `${API_ENDPOINTS.WALLET}/payos-callback`,
    PAYOS_WEBHOOK = `${API_ENDPOINTS.WALLET}/payos/webhook`,
    PAYOS_PAYMENT_INFO = `${API_ENDPOINTS.WALLET}/payos-payment-info`, // cần truyền {id} khi sử dụng
    PAYOS_CANCEL = `${API_ENDPOINTS.WALLET}/payos/cancel`, // cần truyền {id} khi sử dụng
    // Notification
    GET_NOTIFICATION = `${API_ENDPOINTS.NOTIFICATION}`,
    CREATE_NOTIFICATION = `${API_ENDPOINTS.NOTIFICATION}`,
    DELETE_NOTIFICATION = `${API_ENDPOINTS.NOTIFICATION}`,

    //Bank
    GET_BANKS = 'https://api.vietqr.io/v2/banks'


    //Rule
    CREATE_RULE = `${ROLE_ON_LINK.ADMIN}/${API_ENDPOINTS.RULE}`,
    GET_RULE = `${API_ENDPOINTS.RULE}`,
    GET_RULE_BY_ID = `${API_ENDPOINTS.RULE}/:id`,
    // DELETE_RULE = `${API_ENDPOINTS.ADDRESS}/:id`,

    //Canvas
    CREATE_CANVAS = `${API_ENDPOINTS.CANVAS}`,
    GET_CANVAS = `${API_ENDPOINTS.CANVAS}`,

}
