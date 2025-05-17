import ContactForm from "@/components/molecules/contact/ContactForm"
import ContactInfoCard from "@/components/molecules/contact/ContactInfoCard"
import SocialLinks from "@/components/molecules/contact/SocialLinks"
import MapSection from "@/components/molecules/contact/MapSection"
import FAQSection from "@/components/molecules/contact/FAQSection"

export default function ContactContent() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Form - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Gửi tin nhắn cho chúng tôi</h2>
            <p className="text-gray-600 mb-6">Hãy điền vào mẫu dưới đây và chúng tôi sẽ phản hồi bạn sớm nhất có thể.</p>
            <ContactForm />
          </div>

          {/* Contact Info - Takes up 1 column */}
          <div className="space-y-8">
            <ContactInfoCard />
            <SocialLinks />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Map Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vị trí của chúng tôi</h2>
            <p className="text-gray-600 mb-6">
              Hãy đến xưởng của chúng tôi để xem trực tiếp búp bê và gặp gỡ đội ngũ sáng tạo của chúng tôi.
            </p>
            <MapSection />
          </div>

          {/* FAQ Section */}
          <div>
            <FAQSection />
          </div>
        </div>
      </div>
    </section>
  )
}
