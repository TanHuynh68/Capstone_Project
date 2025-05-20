import { columns } from "@/components/organisms/deposit-withdrawal-history/columns"
import { DataTable } from "@/components/organisms/transaction-history/data-table"
import WalletService from "@/services/WalletService"
import { useEffect, useState } from "react"

export const metadata = {
    title: "Lịch sử nạp rút",
    description: "Xem lịch sử nạp và rút tiền của ví điện tử",
}

export default function DepositWithdrawalHistory() {
    const [data, setData]= useState<WalletOrder[]>([])
    const { getWalletOrder } = WalletService()

    useEffect(() => {
        getDepositWithDrawalHistory()
    }, [])

    const getDepositWithDrawalHistory = async () => {
        const response = await getWalletOrder()
        if (response) {
            console.log('response2: ', response)
            setData(response.responseRequestModel.responseList.items)
        }
    }


    // Define filter options for transaction type
    const transactionTypeOptions = [
        { label: "Nạp tiền", value: "Nạp tiền" },
        { label: "Rút tiền", value: "Rút tiền" },
    ]

    // Define filter options for payment methods
    const paymentMethodOptions = [
        { label: "VNPay", value: "VNPay" },
        { label: "PayOS", value: "PayOS" },
        { label: "MoMo", value: "MoMo" },
        { label: "ZaloPay", value: "ZaloPay" },
    ]

    // Define filter options for status
    const statusOptions = [
        { label: "Hoàn thành", value: "Completed" },
        { label: "Đang xử lý", value: "Pending" },
        { label: "Đã hủy", value: "Canceled" },
    ]

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Lịch sử nạp rút</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-sm font-medium text-gray-500">Tổng nạp</h2>
                    <p className="text-2xl font-bold text-green-600">
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(
                            data
                                .filter((item) => item.description.includes("Nạp") && item.orderStatusDisplay === "Completed")
                                .reduce((sum, item) => sum + item.amount, 0),
                        )}
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-sm font-medium text-gray-500">Tổng rút</h2>
                    <p className="text-2xl font-bold text-red-600">
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(
                            data
                                .filter((item) => item.description.includes("Rút") && item.orderStatusDisplay === "Completed")
                                .reduce((sum, item) => sum + item.amount, 0),
                        )}
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-sm font-medium text-gray-500">Đang xử lý</h2>
                    <p className="text-2xl font-bold text-amber-600">
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(
                            data.filter((item) => item.orderStatusDisplay === "Pending").reduce((sum, item) => sum + item.amount, 0),
                        )}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <DataTable
                    columns={columns}
                    data={data}
                    searchColumn="description"
                    filterableColumns={[
                        {
                            id: "orderType",
                            title: "Loại giao dịch",
                            options: transactionTypeOptions,
                        },
                        {
                            id: "paymentMethod",
                            title: "Phương thức",
                            options: paymentMethodOptions,
                        },
                        {
                            id: "orderStatusDisplay",
                            title: "Trạng thái",
                            options: statusOptions,
                        },
                    ]}
                />
            </div>
        </div>
    )
}
