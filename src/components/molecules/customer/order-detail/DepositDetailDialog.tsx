"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Clock, DollarSign, FileText } from "lucide-react";
import { formatCurrencyVND } from "@/utils";

interface DepositTransaction {
  depositTransactionID: string;
  type: "Deposit" | "Withdraw";
  amount: number;
  description: string;
  transactionAt: string;
}

interface DepositDetailDialogProps {
  selectedDeposit: DepositHistoryItem | null;
  detailTransactions: DepositTransaction[];
  detailLoading: boolean;
  onClose: () => void;
}

export default function DepositDetailDialog({
  selectedDeposit,
  detailTransactions,
  detailLoading,
  onClose,
}: DepositDetailDialogProps) {
  const formatDetailDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getDetailTypeColor = (type: string) => {
    switch (type) {
      case "Deposit":
        return "bg-green-100 text-green-800 border-green-200";
      case "Withdraw":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Refund":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Forfeit":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "Deposit":
        return "Đặt cọc";
      case "Withdraw":
        return "Rút tiền";
      case "Refund":
        return "Hoàn tiền";
      case "Forfeit":
        return "Bồi thường";
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Deposit":
        return "💰";
      case "Withdraw":
        return "💸";
      default:
        return "💳";
    }
  };

  if (!selectedDeposit) return null;

  return (
    <div className="bg-white rounded-lg shadow-2xl border flex flex-col w-[500px] max-h-[90vh] transition-all duration-300 ease-out animate-in slide-in-from-right-4">
      {/* Header */}
      <div className="border-b p-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">Chi tiết giao dịch cọc</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {detailLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="text-sm text-gray-600">Đang tải chi tiết...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Thông tin chung
                  </h3>
                  <p className="text-sm text-gray-600">
                    Người thực hiện:{" "}
                    <span className="font-medium">
                      {selectedDeposit?.fullname}
                    </span>
                  </p>
                </div>
                <Badge
                  className={`${getDetailTypeColor(
                    selectedDeposit?.type
                  )} font-medium`}
                >
                  {getTypeIcon(selectedDeposit?.type)}{" "}
                  {getTypeLabel(selectedDeposit?.type)}
                </Badge>
              </div>
              <div className="bg-white rounded-md p-3 border">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Mô tả:
                  </span>
                </div>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {selectedDeposit?.title}
                </p>
              </div>
            </div>

            {/* Transaction Timeline */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Lịch sử giao dịch ({detailTransactions?.length})
              </h3>

              <div className="space-y-4">
                {detailTransactions?.map((transaction, index) => (
                  <div
                    key={transaction.depositTransactionID}
                    className={`
                      relative bg-white rounded-lg border-2 p-4 
                      transition-all duration-300 hover:shadow-md
                      ${getDetailTypeColor(transaction.type)
                        .replace("bg-", "border-")
                        .replace("-100", "-200")}
                      animate-in slide-in-from-right-4
                    `}
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    {/* Timeline connector */}
                    {index < detailTransactions?.length - 1 && (
                      <div className="absolute left-6 bottom-0 w-0.5 h-4 bg-gray-200 transform translate-y-full"></div>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-xl
                        ${getDetailTypeColor(transaction.type)}
                      `}
                      >
                        {getTypeIcon(transaction.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            className={`${getDetailTypeColor(
                              transaction.type
                            )} text-xs`}
                          >
                            {getTypeLabel(transaction.type)}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatDetailDate(transaction.transactionAt)}
                          </div>
                        </div>

                        <p className="text-sm text-gray-800 mb-3 leading-relaxed">
                          {transaction.description}
                        </p>

                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            Số tiền:
                          </span>
                          <span
                            className={`
                            font-bold text-lg
                            ${
                              transaction.type === "Deposit"
                                ? "text-green-600"
                                : "text-blue-600"
                            }
                          `}
                          >
                            {transaction.type === "Deposit" ? "+" : "-"}
                            {formatCurrencyVND(transaction.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4 border">
              <h4 className="font-medium text-gray-900 mb-3">Tổng kết</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    +
                    {formatCurrencyVND(
                      detailTransactions
                        .filter((t) => t.type === "Deposit")
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </div>
                  <div className="text-xs text-gray-600">Tổng đặt cọc</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    -
                    {formatCurrencyVND(
                      detailTransactions
                        .filter((t) => t.type === "Withdraw")
                        .reduce((sum, t) => sum + t.amount, 0)
                    )}
                  </div>
                  <div className="text-xs text-gray-600">Tổng rút tiền</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
