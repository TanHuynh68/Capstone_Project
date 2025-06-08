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
import { useForm } from "react-hook-form";
import {
  type OfferPhaseFormValues,
  offerPhaseSchema,
} from "@/schemas/offerPhaseShecmas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import OfferService from "@/services/OfferService";
import { toast } from "sonner";
import { MESSAGE } from "@/constants";
import { useState } from "react";
import { DialogHeader } from "@/components/ui/dialog";

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
  fetchOfferPhase: any;
}

const UpdateOfferPhase = ({
  offer,
  fetchOfferPhase,
}: UpdateOfferPhaseProps) => {
  console.log("offer: ", offer);
  const { updateOfferPhase } = OfferService();

  // State for date selection
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(offer.startDate)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(offer.endDate)
  );

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
    console.log("onSubmit: ", {
      ...values,
      offerPhaseID: offer.offerPhaseID,
    });

    const response = await updateOfferPhase({
      ...values,
      offerPhaseID: offer.offerPhaseID,
    });
    console.log("updateOfferPhase: ", response);
    if (response) {
      await fetchOfferPhase(offer.offerID);
      toast.success(MESSAGE.UPDATE_OFFER_PHASE_SUCCESSFULLY);
      form.reset();
    }
  };

  // Handle date selection logic
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    // If no start date selected, set as start date
    if (!startDate) {
      setStartDate(date);
      form.setValue("startDate", date);
      return;
    }

    // If start date exists but no end date
    if (startDate && !endDate) {
      // If selected date is after start date, set as end date
      if (date >= startDate) {
        setEndDate(date);
        form.setValue("endDate", date);
      } else {
        // If selected date is before start date, reset and set as new start date
        setStartDate(date);
        setEndDate(undefined);
        form.setValue("startDate", date);
        form.setValue("endDate", undefined as any);
      }
      return;
    }

    // If both dates are selected, reset and start over with new start date
    if (startDate && endDate) {
      setStartDate(date);
      setEndDate(undefined);
      form.setValue("startDate", date);
      form.setValue("endDate", undefined as any);
    }
  };

  // Check if a date is in the selected range
  const isDateInRange = (date: Date): boolean => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  // Check if a date is the start date
  const isStartDate = (date: Date): boolean => {
    if (!startDate) return false;
    return date.toDateString() === startDate.toDateString();
  };

  // Check if a date is the end date
  const isEndDate = (date: Date): boolean => {
    if (!endDate) return false;
    return date.toDateString() === endDate.toDateString();
  };

  // Custom day modifier for styling
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
        className="space-y-4 w-full"
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
      >
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
                  onKeyDown={(e) => {
                    e.stopPropagation();
                  }}
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
              <FormLabel>Giá</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step={1000}
                  placeholder="Nhập giá"
                  {...field}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                  }}
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
                  placeholder="Nhập mô tả"
                  {...field}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date Selection */}
        <div className="space-y-4">
          <FormLabel>Thời gian thực hiện</FormLabel>

          {/* Selected Dates Display */}
          <div className="flex gap-4">
            <div className="flex-1 border rounded-md bg-gray-50">
              <div className="flex gap-2 justify-center py-2">
                <div className=" text-gray-600">Ngày bắt đầu</div>
                <div className="font-medium">
                  {startDate
                    ? startDate.toLocaleDateString("vi-VN")
                    : "Chưa chọn"}
                </div>
              </div>
            </div>
            <div className="flex-1  border rounded-md bg-gray-50">
              <div className="flex gap-2 justify-center py-2">
                <div className=" text-gray-600">Ngày kết thúc</div>
                <div className="font-medium">
                  {endDate ? endDate.toLocaleDateString("vi-VN") : "Chưa chọn"}
                </div>
              </div>
            </div>
          </div>
          {/* Instructions */}
          <div className="text-center text-sm text-gray-600">
            {!startDate && "Nhấn vào ngày để chọn ngày bắt đầu"}
            {startDate && !endDate && "Nhấn vào ngày để chọn ngày kết thúc"}
            {startDate &&
              endDate &&
              "Nhấn vào ngày để chọn lại ngày bắt đầu mới"}
          </div>

          {/* Calendar */}
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={undefined} // Don't use selected prop to avoid conflicts
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

        <div className="flex justify-end">
          <Button type="submit" disabled={!startDate || !endDate}>
            Cập nhật
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateOfferPhase;
