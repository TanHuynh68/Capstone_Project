import type { ReactNode } from "react"

interface ContactInfoItemProps {
  icon: ReactNode
  title: string
  children: ReactNode
}

export default function ContactInfoItem({ icon, title, children }: ContactInfoItemProps) {
  return (
    <div className="flex items-start space-x-3">
      <div className="mt-0.5 text-blue-500">{icon}</div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <div className="text-gray-600">{children}</div>
      </div>
    </div>
  )
}
