import Heading from "@/components/atoms/about/Heading"
import Paragraph from "@/components/atoms/about/Paragraph"
import { Button } from "@/components/ui/button"

export default function CallToAction() {
    return (
        <section className="py-16 bg-blue-500 text-white">
            <div className="container mx-auto px-4 text-center">
                <Heading level={2} className="text-white">
                    Bạn đã sẵn sàng tạo búp bê theo ý mình chưa?
                </Heading>
                <Paragraph size="lg" className="text-white opacity-90 max-w-3xl mx-auto mb-8">
                    Hãy bắt đầu hành trình của bạn ngay hôm nay và biến tầm nhìn độc đáo của bạn thành hiện thực với dịch vụ chuyên nghiệp và được cá nhân hóa của chúng tôi.
                </Paragraph>
                <div className="flex flex-wrap justify-center gap-4">
                    <Button variant="secondary" size="lg" className="bg-white text-blue-500 hover:bg-gray-100">
                        Bắt đầu thiết kế
                    </Button>
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-blue-600">
                        Liên hệ với chúng tôi
                    </Button>
                </div>
            </div>
        </section>
    )
}
