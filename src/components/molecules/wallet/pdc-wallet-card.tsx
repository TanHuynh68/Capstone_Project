import GoldChipIcon from "@/components/atoms/GoldChipIcon"
import { WalletCard, WalletCardProps } from "./wallet-card"


export interface PdcWalletCardProps extends Omit<WalletCardProps, "className" | "children"> {}

export const PdcWalletCard = ({ balance, holdAmount, cardNumber, cardholderName }: PdcWalletCardProps) => {
  return (
    <WalletCard
      balance={balance}
      holdAmount={holdAmount}
      cardNumber={cardNumber}
      cardholderName={cardholderName}
      className="bg-violet-500 text-white h-56"
    >
      {/* Gold chip icon */}
      <GoldChipIcon/>
      {/* PDC Wallet vertical text */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <p className="text-xl font-bold [writing-mode:vertical-rl] rotate-180 tracking-widest mt-10">PDC Wallet</p>
      </div>
    </WalletCard>
  )
}
