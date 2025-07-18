"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "../../ui/button";
import LogoWeb from "@/components/atoms/custom/logo/LogoWeb";

export function Footer() {
  const [visibleElements, setVisibleElements] = useState(new Set());

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

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
  ];

  const quickLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/about", label: "Giới thiệu" },
    { to: "/products", label: "Sản phẩm" },
    { to: "/services", label: "Dịch vụ" },
    { to: "/contact", label: "Liên hệ" },
  ];

  const contactInfo = [
    {
      icon: MapPin,
      content: (
        <>
          123 Đường Doanh Nghiệp, Tầng 1
          <br />
          Quận 1, TP. Hồ Chí Minh
        </>
      ),
    },
    { icon: Phone, content: "+84 912 345 678" },
    { icon: Mail, content: "lienhe@plushdollcustom.com.vn" },
  ];

  return (
    <footer className="bg-background text-foreground relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-3 h-3 bg-primary/20 rounded-full animate-float"></div>
        <div
          className="absolute top-20 right-20 w-4 h-4 bg-primary/15 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/4 w-2 h-2 bg-primary/25 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="container px-4 py-12 md:px-10 md:py-12 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-8">
          {/* Thông tin công ty */}
          <div
            className={`space-y-4 transition-all duration-700 ${
              visibleElements.has("footer-company")
                ? "animate-fly-in-left"
                : "opacity-0 translate-x-[-50px]"
            }`}
            data-animate
            id="footer-company"
          >
            <div className="transform hover:scale-105 transition-transform duration-300">
              <LogoWeb />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              <span className="font-bold text-primary">PlushDollCustom</span>{" "}
              được tạo ra để đáp ứng nhu cầu ngày càng tăng về những con búp bê
              nhồi bông độc đáo, do chính người dùng thiết kế.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  className={`rounded-full hover:bg-primary/10 hover:text-primary transform hover:scale-110 transition-all duration-300 hover:animate-shake ${
                    visibleElements.has("footer-company")
                      ? "animate-zoom-in"
                      : "opacity-0 scale-50"
                  }`}
                  style={{ animationDelay: `${(index + 1) * 200}ms` }}
                >
                  <social.icon className="h-4 w-4" />
                  <span className="sr-only">{social.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div
            className={`space-y-4 transition-all duration-700 ${
              visibleElements.has("footer-links")
                ? "animate-fly-in-up"
                : "opacity-0 translate-y-[50px]"
            }`}
            style={{ animationDelay: "200ms" }}
            data-animate
            id="footer-links"
          >
            <h3 className="text-lg font-semibold text-primary">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link, index) => (
                <li
                  key={link.to}
                  className={`transform transition-all duration-500 ${
                    visibleElements.has("footer-links")
                      ? "animate-fade-in"
                      : "opacity-0"
                  }`}
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block hover:scale-105"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div
            className={`space-y-4 transition-all duration-700 ${
              visibleElements.has("footer-contact")
                ? "animate-fly-in-right"
                : "opacity-0 translate-x-[50px]"
            }`}
            style={{ animationDelay: "400ms" }}
            data-animate
            id="footer-contact"
          >
            <h3 className="text-lg font-semibold text-primary">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              {[
                { to: "/help", label: "Trung tâm trợ giúp" },
                { to: "/faq", label: "Câu hỏi thường gặp" },
                { to: "/guide", label: "Hướng dẫn sử dụng" },
                { to: "/warranty", label: "Chính sách bảo hành" },
              ].map((link, index) => (
                <li
                  key={link.to}
                  className={`transform transition-all duration-500 ${
                    visibleElements.has("footer-contact")
                      ? "animate-fade-in"
                      : "opacity-0"
                  }`}
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                >
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-x-1 inline-block hover:scale-105"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Thông tin liên hệ */}
          <div
            className={`space-y-4 transition-all duration-700 ${
              visibleElements.has("footer-support")
                ? "animate-fly-in-down"
                : "opacity-0 translate-y-[-50px]"
            }`}
            style={{ animationDelay: "600ms" }}
            data-animate
            id="footer-support"
          >
            <h3 className="text-lg font-semibold text-primary">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              {contactInfo.map((contact, index) => (
                <li
                  key={index}
                  className={`flex items-start gap-2 group transition-all duration-500 ${
                    visibleElements.has("footer-support")
                      ? "animate-slide-diagonal"
                      : "opacity-0"
                  }`}
                  style={{ animationDelay: `${600 + index * 150}ms` }}
                >
                  <contact.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {contact.content}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
