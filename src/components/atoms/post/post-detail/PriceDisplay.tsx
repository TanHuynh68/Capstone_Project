import { formatCurrencyVND } from "@/utils";

interface PriceDisplayProps {
  value: number;
  label: string;
  currency?: string;
  className?: string;
}

export default function PriceDisplay({
  value,
  label,
  className = "",
}: PriceDisplayProps) {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold text-primary">
        {formatCurrencyVND(value)}
      </p>
    </div>
  );
}
