import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import AdminService from "@/services/AdminService";
import { MESSAGE } from "@/constants/message";

const BenefitCreateForm: React.FC<{ onCreated: () => void }> = ({
  onCreated,
}) => {
  const { postBenefit } = AdminService();
  const [form, setForm] = useState({
    benefitType: 0,
    title: "",
    description: "",
    customerScoreChange: "",
    designerScoreChange: "",
    customerCompensationRate: "",
    designerCompensationRate: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề quyền lợi.");
      return false;
    }

    if (form.customerScoreChange === "") {
      toast.error("Vui lòng nhập điểm thay đổi cho khách hàng.");
      return false;
    }

    if (form.designerScoreChange === "") {
      toast.error("Vui lòng nhập điểm thay đổi cho nhà thiết kế.");
      return false;
    }

    const customerCompensationRate = Number(form.customerCompensationRate);
    if (
      form.customerCompensationRate === "" ||
      isNaN(customerCompensationRate) ||
      customerCompensationRate < 0 ||
      customerCompensationRate > 100
    ) {
      toast.error(
        "Tỷ lệ bồi thường khách hàng phải từ 0 đến 100% và không được để trống."
      );
      return false;
    }

    const designerCompensationRate = Number(form.designerCompensationRate);
    if (
      form.designerCompensationRate === "" ||
      isNaN(designerCompensationRate) ||
      designerCompensationRate < -100 ||
      designerCompensationRate > 100
    ) {
      toast.error(
        "Tỷ lệ bồi thường nhà thiết kế phải từ -100 đến 100% và không được để trống."
      );
      return false;
    }

    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const requestData: CreateBenefitRequest = {
        benefitType: form.benefitType,
        title: form.title,
        description: form.description,
        customerScoreChange: form.customerScoreChange,
        designerScoreChange: form.designerScoreChange,
        customerCompensationRate: form.customerCompensationRate,
        designerCompensationRate: form.designerCompensationRate,
      };

      const res = await postBenefit(requestData);
      if (res && res.responseRequestModel) {
        toast.success("Tạo quyền lợi thành công.");
        onCreated();
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: string } };
      toast.error(err?.response?.data || MESSAGE.CREATE_BENEFIT_FAILED);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Tiêu đề quyền lợi <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Tiêu đề quyền lợi"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Mô tả quyền lợi
          </label>
          <Textarea
            placeholder="Mô tả chi tiết về quyền lợi này"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Loại quyền lợi <span className="text-red-500">*</span>
          </label>
          <Select
            value={String(form.benefitType)}
            onValueChange={(v) => handleChange("benefitType", Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại quyền lợi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Chung</SelectItem>
              <SelectItem value="1">Đặt cọc</SelectItem>
              <SelectItem value="2">Giao hàng</SelectItem>
              <SelectItem value="3">Phạt</SelectItem>
              <SelectItem value="4">Bảo hành</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Score Changes Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Thay đổi điểm số
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Điểm khách hàng <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-1">(có thể âm)</span>
            </label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="Điểm thay đổi cho khách hàng"
              value={form.customerScoreChange}
              min={-20}
              max={20}
              onKeyDown={(e) => {
                if (["e", "E", "+", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) =>
                handleChange("customerScoreChange", e.target.value)
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Điểm nhà thiết kế <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-1">(có thể âm)</span>
            </label>
            <Input
              type="number"
              inputMode="decimal"
              placeholder="Điểm thay đổi cho nhà thiết kế"
              value={form.designerScoreChange}
              onKeyDown={(e) => {
                if (["e", "E", "+", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) =>
                handleChange("designerScoreChange", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* Compensation Rates Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
          Tỷ lệ bồi thường (%)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Bồi thường khách hàng <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-1">(0-100%)</span>
            </label>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={100}
              placeholder="Tỷ lệ bồi thường cho khách hàng"
              value={form.customerCompensationRate}
              onKeyDown={(e) => {
                if (["e", "E", "+", "-", "."].includes(e.key) || e.shiftKey) {
                  e.preventDefault();
                }
              }}
              onChange={(e) =>
                handleChange("customerCompensationRate", e.target.value)
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Bồi thường nhà thiết kế <span className="text-red-500">*</span>
              <span className="text-xs text-gray-500 ml-1">
                (-100 đến 100%)
              </span>
            </label>
            <Input
              type="number"
              inputMode="decimal"
              min={-100}
              max={100}
              placeholder="Tỷ lệ bồi thường cho nhà thiết kế"
              value={form.designerCompensationRate}
              onKeyDown={(e) => {
                if (["e", "E", "+", "."].includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) =>
                handleChange("designerCompensationRate", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t">
        <Button onClick={handleCreate} disabled={loading} className="px-8">
          {loading ? "Đang tạo..." : "Tạo quyền lợi"}
        </Button>
      </div>
    </div>
  );
};

export default BenefitCreateForm;
