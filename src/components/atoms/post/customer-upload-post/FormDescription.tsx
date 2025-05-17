import type { ReactNode } from "react"

interface FormDescriptionProps {
  children: ReactNode
  className?: string
}

export default function FormDescription({ children, className = "" }: FormDescriptionProps) {
  return <p className={`text-gray-500 text-sm mt-1 ${className}`}>{children}</p>
}
