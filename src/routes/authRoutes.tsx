import { AUTH_ROUTES } from "./path";
import { LoginPage } from "@/pages";

export const authRoutes = [
    {
        path: AUTH_ROUTES.AUTH,
        children: [
            {
                path: AUTH_ROUTES.LOGIN_IN,
                element: <LoginPage />,
            },
        ],
    },
]