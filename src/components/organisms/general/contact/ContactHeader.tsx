import { Separator } from "@/components/ui/separator"

export default function ContactHeader() {
    return (
        <section className="py-12 bg-gradient-to-b from-purple-50 to-white">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Liên hệ</h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Bạn có thắc mắc về búp bê tùy chỉnh của chúng tôi hoặc cần hỗ trợ với đơn hàng của mình không? Chúng tôi ở đây để giúp bạn! Hãy liên hệ với đội ngũ
                    thân thiện của chúng tôi bằng thông tin liên hệ bên dưới.
                </p>
                <Separator className="mt-8 max-w-md mx-auto" />
            </div>
        </section>
    )
}
