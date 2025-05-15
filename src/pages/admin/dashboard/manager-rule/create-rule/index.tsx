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

const RuleCreateForm: React.FC<{ onCreated: () => void }> = ({ onCreated }) => {
  const { postRule } = AdminService();
  const [form, setForm] = useState({
    ruleType: 0,
    title: "",
    description: "",
    scoreChange: "",
    compensationRate: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!form.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề luật lệ.");
      return false;
    }
    if (form.scoreChange === "") {
      toast.error("Vui lòng nhập điểm thay đổi.");
      return false;
    }
    const compensationRate = Number(form.compensationRate);
    if (
      form.compensationRate === "" ||
      isNaN(compensationRate) ||
      compensationRate < 1 ||
      compensationRate > 100
    ) {
      toast.error(
        "Tỷ lệ bồi thường phải từ 1 đến 100% và không được để trống hoặc âm."
      );
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const res = await postRule({
        ruleType: form.ruleType,
        title: form.title,
        description: form.description,
        scoreChange: Number(form.scoreChange),
        compensationRate: Number(form.compensationRate),
      });
      if (res) {
        toast.success("Tạo luật lệ thành công.");
        onCreated();
      }
    } catch (error) {
      toast.error("Tạo luật lệ thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">
          Tiêu đề luật lệ
        </label>
        <Input
          placeholder="Tiêu đề luật lệ"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Mô tả luật lệ</label>
        <Textarea
          placeholder="Mô tả luật lệ"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Loại luật lệ</label>
        <Select
          value={String(form.ruleType)}
          onValueChange={(v) => handleChange("ruleType", Number(v))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn loại luật lệ" />
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
      <div>
        <label className="block text-sm font-medium mb-1">
          Điểm thay đổi (có thể âm)
        </label>
        <Input
          type="number"
          inputMode="decimal"
          placeholder="Điểm thay đổi (có thể nhập số âm)"
          value={form.scoreChange}
          onKeyDown={(e) => {
            if (
              ["e", "E", "+", "."].includes(e.key) ||
              (e.key === "-" && form.scoreChange?.toString().includes("-"))
            ) {
              e.preventDefault();
            }
          }}
          onChange={(e) => handleChange("scoreChange", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Tỷ lệ bồi thường (%)
        </label>
        <Input
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          min={1}
          max={100}
          placeholder="Tỷ lệ bồi thường (%) (1 - 100)"
          value={form.compensationRate}
          onKeyDown={(e) => {
            if (["e", "E", "+", "-", "."].includes(e.key) || e.shiftKey) {
              e.preventDefault();
            }
          }}
          onChange={(e) => handleChange("compensationRate", e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <Button onClick={handleCreate} disabled={loading}>
          {loading ? "Đang tạo..." : "Tạo luật lệ"}
        </Button>
      </div>
    </div>
  );
};

export default RuleCreateForm;
