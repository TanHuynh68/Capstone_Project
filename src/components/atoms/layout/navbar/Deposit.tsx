import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LockKeyhole, Calendar, Hash, Banknote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATH } from "@/routes/path";
import { useState } from "react";

interface DepositProps {
  amount: number;
  deposits: DepositOrder[];
}

const formatCurrencyVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Deposit = ({ amount, deposits }: DepositProps) => {
  const [open, setOpen] = useState(false); // for popover
  const totalDeposits = deposits.length;
  const navigate = useNavigate();
  const handleNavigateToOrderDetail = (id: string) => {
    setOpen(false);
    navigate(`${PATH.ORDER_DETAIL}/${id}`);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="ghost"
          size="default"
          className="flex items-center gap-2 py-2 px-3 hover:bg-muted/50 transition-all duration-200 rounded-lg border border-transparent hover:border-red-200"
        >
          <div className="relative">
            <LockKeyhole className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-red-600 font-bold text-base leading-none">
              {formatCurrencyVND(amount)}
            </span>
            <span className="text-xs text-muted-foreground">
              {totalDeposits} khoản
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[530px] p-0">
        <div className="bg-gradient-to-r from-primary/20 to-primary/30 p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-lg text-foreground">
                Danh sách tiền cọc
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Quản lý các khoản tiền tạm khóa
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrencyVND(amount)}
              </div>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[370px]">
          <div className="p-4">
            {deposits.length === 0 ? (
              <div className="text-center py-8">
                <LockKeyhole className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-medium">
                  Không có khoản cọc nào
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Các khoản tiền cọc sẽ hiển thị tại đây
                </p>
              </div>
            ) : (
              <div className="space-y-3 ">
                {deposits.map((deposit) => {
                  // card
                  return (
                    <div
                      onClick={() =>
                        handleNavigateToOrderDetail(deposit.orderID)
                      }
                      key={deposit.orderDepositID}
                    >
                      <div className="group relative bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all duration-200 hover:border-border">
                        {/* Main content */}
                        <div className="">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Banknote className="w-5 h-5 text-red-600" />
                            </div>

                            <div className="">
                              <div className="font-semibold text-foreground truncate">
                                Đặt cọc {formatCurrencyVND(deposit.amount)} cho
                                đơn hàng #{deposit.orderID.slice(0, 8)}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                                {deposit.orderTitle}
                              </p>
                            </div>
                          </div>

                          {/* Amount */}
                          <div className="mt-3 mb-3">
                            <span className="text-xl font-bold text-foreground">
                              {formatCurrencyVND(deposit.amount)}
                            </span>
                          </div>

                          <Separator className="my-3" />

                          {/* Details */}
                          <div className="flex justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Hash className="w-3 h-3" />
                              <span className="truncate">
                                ID: {deposit.orderID.slice(0, 8)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              {/* <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                              {deposit.type === 'Deposit' ? 'Tiền cọc' : deposit.type}
                            </span> */}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground ">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Tạo: {formatDate(deposit.depositAt + "")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        {deposits.length > 0 && (
          <div className="border-t border-border bg-muted p-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Tổng cộng: {totalDeposits} khoản cọc</span>
              <span>
                Cập nhật lần cuối: {new Date().toLocaleTimeString("vi-VN")}
              </span>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Deposit;
