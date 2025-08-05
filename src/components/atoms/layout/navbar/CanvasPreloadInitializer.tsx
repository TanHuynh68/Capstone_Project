import { useEffect, useRef } from "react";
import { useCanvasPreload } from "@/context/CanvasPreloadContext";

const CanvasPreloadInitializer = () => {
  const { startPreload, hasPreloadedData, isPreloading } = useCanvasPreload();
  const hasStartedPreloadRef = useRef(false);

  useEffect(() => {
    // Prevent multiple preload starts
    if (hasStartedPreloadRef.current) {
      return;
    }

    // Add a small delay to ensure app is fully loaded
    const timer = setTimeout(() => {
      // Start preload when component mounts and not already preloading
      if (!hasPreloadedData && !isPreloading) {
        console.log("CanvasPreloadInitializer: Starting preload");
        hasStartedPreloadRef.current = true;
        startPreload();
      }
    }, 1500); // Increased delay to 1.5 seconds for better app initialization

    return () => clearTimeout(timer);
  }, [startPreload, hasPreloadedData, isPreloading]);

  return null; // This component doesn't render anything
};

export default CanvasPreloadInitializer;
