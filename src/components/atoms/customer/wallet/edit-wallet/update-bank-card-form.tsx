
import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { bankCardSchema } from "@/schemas/bankSchemas"
import { Loader2 } from "lucide-react"

import WalletService from "@/services/WalletService"
import { toast } from "sonner"
import { MESSAGE } from "@/constants"

interface UpdateBankCardFormProps {
    onSuccess?: () => void,
    walletID: string
}

export function UpdateBankCardForm({ onSuccess, walletID }: UpdateBankCardFormProps) {
    const [banks, setBanks] = useState<Bank[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isFetchingBanks, setIsFetchingBanks] = useState(false)
    const { getBanks, updateWallet } = WalletService()

    const form = useForm({
        resolver: zodResolver(bankCardSchema),
        defaultValues: {
            bankAccountNumber: "",
            bankName: "",
            accountHolderName: "",
        },
    })

    useEffect(() => {
        const fetchBanks = async () => {
            setIsFetchingBanks(true)
            const response = await getBanks()
            console.log('fetchBanks: ', response)
            setBanks(response.data.data)
            setIsFetchingBanks(false)
        }
        fetchBanks()
    }, [])

    async function onSubmit(values: any) {
        setIsLoading(true)
        console.log(values, walletID)
        const response = await updateWallet(walletID, values.bankAccountNumber, values.bankName, values.accountHolderName)
        if (response) {
            if(onSuccess){
                onSuccess()
            }
            window.location.reload()
            toast.success(MESSAGE.UPDATE_WALLET_SUCCESSFULLY)
        }
        setIsLoading(false)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="bankAccountNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Số tài khoản</FormLabel>
                            <FormControl>
                                <Input placeholder="Nhập số tài khoản ngân hàng" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ngân hàng</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        {isFetchingBanks ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Đang tải danh sách ngân hàng...</span>
                                            </div>
                                        ) : (
                                            <SelectValue placeholder="Chọn ngân hàng" />
                                        )}
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {banks.map((bank) => (
                                        <SelectItem key={bank.id} value={bank.shortName}>
                                            {bank.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="accountHolderName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tên chủ tài khoản</FormLabel>
                            <FormControl>
                                <Input placeholder="Nhập tên chủ tài khoản" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading || isFetchingBanks}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang cập nhật...
                        </>
                    ) : (
                        "Cập nhật"
                    )}
                </Button>
            </form>
        </Form>
    )
}
