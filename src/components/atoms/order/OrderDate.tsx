import { format, formatDistance } from "date-fns"
import { vi } from "date-fns/locale"

interface OrderDateProps {
  date: string
  format?: "full" | "short" | "relative"
  className?: string
  label?: string
}

export default function OrderDate({ date, format: dateFormat = "short", className = "", label }: OrderDateProps) {
  const formatDate = (dateString: string): string => {
    const dateObj = new Date(dateString)

    switch (dateFormat) {
      case "full":
        return format(dateObj, "dd/MM/yyyy 'lúc' HH:mm", { locale: vi })
      case "short":
        return format(dateObj, "dd/MM/yyyy", { locale: vi })
      case "relative":
        return formatDistance(dateObj, new Date(), {
          addSuffix: true,
          locale: vi,
        })
      default:
        return format(dateObj, "dd/MM/yyyy", { locale: vi })
    }
  }

  return (
    <div className={`${className}`}>
      {label && <span className="text-xs text-gray-500 block">{label}</span>}
      <span className="text-sm text-gray-900">{formatDate(date)}</span>
    </div>
  )
}
