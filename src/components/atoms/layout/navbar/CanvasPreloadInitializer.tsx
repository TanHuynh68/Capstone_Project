import { useEffect } from "react";
import { useCanvasPreload } from "@/context/CanvasPreloadContext";

const CanvasPreloadInitializer = () => {
  const { startPreload, hasPreloadedData } = useCanvasPreload();

  useEffect(() => {
    // Add a small delay to ensure app is fully loaded
    const timer = setTimeout(() => {
      // Start preload when component mounts
      if (!hasPreloadedData) {
        startPreload();
      }
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, [startPreload, hasPreloadedData]);

  return null; // This component doesn't render anything
};

export default CanvasPreloadInitializer;
