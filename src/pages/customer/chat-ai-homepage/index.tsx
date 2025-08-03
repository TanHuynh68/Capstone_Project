"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Send } from "lucide-react";
import ChatAIService from "@/services/ChatAIService";
import Lottie from "react-lottie-player";
import robotAIAnimation from "@/../public/lottiefiles/RobotAI.json";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

export default function ChatAIHomePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Chào Bạn, mình là trợ lý thông minh của PlushDollCustom. Rất vui được hỗ trợ Bạn.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const { postChatAI } = ChatAIService();

  const userId = useSelector((state: RootState) => state.user.id);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Đặt hooks ở đây, trước mọi return
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  if (!userId || !token) return null;

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    try {
      // Gửi nội dung chat tới API
      const res = await postChatAI({ question: input });
      // Giả sử response là { answer: string }

      console.log(res, "res");
      if (res?.responseRequestModel) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: res?.responseRequestModel },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Đã xảy ra lỗi, vui lòng thử lại." },
      ]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 m-0 p-0">
      {/* Trigger Button */}
      <Button
        size="icon"
        className="bg-transparent p-0 border-none shadow-none hover:bg-transparent cursor-pointer"
        aria-label="Open chat"
        onClick={toggleChat}
        style={{ width: 200, height: 150, marginRight: -50, padding: 0 }}
      >
        <div
          style={{
            width: 200,
            height: 150,
            overflow: "hidden",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            margin: 0,
            padding: 0,
          }}
        >
          <Lottie
            loop
            play
            animationData={robotAIAnimation}
            style={{ width: 200, height: 150 }}
          />
        </div>
      </Button>

      {/* Chat Box */}
      <div
        className={`
          fixed bottom-4 right-4
          w-full max-w-sm h-[calc(100vh-32px)] md:h-[70vh]
          flex flex-col rounded-xl shadow-lg overflow-hidden
          bg-background text-foreground dark:bg-background dark:text-foreground
          transition-all duration-300 ease-in-out
          ${
            isOpen
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0 pointer-events-none"
          }
        `}
        style={{ transform: isOpen ? "translateY(0)" : "translateY(100%)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground shrink-0">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 border-2 border-primary bg-background dark:border-primary dark:bg-background">
              <AvatarImage src="/images/logo.png" alt="PlushDollCustom Logo" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <h2 className="text-base font-semibold dark:text-primary-foreground">
              Plush Doll Custom
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground cursor-pointer hover:bg-primary/20 dark:text-primary-foreground dark:hover:bg-primary/20"
            onClick={toggleChat}
          >
            <Minus className="h-5 w-5" />
          </Button>
        </div>

        {/* Chat Content */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-card text-card-foreground dark:bg-card dark:text-primary-foreground">
          <div className="space-y-2">
            {messages.map((msg, idx) => {
              const isDifferentRole =
                idx === 0 || messages[idx - 1].role !== msg.role;
              return (
                <div
                  key={idx}
                  className={
                    (msg.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start items-start") +
                    (isDifferentRole ? " mt-4" : "")
                  }
                >
                  {msg.role === "bot" && (
                    <Avatar className="w-6 h-6 mr-2 mt-0.5">
                      <AvatarImage src="/images/logo.png" alt="Bot" />
                      <AvatarFallback>PD</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={
                      msg.role === "user"
                        ? "bg-primary  rounded-2xl px-4 py-2 max-w-[70%] text-base "
                        : "bg-muted text-muted-foreground rounded-xl px-3 py-1.5 max-w-[70%] text-base"
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground rounded-xl px-3 py-2 max-w-xs animate-pulse text-base">
                  Đang trả lời...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="flex items-center p-4 border-t border-border bg-card text-card-foreground">
          <Input
            placeholder="Bạn cần hỗ trợ gì ..."
            className="flex-1 rounded-full px-3 py-1.5 bg-muted text-muted-foreground border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-xs"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <Button
            size="icon"
            className="bg-primary cursor-pointer ml-2 hover:bg-primary/80 text-primary-foreground rounded-full dark:bg-primary dark:text-primary-foreground"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
