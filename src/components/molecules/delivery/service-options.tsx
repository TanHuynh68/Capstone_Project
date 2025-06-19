import { RadioGroup } from "@/components/ui/radio-group";
import { RadioOption } from "../../atoms/delivery/radio-option";

export function ServiceOptions() {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Gói dịch vụ</h3>

      <RadioGroup
        defaultValue="light"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <RadioOption value="light" id="light">
          <div>
            <div className="flex items-center mb-1">
              <span className="text-orange-500 mr-2">🚚</span>
              <span className="font-medium">Hàng nhẹ ({"< 20kg"})</span>
            </div>
            <div className="text-sm text-gray-600">
              Ngày giao dự kiến: 21/06/2025 - 22/06/2025
            </div>
            <div className="text-sm text-gray-600">Cước phí: 29.001 đ</div>
          </div>
        </RadioOption>

        <RadioOption value="heavy" id="heavy">
          <div>
            <div className="flex items-center mb-1">
              <span className="text-blue-500 mr-2">⚡</span>
              <span className="font-medium">Hàng nặng ({">= 20kg"})</span>
            </div>
            <div className="text-sm text-gray-600">
              Ngày giao dự kiến: 21/06/2025 - 22/06/2025
            </div>
            <div className="text-sm text-gray-600">
              Cước phí: 120.000 đ{" "}
              <span className="text-red-500">(giá ước tính)</span>
            </div>
          </div>
        </RadioOption>
      </RadioGroup>
    </div>
  );
}
