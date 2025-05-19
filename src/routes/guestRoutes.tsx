import { USER_ROUTES } from "./path";
import { CustomerLayout } from "../components/layouts";
import { HomePage, AboutPage, ContactPage } from "../pages";
//
export const guestRoutes = [
  {
    path: USER_ROUTES.HOME,
    element: <CustomerLayout />,
    children: [
      {  index: true, element: <HomePage /> },
      {
        path: USER_ROUTES.ABOUT_PAGE,
        element: <AboutPage />,
      },
      {
        path: USER_ROUTES.CONTACT_PAGE,
        element: <ContactPage />,
      },
    ],
  },
];
