import type { ReactNode } from "react"

interface FormHeaderProps {
  title: string
  subtitle?: ReactNode
}

export default function FormHeader({ title, subtitle }: FormHeaderProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h2 className="mt-6 text-2xl font-bold text-gray-900">{title}</h2>
      {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
    </div>
  )
}
