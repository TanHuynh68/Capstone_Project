import { Button } from "@/components/ui/button";

export function PricingSidebar() {
  return (
    <div className="bg-white rounded-lg border p-6 sticky top-6">
      <div className="space-y-4">
        {/* Service Fee */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Phí dịch vụ</span>
          <span className="font-semibold">29.001 đ</span>
        </div>

        {/* Total Fee */}
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="font-medium">Tổng phí:</span>
          <span className="font-bold text-lg">29.001 đ</span>
        </div>

        {/* Promotional Code Input */}
        {/* <div className="pt-4">
          <div className="relative">
            <Input placeholder="Nhập mã khuyến mãi" className="pr-10" />
            <Button
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div> */}

        {/* GHN Promotional Code */}
        {/* <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-500 text-white text-xs rounded flex items-center justify-center font-bold">
              G
            </div>
            <span className="text-sm font-medium">Mã khuyến mãi từ GHN</span>
            <div className="w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </div> */}

        {/* Action Buttons */}
        <div className="pt-6 space-y-3 border-t">
          <Button variant="outline" size="lg" className="w-full">
            LƯU NHÁP
          </Button>
          <Button
            size="lg"
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            TẠO ĐƠN
          </Button>
        </div>
      </div>
    </div>
  );
}
