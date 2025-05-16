import Heading from "@/components/atoms/about/Heading"
import Paragraph from "@/components/atoms/about/Paragraph"
import FeatureCard from "@/components/molecules/about/FeatureCard"
import { Palette, Scissors, Heart, Sparkles, Users, ShieldCheck } from "lucide-react"

export default function Features() {
    const features = [
        {
            title: "Thiết Kế Tùy Chỉnh",
            description: "Tạo ra những búp bê với đặc điểm, trang phục và phụ kiện độc đáo theo ý tưởng của bạn.",
            icon: <Palette size={24} />,
        },
        {
            title: "Chất Liệu Cao Cấp",
            description: "Chúng tôi sử dụng chất liệu an toàn, bền và cao cấp cho tất cả các búp bê tùy chỉnh.",
            icon: <Scissors size={24} />,
        },
        {
            title: "Thủ Công Tỉ Mỉ",
            description: "Mỗi con búp bê được các nghệ nhân khéo léo làm thủ công với sự chú ý đến từng chi tiết.",
            icon: <Heart size={24} />,
        },
        {
            title: "Cá Nhân Hóa",
            description: "Thêm tên, ngày sinh hoặc thông điệp đặc biệt để làm cho búp bê trở nên độc nhất.",
            icon: <Sparkles size={24} />,
        },
        {
            title: "Cộng Đồng",
            description: "Tham gia cộng đồng yêu búp bê để chia sẻ ý tưởng và tìm cảm hứng.",
            icon: <Users size={24} />,
        },
        {
            title: "Cam Kết Hài Lòng",
            description: "Chúng tôi cam kết mang lại sự hài lòng với chính sách bảo đảm 100% niềm vui.",
            icon: <ShieldCheck size={24} />,
        },

    ]

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <Heading level={2}>Tại sao chọn DollCraft</Heading>
                    <Paragraph size="lg" className="max-w-3xl mx-auto">
                        Chúng tôi kết hợp nghệ thuật, vật liệu chất lượng và tầm nhìn độc đáo của bạn để tạo ra những con búp bê tùy chỉnh thực sự
                        độc nhất vô nhị.
                    </Paragraph>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} title={feature.title} description={feature.description} icon={feature.icon} />
                    ))}
                </div>
            </div>
        </section>
    )
}
