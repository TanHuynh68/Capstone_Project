import { formatDate } from "@/components/utils";
interface OrderDateProps {
  date: string;
  format?: "full" | "short" | "relative";
  className?: string;
  label?: string;
}

export default function OrderDate({
  date,
  className = "",
  label,
}: OrderDateProps) {
  return (
    <div className={`${className}`}>
      {label && <span className="text-xs text-gray-500 block">{label}</span>}
      {/* <span className="text-sm text-gray-900">{formatDate(date)}</span> */}
      <span className="text-sm text-gray-900">{formatDate(date)}</span>
    </div>
  );
}
