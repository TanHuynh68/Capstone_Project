import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (
        <div>
            {/* Bạn có thể thêm <Navbar /> ở đây */}
            <Outlet /> {/* Quan trọng: Hiển thị component con */}
            {/* Bạn có thể thêm <Footer /> ở đây */}
        </div>
    );
};

export default AdminLayout;
