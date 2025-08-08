import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

export default function PaymentReportDetail() {
  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-t-lg">
        <CardTitle className="text-lg flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-yellow-600" />
          Chi tiết thanh toán
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-center py-8 text-gray-500">
          <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>Không có thông tin chi tiết thanh toán</p>
          <p className="text-sm">Dữ liệu targetDetail trả về null</p>
        </div>
      </CardContent>
    </Card>
  );
}
