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
  OfferPhaseFormValues,
  offerPhaseSchema,
} from "@/schemas/offerPhaseShecmas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "@/components/ui/calendar";

const ChatCreateOfferPhase = () => {
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
  });

  const onSubmit = async (values: OfferPhaseFormValues) => {
    console.log("onSubmit: ", values);
    form.reset();
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-10">
        <FormField
          control={form.control}
          name="phaseName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên giai đoạn</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên giai đoạn" {...field} />
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
                <Input type="number" placeholder="Nhập giá" {...field} />
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
                <Input type="text" placeholder="Nhập tên mô tả" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thời gian bắt đầu</FormLabel>
                <FormControl>
                  <div className="flex flex-col flex-wrap items-start gap-2 @md:flex-row">
                    <Calendar
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0); // reset về 00:00:00
                        return date < today;
                      }}
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
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thời gian bắt đầu</FormLabel>
                <FormControl>
                  <div className="flex flex-col flex-wrap items-start gap-2 @md:flex-row">
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
        <div className="flex justify-end">
          <Button type="submit">Gửi</Button>
        </div>
      </form>
    </Form>
  );
};

export default ChatCreateOfferPhase;
