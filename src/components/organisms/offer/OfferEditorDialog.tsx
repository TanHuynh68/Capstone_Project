import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

export function OfferEditorDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  initialData: Offer | null;
  onSave: (values: {
    offerID: string;
    note: string;
    initPrice: number;
    deadlineEndAt: string;
  }) => void;
}) {
  const [note, setNote] = useState("");
  const [price, setPrice] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [priceError, setPriceError] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    if (initialData) {
      setNote(initialData.note || "");
      setPrice((initialData.initPrice + 1000).toString());
      setDeadline(new Date(initialData.deadlineEndAt));
      setPriceError("");
      setDateError("");
    }
  }, [initialData]);

  const validatePrice = (value: string) => {
    const newPrice = Number(value);
    if (isNaN(newPrice) || newPrice <= 0) {
      setPriceError("Vui lòng nhập giá hợp lệ");
      return false;
    }
    if (initialData && newPrice <= initialData.initPrice + 1000) {
      setPriceError(
        `Giá đề xuất mới phải lớn hơn giá hiện tại (${(
          initialData.initPrice + 1000
        ).toLocaleString("vi-VN")} VNĐ)`
      );
      return false;
    }
    setPriceError("");
    return true;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPrice(value);
    validatePrice(value);
  };

  const validateDate = (date: Date | undefined) => {
    if (!date) {
      setDateError("Vui lòng chọn ngày hoàn thành");
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      setDateError("Không thể chọn ngày trong quá khứ");
      return false;
    }

    setDateError("");
    return true;
  };

  const handleDateSelect = (date: Date | undefined) => {
    setDeadline(date);
    validateDate(date);
  };

  const handleSubmit = () => {
    if (!initialData) return;
    if (!validatePrice(price)) return;
    if (!validateDate(deadline)) return;

    onSave({
      offerID: initialData.offerID,
      note,
      initPrice: Number(price),
      deadlineEndAt: deadline!.toISOString(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-6 rounded-2xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Chỉnh sửa đề xuất
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Cập nhật giá, ghi chú và thời hạn hoàn thành cho đề xuất của bạn.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Giá đề xuất */}
          <div className="space-y-1">
            <Label htmlFor="price">
              Giá đề xuất (VNĐ) - Tối thiểu{" "}
              {initialData &&
                (initialData.initPrice + 1000).toLocaleString("vi-VN")}{" "}
              VNĐ
            </Label>
            <Input
              id="price"
              type="number"
              value={price}
              step={1000}
              onChange={handlePriceChange}
              placeholder="Nhập giá đề xuất"
              min={
                initialData?.initPrice
                  ? initialData.initPrice + 1000
                  : undefined
              }
              className={priceError ? "border-red-500" : ""}
            />
            {priceError && (
              <p className="text-sm text-red-500 mt-1">{priceError}</p>
            )}
          </div>

          {/* Ngày hoàn thành */}
          <div className="space-y-1">
            <Label htmlFor="deadline">Hạn hoàn thành</Label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "flex w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    !deadline && "text-muted-foreground",
                    dateError && "border-red-500 focus-visible:ring-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-70" />
                  {deadline ? (
                    format(deadline, "PPP", { locale: vi })
                  ) : (
                    <span className="text-muted-foreground">
                      Chọn ngày hoàn thành
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 rounded-lg shadow-md border border-border"
                align="start"
                sideOffset={4}
              >
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={handleDateSelect}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  initialFocus
                  locale={vi}
                  className="rounded-md border-0"
                />
              </PopoverContent>
            </Popover>
            {dateError && (
              <p className="text-sm text-red-500 mt-1">{dateError}</p>
            )}
          </div>

          {/* Ghi chú */}
          <div className="space-y-1">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi chú thêm về đề xuất..."
              className="min-h-[100px]"
            />
          </div>

          {/* Hành động */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmit} className="bg-primary text-white">
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
