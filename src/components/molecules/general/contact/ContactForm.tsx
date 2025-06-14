"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import ContactInput from "@/components/atoms/general/contact/ContactInput";
import ContactTextarea from "@/components/atoms/general/contact/ContactTextarea";

const formSchema = z.object({
  name: z.string().min(2, { message: "Tên phải có ít nhất 2 ký tự." }),
  email: z.string().email({ message: "Vui lòng nhập địa chỉ email hợp lệ." }),
  subject: z.string().min(5, { message: "Chủ đề phải có ít nhất 5 ký tự." }),
  message: z
    .string()
    .min(10, { message: "Nội dung phải có ít nhất 10 ký tự." }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(data: FormValues) {
    console.log(data);

    setTimeout(() => {
      setIsSubmitted(true);
      form.reset();
    }, 500);
  }

  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
      {isSubmitted ? (
        <Alert className="bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700">
          <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-200">
            Gửi thành công!
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-100">
            Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi trong
            thời gian sớm nhất.
          </AlertDescription>
          <Button
            variant="outline"
            className="mt-4 border-green-300 dark:border-green-600 text-green-700 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-800 hover:text-green-800 dark:hover:text-green-100"
            onClick={() => setIsSubmitted(false)}
          >
            Gửi tin nhắn khác
          </Button>
        </Alert>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <ContactInput
                    field={field}
                    label="Họ và tên"
                    placeholder="Nhập họ và tên của bạn"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <ContactInput
                    field={field}
                    label="Email"
                    placeholder="Nhập địa chỉ email của bạn"
                  />
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <ContactInput
                  field={field}
                  label="Chủ đề"
                  placeholder="Bạn muốn liên hệ về vấn đề gì?"
                />
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <ContactTextarea
                  field={field}
                  label="Nội dung"
                  placeholder="Vui lòng nhập đầy đủ chi tiết để chúng tôi hỗ trợ tốt nhất..."
                  rows={6}
                />
              )}
            />
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Gửi tin nhắn
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
