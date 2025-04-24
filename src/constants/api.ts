export const enum API_ENDPOINTS {
    ADDRESS = 'address',
    AUTH = 'auth',
}

export enum API_ROUTES {
    // Address APIs
    CREATE_ADDRESS = `${API_ENDPOINTS.ADDRESS}`,
    GET_ADDRESSES = `${API_ENDPOINTS.ADDRESS}`,
    UPDATE_ADDRESS = `${API_ENDPOINTS.ADDRESS}/:id`,
    
    DELETE_ADDRESS = `${API_ENDPOINTS.ADDRESS}/:id`,

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
}
