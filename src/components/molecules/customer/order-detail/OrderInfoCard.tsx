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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DepositDialogContainer from "./DepositDialogContainer";
import BenefitDisplay from "./BenefitDisplay";
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
import OrderStatusBadge from "@/components/atoms/customer/order/OrderStatusBadge";

interface BenefitData {
  depositAmount: number;
  depositAmountMessage: string;
  systemUsageFee: number;
  systemUsageFeeMessage: string;
  systemDepositRefund: number;
  systemDepositRefundMessage: string;
  netAmountFromCustomer: number;
  netAmountFromCustomerMessage: string;
  totalNetIncome: number;
  totalNetIncomeMessage: string;
}

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
  onViewDepositHistory,
  onViewActivityLog,
  depositHistory = [],
  depositHistoryLoading = false,
  fetchDepositTransaction,
}: OrderInfoCardProps) {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isDepositHistoryOpen, setIsDepositHistoryOpen] = useState(false);
  const [benefitData, setBenefitData] = useState<BenefitData | null>(null);

  const { createReport } = CustomerReportService();
  const { getBenefitDoneOrder } = BenefitService();

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
    if (order) {
      const response = await getBenefitDoneOrder(
        order.totalPrice,
        order.designerDepositAmount
      );
      if (response && response.responseRequestModel) {
        setBenefitData(response.responseRequestModel);
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

  return (
    <TooltipProvider>
      <Card>
        {/* Benefit Display Section */}
        {benefitData && (
          <div className="mx-6">
            <BenefitDisplay benefitData={benefitData} />
          </div>
        )}
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
        <CardContent className="space-y-4">
          <div className="space-y-2">
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
              <span className="text-sm text-gray-600">Giá trị đơn hàng:</span>
              {benefitData ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 cursor-help">
                      <span className="font-semibold text-gray-500">
                        {formatCurrencyVND(order.totalPrice) +
                          ` (${phase?.length || 0} giai đoạn)`}
                      </span>
                      <Info className="h-3 w-3 text-blue-500 opacity-70" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      Tổng giá trị đơn hàng bao gồm tất cả các giai đoạn thực
                      hiện
                    </p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <span className="font-semibold text-gray-500">
                  {formatCurrencyVND(order.totalPrice) +
                    ` (${phase?.length || 0} giai đoạn)`}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Giá trị sản phẩm:</span>
              {benefitData ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 cursor-help">
                      <span className="font-semibold text-gray-500">
                        {formatCurrencyVND(offer.itemValue)}
                      </span>
                      <Info className="h-3 w-3 text-blue-500 opacity-70" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      Giá trị ước tính của sản phẩm sau khi hoàn thành
                    </p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <span className="font-semibold text-gray-500">
                  {formatCurrencyVND(offer.itemValue)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <LockKeyhole className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">NTK đã cọc:</span>
              {benefitData ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 cursor-help">
                      <span className="font-semibold text-gray-500">
                        {formatCurrencyVND(order.designerDepositAmount)}
                      </span>
                      <Info className="h-3 w-3 text-blue-500 opacity-70" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">
                      {benefitData.depositAmountMessage}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <span className="font-semibold text-gray-500">
                  {formatCurrencyVND(order.designerDepositAmount)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Ngày bắt đầu:</span>
              <span className="text-sm">{formatDate(order.startDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Ngày hết hạn:</span>
              <span className="text-sm">{formatDate(order.deadlineAt)}</span>
            </div>
          </div>
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
    </TooltipProvider>
  );
}
