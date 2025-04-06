export interface DecodedUserRaw {
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string;
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string;
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string;
    exp?: number;
    nbf?: number;
    iss?: string;
    aud?: string;
}

export interface NormalizedUser {
    id: string;
    name: string;
    role: string;
    exp?: number;
}
