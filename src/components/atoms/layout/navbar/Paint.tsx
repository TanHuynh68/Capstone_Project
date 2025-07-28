import { Button } from "@/components/ui/button";
import { USER_ROUTES } from "@/routes/path";
import { Paintbrush2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PaintSplashScreen from "./PaintSplashScreen";

const Paint = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(false);

  const handlePaintClick = () => {
    setShowSplash(true);

    // Sau 3 giây, chuyển đến canvas page
    setTimeout(() => {
      navigate(USER_ROUTES.CANVAS_PAGE);
      setShowSplash(false);
    }, 3000);
  };

  if (showSplash) {
    return <PaintSplashScreen />;
  }

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
