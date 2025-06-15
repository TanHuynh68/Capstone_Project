import { Facebook, Instagram, Twitter, Youtube, Linkedin } from "lucide-react";
import SocialButton from "@/components/atoms/general/contact/SocialButton";

export default function SocialLinks() {
  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
      <h2 className="text-2xl font-bold text-card-foreground mb-4">
        Kết nối với chúng tôi
      </h2>
      <p className="text-muted-foreground mb-4">
        Theo dõi chúng tôi trên mạng xã hội để xem những sáng tạo mới nhất, nội
        dung hậu trường và các chương trình khuyến mãi đặc biệt.
      </p>
      <div className="flex space-x-3">
        <SocialButton
          href="https://facebook.com"
          icon={<Facebook size={18} />}
          label="Facebook"
        />
        <SocialButton
          href="https://instagram.com"
          icon={<Instagram size={18} />}
          label="Instagram"
          color="bg-gradient-to-r from-purple-500 to-pink-500"
        />
        <SocialButton
          href="https://twitter.com"
          icon={<Twitter size={18} />}
          label="Twitter"
          color="bg-blue-400"
        />
        <SocialButton
          href="https://youtube.com"
          icon={<Youtube size={18} />}
          label="YouTube"
          color="bg-red-600"
        />
        <SocialButton
          href="https://linkedin.com"
          icon={<Linkedin size={18} />}
          label="LinkedIn"
          color="bg-blue-600"
        />
      </div>
    </div>
  );
}
