"use client";

import { formatCurrencyVND } from "@/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BenefitData {
  systemDepositRefund: number;
  systemDepositRefundMessage: string;
  systemUsageFee: number;
  systemUsageFeeMessage: string;
  netAmountFromCustomer: number;
  netAmountFromCustomerMessage: string;
  totalNetIncome: number;
  totalNetIncomeMessage: string;
}

interface BenefitDisplayProps {
  benefitData: BenefitData | null;
}

export default function BenefitDisplay({ benefitData }: BenefitDisplayProps) {
  if (!benefitData) return null;

  const benefitItems = [
    {
      label: "Giá trị đơn hàng",
      amount: benefitData.netAmountFromCustomer,
      message: benefitData.netAmountFromCustomerMessage,
      color: "bg-card border border-border",
    },
    {
      label: "Phí hệ thống",
      amount: benefitData.systemUsageFee,
      message: benefitData.systemUsageFeeMessage,
      color: "bg-card border border-border",
    },
    {
      label: "Hoàn tiền",
      amount: benefitData.systemDepositRefund,
      message: benefitData.systemDepositRefundMessage,
      color: "bg-card border border-border",
    },
    {
      label: "Tổng thu nhập",
      amount: benefitData.totalNetIncome,
      message: benefitData.totalNetIncomeMessage,
      color: "bg-card border border-border",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {benefitItems.map((item, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={
                    item.label != "Tổng thu nhập"
                      ? `${item.color} text-blue-600 px-3 py-2 rounded-md text-center cursor-help transition-colors `
                      : `${item.color} text-green-600  px-3 py-2 rounded-md text-center cursor-help transition-colors `
                  }
                >
                  <div className="text-xs font-medium">{item.label}</div>
                  <div className="text-sm font-bold ">
                    {formatCurrencyVND(item.amount)}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="">
                <p className="text-sm">{item.message}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
