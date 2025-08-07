import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PolicyOverview from "@/components/organisms/policy/PolicyOverview";
import PolicyTable from "@/components/organisms/policy/PolicyTable";
import { FileText, Scale, Users } from "lucide-react";
import { policyData } from "./policyData";

export default function PolicyTemplate() {
  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="container mx-auto px-4 py-8 ">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Scale className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold ">
              Quyền lợi & Chính sách
            </h1>
          </div>
          <p className="text-lg  max-w-4xl mx-auto">
            Hệ thống điểm số và bồi thường minh bạch, đảm bảo quyền lợi cho cả
            khách hàng và nhà thiết kế
          </p>
        </div>

        {/* Overview Cards */}
        <PolicyOverview />

        {/* Important Notice */}
        <Card className="mb-8 border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <FileText className="h-5 w-5" />
              Lưu ý quan trọng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-amber-700">
              <p>
                • Điểm số được tính tự động dựa trên hành vi và kết quả thực tế
              </p>
              <p>
                • Bồi thường được tính theo tỷ lệ phần trăm của giá trị đơn hàng
              </p>
              <p>• Mọi tranh chấp sẽ được xem xét và giải quyết công bằng</p>
              <p>
                • Chính sách có thể được cập nhật để phù hợp với tình hình thực
                tế
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Policy Tables */}
        <div className="space-y-8">
          {policyData.map((category) => (
            <PolicyTable key={category.id} category={category} />
          ))}
        </div>

        {/* Footer */}
        <Card className="mt-12 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Users className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold text-gray-900">
                Cam kết của chúng tôi
              </h3>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết xây dựng một môi trường làm việc công bằng, minh
              bạch và bảo vệ quyền lợi của tất cả các bên tham gia. Mọi thắc mắc
              xin liên hệ bộ phận hỗ trợ.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
