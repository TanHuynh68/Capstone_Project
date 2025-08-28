"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyVND } from "@/utils";
import { PATH } from "@/routes/path";
import {  useNavigate } from "react-router-dom";
import {
  XCircle,
  CreditCard,
  Hash,
  Calendar,
  RotateCcw,
  StepBack,
} from "lucide-react";
import { toast } from "sonner";

export default function PaymentFailed() {
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const navigate = useNavigate()
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const depositMoney = urlParams.get("depositMoney");
    const vnp_TransactionNo = urlParams.get("vnp_TransactionNo");
    const vnp_BankCode = urlParams.get("vnp_BankCode");
    const vnp_PayDate = urlParams.get("vnp_PayDate");
    const errorCode = urlParams.get("vnp_ResponseCode");

    // Simulate loading
    setTimeout(() => {
      setPaymentDetails({
        amount: Number.parseInt(depositMoney || "0"),
        paymentMethod: vnp_TransactionNo ? "VNPay" : "PayOs",
        bankCode: vnp_BankCode || "HDFC",
        transactionId: vnp_TransactionNo || "125478965698",
        payDate: vnp_PayDate
          ? formatPayDate(vnp_PayDate)
          : new Date().toLocaleString("vi-VN"),
        mobile: "0897131444",
        email: "customer@gmail.com",
        errorCode: errorCode || "99",
        errorMessage: getErrorMessage(errorCode || "99"),
      });
      setLoading(false);
    }, 1000);
  }, []);

  const formatPayDate = (dateString: string) => {
    if (dateString.length === 14) {
      const year = dateString.substring(0, 4);
      const month = dateString.substring(4, 6);
      const day = dateString.substring(6, 8);
      const hour = dateString.substring(8, 10);
      const minute = dateString.substring(10, 12);
      const second = dateString.substring(12, 14);

      return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    }
    return dateString;
  };

  const getErrorMessage = (errorCode: string) => {
    const errorMessages: { [key: string]: string } = {
      "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).",
      "09": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.",
      "10": "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
      "11": "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.",
      "12": "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.",
      "13": "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).",
      "24": "Giao dịch không thành công do: Khách hàng hủy giao dịch",
      "51": "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.",
      "65": "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.",
      "75": "Ngân hàng thanh toán đang bảo trì.",
      "79": "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.",
      "99": "Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)",
    };
    return (
      errorMessages[errorCode] ||
      "Đã xảy ra lỗi không xác định trong quá trình thanh toán."
    );
  };

  const handleRetry = () => {
    toast.info("Đang chuyển hướng để thử lại...");
    // Redirect to payment page or previous page
    navigate(`/${PATH.MY_WALLET}`)
  };

  const handleClose = () => {
     navigate(`${PATH.HOME}`)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-pink-800 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-2xl">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            <span className="ml-3 text-gray-600">Đang xử lý...</span>
          </div>
        </div>
      </div>
    );
  }

  const detailItems = [
    {
      icon: CreditCard,
      label: "Loại thanh toán",
      value: "Chuyển khoản ngân hàng",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-pink-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center pb-4">
          {/* Failed Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 rounded-full p-3">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>

          <CardTitle className="text-2xl font-bold text-red-600 mb-2">
            Thanh toán thất bại
          </CardTitle>

          <p className="text-gray-600 text-sm">
            Rất tiếc, giao dịch của bạn không thể hoàn tất. Vui lòng thử lại
            hoặc liên hệ hỗ trợ.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
 

          {/* Payment Details */}
          <div className="space-y-3">
            {detailItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-600">
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <span className="font-medium text-sm text-right">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Failed Amount */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-700">
                Số tiền giao dịch
              </span>
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrencyVND(paymentDetails.amount)}
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
                <span className="text-sm">Ngày & Giờ</span>
              </div>
              <span className="text-sm">{paymentDetails.payDate}</span>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleRetry}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              THỬ LẠI
            </Button>

            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
            >
              <StepBack className="h-4 w-4 mr-2" />
              Quay lại trang chủ
            </Button>
          </div>

          {/* Support Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-blue-800 text-center">
              Cần hỗ trợ? Liên hệ: <strong>0936882011</strong> hoặc{" "}
              <strong>plushdollcustom@gmail.com</strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
