import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Switch } from "@/components/ui/switch";

const HCM_PROVINCE_ID = 202;

type PutAddressProps = {
  address: any;
  onUpdated: () => void;
  onClose: () => void;
};

const PutAddress = ({ address, onUpdated, onClose }: PutAddressProps) => {
  const { putAddresses } = CustomerService();
  const [open, setOpen] = useState(true);

  const [formData, setFormData] = useState({
    addressID: "",
    addressDetail: "",
    district: "",
    ward: "",
    isMainAddress: false,
  });

  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);

  // Reset form data only once when modal opens
  useEffect(() => {
    setFormData({
      addressID: address.addressID,
      addressDetail: address.addressDetail,
      district: String(address.district),
      ward: String(address.ward),
      isMainAddress: address.isMainAddress || false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch districts and wards only once
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

  const handleDistrictChange = async (value: string) => {
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
    const res = await putAddresses(payload);
    if (res) {
      onUpdated();
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Cập nhật địa chỉ</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <Label className="mb-1 block" htmlFor="addressDetail">
              Địa chỉ chi tiết
            </Label>
            <Input
              id="addressDetail"
              value={formData.addressDetail}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  addressDetail: e.target.value,
                }))
              }
              placeholder="Ví dụ: 123 Lê Lợi"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1 block">Chọn Quận/Huyện</Label>
              <Select
                value={formData.district}
                onValueChange={handleDistrictChange}
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
              <Label className="mb-1 block">Chọn Phường/Xã</Label>
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

          <div className="flex items-center justify-between">
            <Label className="mr-2">Đặt làm địa chỉ chính</Label>
            <Switch
              checked={formData.isMainAddress}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isMainAddress: checked }))
              }
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Lưu thay đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PutAddress;
