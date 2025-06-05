"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Wallet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import WalletService from "@/services/WalletService";

import History from "@/components/molecules/customer/wallet/history";
import { UpdateBankCardButton } from "@/components/atoms/customer/wallet/edit-wallet/update-bank-card-button.tsx";
import { PdcWalletCard } from "@/components/organisms/customer/wallet/pdc-wallet-card";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WithdrawMoney from "../withdraw-money";

// Define the form schema with validation
const formSchema = z.object({
  amount: z
    .string()
    .min(1, { message: "Số tiền không được để trống" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Số tiền phải là số",
    })
    .refine((val) => Number(val) >= 10000, {
      message: "Số tiền phải lớn hơn hoặc bằng 10,000",
    })
    .refine((val) => Number(val) <= 100000000, {
      message: "Số tiền không được vượt quá 100,000,000",
    }),
});

type FormValues = z.infer<typeof formSchema>;

// Payment method types
type PaymentMethod = "vnpay" | "payos" | null;

export default function DepositMoney() {
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentMethod>("vnpay");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createVnpayLink, createPayosLink, getWallet } = WalletService();
  const { toast } = useToast();
  const [walletInfo, setWalletInfo] = useState<Wallet>();

  // Payment methods
  const paymentMethods = [
    {
      id: "vnpay",
      name: "VNPAY",
      icon: CreditCard,
      description: "Thanh toán qua VNPAY",
    },
    {
      id: "payos",
      name: "payOs",
      icon: Wallet,
      description: "Thanh toán qua payOs",
    },
  ];

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  });

  useEffect(() => {
    getWalletFromCustomer();
  }, []);

  const getWalletFromCustomer = async () => {
    const response = await getWallet();
    console.log("getWalletFromCustomer: ", response);
    if (response && response.responseRequestModel) {
      setWalletInfo(response.responseRequestModel);
    }
  };
  // Handle payment method selection and form submission
  const onSubmit = async (data: FormValues) => {
    if (!selectedPayment) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn phương thức thanh toán",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      if (selectedPayment === "vnpay") {
        const response = await createVnpayLink(data.amount);
        console.log(response);
        if (response) {
          window.location.href = response?.responseRequestModel?.vnPayUrl;
        }
        // Reset form and selection after successful submission
        form.reset();
        setSelectedPayment(null);
      } else if (selectedPayment === "payos") {
        const response = await createPayosLink(data.amount);
        console.log(response);
        if (response) {
          window.location.href = response?.responseRequestModel?.payOSUrl;
        }
        // Reset form and selection after successful submission
        form.reset();
        setSelectedPayment(null);
      }
    } catch (error) {
      toast({
        title: "Lỗi thanh toán",
        description: "Đã xảy ra lỗi khi xử lý thanh toán. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format the amount as the user types
  const formatAmount = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");

    // Format with thousand separators
    if (numericValue) {
      return Number(numericValue).toLocaleString("vi-VN");
    }
    return "";
  };

  return (
    <div className="mx-20">
      <div className="container mx-auto p-4 md:p-6 ">
        <div className="grid grid-cols-2 gap-6 ">
          <div className="">
            <h2 className="text-2xl font-bold">Ví của tôi</h2>
            {walletInfo && (
              <div className="w-full grid grid-cols-12 gap-4 mt-5">
                <div className="col-span-8 w-full">
                  <PdcWalletCard
                    balance={walletInfo?.balance}
                    cardNumber={walletInfo?.bankAccountNumber + ""}
                    holdAmount={walletInfo.locked}
                    cardholderName={walletInfo.accountHolderName}
                  />
                </div>
                <div className="border-solid border-l-2 col-span-1"></div>
                <div className="col-span-3 ">
                  <div className="">Ngân hàng</div>
                  <div className="font-semibold">
                    {walletInfo?.bankName === null
                      ? "Chưa có"
                      : walletInfo?.bankName}
                  </div>
                  <div className="mt-5">Số tài khoản</div>
                  <div className="font-semibold">
                    {walletInfo?.bankAccountNumber === null
                      ? "Chưa có"
                      : walletInfo?.bankAccountNumber}
                  </div>
                  <div className="mt-5">Chủ tài khoản</div>
                  <div className="font-semibold">
                    {walletInfo?.accountHolderName === null
                      ? "Chưa có"
                      : walletInfo?.accountHolderName}
                  </div>
                  <div>
                    <UpdateBankCardButton walletID={walletInfo.walletID} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            <Tabs defaultValue="deposit" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="deposit">Nạp tiền</TabsTrigger>
                <TabsTrigger value="withdraw">Rút tiền</TabsTrigger>
              </TabsList>

              <TabsContent value="deposit">
                <div className="grid gap-2">
                  <h2 className="text-2xl font-bold">Nạp tiền</h2>
                  <p className="text-muted-foreground">
                    Nhập số tiền và chọn phương thức thanh toán để hoàn tất giao
                    dịch.
                  </p>
                </div>

                <div className="flex gap-3 mt-4">
                  {paymentMethods.map((method) => (
                    <Card
                      key={method.id}
                      className={`cursor-pointer h-[60px] transition-colors flex-1 max-w-[200px] ${
                        selectedPayment === method.id
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted"
                      }`}
                      onClick={() =>
                        !isSubmitting &&
                        setSelectedPayment(method.id as PaymentMethod)
                      }
                    >
                      <CardContent className="flex items-center gap-3 h-full p-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            selectedPayment === method.id
                              ? "bg-primary"
                              : "bg-muted"
                          } text-primary-foreground`}
                        >
                          <method.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{method.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="pt-5">
                    <div className="flex flex-col md:flex-row items-end gap-4">
                      <div className="w-full max-w-[350px]">
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
                                    const rawValue = e.target.value.replace(
                                      /[,.]/g,
                                      ""
                                    );
                                    field.onChange(rawValue);
                                    e.target.value = formatAmount(rawValue);
                                  }}
                                  disabled={isSubmitting}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-1 md:mt-0 h-10"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang xử lý...
                          </>
                        ) : (
                          "Thanh toán ngay"
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="withdraw">
                <WithdrawMoney /> {/* Gọi component Rút tiền */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <History />
      </div>
    </div>
  );
}
