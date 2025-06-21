import { Input } from "../../atoms/delivery/input";

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
    </div>
  );
}
