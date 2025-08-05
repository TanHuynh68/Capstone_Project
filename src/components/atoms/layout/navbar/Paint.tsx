import { Button } from "@/components/ui/button";
import { USER_ROUTES } from "@/routes/path";
import { Paintbrush2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useRef } from "react";
import PaintSplashScreen from "./PaintSplashScreen";
import { useCanvasPreload } from "@/context/CanvasPreloadContext";

const Paint = () => {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(false);
  const { startPreload, hasPreloadedData, isPreloading } = useCanvasPreload();

  // Refs for tracking state
  const splashTimerRef = useRef<NodeJS.Timeout | null>(null);
  const preloadTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedPreloadRef = useRef(false);

  const handlePaintClick = useCallback(() => {
    // Prevent multiple clicks
    if (showSplash) {
      return;
    }

    // Clear any existing timers
    if (splashTimerRef.current) {
      clearTimeout(splashTimerRef.current);
    }
    if (preloadTimerRef.current) {
      clearTimeout(preloadTimerRef.current);
    }

    // Start preload if not already done and not currently preloading
    if (!hasPreloadedData && !isPreloading && !hasStartedPreloadRef.current) {
      console.log("Paint: Starting preload on button click");
      hasStartedPreloadRef.current = true;
      startPreload();

      // Stop preload after 3 seconds regardless of completion
      preloadTimerRef.current = setTimeout(() => {
        console.log("Paint: Preload timeout reached (3s)");
        hasStartedPreloadRef.current = false;
      }, 3000);
    }

    setShowSplash(true);

    // Navigate after exactly 3 seconds
    splashTimerRef.current = setTimeout(() => {
      navigate(USER_ROUTES.CANVAS_PAGE);
      setShowSplash(false);

      // Clean up preload timer if still running
      if (preloadTimerRef.current) {
        clearTimeout(preloadTimerRef.current);
        preloadTimerRef.current = null;
      }
      hasStartedPreloadRef.current = false;
    }, 3000);
  }, [hasPreloadedData, isPreloading, startPreload, navigate, showSplash]);

  // Cleanup timers on unmount
  const cleanup = useCallback(() => {
    if (splashTimerRef.current) {
      clearTimeout(splashTimerRef.current);
    }
    if (preloadTimerRef.current) {
      clearTimeout(preloadTimerRef.current);
    }
    hasStartedPreloadRef.current = false;
  }, []);

  // Cleanup on unmount
  useCallback(() => {
    return cleanup;
  }, [cleanup]);

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
        disabled={showSplash}
      >
        <Paintbrush2 className="h-5 w-5" />
        <span className="sr-only">Paint</span>
      </Button>
    </div>
  );
};

export default Paint;
