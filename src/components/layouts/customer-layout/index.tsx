
import { Outlet } from "react-router-dom";

const CustomerLayout: React.FC = () => {
    return (
        <div>
            {/* <Navbar /> */}
            <Outlet />
            {/* <Footer/> */}
        </div>
    );
};

export default CustomerLayout;
