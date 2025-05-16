import Heading from "@/components/atoms/about/Heading"
import Paragraph from "@/components/atoms/about/Paragraph"
import ProcessStep from "@/components/molecules/about/ProcessStep"

export default function Process() {
    const steps = [
        {
            number: 1,
            title: "Thiết Kế Búp Bê",
            description:
                "Sử dụng công cụ thiết kế trực quan của chúng tôi để tùy chỉnh mọi chi tiết của búp bê, từ khuôn mặt đến trang phục và phụ kiện.",
            imageSrc: "https://www.1999.co.jp/itbig65/10654337b11.jpg",
        },
        {
            number: 2,
            title: "Xem Lại & Phê Duyệt",
            description:
                "Các nhà thiết kế sẽ tạo mô hình chi tiết của búp bê để bạn xem và phê duyệt trước khi bắt đầu chế tác.",
            imageSrc: "https://www.thesun.ie/wp-content/uploads/sites/3/2025/04/newspress-collage-pfciau2ou-1744113994916.jpg?1744117891&strip=all&quality=100&w=1920&h=1333&crop=1",
        },
        {
            number: 3,
            title: "Chế Tác Thủ Công",
            description:
                "Đội ngũ nghệ nhân lành nghề sẽ tỉ mỉ hiện thực hóa thiết kế của bạn bằng chất liệu cao cấp và sự chăm chút từng chi tiết.",
            imageSrc: "https://cdnphoto.dantri.com.vn/PWsLBaOV97o0ot1Lhdwh2bkkUJw=/thumb_w/1920/2024/08/17/f1c97b7eaaa90ef757b8-1723834851015.jpg?watermark=true",
        },
        {
            number: 4,
            title: "Giao Hàng & Tận Hưởng",
            description:
                "Búp bê được đóng gói cẩn thận và giao tận tay bạn, sẵn sàng trở thành món quà lưu niệm đầy ý nghĩa.",
            imageSrc: "https://d2z2mkwk6fkehh.cloudfront.net/f2me/blog/Labubu%20Shopping%20Guide/FORWARD2ME_Labubu_1920x840.png",
        },

    ]

    return (
        <section className="py-16 bg-purple-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <Heading level={2}>Nó hoạt động như thế nào</Heading>
                    <Paragraph size="lg" className="max-w-3xl mx-auto">
                        Tạo búp bê tùy chỉnh của bạn là một hành trình hợp tác. Đây là cách chúng tôi hiện thực hóa tầm nhìn của bạn.
                    </Paragraph>
                </div>

                <div className="space-y-16">
                    {steps.map((step, index) => (
                        <ProcessStep
                            key={index}
                            number={step.number}
                            title={step.title}
                            description={step.description}
                            imageSrc={step.imageSrc}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
