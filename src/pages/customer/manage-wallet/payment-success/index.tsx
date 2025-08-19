"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyVND } from "@/utils";
import { PATH } from "@/routes/path";
import { Link } from "react-router-dom";
import { CheckCircle, CreditCard, Hash, Calendar } from "lucide-react";

export default function PaymentSuccess() {
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // Get payment details from URL params
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const details = {
      depositMoney: urlParams.get("depositMoney"),
      vnp_TransactionNo: urlParams.get("vnp_TransactionNo"),
      vnp_BankCode: urlParams.get("vnp_BankCode"),
      vnp_PayDate: urlParams.get("vnp_PayDate"),
      paymentMethod: urlParams.get("vnp_TransactionNo") ? "VNPay" : "PayOs",
      transactionId:
        urlParams.get("vnp_TransactionNo") ||
        urlParams.get("orderCode") ||
        "N/A",
      bankCode: urlParams.get("vnp_BankCode") || "SYSTEM",
      payDate: new Date().toLocaleString("vi-VN"),
    };

    setPaymentDetails(details);
  }, []);

  if (!paymentDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-teal-700 to-blue-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            Thanh toán thành công
          </h1>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Payment Details */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-600">
                <CreditCard className="h-4 w-4" />
                <span className="text-sm">Loại thanh toán</span>
              </div>
              <span className="font-medium">Net banking</span>
            </div>
          </div>

          <Separator />

          {/* Amount Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">
                Số tiền đã nạp
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {paymentDetails.depositMoney
                  ? formatCurrencyVND(
                      Number.parseInt(paymentDetails.depositMoney)
                    )
                  : "500.00"}
              </span>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-600">
                <Hash className="h-4 w-4" />
                <span className="text-sm">Mã giao dịch</span>
              </div>
              <span className="font-mono text-sm">
                {paymentDetails.transactionId}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Thời gian</span>
              </div>
              <span className="text-sm">{paymentDetails.payDate}</span>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              <Link
                to={`/${PATH.MY_WALLET}`}
                className="t text-sm font-medium "
              >
                Quay về ví của tôi
              </Link>
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              <Link to={`${PATH.HOME}`} className=" text-sm font-medium ">
                Quay về trang chủ
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area,
          .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
