import Heading from "@/components/atoms/about/Heading"
import Paragraph from "@/components/atoms/about/Paragraph"
import Image from "@/components/atoms/about/Image"
import { Button } from "@/components/ui/button"

export default function Hero() {
    return (
        <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <Heading level={1} className="text-4xl md:text-5xl mb-4">
                            Biến giấc mơ thành hiện thực
                        </Heading>
                        <Paragraph size="lg" className="mb-6">
                            DollCraft là một nền tảng nơi trí tưởng tượng gặp gỡ nghề thủ công. Chúng tôi giúp bạn tạo ra những con búp bê tùy chỉnh kể
                            câu chuyện độc đáo của bạn.
                        </Paragraph>
                        <div className="flex flex-wrap gap-4">
                            <Button type="button" size="lg">
                                Bắt đầu tạo
                            </Button>
                            <Button variant="outline" size="lg">
                                Xem thư viện
                            </Button>
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <Image
                            src="https://cdn.tuoitre.vn/471584752817336320/2024/8/15/photo1723691650607-17236916506511680605462.jpg"
                            alt="Custom doll creation"
                            width={600}
                            height={500}
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
