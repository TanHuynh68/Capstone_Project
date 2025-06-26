import { Input } from "../../atoms/delivery/input";
import { SelectField } from "../../atoms/delivery/select-field";
import { useState, useEffect } from "react";
import { getDistricts, getWards } from "@/services/ghnApi";

interface ReceiverInfoProps {
  onChange?: (data: Record<string, unknown>) => void;
  errors?: Record<string, string>;
}

interface District {
  DistrictID: number;
  DistrictName: string;
}

interface Ward {
  WardCode: number;
  WardName: string;
}

const HCM_PROVINCE_ID = 202;

export function ReceiverInfo({ onChange, errors }: ReceiverInfoProps) {
  const [form, setForm] = useState<Record<string, unknown>>({
    toName: "",
    toPhone: "",
    toAddress: "",
    toDistrictName: "",
    toWardName: "",
    toProvinceName: "TP. Hồ Chí Minh",
  });

  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");
  const [selectedWardCode, setSelectedWardCode] = useState<string>("");

  useEffect(() => {
    if (onChange) onChange(form);
  }, [form, onChange]);

  // Fetch districts on component mount
  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const res = await getDistricts(HCM_PROVINCE_ID);
        setDistricts(res.data.data || []);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };
    fetchDistricts();
  }, []);

  // Fetch wards when district changes
  const handleDistrictSelect = async (value: string) => {
    setSelectedDistrictId(value);
    const selectedDistrict = districts.find(
      (d) => String(d.DistrictID) === value
    );
    setForm((prev) => ({
      ...prev,
      toDistrictName: selectedDistrict?.DistrictName || "",
      toWardName: "",
    }));
    setSelectedWardCode("");
    setWards([]);

    if (value) {
      try {
        const res = await getWards(Number(value));
        setWards(res.data.data || []);
      } catch (error) {
        console.error("Error fetching wards:", error);
      }
    }
  };

  const handleWardSelect = (value: string) => {
    setSelectedWardCode(value);
    const selectedWard = wards.find((w) => String(w.WardCode) === value);
    setForm((f) => ({ ...f, toWardName: selectedWard?.WardName || "" }));
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Bên nhận</h3>

      <div className="space-y-4">
        {/* Name and Phone on same row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Họ tên"
              placeholder="Nhập họ tên"
              value={form.toName as string}
              required
              onChange={(e) =>
                setForm((f) => ({ ...f, toName: e.target.value }))
              }
            />
            {errors?.toName && (
              <div className="text-red-500 text-sm mt-1">{errors.toName}</div>
            )}
          </div>
          <div className="relative">
            <Input
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              value={form.toPhone as string}
              required
              onChange={(e) =>
                setForm((f) => ({ ...f, toPhone: e.target.value }))
              }
            />
            {errors?.toPhone && (
              <div className="text-red-500 text-sm mt-1">{errors.toPhone}</div>
            )}
          </div>
        </div>

        {/* Address on its own row */}
        <div>
          <Input
            label="Địa chỉ"
            placeholder="Nhập địa chỉ chi tiết"
            value={form.toAddress as string}
            required
            onChange={(e) =>
              setForm((f) => ({ ...f, toAddress: e.target.value }))
            }
          />
          {errors?.toAddress && (
            <div className="text-red-500 text-sm mt-1">{errors.toAddress}</div>
          )}
        </div>

        {/* District and Ward on same row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <SelectField
              label="Quận - Huyện"
              placeholder="Chọn Quận/Huyện"
              value={selectedDistrictId}
              required
              options={districts.map((d) => ({
                value: String(d.DistrictID),
                label: d.DistrictName,
              }))}
              onValueChange={handleDistrictSelect}
            />
            {errors?.toDistrictName && (
              <div className="text-red-500 text-sm mt-1">
                {errors.toDistrictName}
              </div>
            )}
          </div>
          <div>
            <SelectField
              label="Phường - Xã"
              placeholder="Chọn Phường/Xã"
              value={selectedWardCode}
              required
              options={wards.map((w) => ({
                value: String(w.WardCode),
                label: w.WardName,
              }))}
              onValueChange={handleWardSelect}
            />
            {errors?.toWardName && (
              <div className="text-red-500 text-sm mt-1">
                {errors.toWardName}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
