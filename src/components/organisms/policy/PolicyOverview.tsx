import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, XCircle } from "lucide-react";

export default function PolicyOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            Điểm tích cực
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-600">
            Hoàn thành đúng hạn, chất lượng tốt sẽ được cộng điểm và nhận thưởng
          </p>
          <Badge
            variant="outline"
            className="mt-2 text-green-600 border-green-300"
          >
            +5 đến +10 điểm
          </Badge>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-red-700">
            <XCircle className="h-5 w-5" />
            Điểm tiêu cực
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-600">
            Vi phạm cam kết, giao hàng trễ sẽ bị trừ điểm và phạt bồi thường
          </p>
          <Badge variant="outline" className="mt-2 text-red-600 border-red-300">
            -5 đến -20 điểm
          </Badge>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Shield className="h-5 w-5" />
            Bồi thường
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-600">
            Tỷ lệ bồi thường dựa trên mức độ thiệt hại và trách nhiệm của từng
            bên
          </p>
          <Badge
            variant="outline"
            className="mt-2 text-blue-600 border-blue-300"
          >
            0% đến 100%
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
