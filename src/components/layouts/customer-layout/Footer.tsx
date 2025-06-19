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
import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";
import LogoWeb from "@/components/atoms/custom/logo/LogoWeb";

export function Footer() {
  return (
    <footer className="bg-background text-foreground">
      <div className="container px-4 py-12 md:px-6 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Thông tin công ty */}
          <div className="space-y-4">
            <LogoWeb />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Chúng tôi cung cấp sản phẩm và dịch vụ chất lượng từ năm 1992. Sứ
              mệnh của chúng tôi là mang đến giải pháp tối ưu cho khách hàng.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </div>
          </div>

          {/* Liên kết nhanh */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground hover:text-primary"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary"
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-muted-foreground hover:text-primary"
                >
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-muted-foreground hover:text-primary"
                >
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-muted-foreground hover:text-primary"
                >
                  Tin tức
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Thông tin liên hệ */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  123 Đường Doanh Nghiệp, Tầng 1
                  <br />
                  Quận 1, TP. Hồ Chí Minh
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">+84 912 345 678</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  lienhe@acme.com.vn
                </span>
              </li>
            </ul>
          </div>

          {/* Đăng ký nhận tin */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Đăng ký nhận tin</h3>
            <p className="text-sm text-muted-foreground">
              Nhận thông tin mới nhất và ưu đãi đặc biệt từ chúng tôi.
            </p>
            <div className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Địa chỉ email của bạn"
                className="h-10"
              />
              <Button className="w-fit">Đăng ký</Button>
            </div>
          </div>
        </div>

        <Separator className="my-10" />

        {/* Footer dưới */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} ACME. Đã đăng ký bản quyền.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-primary">
              Chính sách bảo mật
            </Link>
            <Link to="/terms" className="hover:text-primary">
              Điều khoản sử dụng
            </Link>
            <Link to="/cookies" className="hover:text-primary">
              Chính sách Cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
