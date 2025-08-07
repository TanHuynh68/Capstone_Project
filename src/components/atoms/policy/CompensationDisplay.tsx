import { cn } from "@/lib/utils";

interface CompensationDisplayProps {
  amount: number;
  className?: string;
}

export default function CompensationDisplay({ amount, className }: CompensationDisplayProps) {
  const getCompensationColor = (amount: number) => {
    if (amount > 0) return "text-blue-600 bg-blue-50";
    if (amount < 0) return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };

  const formatAmount = (amount: number) => {
    if (amount === 0) return "0";
    return `${amount}%`;
  };

  return (
    <div className={cn(
      "inline-flex items-center justify-center px-2 py-1 rounded-md text-sm font-medium",
      getCompensationColor(amount),
      className
    )}>
      {formatAmount(amount)}
    </div>
  );
}
