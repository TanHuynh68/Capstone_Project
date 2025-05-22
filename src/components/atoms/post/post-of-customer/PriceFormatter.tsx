// components/posts/atoms/price-formatter.tsx
interface PriceFormatterProps {
  value: number;
}

export function PriceFormatter({ value }: PriceFormatterProps) {
  const formattedPrice = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);

  return <span>{formattedPrice}</span>;
}