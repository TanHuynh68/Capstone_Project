import { Button } from "@/components/ui/button";
import { USER_ROUTES } from "@/routes/path";
import { Paintbrush2} from "lucide-react";
import { Link } from "react-router-dom";

const Paint = () => {
  return (
    <div>
      <Button variant="ghost" size="icon" className="hidden md:flex">
        <Link to={USER_ROUTES.CANVAS_PAGE}>
          <Paintbrush2 className="h-5 w-5" />
          <span className="sr-only">Paint</span>
        </Link>
      </Button>
    </div>
  );
};

export default Paint;
