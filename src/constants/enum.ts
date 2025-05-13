export enum HTTP_METHOD {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
    PATCH = 'PATCH',
    OPTIONS = 'OPTIONS',
    HEAD = 'HEAD'
}

export enum ROLE {
    CUSTOMER = 'Customer',
    STAFF = 'Staff',
    ADMIN = 'Admin',
    ARTIST = 'Artist',
}

export enum HTTP_STATUS {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,

    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    METHOD_NOT_ALLOWED = 405,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,

    INTERNAL_SERVER_ERROR = 500,
    NOT_IMPLEMENTED = 501,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
    GATEWAY_TIMEOUT = 504,
}

export enum WALLET_TRANSACTION_TYPE {
    Deposit = 0,        // Nạp tiền
    Withdraw = 1,       // Rút tiền
    Transfer = 2,       // Chuyển tiền
    Receive = 3,        // Nhận tiền
    PlaceDeposit = 4,   // Đặt cọc
    RefundDeposit = 5   // Hoàn cọc
}
  
export enum NotificationType {
    ORDER = "order",
    PAYMENT = "payment",
    PROMOTION = "promotion",
    ACCOUNT = "account",
    SYSTEM = "system",
}