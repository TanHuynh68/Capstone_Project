import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DepositWithdrawalHistory from "@/components/atoms/wallet/deposit-withdrawal-history"
import TransactionHistory from "@/components/atoms/wallet/transaction-history"


const History = () => {
    return (
        <div>
            <div className="mt-10">
                <Tabs defaultValue="DepositWithdrawalHistory" >
                    <TabsList className="grid  grid-cols-2">
                        <TabsTrigger value="DepositWithdrawalHistory">Lịch sử nạp rút</TabsTrigger>
                        <TabsTrigger value="TransactionHistory">Lịch sử giao dịch</TabsTrigger>
                    </TabsList>
                    <TabsContent value="DepositWithdrawalHistory">
                        <DepositWithdrawalHistory />
                    </TabsContent>
                    <TabsContent value="TransactionHistory">
                        <TransactionHistory />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default History