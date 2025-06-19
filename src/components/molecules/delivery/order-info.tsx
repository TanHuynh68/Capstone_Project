import { Input } from "../../atoms/delivery/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function OrderInfo() {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Thông tin đơn hàng</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Input label="KL (gram)" defaultValue="500" required />
        <Input label="Dài (cm)" defaultValue="10" required />
        <Input label="Rộng (cm)" defaultValue="10" required />
        <Input label="Cao (cm)" defaultValue="10" required />
      </div>

      <div className="text-sm text-gray-600 mb-6">KL quy đổi (gram): 200</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label className="text-sm font-medium mb-2 block">
            Tổng tiền thu hộ (COD)
          </Label>
          <Input defaultValue="0" />
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox id="cod-fee" defaultChecked />
            <Label htmlFor="cod-fee" className="text-sm">
              Giao thất bại thu tiền
            </Label>
          </div>
          <Input defaultValue="20.000" className="mt-2" />
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">
            Tổng giá trị hàng hóa
          </Label>
          <Input defaultValue="0" />
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">
            Mã đơn riêng khách hàng
          </Label>
          <Input placeholder="Nhập mã đơn riêng khách hàng (nếu có)" />
        </div>
      </div>
    </div>
  );
}
