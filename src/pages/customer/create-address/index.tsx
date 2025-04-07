import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomerService from "@/services/CustomerService";
import { getDistricts, getWards } from "@/services/ghnApi";

const HCM_PROVINCE_ID = 202;

type CreateAddressProps = {
  onCreated: () => void;
  addresses: any[]; // 👈 truyền danh sách địa chỉ hiện tại từ parent
};

const CreateAddress = ({ onCreated, addresses = [] }: CreateAddressProps) => {
  const { postAddresses } = CustomerService();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    addressDetail: "",
    district: "",
    ward: "",
  });

  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  const maxAddressesReached = addresses.length >= 3;

  // Fetch Districts
  useEffect(() => {
    const fetchDistricts = async () => {
      const res = await getDistricts(HCM_PROVINCE_ID);
      setDistricts(res.data.data || []);
    };
    fetchDistricts();
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        addressDetail: "",
        district: "",
        ward: "",
      });
      setWards([]);
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDistrictSelect = async (value: string) => {
    setFormData((prev) => ({ ...prev, district: value, ward: "" }));
    const res = await getWards(Number(value));
    setWards(res.data.data || []);
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      district: Number(formData.district),
      ward: Number(formData.ward),
    };

    const res = await postAddresses(payload);
    if (res) {
      onCreated();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={maxAddressesReached}>Thêm địa chỉ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm địa chỉ mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="addressDetail" className="mb-2 block">
              Địa chỉ chi tiết
            </Label>
            <Input
              id="addressDetail"
              name="addressDetail"
              value={formData.addressDetail}
              onChange={handleChange}
              placeholder="Ví dụ: 123 Lê Lợi"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Chọn Quận/Huyện</Label>
              <Select
                value={formData.district}
                onValueChange={handleDistrictSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d.DistrictID} value={String(d.DistrictID)}>
                      {d.DistrictName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2 block">Chọn Phường/Xã</Label>
              <Select
                value={formData.ward}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, ward: value }))
                }
                disabled={!formData.district}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phường/xã" />
                </SelectTrigger>
                <SelectContent>
                  {wards.map((w) => (
                    <SelectItem key={w.WardCode} value={String(w.WardCode)}>
                      {w.WardName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full mt-3">
            Lưu địa chỉ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAddress;
