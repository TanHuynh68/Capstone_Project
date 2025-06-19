import Heading from "@/components/atoms/general/about/Heading";
import Paragraph from "@/components/atoms/general/about/Paragraph";
import { Button } from "@/components/ui/button";

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
            variant="secondary"
            size="lg"
            className="bg-background text-primary hover:bg-secondary"
          >
            Bắt đầu thiết kế
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-primary-foreground text-primary-foreground hover:bg-primary/80"
          >
            Liên hệ với chúng tôi
          </Button>
        </div>
      </div>
    </section>
  );
}
