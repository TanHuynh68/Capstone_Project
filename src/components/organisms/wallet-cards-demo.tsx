import { PdcWalletCard } from "./wallet/pdc-wallet-card"
import { PremiumWalletCard } from "./wallet/premium-wallet-card"


export const WalletCardsDemo = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 items-center justify-center">
      <PdcWalletCard balance={100} holdAmount={50} cardNumber="9fce655231bc" cardholderName="Nguyen Van A" />

      <PremiumWalletCard balance={1000} holdAmount={50} cardNumber="9fce655231bc" cardholderName="Nguyen Van A" />
    </div>
  )
}
