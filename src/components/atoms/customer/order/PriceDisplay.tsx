interface PriceDisplayProps {
  amount: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function PriceDisplay({
  amount,
  className = "",
  size = "md",
}: PriceDisplayProps) {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg font-semibold",
  };

  return (
    <span className={`${sizeClasses[size]} text-foreground ${className}`}>
      {formatPrice(amount)}
    </span>
  );
}
