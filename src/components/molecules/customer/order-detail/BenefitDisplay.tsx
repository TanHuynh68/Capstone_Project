"use client";

import { formatCurrencyVND } from "@/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BenefitData {
  depositAmount: number;
  depositAmountMessage: string;
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
      label: "Tiền cọc NTK",
      amount: benefitData.depositAmount,
      message: benefitData.depositAmountMessage,
      color: "bg-blue-700 hover:bg-blue-600",
    },
    {
      label: "Phí hệ thống",
      amount: benefitData.systemUsageFee,
      message: benefitData.systemUsageFeeMessage,
      color: "bg-red-700 hover:bg-red-600",
    },
    {
      label: "Tiền từ khách hàng",
      amount: benefitData.netAmountFromCustomer,
      message: benefitData.netAmountFromCustomerMessage,
      color: "bg-green-700 hover:bg-green-600",
    },
    {
      label: "Tổng thu nhập",
      amount: benefitData.totalNetIncome,
      message: benefitData.totalNetIncomeMessage,
      color: "bg-purple-700 hover:bg-purple-600",
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
                  className={`${item.color} text-white px-3 py-2 rounded-md text-center cursor-help transition-colors `}
                >
                  <div className="text-xs font-medium">{item.label}</div>
                  <div className="text-sm font-bold">
                    {formatCurrencyVND(item.amount)}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-md">
                <p className="text-sm">{item.message}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
}
