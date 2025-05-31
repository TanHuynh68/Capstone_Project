import { Button } from "@/components/ui/button";
import { USER_ROUTES } from "@/routes/path";
import { Newspaper } from "lucide-react";
import { Link } from "react-router-dom";

const Post = () => {
  return (
    <Button variant="ghost" size="icon" className="hidden md:flex">
      <Link to={USER_ROUTES.POST_PAGE}>
        <Newspaper className="h-5 w-5" />
        <span className="sr-only">Post</span>
      </Link>
    </Button>
  );
};

export default Post;
