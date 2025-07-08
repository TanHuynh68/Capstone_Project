"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { toast } from "sonner"
import { type OfferPhaseFormValues, offerPhaseSchema } from "@/schemas/offerPhaseShecmas"
import OfferService from "@/services/OfferService"
import { MESSAGE } from "@/constants"
import { formatDateToSubmit } from "@/utils"

interface ChatCreateOfferPhaseProps {
  offerID: string
  fetchOfferPhase: (offerID: string) => Promise<void>
  fetchOffers: () => Promise<void>
  deadline: string
  onSuccess?: () => void // Callback khi thành công
}

const ChatCreateOfferPhase = ({
  offerID,
  fetchOfferPhase,
  fetchOffers,
  deadline,
  onSuccess,
}: ChatCreateOfferPhaseProps) => {
  const { createOfferPhase } = OfferService()
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<OfferPhaseFormValues>({
    resolver: zodResolver(offerPhaseSchema),
    defaultValues: {
      offerPhasePrice: 1000,
      phaseDescription: "",
      phaseName: "",
      startDate: undefined,
      endDate: undefined,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  })

  const onSubmit = async (values: OfferPhaseFormValues) => {
    if (!startDate || !endDate) {
      toast.error("Vui lòng chọn ngày bắt đầu và ngày kết thúc")
      return
    }

    try {
      setIsSubmitting(true)

      const submitData = {
        ...values,
        offerID: offerID,
        startDate: formatDateToSubmit(startDate.toString()),
        endDate: formatDateToSubmit(endDate.toString()),
      }

      console.log("Creating offer phase: ", submitData)

      const response = await createOfferPhase(submitData)

      if (response) {
        // Thành công - reset form và đóng dialog
        form.reset()
        setStartDate(undefined)
        setEndDate(undefined)

        // Refresh data
        await Promise.all([fetchOfferPhase(offerID), fetchOffers()])

        toast.success(MESSAGE.CREATE_OFFER_PHASE_SUCCESSFULLY)
        onSuccess?.() // Gọi callback để đóng dialog
      } else {
        toast.error("Tạo giai đoạn thất bại. Vui lòng thử lại.")
      }
    } catch (error) {
      console.error("Error creating offer phase:", error)
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return

    if (!startDate) {
      setStartDate(date)
      form.setValue("startDate", date)
      return
    }

    if (startDate && !endDate) {
      if (date >= startDate) {
        setEndDate(date)
        form.setValue("endDate", date)
      } else {
        setStartDate(date)
        setEndDate(undefined)
        form.setValue("startDate", date)
        form.setValue("endDate", undefined as any)
      }
      return
    }

    if (startDate && endDate) {
      setStartDate(date)
      setEndDate(undefined)
      form.setValue("startDate", date)
      form.setValue("endDate", undefined as any)
    }
  }

  const isDateInRange = (date: Date): boolean => {
    if (!startDate || !endDate) return false
    return date >= startDate && date <= endDate
  }

  const isStartDate = (date: Date): boolean => {
    if (!startDate) return false
    return date.toDateString() === startDate.toDateString()
  }

  const isEndDate = (date: Date): boolean => {
    if (!endDate) return false
    return date.toDateString() === endDate.toDateString()
  }

  const modifiers = {
    selected: (date: Date): boolean => isStartDate(date) || isEndDate(date),
    range: (date: Date): boolean => isDateInRange(date) && !isStartDate(date) && !isEndDate(date),
    start: (date: Date): boolean => isStartDate(date),
    end: (date: Date): boolean => isEndDate(date),
  }

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
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full" onKeyDown={(e) => e.stopPropagation()}>
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

        {/* Date Selection */}
        <div className="space-y-4">
          <FormLabel>Thời gian thực hiện</FormLabel>

          {/* Selected Dates Display */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg bg-gray-50 p-3">
              <div className="text-sm text-gray-600 mb-1">Ngày bắt đầu</div>
              <div className="font-medium">{startDate ? startDate.toLocaleDateString("vi-VN") : "Chưa chọn"}</div>
            </div>
            <div className="border rounded-lg bg-gray-50 p-3">
              <div className="text-sm text-gray-600 mb-1">Ngày kết thúc</div>
              <div className="font-medium">{endDate ? endDate.toLocaleDateString("vi-VN") : "Chưa chọn"}</div>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-center text-sm text-gray-600 bg-blue-50 p-2 rounded">
            {!startDate && "📅 Nhấn vào ngày để chọn ngày bắt đầu"}
            {startDate && !endDate && "📅 Nhấn vào ngày để chọn ngày kết thúc"}
            {startDate && endDate && "📅 Nhấn vào ngày để chọn lại ngày bắt đầu mới"}
          </div>

          {/* Calendar */}
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={undefined}
              onSelect={handleDateSelect}
              disabled={(date) => {
                const today = new Date()
                const deadlineDate = new Date(deadline)
                deadlineDate.setHours(23, 59, 59, 999)
                return date < today || date > deadlineDate
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
          <Button type="submit" disabled={!startDate || !endDate || isSubmitting} className="min-w-[100px]">
            {isSubmitting ? "Đang tạo..." : "Tạo giai đoạn"}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export function formatDateToISOString(date: any) {
  if (!date) return null
  const utcDate = new Date(date)
  utcDate.setHours(0, 0, 0, 0)
  return utcDate.toISOString()
}

export default ChatCreateOfferPhase
