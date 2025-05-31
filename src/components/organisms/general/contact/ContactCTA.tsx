import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function ContactCTA() {
  return (
    <section className="py-16 bg-purple-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Sẵn sàng bắt đầu hành trình búp bê của riêng bạn?</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          Khám phá thư viện mẫu để lấy cảm hứng hoặc bắt đầu thiết kế búp bê độc đáo của bạn ngay bây giờ.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button className=" text-white">
            Bắt đầu thiết kế <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" className="border-blue-300 text-blue-500 hover:bg-pink-50">
            Xem thư viện
          </Button>
        </div>
      </div>
    </section>
  )
}
