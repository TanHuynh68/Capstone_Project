import { RadioGroup } from "@/components/ui/radio-group";
import { RadioOption } from "../../atoms/delivery/radio-option";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function NotesSection() {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Lưu ý - Ghi chú</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-medium mb-3 block">
            Lưu ý giao hàng <span className="text-red-500">*</span>
          </Label>
          <RadioGroup defaultValue="no-check" className="space-y-3">
            <RadioOption value="no-check" id="no-check">
              Không cho xem hàng
            </RadioOption>
            <RadioOption value="check-no-try" id="check-no-try">
              Cho xem hàng không cho thử
            </RadioOption>
            <RadioOption value="check-try" id="check-try">
              Cho thử hàng
            </RadioOption>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
            Ghi chú
          </Label>
          <Textarea
            id="notes"
            placeholder="Nhập ghi chú"
            className="min-h-[120px] border-gray-300 focus:border-orange-500"
          />
        </div>
      </div>
    </div>
  );
}
