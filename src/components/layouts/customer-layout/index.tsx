import { Navbar } from "@/components/layouts/customer-layout/Navbar";
import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";

const CustomerLayout = () => {
    return (
        <div>
            <Navbar />
            <div className="mx-20">
                <div className="container mx-auto py-10">
                    <Outlet />
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default CustomerLayout;
