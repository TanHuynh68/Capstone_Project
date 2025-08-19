import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Shield,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
} from "lucide-react";

export default function TermsAndConditionsPage() {
  const lastUpdated = "15 tháng 8, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Điều khoản và Điều kiện
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Điều khoản sử dụng dịch vụ PlushDollCustom - Nền tảng thiết kế búp
            bê tùy chỉnh
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              Cập nhật lần cuối: {lastUpdated}
            </span>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-6">
            {/* 1. Giới thiệu */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  1. Giới thiệu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Chào mừng bạn đến với <strong>PlushDollCustom</strong> - nền
                  tảng kết nối khách hàng và nhà thiết kế để tạo ra những sản
                  phẩm búp bê tùy chỉnh độc đáo.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ
                  các điều khoản và điều kiện được nêu trong tài liệu này.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-blue-800 text-sm">
                    <strong>Lưu ý:</strong> Vui lòng đọc kỹ các điều khoản trước
                    khi sử dụng dịch vụ.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 2. Định nghĩa */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  2. Định nghĩa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex gap-3">
                    <Badge variant="outline" className="min-w-fit">
                      Nền tảng
                    </Badge>
                    <p className="text-gray-700">
                      Website và ứng dụng PlushDollCustom cung cấp dịch vụ kết
                      nối và giao dịch.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Badge variant="outline" className="min-w-fit">
                      Khách hàng
                    </Badge>
                    <p className="text-gray-700">
                      Người dùng có nhu cầu đặt làm sản phẩm búp bê tùy chỉnh.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Badge variant="outline" className="min-w-fit">
                      Nhà thiết kế
                    </Badge>
                    <p className="text-gray-700">
                      Người cung cấp dịch vụ thiết kế và sản xuất búp bê theo
                      yêu cầu.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Badge variant="outline" className="min-w-fit">
                      Đơn hàng
                    </Badge>
                    <p className="text-gray-700">
                      Yêu cầu thiết kế và sản xuất sản phẩm được tạo trên nền
                      tảng.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. Quyền và nghĩa vụ của Khách hàng */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  3. Quyền và nghĩa vụ của Khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Quyền của Khách hàng:
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Được tư vấn và hỗ trợ trong quá trình đặt hàng</li>
                    <li>Theo dõi tiến độ thực hiện đơn hàng</li>
                    <li>Yêu cầu chỉnh sửa trong phạm vi thỏa thuận</li>
                    <li>
                      Được bảo vệ thông tin cá nhân theo chính sách bảo mật
                    </li>
                    <li>Khiếu nại và được giải quyết khi có tranh chấp</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Nghĩa vụ của Khách hàng:
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Cung cấp thông tin chính xác và đầy đủ</li>
                    <li>Thanh toán đúng hạn theo thỏa thuận</li>
                    <li>Tôn trọng quyền sở hữu trí tuệ của nhà thiết kế</li>
                    <li>Không sử dụng dịch vụ cho mục đích bất hợp pháp</li>
                    <li>Tuân thủ các quy định của nền tảng</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 4. Quyền và nghĩa vụ của Nhà thiết kế */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  4. Quyền và nghĩa vụ của Nhà thiết kế
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Quyền của Nhà thiết kế:
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Được bảo vệ quyền sở hữu trí tuệ</li>
                    <li>Nhận thanh toán đúng hạn theo thỏa thuận</li>
                    <li>Từ chối đơn hàng không phù hợp</li>
                    <li>Được hỗ trợ giải quyết tranh chấp</li>
                    <li>Quảng bá sản phẩm trên nền tảng</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Nghĩa vụ của Nhà thiết kế:
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Thực hiện đúng yêu cầu và thời hạn</li>
                    <li>Đảm bảo chất lượng sản phẩm</li>
                    <li>Bảo mật thông tin khách hàng</li>
                    <li>Cập nhật tiến độ thường xuyên</li>
                    <li>Tuân thủ các tiêu chuẩn chất lượng</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 5. Chính sách thanh toán */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  5. Chính sách thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">
                    Phương thức thanh toán:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-green-700 ml-4">
                    <li>Chuyển khoản ngân hàng</li>
                    <li>Ví điện tử (VNPay, PayOS)</li>
                    <li>Thẻ tín dụng/ghi nợ</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Quy trình thanh toán:
                  </h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                    <li>Khách hàng đặt cọc 30-50% giá trị đơn hàng</li>
                    <li>Nhà thiết kế bắt đầu thực hiện sau khi nhận cọc</li>
                    <li>Thanh toán theo từng giai đoạn hoàn thành</li>
                    <li>Thanh toán hoàn tất khi giao sản phẩm</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* 6. Chính sách hoàn tiền */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  6. Chính sách hoàn tiền
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    Điều kiện hoàn tiền:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-orange-700 ml-4">
                    <li>Nhà thiết kế không thể hoàn thành đơn hàng</li>
                    <li>Sản phẩm không đúng yêu cầu và không thể sửa chữa</li>
                    <li>Khách hàng hủy đơn trước khi bắt đầu sản xuất</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Thời gian xử lý:
                  </h4>
                  <p className="text-gray-700">
                    Yêu cầu hoàn tiền sẽ được xử lý trong vòng 7-14 ngày làm
                    việc kể từ khi được phê duyệt.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 7. Bảo vệ dữ liệu */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  7. Bảo vệ dữ liệu và quyền riêng tư
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Chúng tôi cam kết bảo vệ thông tin cá nhân của người dùng theo
                  <strong> Chính sách bảo mật</strong> riêng biệt.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Cam kết bảo mật:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 ml-4">
                    <li>Mã hóa dữ liệu nhạy cảm</li>
                    <li>Không chia sẻ thông tin với bên thứ ba</li>
                    <li>Tuân thủ các quy định về bảo vệ dữ liệu</li>
                    <li>Cập nhật biện pháp bảo mật thường xuyên</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 8. Giải quyết tranh chấp */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  8. Giải quyết tranh chấp
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Quy trình giải quyết:
                  </h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                    <li>Thương lượng trực tiếp giữa các bên</li>
                    <li>Can thiệp và hòa giải bởi nền tảng</li>
                    <li>Giải quyết thông qua cơ quan có thẩm quyền</li>
                  </ol>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                  <p className="text-red-800 text-sm">
                    <strong>Lưu ý:</strong> Mọi tranh chấp sẽ được giải quyết
                    theo pháp luật Việt Nam.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 9. Liên hệ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-600" />
                  9. Thông tin liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng
                  liên hệ:
                </p>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">
                      support@plushdollcustom.com
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">
                      1900-xxxx (8:00 - 22:00)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardContent className="p-6 text-center">
                <p className="text-gray-600">
                  Bằng việc sử dụng dịch vụ PlushDollCustom, bạn xác nhận đã
                  đọc, hiểu và đồng ý với tất cả các điều khoản và điều kiện nêu
                  trên.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  © 2025 PlushDollCustom. Tất cả quyền được bảo lưu.
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
