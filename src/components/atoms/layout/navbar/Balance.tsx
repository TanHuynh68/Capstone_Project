import { Button } from "@/components/ui/button";
import { formatCurrencyVND } from "@/components/utils";
import { Wallet } from "lucide-react"; // icon ví tiền

interface BalanceProps {
  balance: number;
}

const Balance = ({ balance }: BalanceProps) => {
  return (
    <Button
      variant="ghost"
      size="default"
      className="flex items-center gap-2 py-2 hover:bg-muted/30 transition"
    >
      <Wallet className="w-5 h-5 text-primary" />
      <span className="text-sm font-semibold text-muted-foreground">
        Số dư:
      </span>
      <span className="text-base font-bold text-primary">
        {formatCurrencyVND(balance)}
      </span>
    </Button>
  );
};

export default Balance;
