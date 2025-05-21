import type { ReactNode } from "react"

interface FormFooterProps {
  children: ReactNode
}

export default function FormFooter({ children }: FormFooterProps) {
  return <p className="mt-2 text-center text-xs text-gray-500">{children}</p>
}
