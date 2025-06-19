import { Input } from "../../atoms/delivery/input";
import { SelectField } from "../../atoms/delivery/select-field";

export function ReceiverInfo() {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Bên nhận</h3>

      <div className="space-y-4">
        {/* Name and Phone on same row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Họ tên"
            placeholder="Nhập họ tên"
            defaultValue="Yumi tran"
            required
          />
          <div className="relative">
            <Input
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              defaultValue="0909392694"
              required
            />
            {/* <div className="absolute right-2 top-8">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                An toàn 95%
              </span>
            </div> */}
          </div>
        </div>

        {/* Address on its own row */}
        <div>
          <Input
            label="Địa chỉ"
            placeholder="Nhập địa chỉ"
            defaultValue="96 Ung Văn Khiêm"
            required
          />
        </div>

        {/* District on its own row */}
        <div>
          <SelectField
            label="Quận - Huyện"
            placeholder="Chọn Quận/Huyện"
            defaultValue="binh-thanh"
            required
            options={[
              { value: "binh-thanh", label: "Quận Bình Thạnh - Hồ Chí Minh" },
              { value: "district1", label: "Quận 1" },
              { value: "district2", label: "Quận 2" },
            ]}
          />
        </div>

        {/* Ward on its own row */}
        <div>
          <SelectField
            label="Phường - Xã"
            placeholder="Chọn Phường/Xã"
            defaultValue="phuong-26"
            required
            options={[
              { value: "phuong-26", label: "Phường 26" },
              { value: "ward1", label: "Phường 1" },
              { value: "ward2", label: "Phường 2" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
