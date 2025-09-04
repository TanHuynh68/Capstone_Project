// import ContactForm from "@/components/molecules/general/contact/ContactForm";
// import ContactInfoCard from "@/components/molecules/general/contact/ContactInfoCard";
// import SocialLinks from "@/components/molecules/general/contact/SocialLinks";
import MapSection from "@/components/molecules/general/contact/MapSection";
import FAQSection from "@/components/molecules/general/contact/FAQSection";

export default function ContactContent() {
  return (
    <section className="py-0 bg-background">
      <div className="container mx-auto px-4">
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Gửi tin nhắn cho chúng tôi
            </h2>
            <p className="text-muted-foreground mb-6">
              Hãy điền vào mẫu dưới đây và chúng tôi sẽ phản hồi bạn sớm nhất có
              thể.
            </p>
            <ContactForm />
          </div>

          <div className="space-y-8">
            <ContactInfoCard />
          </div>
        </div> */}

        <div className="grid grid-cols-1  gap-8 mb-4 items-stretch">
          <div className="flex flex-col h-full">
            <FAQSection />
          </div>
          {/* Map Section */}
          <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Vị trí của chúng tôi
            </h2>
            <p className="text-muted-foreground mb-6">
              Địa chỉ: 77 Trần Quốc Thảo, Phường Võ Thị Sáu, Quận 3, Hồ Chí Minh
            </p>
            <MapSection />
          </div>

          {/* FAQ Section */}
        </div>
      </div>
    </section>
  );
}
