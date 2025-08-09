import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface AutoSaveComponentProps {
  isAutoSaveEnabled: boolean;
  setIsAutoSaveEnabled: (enabled: boolean) => void;
  autoSaveCountdown: number;
  setAutoSaveCountdown: (
    countdown: number | ((prev: number) => number)
  ) => void;
  saveCanvasAsJSON: () => Promise<void>;
}

const AutoSaveComponent: React.FC<AutoSaveComponentProps> = ({
  isAutoSaveEnabled,
  setIsAutoSaveEnabled,
  autoSaveCountdown,
  setAutoSaveCountdown,
  saveCanvasAsJSON,
}) => {
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Add auto save effect
  useEffect(() => {
    if (isAutoSaveEnabled) {
      // Start countdown
      countdownIntervalRef.current = setInterval(() => {
        setAutoSaveCountdown((prev: number) => {
          if (prev <= 1) {
            return 5; // Reset to 5 when reaching 0
          }
          return prev - 1;
        });
      }, 1000);

      // Start auto save
      autoSaveIntervalRef.current = setInterval(() => {
        saveCanvasAsJSON();
      }, 5000);
    } else {
      // Clear intervals when disabled
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
      setAutoSaveCountdown(5); // Reset countdown
    }

    // Cleanup on unmount
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [isAutoSaveEnabled, saveCanvasAsJSON, setAutoSaveCountdown]);

  const toggleAutoSave = () => {
    setIsAutoSaveEnabled(!isAutoSaveEnabled);
  };

  return (
    <Button
      variant={isAutoSaveEnabled ? "default" : "outline"}
      onClick={toggleAutoSave}
      className="flex items-center gap-2"
    >
      <Save className="w-4 h-4" />
      {isAutoSaveEnabled ? (
        <span className="flex items-center gap-1">
          <span className="text-xs font-medium">Tự động lưu: </span>
          <span className="text-xs font-medium">{autoSaveCountdown}s</span>
        </span>
      ) : (
        <span className="text-xs font-medium">Tự động lưu: Tắt</span>
      )}
    </Button>
  );
};

export default AutoSaveComponent;
