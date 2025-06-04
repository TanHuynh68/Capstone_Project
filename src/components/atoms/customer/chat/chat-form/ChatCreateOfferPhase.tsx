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
import { Textarea } from "@/components/ui/textarea";
import OfferService from "@/services/OfferService";
import { toast } from "sonner";
import { MESSAGE } from "@/constants";
import { DialogClose } from "@/components/ui/dialog";

interface ChatCreateOfferPhaseProps {
  offerID: string;
  fetchOfferPhase: any;
}
const ChatCreateOfferPhase = ({
  offerID,
  fetchOfferPhase,
}: ChatCreateOfferPhaseProps) => {
  const { createOfferPhase } = OfferService();
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
    console.log("onSubmit: ", {
      ...values,
      offerID: offerID,
    });
    const response = await createOfferPhase({
      ...values,
      offerID: offerID,
    });
    if (response) {
      await fetchOfferPhase();
      toast.success(MESSAGE.CREATE_OFFER_PHASE_SUCCESSFULLY);
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 mt-10 w-full"
      >
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
                <Input
                  type="number"
                  step={1000}
                  placeholder="Nhập giá"
                  {...field}
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
                <Textarea placeholder="Nhập tên mô tả" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thời gian bắt đầu</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center flex-wrap gap-2 @md:flex-row">
                    <Calendar
                      disabled={(date) => {
                        const today = new Date();
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
                <FormLabel>Thời gian kết thúc</FormLabel>
                <FormControl>
                  <div className="flex flex-col flex-wrap items-center gap-2 @md:flex-row">
                    <Calendar
                      disabled={(date) => {
                        const today = new Date();
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
        </div>

        <div className="flex justify-end">
          <DialogClose><Button type="submit">Gửi</Button></DialogClose>
        </div>
      </form>
    </Form>
  );
};

export default ChatCreateOfferPhase;
