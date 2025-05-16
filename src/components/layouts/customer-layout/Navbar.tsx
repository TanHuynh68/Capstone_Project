import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, ShoppingCart, Search } from "lucide-react";

import { Button } from "../../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "../../ui/dropdown-menu";
import { Input } from "../../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { ThemeToggle } from "@/components/themes/ThemeToggle";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/userSlice";
import { PATH, USER_ROUTES } from "@/routes/path";
import Notification from "@/components/molecules/navbar/Notification";
import Logo from "@/components/atoms/logo/Logo";

const navItems = [
  { title: "Home", href: "/" },
  { title: "Products", href: "/products" },
  { title: "About", href: "/about" },
  { title: "Contact", href: "/contact" },
]

const categories = [
  { title: "Electronics", href: "/products/electronics" },
  { title: "Clothing", href: "/products/clothing" },
  { title: "Home & Garden", href: "/products/home-garden" },
  { title: "Sports", href: "/products/sports" },
]

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const userInfo = useSelector((state: RootState) => state.user)
  const isLoggedIn = !!userInfo
  const dispatch = useDispatch()
  const navigate = useNavigate()


  const MobileMenu = () => (
    <div className="flex flex-col space-y-4 py-4">
      {navItems.map((item) => (
        <Link key={item.title} to={item.href} className="text-lg font-medium transition-colors hover:text-primary">
          {item.title}
        </Link>
      ))}
      <div className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger >
            <Button variant="ghost" className="flex items-center justify-start px-0 font-medium">
              Products <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent align="start" className="w-48 z-50">
              {categories.map((category) => (
                <DropdownMenuItem key={category.title}>
                  <Link to={category.href} className="w-full">
                    {category.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>
      <div className="pt-4">
        <Button  className="w-full">
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    </div>
  )

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Logo/>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-6">
          {navItems.map((item, index) => (
            <Link key={index} to={item.href} className="text-sm font-medium transition-colors hover:text-primary">
              {item.title}
            </Link>
          ))}
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger >
                <Button variant="ghost" className="flex items-center text-sm font-medium">
                  Products <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 z-50">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.title}>
                    <Link to={category.href} className="w-full">
                      {category.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>

        <div className="flex items-center space-x-2">
          {isSearchOpen ? (
            <div className="flex items-center">
              <Input type="search" placeholder="Search..." className="w-[200px] md:w-[300px]" />
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)} className="ml-2">
                <X className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} className="hidden md:flex">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <ThemeToggle />

          <Notification/>

          <Button variant="ghost" size="icon"  className="hidden md:flex">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Link>
          </Button>

          {isLoggedIn ? (
            <div className="relative hidden md:flex">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 z-50">
                  <DropdownMenuItem>
                    <Link to={USER_ROUTES.PROFILE} className="w-full">
                      Hồ sơ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/orders" className="w-full">
                      Đơn đặt hàng
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/settings" className="w-full">
                      Cài đặt
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to={USER_ROUTES.DEPOSIT_MONEY} className="w-full">
                      Ví
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      dispatch(logout())
                      navigate("/auth/login")
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button  variant="outline">
                <Link to={PATH.LOGIN_IN}>Đăng nhập</Link>
              </Button>
              <Button >
                <Link to={PATH.REGISTER}>Đăng ký</Link>
              </Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger >
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
  )
}
