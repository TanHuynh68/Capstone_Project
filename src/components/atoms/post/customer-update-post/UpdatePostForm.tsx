"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  UpdatePostFormValues,
  updatePostSchema,
} from "@/schemas/report/updatePostSchema";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import PostService from "@/services/PostService";
import { toast } from "sonner";
import { MESSAGE } from "@/constants";
import { DialogClose } from "@/components/ui/dialog";
import { formatDateToSubmit } from "@/utils";

interface UpdatePostFormProps {
  fetchPosts: any;
  data: UpdatePostFormValues;
  projectPostId: string;
}

export function UpdatePostForm({
  data,
  projectPostId,
  fetchPosts,
}: UpdatePostFormProps) {
  const { updatePost } = PostService();
  const onSubmit = async (values: UpdatePostFormValues) => {
    const valueSubmit = {
      projectPostId: projectPostId,
      title: values.Title,
      itemValue: values.ItemValue,
      description: values.Description,
      finishDate: formatDateToSubmit(values.FinishDate + ""),
      suggestedPrice: values.SuggestedPrice,
    };
    console.log("valueSubmit: ", valueSubmit);
    const response = await updatePost(valueSubmit);
    console.log("response: ", response);
    if (response && response.isSuccess) {
      await fetchPosts();
      toast.success(MESSAGE.UPDATE_POST_SUCCESSFULLY);
    }
  };
  const form = useForm({
    resolver: zodResolver(updatePostSchema),
    defaultValues: {
      Title: data?.Title,
      Description: data?.Description,
      ItemValue: data?.ItemValue,
      SuggestedPrice: data?.SuggestedPrice,
      FinishDate: data?.FinishDate,
    },
    mode: "onBlur", // Validate khi người dùng rời khỏi trường input
    reValidateMode: "onChange", // Validate lại khi người dùng thay đổi giá trị
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="Title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề 2</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="Description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="shadcn" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-12">
          <div className="col-span-7">
            <FormField
              control={form.control}
              name="FinishDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời gian kết thúc</FormLabel>
                  <FormControl>
                    <div className="flex  flex-col flex-wrap items-center gap-2 @md:flex-row ">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="rounded-md border shadow-sm"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-5 space-y-8 flex flex-col items-center justify-between">
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="ItemValue"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Giá trị sản phẩm</FormLabel>
                    <FormControl className="w-[100px] ">
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="SuggestedPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giá đề xuất</FormLabel>
                    <FormControl className="w-[100px]">
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className=" ">
              <DialogClose>
                <Button type="submit">Gửi</Button>
              </DialogClose>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
