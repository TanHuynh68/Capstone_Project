import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQSection() {
  const faqs = [
    {
      question: "Mất bao lâu để tạo một búp bê theo yêu cầu?",
      answer:
        "Quá trình tạo thường mất từ 2–4 tuần kể từ khi phê duyệt thiết kế đến khi giao hàng, tùy thuộc vào độ phức tạp của búp bê và số lượng đơn hàng hiện tại.",
    },
    {
      question: "Tôi có thể yêu cầu những chi tiết cụ thể cho búp bê của mình không?",
      answer:
        "Bạn có thể tùy chỉnh mọi thứ từ màu tóc, kiểu tóc, khuôn mặt cho đến trang phục và phụ kiện. Công cụ thiết kế của chúng tôi hỗ trợ tùy chỉnh chi tiết.",
    },
    {
      question: "Bạn có giao hàng quốc tế không?",
      answer:
        "Có, chúng tôi giao hàng toàn cầu. Phí vận chuyển quốc tế và thời gian giao hàng sẽ thay đổi tùy theo vị trí của bạn. Bạn có thể xem chi phí ước tính trong quá trình thanh toán.",
    },
    {
      question: "Nếu tôi không hài lòng với búp bê thì sao?",
      answer:
        "Chúng tôi cam kết sự hài lòng của bạn. Nếu búp bê không đáp ứng mong đợi, vui lòng liên hệ với chúng tôi trong vòng 14 ngày kể từ khi nhận hàng để được hỗ trợ.",
    },
    {
      question: "Tôi có thể đặt nhiều búp bê với cùng một thiết kế không?",
      answer:
        "Có, bạn có thể đặt nhiều búp bê có cùng thiết kế. Chúng tôi cung cấp ưu đãi giảm giá cho đơn hàng từ 3 búp bê trở lên với thông số giống nhau.",
    },
  ]

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Câu Hỏi Thường Gặp</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
