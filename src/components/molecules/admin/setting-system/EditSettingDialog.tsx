"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  updateSettingSchema,
  type UpdateSettingFormValues,
} from "@/schemas/settingSchema";
import SettingService from "@/services/SettingSerivce";

interface EditSettingDialogProps {
  setting: SystemSetting | null;
  isOpen: boolean;
  onClose: () => void;
  onSettingUpdated: () => void;
}

export default function EditSettingDialog({
  setting,
  isOpen,
  onClose,
  onSettingUpdated,
}: EditSettingDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateSetting } = SettingService();
  const form = useForm<UpdateSettingFormValues>({
    resolver: zodResolver(updateSettingSchema),
    defaultValues: {
      value: 0,
      description: "",
    },
  });

  useEffect(() => {
    if (setting) {
      form.setValue("value", setting.value);
      form.setValue("description", setting.description);
    }
  }, [setting, form]);

  const onSubmit = async (data: UpdateSettingFormValues) => {
    if (!setting) return;
    console.log('setting: ', setting)
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      console.log("Updating setting:", {
        settingId: setting.settingId,
        ...data,
      });

      const response = await updateSetting({
        settingId: setting.settingId,
        ...data,
      });
      if (response) {
        toast.success("Cập nhật setting thành công!");
        onClose();
        onSettingUpdated();
      }
    } catch (error) {
      console.error("Error updating setting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Chỉnh Sửa Setting
          </DialogTitle>
          {setting && (
            <p className="text-sm text-gray-600">
              Key: <span className="font-medium">{setting.key}</span>
            </p>
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Giá trị <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Nhập giá trị"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Mô tả <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Nhập mô tả chi tiết"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
