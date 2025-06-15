"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import FormLabel from "@/components/atoms/post/customer-upload-post/FormLabel";
import FormError from "@/components/atoms/post/customer-upload-post/FormError";
import FileUpload from "@/components/molecules/post/customer-upload-post/FileUpload";
import MultipleFileUpload from "@/components/molecules/post/customer-upload-post/MultipleFileUpload";
import { toast } from "sonner";
import PostService from "@/services/PostService";
import { MESSAGE } from "@/constants";
import {
  type UploadPostFormValues,
  uploadPostSchema,
} from "@/schemas/postSchema";
import { CalendarIcon } from "lucide-react";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { formatDate, formatDateToSubmit } from "@/components/utils";

export default function PostForm() {
  const [OriginalAttachmentFiles, setOriginalAttachmentFiles] =
    useState<File | null>(null);
  const [RequestedAttachmentFiles, setRequestedAttachmentFiles] = useState<
    File[]
  >([]);
  const [submitting, setSubmitting] = useState(false);
  const { createPost } = PostService();
  const [formErrors, setFormErrors] = useState({
    OriginalAttachmentFiles: "",
    RequestedAttachmentFiles: "",
  });

  const form = useForm({
    resolver: zodResolver(uploadPostSchema),
    defaultValues: {
      Title: "",
      Description: "",
      ItemValue: 1000,
      SuggestedPrice: 1000,
      FinishDate: undefined,
    },
    mode: "onBlur", // Validate khi người dùng rời khỏi trường input
    reValidateMode: "onChange", // Validate lại khi người dùng thay đổi giá trị
  });

  const onSubmit = async (data: UploadPostFormValues) => {
    // Validate files
    let hasErrors = false;
    const errors = {
      OriginalAttachmentFiles: "",
      RequestedAttachmentFiles: "",
    };

    if (!OriginalAttachmentFiles) {
      errors.OriginalAttachmentFiles = "Vui lòng tải lên ảnh gốc của sản phẩm";
      hasErrors = true;
    }

    if (!RequestedAttachmentFiles) {
      errors.RequestedAttachmentFiles = "Vui lòng tải lên ảnh mẫu";
      hasErrors = true;
    }

    setFormErrors(errors);

    if (hasErrors) return;

    setSubmitting(true);
    const valuesSubmit = {
      ...data,
      FinishDate: formatDateToSubmit(data.FinishDate + ""),
      OriginalAttachmentFiles: OriginalAttachmentFiles,
      RequestedAttachmentFiles: RequestedAttachmentFiles,
    };
    console.log("valuesSubmit: ", valuesSubmit);

    const response = await createPost(valuesSubmit);

    if (response) {
      toast.success(MESSAGE.CREATE_POST_SUCCESSFULLY);
      // Reset form
      form.reset();
      setOriginalAttachmentFiles(null);
      setRequestedAttachmentFiles([]);
    }
    setSubmitting(false);
  };

  return (
    <div className="grid grid-cols-1 gap-6 w-[900px]">
      <div className="">
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-foreground mb-6">
            Đăng Bài Mới
          </h1>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="Title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required htmlFor="title">
                      Tiêu đề
                    </FormLabel>

                    <FormControl>
                      <Input id="title" {...field} className="bg-card" />
                    </FormControl>
                    <FormError>
                      {form.formState.errors.Title?.message}
                    </FormError>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="Description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required htmlFor="description">
                      Mô tả
                    </FormLabel>

                    <FormControl>
                      <Textarea
                        id="description"
                        {...field}
                        className="bg-card min-h-[100px]"
                      />
                    </FormControl>
                    <FormError>
                      {form.formState.errors.Description?.message}
                    </FormError>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormField
                    control={form.control}
                    name="ItemValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required htmlFor="itemValue">
                          Giá trị sản phẩm
                        </FormLabel>

                        <FormControl>
                          <Input
                            id="itemValue"
                            type="number"
                            step="1"
                            {...field}
                            className="bg-card"
                          />
                        </FormControl>
                        <FormError>
                          {form.formState.errors.ItemValue?.message}
                        </FormError>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="SuggestedPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required htmlFor="suggestedPrice">
                          Giá đề xuất
                        </FormLabel>

                        <FormControl>
                          <Input
                            id="suggestedPrice"
                            type="number"
                            step="1"
                            {...field}
                            className="bg-card"
                          />
                        </FormControl>
                        <FormError>
                          {form.formState.errors.SuggestedPrice?.message}
                        </FormError>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="FinishDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required htmlFor="finishDate">
                        Ngày kết thúc
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-card",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                formatDate(field.value + "")
                              ) : (
                                <span>Chọn ngày kết thúc</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            locale={vi}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormError>
                        {form.formState.errors.FinishDate?.message}
                      </FormError>
                    </FormItem>
                  )}
                />
                <div className="grid gap-4">
                  <FormLabel required htmlFor="attachmentFile">
                    Ảnh gốc sản phẩm
                  </FormLabel>
                  <FileUpload
                    id="attachmentFile"
                    onChange={setOriginalAttachmentFiles}
                    value={OriginalAttachmentFiles}
                    error={formErrors.OriginalAttachmentFiles}
                    accept=".jpg,.jpeg,.png"
                    maxSize={1048576} // 1MB
                  />
                  <FormLabel required htmlFor="attachmentFiles">
                    Ảnh mẫu sản phẩm
                  </FormLabel>
                  <MultipleFileUpload
                    id="attachmentFiles"
                    onChange={setRequestedAttachmentFiles}
                    value={RequestedAttachmentFiles}
                    error={formErrors.RequestedAttachmentFiles}
                    accept=".jpg,.jpeg,.png"
                    maxSize={1048576} // 1MB
                    maxFiles={3}
                  />
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={submitting}
                  >
                    {submitting ? "Đang xử lý..." : "Đăng bài"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
