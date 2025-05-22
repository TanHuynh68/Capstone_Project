// components/posts/atoms/date-formatter.tsx
interface DateFormatterProps {
  date: string;
  includeTime?: boolean;
}

export function DateFormatter({ date, includeTime = false }: DateFormatterProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
    };
    
    return new Intl.DateTimeFormat('vi-VN', options).format(date);
  };

  return <span>{formatDate(date)}</span>;
}