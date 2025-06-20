import { Textarea } from "@/components/ui/textarea";

export function NotesSection() {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="text-lg font-semibold mb-4">Lưu ý - Ghi chú</h3>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div>
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
