import Heading from "@/components/atoms/general/about/Heading";
import Paragraph from "@/components/atoms/general/about/Paragraph";
import Image from "@/components/atoms/general/about/Image";
import { Button } from "@/components/ui/button";
import { Paintbrush2, ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="py-16 bg-gradient-to-b from-secondary to-background ">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <Heading level={1} className="text-4xl md:text-5xl mb-4">
              Biến giấc mơ thành hiện thực
            </Heading>
            <Paragraph size="lg" className="mb-6 text-muted-foreground">
              DollCraft là một nền tảng nơi trí tưởng tượng gặp gỡ nghề thủ
              công. Chúng tôi giúp bạn tạo ra những con búp bê tùy chỉnh kể câu
              chuyện độc đáo của bạn.
            </Paragraph>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 transform hover:scale-105 transition-all duration-300"
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
                className="border-primary text-primary hover:bg-primary/5 bg-transparent"
                asChild
              >
                <Link
                  to="/contact"
                  className="flex items-center gap-2"
                >
                  <ImageIcon className="h-5 w-5" />
                  <span className="inline-block align-middle">Liên hệ</span>
                </Link>
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
  );
}
