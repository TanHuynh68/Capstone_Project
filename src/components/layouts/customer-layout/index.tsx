import { Navbar } from "@/components/layouts/customer-layout/Navbar";
import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";

const CustomerLayout = () => {
    return (
        <div className=" ">
            <div className="border-b ">
                <div className="container mx-auto">
                    <Navbar />
                </div>
            </div>
            <div className="mx-20 py-10">
                <Outlet />
            </div>
            <div className="border-t">
                <div className="container mx-auto">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default CustomerLayout;
