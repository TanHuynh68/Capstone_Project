"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { DialogHeader } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import {
  type OfferPhaseFormValues,
  offerPhaseSchema,
} from "@/schemas/offerPhaseShecmas";
import OfferService from "@/services/OfferService";
import { MESSAGE } from "@/constants";
import { formatDayAndTime } from "@/utils";

interface OfferPhase {
  offerPhaseID: string;
  offerID: string;
  offerPhasePrice: number;
  phaseDescription: string;
  phaseName: string;
  startDate: string;
  endDate: string;
}

interface UpdateOfferPhaseProps {
  offer: OfferPhase;
  fetchOfferPhase: (offerID: string) => Promise<void>;
  onSuccess?: () => void; // Callback khi thành công
}

const UpdateOfferPhase = ({
  offer,
  fetchOfferPhase,
  onSuccess,
}: UpdateOfferPhaseProps) => {
  const { updateOfferPhase } = OfferService();
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(offer.startDate)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(offer.endDate)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OfferPhaseFormValues>({
    resolver: zodResolver(offerPhaseSchema),
    defaultValues: {
      offerPhasePrice: offer.offerPhasePrice,
      phaseDescription: offer.phaseDescription,
      phaseName: offer.phaseName,
      startDate: new Date(offer.startDate),
      endDate: new Date(offer.endDate),
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const onSubmit = async (values: OfferPhaseFormValues) => {
    if (!startDate || !endDate) {
      toast.error("Vui lòng chọn ngày bắt đầu và ngày kết thúc");
      return;
    }

    try {
      setIsSubmitting(true);

      const submitData = {
        ...values,
        offerPhaseID: offer.offerPhaseID,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };

      console.log("Updating offer phase: ", submitData);

      const response = await updateOfferPhase(submitData);

      if (response) {
        // Thành công - refresh data và đóng dialog
        await fetchOfferPhase(offer.offerID);
        toast.success(MESSAGE.UPDATE_OFFER_PHASE_SUCCESSFULLY);
        onSuccess?.(); // Gọi callback để đóng dialog
      }
    } catch (error) {
      console.error("Error updating offer phase:", error);
      // toast.error("Có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (!startDate) {
      setStartDate(date);
      form.setValue("startDate", date);
      return;
    }

    if (startDate && !endDate) {
      if (date >= startDate) {
        setEndDate(date);
        form.setValue("endDate", date);
      } else {
        setStartDate(date);
        setEndDate(undefined);
        form.setValue("startDate", date);
        form.setValue("endDate", undefined as any);
      }
      return;
    }

    if (startDate && endDate) {
      setStartDate(date);
      setEndDate(undefined);
      form.setValue("startDate", date);
      form.setValue("endDate", undefined as any);
    }
  };

  const isDateInRange = (date: Date): boolean => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const isStartDate = (date: Date): boolean => {
    if (!startDate) return false;
    return date.toDateString() === startDate.toDateString();
  };

  const isEndDate = (date: Date): boolean => {
    if (!endDate) return false;
    return date.toDateString() === endDate.toDateString();
  };

  const modifiers = {
    selected: (date: Date): boolean => isStartDate(date) || isEndDate(date),
    range: (date: Date): boolean =>
      isDateInRange(date) && !isStartDate(date) && !isEndDate(date),
    start: (date: Date): boolean => isStartDate(date),
    end: (date: Date): boolean => isEndDate(date),
  };

  const modifiersStyles = {
    selected: {
      backgroundColor: "#3b82f6",
      color: "white",
      borderRadius: "6px",
    },
    range: {
      backgroundColor: "#dbeafe",
      color: "#1e40af",
      borderRadius: "0",
    },
    start: {
      backgroundColor: "#3b82f6",
      color: "white",
      borderRadius: "6px 0 0 6px",
    },
    end: {
      backgroundColor: "#3b82f6",
      color: "white",
      borderRadius: "0 6px 6px 0",
    },
  };

  return (
    <Form {...form}>
      <DialogHeader className="items-center font-bold text-xl mt-5">
        Cập nhật giai đoạn
      </DialogHeader>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" w-full grid grid-cols-2 gap-4"
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="phaseName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên giai đoạn</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tên giai đoạn"
                    {...field}
                    onKeyDown={(e) => e.stopPropagation()}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="offerPhasePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá (VNĐ)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step={1000}
                    min={1000}
                    placeholder="Nhập giá"
                    {...field}
                    onKeyDown={(e) => e.stopPropagation()}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phaseDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mô tả</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Nhập mô tả chi tiết cho giai đoạn này"
                    rows={3}
                    {...field}
                    onKeyDown={(e) => e.stopPropagation()}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Date Selection */}
        <div className="space-y-4">
          <FormLabel>Thời gian thực hiện</FormLabel>

          {/* Selected Dates Display */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg bg-gray-50 p-3">
              <div className="text-sm text-gray-600 mb-1">Ngày bắt đầu</div>
              <div className="font-medium">
                {startDate ? formatDayAndTime(startDate) : "Chưa chọn"}
              </div>
            </div>
            <div className="border rounded-lg bg-gray-50 p-3">
              <div className="text-sm text-gray-600 mb-1">Ngày kết thúc</div>
              <div className="font-medium">
                {endDate ? formatDayAndTime(endDate) : "Chưa chọn"}
              </div>
            </div>
          </div>


          {/* Calendar */}
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={undefined}
              onSelect={handleDateSelect}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-md border shadow-sm"
              numberOfMonths={1}
            />
          </div>

          {/* Hidden form fields for validation */}
          <FormField
            control={form.control}
            name="startDate"
            render={() => (
              <FormItem className="hidden">
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={() => (
              <FormItem className="hidden">
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="submit"
            disabled={!startDate || !endDate || isSubmitting}
            className="min-w-[100px]"
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateOfferPhase;
