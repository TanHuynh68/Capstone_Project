export const enum API_ENDPOINTS {
    ADDRESS = 'address',
    AUTH = 'auth',
}

export enum API_ROUTES {
    // Address APIs
    CREATE_ADDRESS = `${API_ENDPOINTS.ADDRESS}`,
    GET_ADDRESSES = `${API_ENDPOINTS.ADDRESS}`,
    UPDATE_ADDRESS = `${API_ENDPOINTS.ADDRESS}/:id`,
    
    GENERATE_ADDRESS_CODE = `${API_ENDPOINTS.ADDRESS}/generate-code`,
    REDEEM_ADDRESS_CODE = `${API_ENDPOINTS.ADDRESS}/redeem-code`,

    // Auth APIs
    SIGN_IN = `${API_ENDPOINTS.AUTH}/sign-in`,
    GET_PROFILE = `${API_ENDPOINTS.AUTH}/profile`,

    // Test API
    TEST = `/test`,
}
