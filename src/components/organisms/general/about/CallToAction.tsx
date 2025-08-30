import Heading from "@/components/atoms/general/about/Heading";
import Paragraph from "@/components/atoms/general/about/Paragraph";
import { Button } from "@/components/ui/button";
import { Paintbrush2, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <Heading level={2} className="text-primary-foreground">
          Bạn đã sẵn sàng tạo búp bê theo ý mình chưa?
        </Heading>
        <Paragraph
          size="lg"
          className="text-primary-foreground opacity-90 max-w-3xl mx-auto mb-8"
        >
          Hãy bắt đầu hành trình của bạn ngay hôm nay và biến tầm nhìn độc đáo
          của bạn thành hiện thực với dịch vụ chuyên nghiệp và được cá nhân hóa
          của chúng tôi.
        </Paragraph>
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            size="lg"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 transform hover:scale-105 transition-all duration-300"
            asChild
          >
            <Link
              to="/canvas"
              className="flex items-center gap-2"
            >
              <Paintbrush2 className="h-5 w-5" />
              <span className="inline-block align-middle">
                Bắt đầu sáng tạo
              </span>
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            asChild
          >
            <Link
              to="/contact"
              className="flex items-center gap-2"
            >
              <Mail className="h-5 w-5" />
              <span className="inline-block align-middle">Liên hệ</span>
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
