import { DecodedUserRaw, NormalizedUser } from "@/types/auth";

export function normalizeDecodedUser(decoded: DecodedUserRaw): NormalizedUser {
  return {
    name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
    id: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
    role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    exp: decoded.exp,
  };
}
