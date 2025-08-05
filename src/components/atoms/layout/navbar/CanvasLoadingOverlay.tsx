import React from "react";
import { Palette, Sparkles } from "lucide-react";

interface CanvasLoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number; // Progress từ 0-100
}

const CanvasLoadingOverlay: React.FC<CanvasLoadingOverlayProps> = ({
  isVisible,
  message = "Đang tải thiết kế...",
  progress = 0,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-cyan-100 via-purple-100 to-pink-100 backdrop-blur-sm flex items-center justify-center mb-0">
      <div className="text-center">
        {/* Animated Icons */}
        <div className="relative mb-0 w-full">
          {/* <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-full max-w-4xl h-32 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-full animate-pulse"
              style={{ animationDuration: "2s" }}
            ></div>
          </div> */}
          <div className="relative flex items-center justify-center w-full">
            <img
              src="/images/animation_logo.gif"
              alt="Loading animation"
              className="object-contain"
              style={{
                width: "400px",
                height: "100px",
                animationDuration: "1.5s",
                animationTimingFunction: "ease-in-out",
              }}
            />
            <Palette
              className="w-12 h-12 absolute -top-4 -right-4 animate-spin text-purple-600"
              style={{
                animationDuration: "2.5s",
                animationTimingFunction: "linear",
              }}
            />
            <Sparkles
              className="w-8 h-8 absolute -bottom-4 -left-4 animate-pulse text-pink-600"
              style={{
                animationDuration: "1.8s",
                animationTimingFunction: "ease-in-out",
              }}
            />
          </div>
        </div>

        {/* Loading Text */}
        <h2
          className="text-xl font-bold mb-4 animate-pulse bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          style={{ animationDuration: "2s" }}
        >
          {message}
        </h2>
        <p className="text-lg text-gray-700 mb-8 font-medium">
          Khởi tạo canvas và tải dữ liệu thiết kế
        </p>

        {/* Loading Dots */}
        {/* <div className="flex justify-center space-x-2">
          <div
            className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"
            style={{
              animationDelay: "0ms",
              animationDuration: "1.2s",
              animationTimingFunction: "ease-in-out",
            }}
          ></div>
          <div
            className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"
            style={{
              animationDelay: "200ms",
              animationDuration: "1.2s",
              animationTimingFunction: "ease-in-out",
            }}
          ></div>
          <div
            className="w-3 h-3 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full animate-bounce"
            style={{
              animationDelay: "400ms",
              animationDuration: "1.2s",
              animationTimingFunction: "ease-in-out",
            }}
          ></div>
        </div> */}

        {/* Progress Bar */}
        <div className="mt-4 w-64 mx-auto">
          <div className="w-full bg-white-500 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-150 ease-out"
              style={{
                width:
                  progress >= 100
                    ? "100%"
                    : `${Math.min(Math.max(progress, 0), 90)}%`,
                minWidth: progress > 0 ? "2px" : "0px",
                maxWidth: "100%",
                transform: "translateZ(0)", // Hardware acceleration
                willChange: "width", // Optimize for width changes
              }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-700 font-medium">
            {progress >= 100 ? "Hoàn thành!" : `${Math.round(progress)}%`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasLoadingOverlay;
