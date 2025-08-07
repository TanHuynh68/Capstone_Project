import { useEffect, useState } from "react";
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
import WalletService from "@/services/WalletService";
import Deposit from "@/components/atoms/layout/navbar/Deposit";

const navItems = [
  { title: "Giới thiệu", href: PATH.ABOUT_PAGE },
  { title: "Liên hệ", href: PATH.CONTACT_PAGE },
  { title: "Chính sách", href: PATH.POLICY_PAGE },
];

export function Navbar() {
  const { getWallet, getDepositOrder } = WalletService();
  const [wallet, setWallet] = useState<Wallet>();
  const [depositMoney, setDepositMoney] = useState<DepositOrder[]>([]);

  useEffect(() => {
    fetchWallet();
    fetchDepositOrderList();
  }, []);

  /**
   * fetch wallet to show balance on navbar
   */
  const fetchWallet = async () => {
    const response = await getWallet();
    if (response && response.responseRequestModel) {
      console.log(
        "response.responseRequestModel: ",
        response.responseRequestModel
      );
      setWallet(response.responseRequestModel);
    }
  };

  const fetchDepositOrderList = async () => {
    const response = await getDepositOrder();
    if (response && response.responseRequestModel) {
      setDepositMoney(response.responseRequestModel.responseList.items);
    }
  };

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
      <div className="container flex h-16 items-center justify-between px-4 md:px-12">
        {/* Logo */}
        <div className="flex gap-2 items-center">
          <Link to={PATH.HOME} className="flex items-center space-x-2">
            <DualLogo path={PATH.HOME} />
          </Link>
          <div className="grid grid-cols-2 gap-20">
            <div>
              <Link to={PATH.MY_WALLET}>
                {isLoggedIn() && <Balance balance={wallet?.balance || 0} />}
              </Link>
            </div>
            <div>
              {isLoggedIn() && (
                <Deposit
                  deposits={depositMoney.filter(
                    (item) => item.type === "Deposit"
                  )}
                  amount={wallet?.locked || 0}
                />
              )}
            </div>
          </div>
        </div>
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
          <ThemeToggle />
          {isLoggedIn() && <Notification />}
          {isLoggedIn() && <Cart />}
          {<Post />}
          {isLoggedIn() && <Message />}
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
