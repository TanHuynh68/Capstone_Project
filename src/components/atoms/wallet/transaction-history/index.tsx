


import { columns } from "@/components/organisms/transaction-history/columns"
import { DataTable } from "@/components/organisms/transaction-history/data-table"
import { WALLET_TRANSACTION_TYPE } from "@/constants"
import WalletService from "@/services/WalletService"
import { useEffect, useState } from "react"

export const metadata = {
    title: "Lịch sử giao dịch",
    description: "Xem lịch sử giao dịch của ví điện tử",
}

export default function TransactionHistory() {
    const [transactions, setTransaction] = useState<Transaction[]>([])
    const { getWalletTransaction } = WalletService()

    useEffect(()=>{
        getTransactionHistory()
    }, [])

    const getTransactionHistory = async () => {
        const response = await getWalletTransaction()
        console.log('response: ', response)
        if (response && response?.responseRequestModel?.responseList) {
            setTransaction(response?.responseRequestModel?.responseList?.items)
        }
    }


    // Define filter options for transaction type
    const transactionTypeOptions = [
        { label: "Nạp tiền", value: WALLET_TRANSACTION_TYPE.Deposit.toString() },
        { label: "Rút tiền", value: WALLET_TRANSACTION_TYPE.Withdraw.toString() },
        { label: "Chuyển tiền", value: WALLET_TRANSACTION_TYPE.Transfer.toString() },
        { label: "Nhận tiền", value: WALLET_TRANSACTION_TYPE.Receive.toString() },
        { label: "Đặt cọc", value: WALLET_TRANSACTION_TYPE.PlaceDeposit.toString() },
        { label: "Hoàn cọc", value: WALLET_TRANSACTION_TYPE.RefundDeposit.toString() },
    ]


    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Lịch sử giao dịch</h1>
            <div className="space-y-4">
                <DataTable
                    columns={columns}
                    data={transactions}
                    searchColumn="description"
                    filterableColumns={[
                        {
                            id: "transactionType",
                            title: "Loại giao dịch",
                            options: transactionTypeOptions,
                        },
                    ]}
                />
            </div>
        </div>
    )
}
