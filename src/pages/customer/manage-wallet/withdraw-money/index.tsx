import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import WalletService from "@/services/WalletService";
import { toast } from "sonner";

const formSchema = z.object({
  amount: z
    .string()
    .min(1, { message: "Số tiền không được để trống" })
    .refine((val) => !isNaN(Number(val)), { message: "Số tiền phải là số" })
    .refine((val) => Number(val) >= 200000, {
      message: "Số tiền tối thiểu 200,000",
    })
    .refine((val) => Number(val) <= 100000000, {
      message: "Số tiền tối đa 100,000,000",
    })
    .refine((val) => Number(val) % 1000 === 0, {
      message: "Số tiền phải chia hết cho 1,000",
    }),
});

export default function WithdrawMoney() {
  const { withdrawMoney } = WalletService();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { amount: "" },
  });

  const isSubmitting = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const res = await withdrawMoney({ amount: data.amount });

    if (res?.isSuccess) {
      toast.success(res.message || "Rút tiền thành công");
      form.reset();
    } else {
      // toast.error(res?.message || "Rút tiền thất bại");
    }
  };

  const formatAmount = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    return numericValue ? Number(numericValue).toLocaleString("vi-VN") : "";
  };

  const quickAmounts = [200000, 500000, 1000000, 1500000, 2000000];

  return (
    <div>
      <div className="grid gap-2">
        <h2 className="text-2xl font-bold">Rút tiền</h2>
        <p className="text-muted-foreground">
          Nhập số tiền cần rút và xác nhận giao dịch.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {quickAmounts.map((amount) => (
          <Button
            key={amount}
            variant="outline"
            type="button"
            onClick={() => form.setValue("amount", amount.toString())}
            className="px-4 py-2"
          >
            {amount.toLocaleString("vi-VN")}
          </Button>
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
                          const rawValue = e.target.value.replace(/[,.]/g, "");
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
                "Rút tiền ngay"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
