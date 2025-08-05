import React from "react";
import { Paintbrush2, Palette, Sparkles } from "lucide-react";

const PaintSplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
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
        <h2 className="text-3xl font-bold mb-4 animate-pulse">
          Đang chuẩn bị...
        </h2>
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
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full animate-pulse"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintSplashScreen;
