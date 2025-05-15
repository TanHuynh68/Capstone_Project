interface Wallet {
  walletID: string;
  balance: number;
  locked: number;
  bankAccountNumber: string;
  bankName: string;
  accountHolderName: string;
}
interface Transaction {
  id: string
  amount: number
  afterBalance: number
  transactionType: WALLET_TRANSACTION_TYPE
  transactionDate: string
  description?: string
  status: "completed" | "pending" | "failed"
  reference?: string
}


 interface WalletOrder {
  walletOrderID: string
  walletID: string
  amount: number
  orderStatusDisplay: "Completed" | "Pending" | "Canceled" | string
  description: string
  orderDate: string
  paymentMethod?: string
}


 interface Bank {
  id: string
  name: string,
  code: string,
  bin: string,
  shortName: string,
  logo: string,
  transferSupported: string,
  lookupSupported: string,
}

interface BankCard {
  bankAccountNumber: string
  bankName: string
  accountHolderName: string
}
