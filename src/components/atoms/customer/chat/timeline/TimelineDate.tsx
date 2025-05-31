interface TimelineDateProps {
  date: string
  className?: string
}

export default function TimelineDate({ date, className = "" }: TimelineDateProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    } catch (error) {
      return dateString
    }
  }

  return <div className={`text-sm text-gray-400 font-mono ${className}`}>{formatDate(date)}</div>
}
