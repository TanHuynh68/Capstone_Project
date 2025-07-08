import { Navbar } from "@/components/layouts/customer-layout/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./Footer";
import { USER_ROUTES } from "@/routes/path";
// CustomerLayout.tsx
const CustomerLayout = () => {
  const location = useLocation();

  const isChatPage = location.pathname === USER_ROUTES.CHAT;

  const HIDE_FOOTER_ROUTES = [
    USER_ROUTES.CHAT,
    `/${USER_ROUTES.PLUSHDOLL_DESIGN}`,
  ];
  const HIDE_HEADER_ROUTES = [
    `/${USER_ROUTES.PLUSHDOLL_DESIGN}`,
  ];

  const hideFooter = HIDE_FOOTER_ROUTES.includes(location.pathname);
  const hideHeader = HIDE_HEADER_ROUTES.includes(location.pathname);

  return (
    <div className={isChatPage ? "flex flex-col h-screen" : ""}>
      {!hideHeader && (
        <div className="border-b shrink-0">
          <div className="container mx-auto">
            <Navbar />
          </div>
        </div>
      )}

      {/* Outlet sẽ chiếm toàn bộ phần còn lại */}
      <div className={isChatPage ? "flex-1 overflow-hidden" : ""}>
        <Outlet />
      </div>

      {!hideFooter && (
        <div className="border-t mt-10">
          <div className="container mx-auto">
            <Footer />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerLayout;
