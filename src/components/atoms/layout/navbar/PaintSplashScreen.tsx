import { useState, useEffect } from "react";
import "./PaintSplashScreen.css";
import { useCanvasPreload } from "@/context/CanvasPreloadContext";

const PaintSplashScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const { isPreloading, hasPreloadedData, startPreload } = useCanvasPreload();

  const steps = [
    "Đang tải các thiết kế gần đây",
    "Chuẩn bị canvas workspace",
    "Khởi tạo công cụ thiết kế",
    "Hoàn tất!",
  ];

  // Start preloading when splash screen appears
  useEffect(() => {
    startPreload();
  }, [startPreload]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 3.33; // 100% / 30 steps = 3.33% per step
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return steps.length - 1;
        }
        return prev + 1;
      });
    }, 750);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  // Update progress based on preload status
  useEffect(() => {
    if (!isPreloading && hasPreloadedData) {
      // If preload is complete, speed up the progress but don't jump to 100%
      setProgress((prev) => {
        const newProgress = prev + 15; // Speed up by 15%
        return Math.min(newProgress, 95); // Cap at 95% to let normal progress finish
      });
    }
  }, [isPreloading, hasPreloadedData]);

  // Ensure progress reaches 100% at the end of splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 2800); // Set to 100% 200ms before splash screen ends

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-cyan-100 via-purple-100 to-pink-100 z-50 flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      {/* <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full animate-ping animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: "3s",
            }}
          />
        ))}
        {[...Array(4)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: "2s",
            }}
          />
        ))}
      </div> */}

      <div className="text-center relative z-10">
        {/* Animated Logo GIF */}
        <div className="mb-6 animate-scale-in">
          <img
            src="/images/animation_logo.gif"
            alt="PlushDollDesign Logo"
            className="w-auto h-20 md:h-24 mx-auto"
          />
        </div>

        {/* Loading Indicator */}
        {/* <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in-delay-2">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <span className="text-purple-600 font-medium text-lg">
            Đang tải...
          </span>
        </div> */}

        {/* Current Step Display */}
        <div className="mb-6 animate-fade-in-delay-3">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">
              {steps[currentStep]}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto mb-8">
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="text-center mt-2 text-sm text-gray-500">
            {Math.min(Math.round(progress), 100)}%
          </div>
        </div>

        {/* Loading Steps */}
        <div className="flex flex-col items-center">
          <div className="text-sm text-gray-500 space-y-2 max-w-md mx-auto flex flex-col items-start">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex gap-2 transition-all duration-300 items-start ${
                  index <= currentStep ? "opacity-100" : "opacity-40"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full flex items-start ${
                    index < currentStep
                      ? "bg-green-500 animate-pulse-green"
                      : index === currentStep
                      ? "bg-blue-500 animate-pulse-blue"
                      : "bg-gray-300"
                  }`}
                ></div>
                <span
                  className={
                    index <= currentStep ? "text-gray-700" : "text-gray-400"
                  }
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Preload Status */}
        {isPreloading && (
          <div className="mt-4 text-xs text-gray-500 animate-fade-in-delay-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Đang tải danh sách thiết kế...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaintSplashScreen;
