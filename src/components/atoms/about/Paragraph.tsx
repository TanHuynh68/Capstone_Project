import type { ReactNode } from "react"

interface ParagraphProps {
  children: ReactNode
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function Paragraph({ children, size = "md", className = "" }: ParagraphProps) {
  const sizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  return <p className={`text-gray-600 mb-4 leading-relaxed ${sizeStyles[size]} ${className}`}>{children}</p>
}
