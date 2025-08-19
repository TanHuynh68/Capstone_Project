import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  AlertTriangle,
  Clock,
  Mail,
  Phone,
  Globe,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const lastUpdated = "15 tháng 8, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Chính sách bảo mật
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cam kết bảo vệ thông tin cá nhân và quyền riêng tư của người dùng
            PlushDollCustom
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
            {/* 1. Tổng quan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  1. Tổng quan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  <strong>PlushDollCustom</strong> cam kết bảo vệ quyền riêng tư
                  và thông tin cá nhân của tất cả người dùng. Chính sách này
                  giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ
                  thông tin của bạn.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-blue-800 text-sm">
                    <strong>Cam kết:</strong> Chúng tôi không bán, cho thuê hoặc
                    chia sẻ thông tin cá nhân của bạn với bên thứ ba vì mục đích
                    thương mại.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 2. Thông tin chúng tôi thu thập */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-600" />
                  2. Thông tin chúng tôi thu thập
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Thông tin cá nhân:
                  </h4>
                  <div className="grid gap-3">
                    <div className="flex gap-3">
                      <Badge variant="outline" className="min-w-fit">
                        Bắt buộc
                      </Badge>
                      <div>
                        <p className="text-gray-700 font-medium">
                          Thông tin đăng ký
                        </p>
                        <p className="text-sm text-gray-600">
                          Họ tên, email, số điện thoại, giới tính
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Badge variant="outline" className="min-w-fit">
                        Tùy chọn
                      </Badge>
                      <div>
                        <p className="text-gray-700 font-medium">
                          Thông tin hồ sơ
                        </p>
                        <p className="text-sm text-gray-600">
                          Ảnh đại diện, địa chỉ, ngày sinh
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Badge variant="outline" className="min-w-fit">
                        Giao dịch
                      </Badge>
                      <div>
                        <p className="text-gray-700 font-medium">
                          Thông tin thanh toán
                        </p>
                        <p className="text-sm text-gray-600">
                          Lịch sử giao dịch, phương thức thanh toán
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Thông tin kỹ thuật:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Địa chỉ IP và thông tin thiết bị</li>
                    <li>Cookies và dữ liệu phiên làm việc</li>
                    <li>Nhật ký hoạt động trên nền tảng</li>
                    <li>Thông tin về trình duyệt và hệ điều hành</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 3. Cách chúng tôi sử dụng thông tin */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-purple-600" />
                  3. Cách chúng tôi sử dụng thông tin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">
                      Cung cấp dịch vụ:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-purple-700 ml-4">
                      <li>Xử lý đơn hàng và giao dịch</li>
                      <li>Kết nối khách hàng với nhà thiết kế</li>
                      <li>Hỗ trợ khách hàng và giải quyết tranh chấp</li>
                      <li>Cung cấp thông báo về trạng thái đơn hàng</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Cải thiện dịch vụ:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-green-700 ml-4">
                      <li>Phân tích hành vi người dùng</li>
                      <li>Cải thiện giao diện và trải nghiệm</li>
                      <li>Phát triển tính năng mới</li>
                      <li>Đảm bảo an ninh và chống gian lận</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Marketing và liên lạc:
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-blue-700 ml-4">
                      <li>Gửi thông báo quan trọng</li>
                      <li>Chia sẻ tin tức và cập nhật</li>
                      <li>Khuyến mãi và ưu đãi (với sự đồng ý)</li>
                      <li>Khảo sát ý kiến khách hàng</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4. Chia sẻ thông tin */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-orange-600" />
                  4. Chia sẻ thông tin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    Chúng tôi có thể chia sẻ thông tin trong các trường hợp:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-orange-700 ml-4">
                    <li>
                      <strong>Với sự đồng ý:</strong> Khi bạn cho phép rõ ràng
                    </li>
                    <li>
                      <strong>Đối tác dịch vụ:</strong> Nhà cung cấp thanh toán,
                      vận chuyển
                    </li>
                    <li>
                      <strong>Yêu cầu pháp lý:</strong> Theo quy định của pháp
                      luật
                    </li>
                    <li>
                      <strong>Bảo vệ quyền lợi:</strong> Ngăn chặn gian lận, vi
                      phạm
                    </li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-red-800 text-sm">
                    <strong>Cam kết:</strong> Chúng tôi KHÔNG bán thông tin cá
                    nhân cho bên thứ ba vì mục đích thương mại.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 5. Bảo mật thông tin */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-600" />
                  5. Bảo mật thông tin
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Biện pháp bảo mật:
                  </h4>
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3">
                      <Lock className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Mã hóa dữ liệu
                        </p>
                        <p className="text-sm text-gray-600">
                          SSL/TLS cho truyền tải, AES-256 cho lưu trữ
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Kiểm soát truy cập
                        </p>
                        <p className="text-sm text-gray-600">
                          Xác thực đa yếu tố, phân quyền nghiêm ngặt
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Eye className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Giám sát 24/7
                        </p>
                        <p className="text-sm text-gray-600">
                          Phát hiện và ngăn chặn truy cập bất thường
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Database className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Sao lưu định kỳ
                        </p>
                        <p className="text-sm text-gray-600">
                          Backup tự động và khôi phục dữ liệu
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 6. Quyền của người dùng */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  6. Quyền của người dùng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-3">
                    Bạn có quyền:
                  </h4>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Truy cập
                      </Badge>
                      <span className="text-green-700 text-sm">
                        Xem thông tin cá nhân được lưu trữ
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Chỉnh sửa
                      </Badge>
                      <span className="text-green-700 text-sm">
                        Cập nhật hoặc sửa đổi thông tin
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Xóa
                      </Badge>
                      <span className="text-green-700 text-sm">
                        Yêu cầu xóa tài khoản và dữ liệu
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Từ chối
                      </Badge>
                      <span className="text-green-700 text-sm">
                        Không đồng ý với việc xử lý dữ liệu
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Khiếu nại
                      </Badge>
                      <span className="text-green-700 text-sm">
                        Báo cáo vi phạm quyền riêng tư
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Để thực hiện các quyền trên, vui lòng liên hệ với chúng tôi
                  qua email hoặc số điện thoại được cung cấp bên dưới.
                </p>
              </CardContent>
            </Card>

            {/* 7. Cookies và công nghệ theo dõi */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  7. Cookies và công nghệ theo dõi
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Chúng tôi sử dụng cookies để:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Duy trì phiên đăng nhập của bạn</li>
                    <li>Ghi nhớ tùy chọn và cài đặt</li>
                    <li>Phân tích lưu lượng truy cập</li>
                    <li>Cải thiện hiệu suất website</li>
                    <li>Cung cấp nội dung phù hợp</li>
                  </ul>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Kiểm soát cookies:</strong> Bạn có thể quản lý
                    cookies thông qua cài đặt trình duyệt hoặc công cụ quản lý
                    cookies của chúng tôi.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 8. Thay đổi chính sách */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  8. Thay đổi chính sách
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Chúng tôi có thể cập nhật chính sách bảo mật này theo thời
                  gian để phản ánh các thay đổi trong dịch vụ hoặc yêu cầu pháp
                  lý.
                </p>
                <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <h4 className="font-semibold text-orange-800 mb-2">
                    Khi có thay đổi:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-orange-700 ml-4">
                    <li>Thông báo qua email cho người dùng đã đăng ký</li>
                    <li>Hiển thị thông báo trên website</li>
                    <li>Cập nhật ngày "Cập nhật lần cuối"</li>
                    <li>Cung cấp thời gian để người dùng xem xét</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* 9. Liên hệ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-green-600" />
                  9. Liên hệ về quyền riêng tư
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Nếu bạn có câu hỏi về chính sách bảo mật hoặc muốn thực hiện
                  quyền của mình:
                </p>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">Email bảo mật</p>
                      <p className="text-sm text-gray-600">
                        privacy@plushdollcustom.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Hotline hỗ trợ
                      </p>
                      <p className="text-sm text-gray-600">
                        1900-xxxx (8:00 - 22:00)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 text-sm">
                    <strong>Thời gian phản hồi:</strong> Chúng tôi cam kết phản
                    hồi các yêu cầu về quyền riêng tư trong vòng 72 giờ làm
                    việc.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <Card className="bg-gradient-to-r from-blue-500/5 to-indigo-500/10">
              <CardContent className="p-6 text-center">
                <p className="text-gray-600">
                  Chính sách bảo mật này có hiệu lực từ ngày {lastUpdated} và áp
                  dụng cho tất cả người dùng PlushDollCustom.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  © 2025 PlushDollCustom. Cam kết bảo vệ quyền riêng tư của bạn.
                </p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
