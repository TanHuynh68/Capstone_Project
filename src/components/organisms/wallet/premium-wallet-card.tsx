import GoldChipIcon from "@/components/atoms/login/GoldChipIcon"
import { WalletCard, WalletCardProps } from "@/components/molecules/wallet/wallet-card"


export interface PremiumWalletCardProps extends Omit<WalletCardProps, "className" | "children"> {}

export const PremiumWalletCard = ({ balance, holdAmount, cardNumber, cardholderName }: PremiumWalletCardProps) => {
  return (
    <WalletCard
      balance={balance}
      holdAmount={holdAmount}
      cardNumber={cardNumber}
      cardholderName={cardholderName}
      className="bg-black text-amber-300 h-56 border border-amber-300"
    >
      <GoldChipIcon/>
      {/* Premium vertical text */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <p className="text-xl font-bold [writing-mode:vertical-rl] rotate-180 tracking-widest mt-7">PREMIUM</p>
      </div>
    </WalletCard>
  )
}
