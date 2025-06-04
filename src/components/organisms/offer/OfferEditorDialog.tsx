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
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toVietnamTime, formatVietnamFullDate } from "@/components/utils/date";

export function OfferEditorDialog({
  open,
  onOpenChange,
  initialData,
  onSave,
  postFinishDate,
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
  postFinishDate: string;
}) {
  const [note, setNote] = useState("");
  const [price, setPrice] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [priceError, setPriceError] = useState("");
  const [dateError, setDateError] = useState("");
  const [openCalendar, setOpenCalendar] = useState(false);

  useEffect(() => {
    if (initialData) {
      setNote(initialData.note || "");
      setPrice((initialData.initPrice + 1000).toString());
      setDeadline(toVietnamTime(initialData.deadlineEndAt));
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

    const today = toVietnamTime(new Date());
    today.setHours(0, 0, 0, 0);

    const finishDate = toVietnamTime(new Date(postFinishDate));
    finishDate.setHours(0, 0, 0, 0);

    // Bỏ qua giờ khi so sánh
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      setDateError("Không thể chọn ngày trong quá khứ");
      return false;
    }

    if (selectedDate > finishDate) {
      setDateError(
        `Không thể chọn ngày sau ngày hoàn thành dự kiến (${formatVietnamFullDate(
          finishDate
        )})`
      );
      return false;
    }

    setDateError("");
    return true;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const vietnamDate = toVietnamTime(date);
      setDeadline(vietnamDate);
      validateDate(vietnamDate);
      setOpenCalendar(false);
    } else {
      setDeadline(undefined);
      validateDate(undefined);
    }
  };

  const handleSubmit = () => {
    if (!initialData) return;
    if (!validatePrice(price)) return;
    if (!validateDate(deadline)) return;

    const utcDeadline = new Date(deadline!.getTime() - 7 * 60 * 60 * 1000);

    onSave({
      offerID: initialData.offerID,
      note,
      initPrice: Number(price),
      deadlineEndAt: utcDeadline.toISOString(),
    });
    onOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg p-6 rounded-2xl shadow-lg"
        onKeyDown={handleKeyDown}
      >
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
              Giá đề xuất (đ) - Tối thiểu{" "}
              {initialData &&
                (initialData.initPrice + 1000).toLocaleString("vi-VN")}{" "}
              đ
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
            <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
              <PopoverTrigger asChild>
                <button
                  className={cn(
                    "flex w-full justify-between items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    !deadline && "text-muted-foreground",
                    dateError && "border-red-500 focus-visible:ring-red-500"
                  )}
                >
                  {deadline ? (
                    formatVietnamFullDate(deadline)
                  ) : (
                    <span className="text-muted-foreground">
                      Chọn ngày hoàn thành
                    </span>
                  )}
                  <CalendarIcon className="mr-2 h-4 w-4 shrink-0 opacity-70" />
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
                  disabled={(date) => {
                    const today = toVietnamTime(new Date());
                    today.setHours(0, 0, 0, 0);

                    const finishDate = toVietnamTime(new Date(postFinishDate));
                    finishDate.setHours(0, 0, 0, 0);

                    return date < today || date > finishDate;
                  }}
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
              onKeyDown={handleKeyDown}
              placeholder="Ghi chú thêm về đề xuất..."
              className="min-h-[100px] w-full resize-none break-words whitespace-pre-wrap"
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
