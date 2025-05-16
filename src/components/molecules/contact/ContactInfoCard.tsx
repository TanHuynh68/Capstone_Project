import { MapPin, Phone, Mail, Clock } from "lucide-react"
import ContactInfoItem from "@/components/atoms/contact/ContactInfoItem"

export default function ContactInfoCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Thông Tin Liên Hệ</h2>

      <ContactInfoItem icon={<MapPin size={20} />} title="Địa Chỉ">
        <address className="not-italic">
          123 Craft Lane
          <br />
          Dollsville, DC 12345
          <br />
          Hoa Kỳ
        </address>
      </ContactInfoItem>

      <ContactInfoItem icon={<Phone size={20} />} title="Số Điện Thoại">
        <a href="tel:+1234567890" className=" transition-colors">
          (123) 456-7890
        </a>
      </ContactInfoItem>

      <ContactInfoItem icon={<Mail size={20} />} title="Email">
        <a href="mailto:info@dollcraft.com" className=" transition-colors">
          info@dollcraft.com
        </a>
      </ContactInfoItem>

      <ContactInfoItem icon={<Clock size={20} />} title="Giờ Làm Việc">
        <p>Thứ Hai - Thứ Sáu: 9:00 - 18:00</p>
        <p>Thứ Bảy: 10:00 - 16:00</p>
        <p>Chủ Nhật: Nghỉ</p>
      </ContactInfoItem>
    </div>
  )
}
