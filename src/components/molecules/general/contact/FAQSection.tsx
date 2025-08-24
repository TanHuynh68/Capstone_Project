import { memo, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = memo(function FAQSection() {
  const faqs = useMemo(
    () => [
      {
        question: "Quy trình đặt đơn như thế nào?",
        answer: `Quy trình đặt đơn trên nền tảng diễn ra theo các bước sau:

1) Đăng bài yêu cầu  
Khách hàng đăng bài kèm ảnh sản phẩm cần thiết kế cùng mô tả chi tiết mong muốn.

2) Nhận đề xuất từ nhà thiết kế  
Các nhà thiết kế quan tâm sẽ gửi các đề xuất phù hợp với yêu cầu.

3) Chọn nhà thiết kế & thương lượng  
Khách hàng chọn nhà thiết kế phù hợp để bắt đầu thương lượng chi tiết trong phần nhắn tin.

4) Lên kế hoạch thực hiện  
Hai bên cùng thống nhất các giai đoạn thực hiện dự án, nội dung và chi phí từng giai đoạn.

5) Tạo đơn chính thức  
Khi đã đạt thỏa thuận, nhà thiết kế tiến hành đặt cọc để tạo đơn hàng chính thức.

6) Giao sản phẩm đầu vào  
Khách hàng giao sản phẩm cho nhà thiết kế thông qua mục giao hàng trong hệ thống.

7) Kiểm tra và bắt đầu thực hiện  
Nhà thiết kế kiểm tra sản phẩm nhận và bắt đầu thực hiện giai đoạn.

8) Đặt cọc theo từng phase  
Trước mỗi giai đoạn, khách hàng sẽ đặt cọc tương ứng để nhà thiết kế rút tiền để thực hiện và cập nhật chi tiết cho từng giai đoạn.

9) Hoàn thành và đánh giá từng phase  
Sau khi mỗi giai đoạn hoàn tất, khách hàng tiến hành đánh giá chất lượng để tiếp tục giai đoạn tiếp theo.

10) Hoàn tất đơn và nhận lại sản phẩm  
Khi tất cả các giai đoạn đều được hoàn thành và đánh giá đạt yêu cầu, nhà thiết kế tiến hành giao lại sản phẩm hoàn thiện cho khách hàng.

11) Đánh giá cuối cùng & thanh toán  
Khách hàng đánh giá tổng thể. Nhà thiết kế nhận lại phần tiền cọc còn lại (sau khi trừ phí nền tảng).`,
      },
      {
        question: "Làm thế nào để khiếu nại về sản phẩm?",
        answer: `Quy trình khiếu nại trên nền tảng diễn ra theo các bước sau:

1) Người dùng chọn phần cần khiếu nại  
Người dùng có thể khiếu nại về bài đăng, đơn hàng, giao hàng, …

2) Chờ nhân viên xem xét  
Sau khi gửi đơn khiếu nại thành công, người dùng cần chờ đợi để nhân viên đưa ra hướng giải quyết hợp lệ.

3) Nhân viên tiến hành giải quyết  
Nhân viên sẽ xem xét đơn khiếu nại và kiểm tra các bằng chứng để đưa ra hướng xử lý.

4) Nhận kết quả  
Sau khi giải quyết xong, hệ thống sẽ gửi thông báo về tình trạng đơn khiếu nại.`,
      },
      {
        question: "Quy trình rút tiền/hoàn tiền như thế nào?",
        answer: `Rút tiền:  
Người dùng có thể rút tiền bằng cách vào phần ví và chọn số tiền hợp lệ cần rút. Sau khi tạo đơn, sẽ chờ nhân viên kiểm tra và thực hiện rút tiền về cho tài khoản người dùng.

Hoàn tiền:  
Đối với những đơn hàng bị hủy, có thể hoàn tiền sau khi đơn tố cáo/khiếu nại được giải quyết. Tiền sẽ được hoàn tự động về ví của người dùng.`,
      },
      {
        question: "Tôi có thể hủy đơn hàng sau khi đã thanh toán không?",
        answer: `Có thể hủy đơn hàng cả trước khi thực hiện và trong khi thực hiện.  
Khi đơn hàng bị hủy cần kèm lý do tố cáo/khiếu nại và sẽ được nhân viên xem xét để đưa ra hướng giải quyết cho cả hai bên.`,
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
            <AccordionContent className="whitespace-pre-line">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
});

export default FAQSection;
