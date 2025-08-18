"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DepositDialogContainer from "./DepositDialogContainer";
import {
  MoreHorizontal,
  User,
  Calendar,
  DollarSign,
  LockKeyhole,
  Flag,
  ShoppingBag,
  Info,
} from "lucide-react";
import { formatCurrencyVND } from "@/utils";
import ReportDialog from "../../customer-and-designer/report/ReportDialog";
import CustomerReportService from "@/services/CustomerReportService";
import BenefitService from "@/services/BenefitService";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import OrderStatusBadge from "@/components/atoms/customer/order/OrderStatusBadge";

interface OrderInfoCardProps {
  order: any;
  phase: any;
  offer: any;
  onViewPhases: () => void;
  onViewDepositHistory: () => void;
  onViewActivityLog: () => void;
  depositHistory?: DepositHistoryItem[];
  depositHistoryLoading?: boolean;
  fetchDepositTransaction: any;
}

export default function OrderInfoCard({
  order,
  phase,
  offer,
  onViewPhases,
  onViewDepositHistory,
  onViewActivityLog,
  depositHistory = [],
  depositHistoryLoading = false,
  fetchDepositTransaction,
}: OrderInfoCardProps) {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isDepositHistoryOpen, setIsDepositHistoryOpen] = useState(false);
  const { createReport } = CustomerReportService();
  const { getBenefitDoneOrder } = BenefitService();
  const [desBenefit, setDesBenefit] = useState<string>("");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  useEffect(() => {
    fetchBenefitDoneOrder();
  }, [order, offer]);

  const fetchBenefitDoneOrder = async () => {
    console.log("a: ", order.totalPrice, order.designerDepositAmount);
    if (order) {
      const response = await getBenefitDoneOrder(
        order.totalPrice,
        order.designerDepositAmount
      );
      if (response && response.responseRequestModel) {
        setDesBenefit(response.responseRequestModel.systemDepositRefund || 0);
      }
    }
  };

  const handleReportSubmit = async (data: any): Promise<boolean> => {
    const response = await createReport({
      ...data,
      targetID: order.orderID,
      reportType: 3,
    });
    return response;
  };

  const handleViewDepositHistory = () => {
    setIsDepositHistoryOpen(true);
    onViewDepositHistory();
  };

  console.log("order: ", order);
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">
              Thông tin đơn hàng
            </CardTitle>
            {(order.orderStatus === "InProgress" ||
              order.orderStatus === "Created") && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsReportDialogOpen(true)}
                className="hover:bg-red-50 hover:text-red-600 h-8 w-8"
              >
                <Flag className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onViewPhases}>
                  Giai đoạn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleViewDepositHistory}>
                  Lịch sử cọc
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onViewActivityLog}>
                  Hoạt động
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <OrderStatusBadge status={order.orderStatus} />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Tên đơn hàng:</span>
            <span className="text-sm font-medium">{order.note}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Khách hàng:</span>
            <span className="text-sm font-medium">{order.customerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Nhà thiết kế:</span>
            <span className="text-sm font-medium">{order.designerName}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className=" text-sm text-gray-600">Giá trị đơn hàng:</span>
            <span className="font-semibold text-gray-500">
              {formatCurrencyVND(order.totalPrice) +
                ` (${phase?.length || 0} giai đoạn)`}
            </span>
          </div>
          <div className="text-gray-500">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 " />
              <span className=" text-sm text-gray-600">Giá trị sản phẩm:</span>
              <span className="font-semibold">
                {formatCurrencyVND(offer.itemValue)}
              </span>
            </div>
          </div>
          <div className="text-gray-500">
            <div className="flex items-center gap-2">
              <LockKeyhole className="h-4 w-4 " />
              <span className=" text-sm text-gray-600"> NTK đã cọc:</span>
              <span className="font-semibold">
                {formatCurrencyVND(order.designerDepositAmount)}
              </span>
            </div>
          </div>
          <div className="text-gray-500">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 " />
              <span className=" text-sm text-gray-600 flex gap-2 items-center">
                Số tiền hoàn lại:
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-primary hover:text-gray-600 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      {/* <p>Số tiền cọc mà nhà thiết kế yêu cầu</p> */}
                      <p>Số tiền hoàn lại: = Tiền cọc - Giá trị đơn hàng * 10% </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
              <span className="font-semibold text-green-600">
                {formatCurrencyVND(parseInt(desBenefit))}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Ngày bắt đầu:</span>
            <span className="text-sm">{formatDate(order.startDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Ngày hết hạn:</span>
            <span className="text-sm  ">{formatDate(order.deadlineAt)}</span>
          </div>
          <div></div>
        </CardContent>
      </Card>

      {/* Report Dialog */}
      <ReportDialog
        isOpen={isReportDialogOpen}
        onClose={() => setIsReportDialogOpen(false)}
        targetID={order.orderID}
        defaultReportType={4}
        onSubmit={handleReportSubmit}
      />

      {/* Deposit History Container */}
      <DepositDialogContainer
        fetchDepositTransaction={fetchDepositTransaction}
        open={isDepositHistoryOpen}
        onOpenChange={setIsDepositHistoryOpen}
        deposits={depositHistory}
        loading={depositHistoryLoading}
        onClose={() => setIsDepositHistoryOpen(false)}
      />
    </>
  );
}
