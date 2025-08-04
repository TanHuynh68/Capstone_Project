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
        answer:
          "Quy trình đặt đơn gồm 4 bước:\n\n1) Thiết kế búp bê trên nền tảng của chúng tôi\n2) Xác nhận thiết kế và thanh toán\n3) Chúng tôi bắt đầu sản xuất và cập nhật tiến độ\n4) Giao hàng và xác nhận nhận hàng",
      },
      {
        question: "Làm thế nào để khiếu nại về sản phẩm?",
        answer:
          "Để khiếu nại, vui lòng:\n\n1) Chụp ảnh sản phẩm có vấn đề\n2) Liên hệ qua email hoặc hotline trong vòng 14 ngày\n3) Mô tả chi tiết vấn đề\n4) Chúng tôi sẽ phản hồi trong 24-48 giờ và hỗ trợ giải quyết",
      },
      {
        question: "Quy trình rút tiền/hoàn tiền như thế nào?",
        answer:
          "Quy trình hoàn tiền:\n\n1) Gửi yêu cầu hoàn tiền qua email hoặc hotline\n2) Cung cấp thông tin đơn hàng và lý do\n3) Chúng tôi xem xét trong 3-5 ngày làm việc\n4) Nếu được chấp thuận, tiền sẽ được hoàn trong 7-14 ngày tùy phương thức thanh toán",
      },
      {
        question: "Tôi có thể hủy đơn hàng sau khi đã thanh toán không?",
        answer:
          "Có thể hủy đơn hàng trong vòng 24 giờ sau khi đặt hàng. Sau thời gian này, nếu chưa bắt đầu sản xuất, bạn có thể yêu cầu hoàn tiền với phí xử lý 10%. Nếu đã bắt đầu sản xuất, không thể hủy đơn hàng.",
      },
      {
        question: "Làm thế nào để theo dõi đơn hàng của tôi?",
        answer:
          "Bạn có thể theo dõi đơn hàng qua:\n\n1) Email cập nhật tự động\n2) Đăng nhập vào tài khoản trên website\n3) Liên hệ hotline với mã đơn hàng\n\nChúng tôi cập nhật trạng thái mỗi 2-3 ngày.",
      },
      {
        question: "Có thể thay đổi thiết kế sau khi đã đặt hàng không?",
        answer:
          "Có thể thay đổi thiết kế trong vòng 48 giờ sau khi đặt hàng với phí thay đổi 5% giá trị đơn hàng. Sau thời gian này, việc thay đổi sẽ phụ thuộc vào tiến độ sản xuất và có thể phát sinh thêm chi phí.",
      },
      // {
      //   question: "Mất bao lâu để tạo một búp bê theo yêu cầu?",
      //   answer:
      //     "Quá trình tạo thường mất từ 2–4 tuần kể từ khi phê duyệt thiết kế đến khi giao hàng, tùy thuộc vào độ phức tạp của búp bê và số lượng đơn hàng hiện tại.",
      // },
      // {
      //   question:
      //     "Tôi có thể yêu cầu những chi tiết cụ thể cho búp bê của mình không?",
      //   answer:
      //     "Bạn có thể tùy chỉnh mọi thứ từ màu tóc, kiểu tóc, khuôn mặt cho đến trang phục và phụ kiện. Công cụ thiết kế của chúng tôi hỗ trợ tùy chỉnh chi tiết.",
      // },
      // {
      //   question: "Nếu tôi không hài lòng với búp bê thì sao?",
      //   answer:
      //     "Chúng tôi cam kết sự hài lòng của bạn. Nếu búp bê không đáp ứng mong đợi, vui lòng liên hệ với chúng tôi trong vòng 14 ngày kể từ khi nhận hàng để được hỗ trợ.",
      // },
      // {
      //   question: "Tôi có thể đặt nhiều búp bê với cùng một thiết kế không?",
      //   answer:
      //     "Có, bạn có thể đặt nhiều búp bê có cùng thiết kế. Chúng tôi cung cấp ưu đãi giảm giá cho đơn hàng từ 3 búp bê trở lên với thông số giống nhau.",
      // },
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
