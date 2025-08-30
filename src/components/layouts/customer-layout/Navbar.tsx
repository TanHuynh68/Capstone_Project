"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "../../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import { ThemeToggle } from "@/components/themes/ThemeToggle";
import Notification from "@/components/molecules/navbar/Notification";
import Cart from "@/components/atoms/layout/navbar/Paint";
import Post from "@/components/atoms/layout/navbar/Post";
import UserOption from "@/components/atoms/layout/navbar/UserOption";
import UserAuth from "@/components/atoms/layout/navbar/UserAuth";
import { isLoggedIn } from "@/utils";
import { PATH } from "@/routes/path";
import Message from "@/components/atoms/layout/navbar/Message";
import DualLogo from "@/components/atoms/custom/logo/LogoWeb";
import Balance from "@/components/atoms/layout/navbar/Balance";
import Deposit from "@/components/atoms/layout/navbar/Deposit";
import { useStateValue } from "@/context/stateProvider";

const navItems = [
  { title: "Giới thiệu", href: PATH.ABOUT_PAGE },
  { title: "Liên hệ", href: PATH.CONTACT_PAGE },
  { title: "Chính sách", href: PATH.POLICY_PAGE },
];

export function Navbar() {
  const { wallet, fetchWallet, depositMoney, fetchDepositOrderList } =
    useStateValue();

  useEffect(() => {
    fetchWallet();
    fetchDepositOrderList();
  }, []);

  const MobileMenu = () => (
    <div className="flex flex-col h-full py-4">
      {/* User Section */}
      {isLoggedIn() ? (
        <div className="border-b pb-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Tài khoản</h3>
            <UserOption />
          </div>
          <div className="space-y-3">
            <Link
              to={PATH.MY_WALLET}
              className="block p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <Balance balance={wallet?.balance || 0} />
            </Link>
            <div className="p-3 bg-muted rounded-lg">
              <Deposit
                deposits={depositMoney.filter(
                  (item: any) => item.type === "Deposit"
                )}
                amount={wallet?.locked || 0}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="border-b pb-6 mb-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Chào mừng!</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Đăng nhập để sử dụng đầy đủ tính năng
          </p>
          <UserAuth />
        </div>
      )}

      {/* Navigation */}
      <div className="space-y-2 mb-6">
        {navItems.map((item) => (
          <Link
            key={item.title}
            to={item.href}
            className="block py-3 px-4 rounded-lg text-base font-medium transition-colors hover:bg-muted"
          >
            {item.title}
          </Link>
        ))}
      </div>

      {/* Actions */}
      {isLoggedIn() && (
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between py-2 px-4">
            <span className="text-sm font-medium">Thông báo</span>
            <Notification />
          </div>
          <div className="flex items-center justify-between py-2 px-4">
            <span className="text-sm font-medium">Giỏ hàng</span>
            <Cart />
          </div>
          <div className="flex items-center justify-between py-2 px-4">
            <span className="text-sm font-medium">Tin nhắn</span>
            <Message />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between py-2 px-4 mb-6">
        <span className="text-sm font-medium">Đăng bài</span>
        <Post />
      </div>

      {/* Theme Toggle */}
      <div className="mt-auto pt-6 border-t">
        <div className="flex items-center justify-between py-2 px-4">
          <span className="text-sm font-medium">Giao diện</span>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b">
      <div className="container flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-6">
          <Link to={PATH.HOME} className="flex items-center">
            <DualLogo path={PATH.HOME} />
          </Link>

          {isLoggedIn() && (
            <div className="hidden lg:flex items-center gap-4">
              <Link to={PATH.MY_WALLET}>
                <Balance balance={wallet?.balance || 0} />
              </Link>
              <Deposit
                deposits={depositMoney.filter(
                  (item: any) => item.type === "Deposit"
                )}
                amount={wallet?.locked || 0}
              />
            </div>
          )}
        </div>

        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />
            {isLoggedIn() && <Notification />}
            {isLoggedIn() && <Cart />}
            <Post />
            {isLoggedIn() && <Message />}
            {isLoggedIn() ? <UserOption /> : <UserAuth />}
          </div>

          {/* Mobile menu trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <MobileMenu />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
