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
      {label && (
        <span className="text-xs text-muted-foreground block">{label}</span>
      )}
      {/* <span className="text-sm text-foreground">{formatDate(date)}</span> */}
      <span className="text-sm text-foreground">{formatDate(date)}</span>
    </div>
  );
}
