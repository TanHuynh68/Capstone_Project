import { Button } from "@/components/ui/button";
import { PATH } from "@/routes/path";
import { Link } from "react-router-dom";

const UserAuth = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outline">
        <Link to={PATH.LOGIN_IN}>Đăng nhập</Link>
      </Button>
      <Button>
        <Link to={PATH.REGISTER}>Đăng ký</Link>
      </Button>
    </div>
  );
};

export default UserAuth;
