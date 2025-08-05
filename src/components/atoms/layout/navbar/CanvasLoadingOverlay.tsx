import React from "react";
import { Paintbrush2, Palette, Sparkles } from "lucide-react";

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
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-500/90 via-purple-500/90 to-pink-500/90 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center text-white">
        {/* Animated Icons */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-white/20 rounded-full animate-pulse"></div>
          </div>
          <div className="relative flex items-center justify-center">
            <Paintbrush2 className="w-16 h-16 animate-bounce" />
            <Palette
              className="w-12 h-12 absolute -top-2 -right-2 animate-spin"
              style={{ animationDuration: "3s" }}
            />
            <Sparkles className="w-8 h-8 absolute -bottom-2 -left-2 animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-3xl font-bold mb-4 animate-pulse">{message}</h2>
        <p className="text-lg opacity-90 mb-8">
          Khởi tạo canvas và tải dữ liệu thiết kế
        </p>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-64 mx-auto">
          <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300 ease-out"
              style={{
                width:
                  progress >= 100
                    ? "100%"
                    : `${Math.min(Math.max(progress, 0), 90)}%`,
                minWidth: progress > 0 ? "2px" : "0px",
                maxWidth: "100%",
              }}
            ></div>
          </div>
          <div className="mt-2 text-sm opacity-80">
            {progress >= 100 ? "Hoàn thành!" : `${Math.round(progress)}%`}
          </div>
        </div>

        {/* Loading Spinner */}
        {/* <div className="mt-6">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
        </div> */}
      </div>
    </div>
  );
};

export default CanvasLoadingOverlay;
