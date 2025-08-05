import { useState, useEffect } from "react";
import "./PaintSplashScreen.css";
import { useCanvasPreload } from "@/context/CanvasPreloadContext";

const PaintSplashScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const { isPreloading, hasPreloadedData, startPreload, isFabricReady } =
    useCanvasPreload();

  const steps = [
    "Đang tải các thiết kế gần đây",
    "Chuẩn bị canvas workspace",
    "Khởi tạo công cụ thiết kế",
    "Hoàn tất!",
  ];

  // Start preloading when splash screen appears (only if not already preloading)
  useEffect(() => {
    if (!hasPreloadedData && !isPreloading) {
      startPreload();
    }
  }, [startPreload, hasPreloadedData, isPreloading]);

  // Progress animation that stops at 90% and waits for preload
  useEffect(() => {
    console.log("PaintSplashScreen: Starting progress animation");
    const startTime = Date.now();
    const duration = 3000; // 3 seconds total
    let animationId: number;

    const animateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / duration) * 90, 90); // Stop at 90%

      console.log("PaintSplashScreen: Progress update:", progressPercent);
      setProgress(progressPercent);

      if (elapsed < duration) {
        animationId = requestAnimationFrame(animateProgress);
      }
    };

    animationId = requestAnimationFrame(animateProgress);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  // Complete progress to 100% when preload is done
  useEffect(() => {
    if (!isPreloading && hasPreloadedData) {
      console.log(
        "PaintSplashScreen: Preload complete, setting progress to 100%"
      );
      setProgress(100);
    }
  }, [isPreloading, hasPreloadedData]);

  // Step transitions - complete all steps within 3 seconds
  useEffect(() => {
    const stepDuration = 3000 / steps.length; // Distribute steps evenly over 3 seconds

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return steps.length - 1;
        }
        return prev + 1;
      });
    }, stepDuration);

    return () => clearInterval(stepInterval);
  }, []);

  console.log("PaintSplashScreen: Current progress:", progress);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-cyan-100 via-purple-100 to-pink-100 z-50 flex items-center justify-center overflow-hidden">
      <div className="text-center relative z-10">
        {/* Animated Logo GIF */}
        <div className="mb-6 animate-scale-in">
          <img
            src="/images/animation_logo.gif"
            alt="PlushDollDesign Logo"
            className="w-auto h-20 md:h-24 mx-auto"
          />
        </div>

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
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full shadow-lg"
              style={{
                width: `${Math.min(progress, 100)}%`,
                transition: "none", // Remove CSS transition to prevent conflicts
              }}
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
              <span>
                {isFabricReady
                  ? "Đang tạo preview thiết kế..."
                  : "Đang tải công cụ thiết kế..."}
              </span>
            </div>
          </div>
        )}

        {/* Fabric Status */}
        {isFabricReady && (
          <div className="mt-2 text-xs text-green-500 animate-fade-in-delay-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Công cụ thiết kế đã sẵn sàng</span>
            </div>
          </div>
        )}

        {/* Waiting for Preload Status */}
        {progress >= 90 && isPreloading && (
          <div className="mt-2 text-xs text-yellow-500 animate-fade-in-delay-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>Chờ hoàn tất tải dữ liệu...</span>
            </div>
          </div>
        )}

        {/* Preload Complete */}
        {!isPreloading && hasPreloadedData && progress >= 90 && (
          <div className="mt-2 text-xs text-green-500 animate-fade-in-delay-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Dữ liệu đã sẵn sàng!</span>
            </div>
          </div>
        )}

        {/* Timeout Warning */}
        {isPreloading && progress > 80 && (
          <div className="mt-2 text-xs text-orange-500 animate-fade-in-delay-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
              <span>Chuyển đến canvas trong vài giây...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaintSplashScreen;
