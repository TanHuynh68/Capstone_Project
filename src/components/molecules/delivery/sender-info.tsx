import { Input } from "../../atoms/delivery/input";
import { SelectField } from "../../atoms/delivery/select-field";

export function SenderInfo() {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Bên gửi</h3>

      <div className="space-y-4">
        {/* Name and Phone on same row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Họ tên"
            placeholder="Nhập họ tên"
            defaultValue="Labubu"
            required
          />
          <Input
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            defaultValue="0582940458"
            required
          />
        </div>

        {/* Address on its own row */}
        <div>
          <Input
            label="Địa chỉ"
            placeholder="Nhập địa chỉ"
            defaultValue="VGM4+H96, An Bình, Dĩ An"
            required
          />
        </div>

        {/* District on its own row */}
        <div>
          <SelectField
            label="Quận - Huyện"
            placeholder="Chọn Quận/Huyện"
            defaultValue="di-an"
            required
            options={[
              { value: "di-an", label: "Thành phố Dĩ An - Bình Dương" },
              {
                value: "thu-dau-mot",
                label: "Thành phố Thủ Dầu Một - Bình Dương",
              },
              { value: "ben-cat", label: "Thị xã Bến Cát - Bình Dương" },
            ]}
          />
        </div>

        {/* Ward on its own row */}
        <div>
          <SelectField
            label="Phường - Xã"
            placeholder="Chọn Phường/Xã"
            defaultValue="an-binh"
            required
            options={[
              { value: "an-binh", label: "Phường An Bình" },
              { value: "dong-hoa", label: "Phường Đông Hòa" },
              { value: "tan-dong-hiep", label: "Phường Tân Đông Hiệp" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
