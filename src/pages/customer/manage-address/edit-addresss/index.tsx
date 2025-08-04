import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Switch } from "@/components/ui/switch";
import {
  updateAddressSchema,
  UpdateAddressFormData,
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

type Address = {
  addressID: string;
  addressDetail: string;
  district: number;
  ward: number;
  isMainAddress: boolean;
};

type PutAddressProps = {
  address: Address;
  onUpdated: () => void;
  onClose: () => void;
};

const PutAddress = ({ address, onUpdated, onClose }: PutAddressProps) => {
  const { putAddresses } = CustomerService();
  const [open, setOpen] = useState(true);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const form = useForm<UpdateAddressFormData>({
    resolver: zodResolver(updateAddressSchema),
    defaultValues: {
      addressDetail: address.addressDetail,
      district: String(address.district),
      ward: String(address.ward),
      isMainAddress: address.isMainAddress || false,
    },
  });

  const watchedDistrict = form.watch("district");

  // Fetch districts and wards
  useEffect(() => {
    const fetchData = async () => {
      const districtRes = await getDistricts(HCM_PROVINCE_ID);
      const allDistricts = districtRes.data.data || [];
      setDistricts(allDistricts);

      if (address.district) {
        const wardRes = await getWards(Number(address.district));
        setWards(wardRes.data.data || []);
      }
    };
    fetchData();
  }, [address]);

  // Handle close modal
  useEffect(() => {
    if (!open) onClose();
  }, [open, onClose]);

  // Fetch wards when district changes
  useEffect(() => {
    const fetchWards = async () => {
      if (watchedDistrict && watchedDistrict !== String(address.district)) {
        const res = await getWards(Number(watchedDistrict));
        setWards(res.data.data || []);
        form.setValue("ward", "");
      }
    };
    fetchWards();
  }, [watchedDistrict, form, address.district]);

  const onSubmit = async (data: UpdateAddressFormData) => {
    console.log("Form data:", data); // Debug log
    try {
      const payload = {
        addressDetail: data.addressDetail,
        district: Number(data.district),
        ward: Number(data.ward),
        isMainAddress: data.isMainAddress,
        addressID: address.addressID, // Add this for the service to use in URL
      };

      console.log("Payload:", payload); // Debug log
      const res = await putAddresses(payload);
      console.log("API response:", res); // Debug log
      if (res) {
        onUpdated();
        setOpen(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật địa chỉ</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="addressDetail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ chi tiết</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ví dụ: 123 Lê Lợi"
                      value={field.value || ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
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

            <div className="flex items-center justify-between">
              <FormLabel className="mr-2">Đặt làm địa chỉ chính</FormLabel>
              <FormField
                control={form.control}
                name="isMainAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">
              Lưu thay đổi
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PutAddress;
