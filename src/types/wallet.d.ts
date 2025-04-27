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


