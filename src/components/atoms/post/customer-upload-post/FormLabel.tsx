import type { ReactNode } from "react"

interface FormLabelProps {
  children: ReactNode
  required?: boolean
  htmlFor?: string
  className?: string
}

export default function FormLabel({ children, required = false, htmlFor, className = "" }: FormLabelProps) {
  return (
    <label htmlFor={htmlFor} className={`text-gray-700 font-medium block mb-1 ${className}`}>
      {children}{" "}
      {required && (
        <span className="text-red-500 font-medium ml-1" aria-hidden="true">
          *
        </span>
      )}
      {required && <span className="text-red-500 text-sm ml-2">bắt buộc</span>}
    </label>
  )
}
