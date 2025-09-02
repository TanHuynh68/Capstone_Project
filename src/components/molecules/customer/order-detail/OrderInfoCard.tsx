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
import { formatCurrencyVND, useCurrentUser } from "@/utils";
import ReportDialog from "../../customer-and-designer/report/ReportDialog";
import CustomerReportService from "@/services/CustomerReportService";
import BenefitService from "@/services/BenefitService";
import OrderStatusBadge from "@/components/atoms/customer/order/OrderStatusBadge";
import { ROLE } from "@/constants";

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
  const currentUser = useCurrentUser();
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
        {(benefitData && currentUser.role === ROLE.DESIGNER) && (
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
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Information */}
            <div className="space-y-4">

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--chart-1)' }}>
                    <ShoppingBag className="h-4 w-4" style={{ color: 'white' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                      Tên đơn hàng
                    </p>
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                      {order.note}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--chart-2)' }}>
                    <User className="h-4 w-4" style={{ color: 'white' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                      Khách hàng
                    </p>
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                      {order.customerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--chart-3)' }}>
                    <User className="h-4 w-4" style={{ color: 'white' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                      Nhà thiết kế
                    </p>
                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                      {order.designerName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--chart-4)' }}>
                    <Calendar className="h-4 w-4" style={{ color: 'white' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                      Ngày bắt đầu
                    </p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                      {formatDate(order.startDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Financial & Timeline */}
            <div className="space-y-4">

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--chart-5)' }}>
                    <DollarSign className="h-4 w-4" style={{ color: 'white' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                      Giá trị đơn hàng
                    </p>
                    {benefitData ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 cursor-help">
                            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                              {formatCurrencyVND(order.totalPrice) +
                                ` (${phase?.length || 0} giai đoạn)`}
                            </p>
                            <Info className="h-3 w-3" style={{ color: 'var(--primary)' }} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xl">
                          <p className="text-sm">
                            Tổng giá trị đơn hàng bao gồm tất cả các giai đoạn thực hiện
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                          {formatCurrencyVND(order.totalPrice) +
                            ` (${phase?.length || 0} giai đoạn)`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--chart-1)' }}>
                    <DollarSign className="h-4 w-4" style={{ color: 'white' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                      Giá trị sản phẩm
                    </p>
                    {benefitData ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 cursor-help">
                            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                              {formatCurrencyVND(offer.itemValue)}
                            </p>
                            <Info className="h-3 w-3" style={{ color: 'var(--primary)' }} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xl">
                          <p className="text-sm">
                            Giá trị ước tính của sản phẩm sau khi hoàn thành
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                          {formatCurrencyVND(offer.itemValue)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--chart-2)' }}>
                    <LockKeyhole className="h-4 w-4" style={{ color: 'white' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                      NTK đã cọc
                    </p>
                    {benefitData ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 cursor-help">
                            <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                              {formatCurrencyVND(order.designerDepositAmount)}
                            </p>
                            <Info className="h-3 w-3" style={{ color: 'var(--primary)' }} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xl">
                          <p className="text-sm">
                            {benefitData.depositAmountMessage}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                        <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                          {formatCurrencyVND(order.designerDepositAmount)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg border" style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--destructive)' }}>
                    <Calendar className="h-4 w-4" style={{ color: 'white' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
                      Ngày hết hạn
                    </p>
                    <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                      {formatDate(order.deadlineAt)}
                    </p>
                  </div>
                </div>
              </div>
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
