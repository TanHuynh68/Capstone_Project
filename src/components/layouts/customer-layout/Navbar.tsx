import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import { Button } from "../../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import { Input } from "../../ui/input";
import { ThemeToggle } from "@/components/themes/ThemeToggle";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import Notification from "@/components/molecules/navbar/Notification";
import Logo from "@/components/atoms/logo/Logo";
import Cart from "@/components/atoms/navbar/Cart";
import Post from "@/components/atoms/navbar/Post";
import UserOption from "@/components/atoms/navbar/UserOption";
import UserAuth from "@/components/atoms/navbar/UserAuth";
import { ROLE } from "@/constants";
import { isLoggedIn } from "@/components/utils";
import { PATH } from "@/routes/path";

const navItems = [
  { title: "Giới thiệu", href: PATH.ABOUT_PAGE },
  { title: "Liên hệ", href: PATH.CONTACT_PAGE },
];

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const userInfo = useSelector((state: RootState) => state.user);
  const MobileMenu = () => (
    <div className="flex flex-col space-y-4 py-4">
      {navItems.map((item) => (
        <Link
          key={item.title}
          to={item.href}
          className="text-lg font-medium transition-colors hover:text-primary"
        >
          {item.title}
        </Link>
      ))}
      <div className="pt-4">
        <Button className="w-full">
          <Link to={PATH.LOGIN_IN}>Đăng nhập</Link>
        </Button>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to={PATH.HOME} className="flex items-center space-x-2">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
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

        <div className="flex items-center space-x-2">
          {isSearchOpen ? (
            <div className="flex items-center">
              <Input
                type="search"
                placeholder="Search..."
                className="w-[200px] md:w-[300px]"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(false)}
                className="ml-2"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <ThemeToggle />
          {isLoggedIn() && <Notification />}
          {isLoggedIn() && <Cart />}
          {userInfo?.role === ROLE.CUSTOMER && <Post />}

          {isLoggedIn() ? (
            <div className="relative hidden md:flex">
              <UserOption />
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <UserAuth />
            </div>
          )}

          <Sheet>
            <SheetTrigger>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <MobileMenu />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
