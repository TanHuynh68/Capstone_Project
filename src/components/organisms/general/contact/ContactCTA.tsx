import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ContactCTA() {
  const navigate = useNavigate();

  const handleStartDesign = () => {
    navigate("/canvas");
  };

  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Sẵn sàng bắt đầu hành trình búp bê của riêng bạn?
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
          Khám phá và bắt đầu thiết kế búp bê độc
          đáo của bạn ngay bây giờ.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleStartDesign}
          >
            Bắt đầu thiết kế <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
