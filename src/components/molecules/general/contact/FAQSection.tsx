import React, { memo, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FileText,
  MessageSquare,
  Handshake,
  Calendar,
  ShoppingCart,
  Truck,
  CheckCircle,
  CreditCard,
  Star,
  Package,
  ThumbsUp,
  AlertTriangle,
  DollarSign,
  XCircle,
} from "lucide-react";

// Component helper để render step với icon
const StepWithIcon = ({ step, title, description, icon: Icon, iconColor = "text-blue-500" }: {
  step: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
}) => (
  <div className="flex gap-3 mb-4">
    <div className="flex-shrink-0">
      <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${iconColor}`}>
        <Icon className="w-4 h-4" />
      </div>
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm font-medium text-gray-500">{step})</span>
        <span className="font-semibold text-gray-900">{title}</span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  </div>
);

const FAQSection = memo(function FAQSection() {
  const faqs = useMemo(
    (): Array<{ question: string; answer: string | React.ReactNode }> => [
      {
        question: "Quy trình đặt đơn như thế nào?",
        answer: (
          <div className="space-y-1">
            <p className="text-sm text-gray-600 mb-4">Quy trình đặt đơn trên nền tảng diễn ra theo các bước sau:</p>

            <StepWithIcon
              step={1}
              title="Đăng bài yêu cầu"
              description="Khách hàng đăng bài kèm ảnh sản phẩm cần thiết kế cùng mô tả chi tiết mong muốn."
              icon={FileText}
              iconColor="text-blue-500"
            />

            <StepWithIcon
              step={2}
              title="Nhận đề xuất từ nhà thiết kế"
              description="Các nhà thiết kế quan tâm sẽ gửi các đề xuất phù hợp với yêu cầu."
              icon={MessageSquare}
              iconColor="text-green-500"
            />

            <StepWithIcon
              step={3}
              title="Chọn nhà thiết kế & thương lượng"
              description="Khách hàng chọn nhà thiết kế phù hợp để bắt đầu thương lượng chi tiết trong phần nhắn tin."
              icon={Handshake}
              iconColor="text-purple-500"
            />

            <StepWithIcon
              step={4}
              title="Lên kế hoạch thực hiện"
              description="Hai bên cùng thống nhất các giai đoạn thực hiện dự án, nội dung và chi phí từng giai đoạn."
              icon={Calendar}
              iconColor="text-orange-500"
            />

            <StepWithIcon
              step={5}
              title="Tạo đơn chính thức"
              description="Khi đã đạt thỏa thuận, nhà thiết kế tiến hành đặt cọc để tạo đơn hàng chính thức."
              icon={ShoppingCart}
              iconColor="text-indigo-500"
            />

            <StepWithIcon
              step={6}
              title="Giao sản phẩm đầu vào"
              description="Khách hàng giao sản phẩm cho nhà thiết kế thông qua mục giao hàng trong hệ thống."
              icon={Truck}
              iconColor="text-cyan-500"
            />

            <StepWithIcon
              step={7}
              title="Kiểm tra và bắt đầu thực hiện"
              description="Nhà thiết kế kiểm tra sản phẩm nhận và bắt đầu thực hiện giai đoạn."
              icon={CheckCircle}
              iconColor="text-emerald-500"
            />

            <StepWithIcon
              step={8}
              title="Đặt cọc theo từng giai đoạn"
              description="Trước mỗi giai đoạn, khách hàng sẽ đặt cọc tương ứng để nhà thiết kế rút tiền để thực hiện và cập nhật chi tiết cho từng giai đoạn."
              icon={CreditCard}
              iconColor="text-yellow-500"
            />

            <StepWithIcon
              step={9}
              title="Hoàn thành và đánh giá từng giai đoạn"
              description="Sau khi mỗi giai đoạn hoàn tất, khách hàng tiến hành đánh giá chất lượng để tiếp tục giai đoạn tiếp theo."
              icon={Star}
              iconColor="text-pink-500"
            />

            <StepWithIcon
              step={10}
              title="Hoàn tất đơn và nhận lại sản phẩm"
              description="Khi tất cả các giai đoạn đều được hoàn thành và đánh giá đạt yêu cầu, nhà thiết kế tiến hành giao lại sản phẩm hoàn thiện cho khách hàng."
              icon={Package}
              iconColor="text-teal-500"
            />

            <StepWithIcon
              step={11}
              title="Đánh giá cuối cùng & thanh toán"
              description="Khách hàng đánh giá tổng thể. Nhà thiết kế nhận lại phần tiền cọc còn lại (sau khi trừ phí nền tảng)."
              icon={ThumbsUp}
              iconColor="text-red-500"
            />
          </div>
        ),
      },
      {
        question: "Làm thế nào để khiếu nại về sản phẩm?",
        answer: (
          <div className="space-y-1">
            <p className="text-sm text-gray-600 mb-4">Quy trình khiếu nại trên nền tảng diễn ra theo các bước sau:</p>

            <StepWithIcon
              step={1}
              title="Người dùng chọn phần cần khiếu nại"
              description="Người dùng có thể khiếu nại về bài đăng, đơn hàng, giao hàng, …"
              icon={AlertTriangle}
              iconColor="text-red-500"
            />

            <StepWithIcon
              step={2}
              title="Chờ nhân viên xem xét"
              description="Sau khi gửi đơn khiếu nại thành công, người dùng cần chờ đợi để nhân viên đưa ra hướng giải quyết hợp lệ."
              icon={MessageSquare}
              iconColor="text-yellow-500"
            />

            <StepWithIcon
              step={3}
              title="Nhân viên tiến hành giải quyết"
              description="Nhân viên sẽ xem xét đơn khiếu nại và kiểm tra các bằng chứng để đưa ra hướng xử lý."
              icon={CheckCircle}
              iconColor="text-blue-500"
            />

            <StepWithIcon
              step={4}
              title="Nhận kết quả"
              description="Sau khi giải quyết xong, hệ thống sẽ gửi thông báo về tình trạng đơn khiếu nại."
              icon={ThumbsUp}
              iconColor="text-green-500"
            />
          </div>
        ),
      },
      {
        question: "Quy trình rút tiền/hoàn tiền như thế nào?",
        answer: (
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Rút tiền</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Người dùng có thể rút tiền bằng cách vào phần ví và chọn số tiền hợp lệ cần rút.
                  Sau khi tạo đơn, sẽ chờ nhân viên kiểm tra và thực hiện rút tiền về cho tài khoản người dùng.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">Hoàn tiền</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Đối với những đơn hàng bị hủy, có thể hoàn tiền sau khi đơn tố cáo/khiếu nại được giải quyết.
                  Tiền sẽ được hoàn tự động về ví của người dùng.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        question: "Tôi có thể hủy đơn hàng sau khi đã thanh toán không?",
        answer: (
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-900">Có thể hủy đơn hàng</span> cả trước khi thực hiện và trong khi thực hiện.
                Khi đơn hàng bị hủy cần kèm lý do tố cáo/khiếu nại và sẽ được nhân viên xem xét để đưa ra hướng giải quyết cho cả hai bên.
              </p>
            </div>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
      <h2 className="text-2xl font-bold text-card-foreground mb-4">
        Câu Hỏi Thường Gặp
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left cursor-pointer">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>
              {typeof faq.answer === 'string' ? (
                <div className="whitespace-pre-line">{faq.answer}</div>
              ) : (
                faq.answer
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
});

export default FAQSection;
