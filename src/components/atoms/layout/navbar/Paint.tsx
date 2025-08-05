import { Button } from "@/components/ui/button";
import { USER_ROUTES } from "@/routes/path";
import { Paintbrush2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Paint = () => {
  const navigate = useNavigate();

  const handlePaintClick = () => {
    navigate(USER_ROUTES.CANVAS_PAGE);
  };

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        className="hidden md:flex"
        onClick={handlePaintClick}
      >
        <Paintbrush2 className="h-5 w-5" />
        <span className="sr-only">Paint</span>
      </Button>
    </div>
  );
};

export default Paint;
