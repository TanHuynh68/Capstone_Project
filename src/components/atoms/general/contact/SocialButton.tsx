import type { ReactNode } from "react"

interface SocialButtonProps {
  href: string
  icon: ReactNode
  label: string
  color?: string
}

export default function SocialButton({ href, icon, label, color = "bg-pink-500" }: SocialButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${color} text-white p-2 rounded-full hover:opacity-90 transition-opacity`}
      aria-label={label}
    >
      {icon}
      <span className="sr-only">{label}</span>
    </a>
  )
}
