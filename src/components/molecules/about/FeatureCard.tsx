import type { ReactNode } from "react"
import Heading from "@/components/atoms/about/Heading"
import Paragraph from "@/components/atoms/about/Paragraph"

interface FeatureCardProps {
  title: string
  description: string
  icon: ReactNode
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 mb-4">
        {icon}
      </div>
      <Heading level={3} className="text-xl mb-2">
        {title}
      </Heading>
      <Paragraph size="md">{description}</Paragraph>
    </div>
  )
}
