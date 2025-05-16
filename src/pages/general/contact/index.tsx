import ContactHeader from "@/components/organisms/contact/ContactHeader"
import ContactContent from "@/components/organisms/contact/ContactContent"
import ContactCTA from "@/components/organisms/contact/ContactCTA"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <ContactHeader />
        <ContactContent />
        <ContactCTA />
      </main>
    </div>
  )
}
