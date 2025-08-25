"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Zap, Globe, ArrowUp, Paintbrush2, Mail } from "lucide-react";
import LoginVideo from "@/components/atoms/auth/login/LoginVideo";
import { USER_ROUTES } from "@/routes/path";
import { Link } from "react-router-dom";
// import ChatAIHomePage from "@/pages/customer/chat-ai-homepage";

export default function AnimatedLandingPage() {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollBtnVisible, setScrollBtnVisible] = useState(false);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const animatedElements = document.querySelectorAll("[data-animate]");
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Show scroll-to-top button when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation for scroll-to-top button
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showScrollTop) {
      setScrollBtnVisible(true);
    } else {
      timeout = setTimeout(() => setScrollBtnVisible(false), 300); // match animation duration
    }
    return () => clearTimeout(timeout);
  }, [showScrollTop]);

  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Thiết kế chuyên nghiệp",
      description:
        "Mang đến những sản phẩm thiết kế tinh tế, hiện đại và chuẩn thẩm mỹ.",
      image: "/images/header-banner.png",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Tốc độ siêu nhanh",
      description:
        "Trải nghiệm hiệu suất cực nhanh với các giải pháp được tối ưu hóa",
      image: "/images/header-banner.png",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Phạm vi nội thành TP.HCM",
      description:
        "Kết nối với khán giả trên toàn thế giới thông qua nền tảng của chúng tôi",
      image: "/images/header-banner.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-primary/10">
      {/* Hero Section */}
      <section id="home" className="relative py-20 px-16 overflow-hidden">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div
                className={`${
                  visibleElements.has("hero-badge") ? "animate-bounce-in" : ""
                }`}
                data-animate
                id="hero-badge"
              >
                <Badge className="bg-primary/10 text-primary border-primary/20 animate-float">
                  🚀 Tính năng mới có sẵn
                </Badge>
              </div>
              <h1
                className={`text-5xl md:text-7xl font-bold leading-tight ${
                  visibleElements.has("hero-title") ? "animate-fly-in-left" : ""
                }`}
                data-animate
                id="hero-title"
              >
                <span className="text-primary text-glow">Tạo ra</span>
                <br />
                <span className="text-foreground">Những trải nghiệm</span>
                <br />
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Tuyệt vời
                </span>
              </h1>
              <p
                className={`text-xl text-muted-foreground max-w-lg delay-200 ${
                  visibleElements.has("hero-description")
                    ? "animate-fly-in-left"
                    : ""
                }`}
                data-animate
                id="hero-description"
              >
                Biến ý tưởng của bạn thành những trải nghiệm thị giác tuyệt đẹp
                với nền tảng tiên tiến của chúng tôi. Tham gia cùng hàng nghìn
                nhà sáng tạo tin tưởng công cụ của chúng tôi.
              </p>
              <div
                className={`flex flex-col sm:flex-row gap-4 delay-400 ${
                  visibleElements.has("hero-buttons") ? "animate-fly-in-up" : ""
                }`}
                data-animate
                id="hero-buttons"
              >
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 transform hover:scale-105 transition-all duration-300 group"
                  asChild
                >
                  <Link
                    to={USER_ROUTES.CANVAS_PAGE}
                    className="flex items-center gap-2 "
                  >
                    <Paintbrush2 className="h-5 w-5" />
                    <span className="inline-block align-middle">
                      Bắt đầu sáng tạo
                    </span>
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/5 group bg-transparent"
                >
                  <Link
                    to={USER_ROUTES.CONTACT_PAGE}
                    className="flex items-center gap-2 "
                  >
                    <Mail className="h-5 w-5" />
                    <span className="inline-block align-middle">Liên hệ</span>
                  </Link>
                </Button>
              </div>
            </div>
            <div
              className={`relative w-full aspect-video max-h-[500px] md:max-h-[600px] lg:max-h-[700px] mx-auto rounded-xl overflow-hidden shadow-lg ${
                visibleElements.has("hero-login-video")
                  ? "animate-fly-in-up"
                  : ""
              }`}
              data-animate
              id="hero-login-video"
            >
              <LoginVideo />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-16 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl font-bold mb-4 ${
                visibleElements.has("features-title")
                  ? "animate-fly-in-down"
                  : ""
              }`}
              data-animate
              id="features-title"
            >
              <span className="text-primary">Tính năng mạnh mẽ</span>
            </h2>
            <p
              className={`text-muted-foreground max-w-2xl mx-auto delay-200 ${
                visibleElements.has("features-subtitle")
                  ? "animate-fly-in-up"
                  : ""
              }`}
              data-animate
              id="features-subtitle"
            >
              Khám phá những công cụ sẽ cách mạng hóa quy trình sáng tạo của bạn
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-primary/10 delay-${
                  (index + 1) * 200
                } ${
                  visibleElements.has(`feature-${index}`)
                    ? "animate-fly-in-up"
                    : ""
                }`}
                data-animate
                id={`feature-${index}`}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 "
                    />
                    <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors duration-500"></div>
                  </div>
                  <div className="p-6">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 text-primary-foreground">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-16 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
        <div className="container mx-auto text-center">
          <div
            className={`max-w-3xl mx-auto ${
              visibleElements.has("cta-content") ? "animate-bounce-in" : ""
            }`}
            data-animate
            id="cta-content"
          >
            <h2 className="text-4xl font-bold mb-6">Sẵn sàng bắt đầu?</h2>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Tham gia cùng hàng nghìn nhà sáng tạo và bắt đầu xây dựng những
              trải nghiệm tuyệt vời ngay hôm nay
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 transform hover:scale-105 transition-all duration-300"
              >
                Dùng thử miễn phí
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Scroll to Top Button */}
      {scrollBtnVisible && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`fixed bottom-40 right-8 z-50 bg-primary text-primary-foreground rounded-full shadow-lg p-2 hover:bg-primary/90 transition-all flex items-center justify-center cursor-pointer
            ${
              showScrollTop
                ? "animate-fade-in opacity-100"
                : "animate-fade-out opacity-0 pointer-events-none"
            }`}
          aria-label="Scroll to top"
          style={{ transition: "opacity 0.3s" }}
        >
          <ArrowUp className="h-8 w-8" />
        </button>
      )}

      {/* <ChatAIHomePage /> */}
    </div>
  );
}
