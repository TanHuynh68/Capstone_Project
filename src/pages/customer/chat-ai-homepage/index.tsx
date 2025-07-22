"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Menu, Smile, Send, MessageCircle } from "lucide-react";

export default function ChatAIHomepage() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Trigger Button */}
      <Button
        size="icon"
        className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        aria-label="Open chat"
        onClick={toggleChat}
      >
        <MessageCircle className="h-7 w-7" />
      </Button>

      {/* Chat Box */}
      <div
        className={`
          fixed bottom-4 right-4
          w-full max-w-md h-[calc(100vh-64px)] md:h-[600px]
          flex flex-col rounded-xl shadow-lg overflow-hidden bg-white
          transition-all duration-300 ease-in-out
          ${
            isOpen
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0 pointer-events-none"
          }
        `}
        style={{ transform: isOpen ? "translateY(0)" : "translateY(100%)" }} // Ensure smooth transition
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white shrink-0">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 border-2 border-white">
              <AvatarImage
                src="/placeholder.svg?height=40&width=40"
                alt="ACB Logo"
              />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-semibold">Chat cùng ACB</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
            onClick={toggleChat}
          >
            <Minus className="h-5 w-5" />
          </Button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
          <div className="flex justify-center py-4">
            <img
              src="/placeholder.svg?height=120&width=120"
              alt="Robot Illustration"
              className="h-32 w-32 object-contain"
            />
          </div>
          <div className="text-center text-gray-700 text-sm px-4">
            <p>
              Chào Bạn, mình là ONE - trợ lý thông minh của ACB. Rất vui được hỗ
              trợ Bạn.
            </p>
          </div>

          <div className="relative flex items-center justify-center py-4">
            <div className="absolute inset-x-0 h-px bg-gray-200" />
            <span className="relative z-10 bg-gray-50 px-3 text-xs text-gray-500">
              Hôm nay
            </span>
          </div>
        </div>

        {/* Input Area */}
        <div className="flex items-center p-4 border-t border-gray-200 bg-white space-x-2 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Bạn cần hỗ trợ gì ..."
            className="flex-1 rounded-full px-4 py-2 bg-gray-100 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:bg-gray-100"
          >
            <Smile className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
