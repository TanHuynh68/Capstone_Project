interface DateDisplayProps {
  date: string
  format?: "short" | "medium" | "long"
  className?: string
}

export default function DateDisplay({ date, format = "medium", className = "" }: DateDisplayProps) {
  const formatDate = (dateString: string, formatType: "short" | "medium" | "long") => {
    const date = new Date(dateString)

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    }

    if (formatType === "medium" || formatType === "long") {
      options.hour = "2-digit"
      options.minute = "2-digit"
    }

    if (formatType === "long") {
      options.second = "2-digit"
      options.weekday = "long"
    }

    return new Intl.DateTimeFormat("vi-VN", options).format(date)
  }

  return <div className={className}>{formatDate(date, format)}</div>
}
