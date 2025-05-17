import { useState, useEffect } from "react";
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

const LOCK_DURATION = 60; // giây

export default function WithdrawMoney() {
  const { withdrawMoney } = WalletService();
  const [failCount, setFailCount] = useState(0);
  const [lockEndTime, setLockEndTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { amount: "" },
  });

  const isSubmitting = form.formState.isSubmitting;
  const isDisabled = failCount >= 3;

  // Đọc từ localStorage khi load trang
  useEffect(() => {
    const storedFail = Number(localStorage.getItem("withdraw_fail_count") || 0);
    const storedLock = Number(localStorage.getItem("withdraw_lock_until") || 0);

    setFailCount(storedFail);

    if (storedLock > Date.now()) {
      setLockEndTime(storedLock);
      updateRemainingTime(storedLock);
    }
  }, []);

  // Đếm ngược mỗi giây khi đang khóa
  useEffect(() => {
    if (!lockEndTime) return;

    const interval = setInterval(() => {
      updateRemainingTime(lockEndTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [lockEndTime]);

  const updateRemainingTime = (lockEnd: number) => {
    const diff = Math.max(0, Math.ceil((lockEnd - Date.now()) / 1000));
    setRemainingTime(diff);

    if (diff <= 0) {
      // Hết khóa
      setFailCount(0);
      setLockEndTime(null);
      localStorage.removeItem("withdraw_fail_count");
      localStorage.removeItem("withdraw_lock_until");
      toast.success("Bạn đã có thể rút tiền lại!");
    }
  };

  const increaseFail = (apiMessage?: string) => {
    const newFail = failCount + 1;
    setFailCount(newFail);
    localStorage.setItem("withdraw_fail_count", newFail.toString());

    if (apiMessage) {
      toast.error(apiMessage); // ✅ Chỉ toast lỗi từ API 1 lần ở đây
    }

    if (newFail >= 3) {
      const lockUntil = Date.now() + LOCK_DURATION * 1000;
      setLockEndTime(lockUntil);
      localStorage.setItem("withdraw_lock_until", lockUntil.toString());
      //   toast.error("Bạn đã nhập sai quá 3 lần, chức năng rút tiền bị khóa 60s!");
    } else {
      //   toast.warning(`Sai ${newFail}/3 lần. Cẩn thận bị khóa nhé!`);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const res = await withdrawMoney({ amount: data.amount });

    if (res?.isSuccess) {
      toast.success(res.message || "Rút tiền thành công");
      form.reset();
      setFailCount(0);
      localStorage.removeItem("withdraw_fail_count");
    } else {
      increaseFail(res?.message);
    }
  };

  const onInvalid = () => {
    increaseFail();
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
        {isDisabled && lockEndTime && (
          <p className="text-red-500">
            Chức năng rút tiền bị khóa {remainingTime}s
          </p>
        )}
        {!isDisabled && failCount > 0 && (
          <p className="text-yellow-500">
            Sai {failCount}/3 lần. Sai 3 lần sẽ bị khóa 60s.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {quickAmounts.map((amount) => (
          <Button
            key={amount}
            variant="outline"
            type="button"
            onClick={() => form.setValue("amount", amount.toString())}
            className="px-4 py-2"
            disabled={isDisabled}
          >
            {amount.toLocaleString("vi-VN")}
          </Button>
        ))}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="space-y-6 pt-5"
        >
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
                    disabled={isDisabled || isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center items-center h-[100px]">
            <Button type="submit" disabled={isDisabled || isSubmitting}>
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
