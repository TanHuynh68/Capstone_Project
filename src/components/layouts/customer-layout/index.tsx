import { Navbar } from "@/components/layouts/customer-layout/Navbar";
import { Outlet } from "react-router-dom";

const CustomerLayout = () => {
    return (
        <div>
            <div>
                <Navbar />
            </div>
            <div className="mx-20">
                <div className="container mx-auto">
                    <Outlet /> {/* Quan trọng: Hiển thị component con */}
                    {/* Bạn có thể thêm <Footer /> ở đây */}
                </div>
            </div>
        </div>
    );
};

export default CustomerLayout;
