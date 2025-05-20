import { Button } from "@/components/ui/button"

import type { ReactNode } from "react"
import { ButtonProps } from "../login/Button"

interface ChatButtonProps extends ButtonProps {
  children: ReactNode
}

export default function ChatButton({ children, ...props }: ChatButtonProps) {
  return (
    <Button variant="ghost" size="icon" className="rounded-full" {...props}>
      {children}
    </Button>
  )
}
