"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CreditCard, Wallet, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import WalletService from "@/services/WalletService"
import { PdcWalletCard } from "@/components/molecules/wallet/pdc-wallet-card"


// Define the form schema with validation
const formSchema = z.object({
    amount: z
        .string()
        .min(1, { message: "Số tiền không được để trống" })
        .refine((val) => !isNaN(Number(val)), {
            message: "Số tiền phải là số",
        })
        .refine((val) => Number(val) > 10000, {
            message: "Số tiền phải lớn hơn 10,000",
        })
        .refine((val) => Number(val) <= 100000000, {
            message: "Số tiền không được vượt quá 100,000,000",
        }),
})

type FormValues = z.infer<typeof formSchema>

// Payment method types
type PaymentMethod = "vnpay" | "payos" | null

export default function DepositMoney() {
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('vnpay')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { createVnpayLink, createPayosLink, getWallet } = WalletService()
    const { toast } = useToast()
    const [walletInfo, setWalletInfo] = useState<Wallet>();
    // Initialize form
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: "",
        },
    })

    useEffect(() => {
        getWalletFromCustomer()
    }, [])

    const getWalletFromCustomer = async () => {
        const response = await getWallet()
        if (response && response.responseRequestModel) {
            setWalletInfo(response.responseRequestModel)
        }
    }
    // Handle payment method selection and form submission
    const onSubmit = async (data: FormValues) => {
        if (!selectedPayment) {
            toast({
                title: "Lỗi",
                description: "Vui lòng chọn phương thức thanh toán",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            // Simulate API call
            if (selectedPayment === 'vnpay') {
                const response = await createVnpayLink(data.amount);
                console.log(response)
                if (response) {
                    window.location.href = response?.responseRequestModel?.vnPayUrl
                }
                // Reset form and selection after successful submission
                form.reset()
                setSelectedPayment(null)
            } else if (selectedPayment === 'payos') {
                const response = await createPayosLink(data.amount);
                console.log(response)
                if (response) {
                    window.location.href = response?.responseRequestModel?.vnPayUrl
                }
                // Reset form and selection after successful submission
                form.reset()
                setSelectedPayment(null)
            }
        } catch (error) {
            toast({
                title: "Lỗi thanh toán",
                description: "Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Format the amount as the user types
    const formatAmount = (value: string) => {
        // Remove non-numeric characters
        const numericValue = value.replace(/[^0-9]/g, "")

        // Format with thousand separators
        if (numericValue) {
            return Number(numericValue).toLocaleString("vi-VN")
        }
        return ""
    }

    return (
        <div className="max-w-md mx-auto p-4 md:p-6">
            <div className="grid gap-6">
                <div>
                    {
                        walletInfo && <PdcWalletCard
                            balance={walletInfo?.balance}
                            cardNumber={walletInfo?.bankAccountNumber+''}
                            holdAmount={walletInfo.locked}
                            cardholderName={walletInfo.accountHolderName}
                        />
                    }
                </div>
                <div className="grid gap-2">
                    <h2 className="text-2xl font-bold">Nạp tiền</h2>
                    <p className="text-muted-foreground">Nhập số tiền và chọn phương thức thanh toán để hoàn tất giao dịch.</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Số tiền (VND)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập số tiền"
                                            {...field}
                                            onChange={(e) => {
                                                // Store the raw numeric value but display formatted
                                                const rawValue = e.target.value.replace(/[,.]/g, "")
                                                field.onChange(rawValue)

                                                // Format the display value
                                                e.target.value = formatAmount(rawValue)
                                            }}
                                            disabled={isSubmitting}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid gap-4">
                            <h3 className="font-medium">Chọn phương thức thanh toán</h3>

                            <Card
                                className={`cursor-pointer transition-colors ${selectedPayment === "vnpay" ? "border-primary bg-primary/5" : "hover:bg-muted"
                                    }`}
                                onClick={() => !isSubmitting && setSelectedPayment("vnpay")}
                            >
                                <CardContent className="flex items-center gap-4 p-4">
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-full ${selectedPayment === "vnpay" ? "bg-primary" : "bg-muted"
                                            } text-primary-foreground`}
                                    >
                                        <CreditCard className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">VNPAY</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Thanh toán an toàn với thẻ Visa, Mastercard hoặc American Express.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card
                                className={`cursor-pointer transition-colors ${selectedPayment === "payos" ? "border-primary bg-primary/5" : "hover:bg-muted"
                                    }`}
                                onClick={() => !isSubmitting && setSelectedPayment("payos")}
                            >
                                <CardContent className="flex items-center gap-4 p-4">
                                    <div
                                        className={`flex h-12 w-12 items-center justify-center rounded-full ${selectedPayment === "payos" ? "bg-primary" : "bg-muted"
                                            } text-primary-foreground`}
                                    >
                                        <Wallet className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">payOs</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Thanh toán trực tiếp từ tài khoản ngân hàng với thẻ ghi nợ.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                "Thanh toán ngay"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
