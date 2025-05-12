import { Navbar } from "@/components/layouts/customer-layout/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import { Footer } from "./Footer";
import { USER_ROUTES } from "@/routes/path";

const CustomerLayout = () => {
    const location = useLocation();
    const HIDE_FOOTER_ROUTES = [`/${USER_ROUTES.CHAT}`]; // thêm route bạn muốn ẩn Footer
    const hideFooter = HIDE_FOOTER_ROUTES.includes(location.pathname);

    return (
        <div className=" ">
            <div className="border-b ">
                <div className="container mx-auto">
                    <Navbar />
                </div>
            </div>
            <div className="">
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
