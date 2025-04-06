import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/redux/userSlice";
import { jwtDecode } from "jwt-decode";
import { normalizeDecodedUser } from "@/components/utils/jwt";

export function InitUserFromToken(): null {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<DecodedUserRaw>(token);
      const user = normalizeDecodedUser(decoded);
      dispatch(loginSuccess(user));
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
    }
  }, [dispatch]);

  return null;
}
