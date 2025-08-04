import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CustomerService from "@/services/CustomerService";
import { getDistricts, getWards } from "@/services/ghnApi";
import { MapPinned } from "lucide-react";
import {
  createAddressSchema,
  CreateAddressFormData,
  createAddressPayloadSchema,
} from "@/schemas/addressSchema";

const HCM_PROVINCE_ID = 202;

type District = {
  DistrictID: number;
  DistrictName: string;
};

type Ward = {
  WardCode: number;
  WardName: string;
};

type CreateAddressProps = {
  onCreated: () => void;
  addresses: any[];
  className?: string;
};

const CreateAddress = ({
  onCreated,
  addresses = [],
  className,
}: CreateAddressProps) => {
  const { postAddresses } = CustomerService();
  const [open, setOpen] = useState(false);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const maxAddressesReached = addresses.length >= 3;

  const form = useForm<CreateAddressFormData>({
    resolver: zodResolver(createAddressSchema),
    defaultValues: {
      addressDetail: "",
      district: "",
      ward: "",
      isMainAddress: false,
    },
    mode: "onBlur",
  });

  const watchedDistrict = form.watch("district");

  useEffect(() => {
    const fetchDistricts = async () => {
      const res = await getDistricts(HCM_PROVINCE_ID);
      setDistricts(res.data.data || []);
    };
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (!open) {
      form.reset({
        addressDetail: "",
        district: "",
        ward: "",
        isMainAddress: false,
      });
      setWards([]);
    }
  }, [open, form]);

  useEffect(() => {
    const fetchWards = async () => {
      if (watchedDistrict) {
        const res = await getWards(Number(watchedDistrict));
        setWards(res.data.data || []);
        form.setValue("ward", "");
      } else {
        setWards([]);
      }
    };
    fetchWards();
  }, [watchedDistrict, form]);

  const onSubmit = async (data: CreateAddressFormData) => {
    console.log("Form data:", data); // Debug log
    try {
      const validatedPayload = createAddressPayloadSchema.parse(data);
      const payload = {
        ...validatedPayload,
        isMainAddress: addresses.length === 0,
      };

      console.log("Payload:", payload); // Debug log

      const isDuplicate = addresses.some(
        (addr) =>
          addr.addressDetail.trim().toLowerCase() ===
            payload.addressDetail.trim().toLowerCase() &&
          Number(addr.district) === payload.district &&
          Number(addr.ward) === payload.ward
      );

      if (isDuplicate) {
        alert("Địa chỉ này đã tồn tại. Vui lòng nhập địa chỉ khác.");
        return;
      }

      const res = await postAddresses(payload);
      if (res?.statusCode === 201) {
        onCreated();
        setOpen(false);
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className={`${className || ""}`}>
          <Button className="w-full" disabled={maxAddressesReached}>
            <MapPinned className="mr-2 h-4 w-4" />
            Thêm địa chỉ
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm địa chỉ mới</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="addressDetail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ chi tiết</FormLabel>
                  <FormControl>
                    <Input placeholder="Ví dụ: 123 Lê Lợi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chọn Quận/Huyện</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quận/huyện" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {districts.map((d) => (
                          <SelectItem
                            key={d.DistrictID}
                            value={String(d.DistrictID)}
                          >
                            {d.DistrictName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chọn Phường/Xã</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!watchedDistrict}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phường/xã" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {wards.map((w) => (
                          <SelectItem
                            key={w.WardCode}
                            value={String(w.WardCode)}
                          >
                            {w.WardName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full mt-3">
              Lưu địa chỉ
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAddress;
