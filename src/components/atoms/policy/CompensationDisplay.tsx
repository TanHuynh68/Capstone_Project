import { cn } from "@/lib/utils";

interface CompensationDisplayProps {
  amount: number;
  className?: string;
}

export default function CompensationDisplay({
  amount,
  className,
}: CompensationDisplayProps) {
  const getCompensationColor = (amount: number) => {
    if (amount >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (amount >= 50) return "text-blue-600 bg-blue-50 border-blue-200";
    if (amount > 0) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  const formatAmount = (amount: number) => {
    if (amount === 0) return "0%";
    return `${amount}%`;
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold border",
        getCompensationColor(amount),
        className
      )}
    >
      {formatAmount(amount)}
    </div>
  );
}
