import type { ReactNode } from "react"

interface FormErrorProps {
  children: ReactNode
  className?: string
}

export default function FormError({ children, className = "" }: FormErrorProps) {
  return <p className={`text-red-500 text-sm mt-1 ${className}`}>{children}</p>
}
