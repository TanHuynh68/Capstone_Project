import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import "./PaintSplashScreen.css";

const PaintSplashScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    "Đang tải các thiết kế gần đây",
    "Chuẩn bị canvas workspace",
    "Khởi tạo công cụ thiết kế",
    "Hoàn tất!",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 3.33; // 100% / 30 steps = 3.33% per step
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
        {/* Animated Logo */}
        {/* <div className="w-32 h-32 mx-auto mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse"></div>
          <div className="absolute inset-3 bg-white rounded-full flex items-center justify-center shadow-lg">
            <Paintbrush2 className="w-16 h-16 text-purple-600 animate-bounce" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-pulse" />
        </div> */}

        {/* Animated Logo GIF */}
        <div className="mb-6 animate-scale-in">
          <img
            src="/images/animation_logo.gif"
            alt="PlushDollDesign Logo"
            className="w-auto h-20 md:h-24 mx-auto"
          />
        </div>

        {/* Subtitle */}
        {/* <p className="text-xl text-gray-600 mb-8 animate-fade-in-delay">
          Đang chuẩn bị không gian thiết kế...
        </p> */}

        {/* Loading Indicator */}
        <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in-delay-2">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <span className="text-purple-600 font-medium text-lg">
            Đang tải...
          </span>
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
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300 ease-out shadow-lg"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-center mt-2 text-sm text-gray-500">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Loading Steps */}
        <div className="text-sm text-gray-500 space-y-2 max-w-md mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 transition-all duration-300 ${
                index <= currentStep ? "opacity-100" : "opacity-40"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
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
    </div>
  );
};

export default PaintSplashScreen;
