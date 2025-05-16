import type { ReactNode } from "react"
import type { JSX } from "react"

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6
  children: ReactNode
  className?: string
}

export default function Heading({ level, children, className = "" }: HeadingProps) {
  const baseStyles = "font-bold text-gray-900"

  const sizeStyles = {
    1: "text-4xl md:text-5xl mb-6",
    2: "text-3xl md:text-4xl mb-5",
    3: "text-2xl md:text-3xl mb-4",
    4: "text-xl md:text-2xl mb-3",
    5: "text-lg md:text-xl mb-2",
    6: "text-base md:text-lg mb-2",
  }

  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  return <Tag className={`${baseStyles} ${sizeStyles[level]} ${className}`}>{children}</Tag>
}
