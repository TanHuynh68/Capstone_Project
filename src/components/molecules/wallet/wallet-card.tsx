import type React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { formatBankAccountNumber } from "@/components/utils"

export interface WalletCardProps {
  balance: number
  holdAmount: number
  cardNumber: string
  cardholderName: string
  className?: string
  children?: React.ReactNode
}

export const WalletCard = ({
  balance,
  holdAmount,
  cardNumber,
  cardholderName,
  className,
  children,
}: WalletCardProps) => {

  return (
    <Card className={cn("relative w-full max-w-md overflow-hidden rounded-xl p-6", className)}>
      <div className="flex flex-col h-full justify-between">
        <div className="space-y-1">
          <p className="text-xl font-medium">Số dư ví: {balance.toLocaleString()} xu</p>
          <p className="text-xl font-medium">Tạm giữ: {holdAmount.toLocaleString()} xu</p>
        </div>

        <div className="mt-auto space-y-2">
          <p className="text-2xl">{cardNumber === null ? 'Chưa có': formatBankAccountNumber(cardNumber)}</p>
          <p className="text-2xl font-semibold">{cardholderName === null ? 'Chưa có': cardholderName}</p>
        </div>
      </div>
      {children}
    </Card>
  )
}
