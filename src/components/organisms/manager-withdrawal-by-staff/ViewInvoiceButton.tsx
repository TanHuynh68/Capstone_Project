import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { XCircle } from "lucide-react";

interface ViewInvoiceButtonProps {
  row: {
    walletOrderID: string;
    fullName?: string;
    amount: number;
    orderStatusDisplay: string;
    orderDate: string;
    description?: string;
    note?: string;
    imageUrl?: string;
  };
}

const ViewInvoiceButton: React.FC<ViewInvoiceButtonProps> = ({ row }) => {
  const handleOpenInvoice = () => {
    const statusMap: Record<string, string> = {
      Pending: "Chờ duyệt",
      Completed: "Hoàn tất",
      Canceled: "Đã hủy",
    };
    const statusDisplay =
      statusMap[row.orderStatusDisplay] || row.orderStatusDisplay;

    toast.custom(
      (t) => (
        <div className="bg-white rounded-xl shadow-xl border border-gray-300 max-w-md w-full p-6 relative font-mono  z-[1000]">
          {/* Close button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => toast.dismiss(t)}
            className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
          >
            <XCircle className="w-5 h-5" />
          </Button>

          {/* Header */}
          <div className="text-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-gray-900">
              HÓA ĐƠN GIAO DỊCH
            </h2>
            <p className="text-xs text-gray-500">
              Ngày: {new Date(row.orderDate).toLocaleString("vi-VN")}
            </p>
            <p className="text-xs text-gray-500">
              Mã giao dịch: {row.walletOrderID}
            </p>
          </div>

          {/* Body */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Họ tên:</span>
              <span className="font-semibold text-gray-800">
                {row.fullName ?? "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Số tiền:</span>
              <span className="font-semibold text-gray-800">
                {row.amount.toLocaleString("vi-VN")} ₫
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Trạng thái:</span>
              <span
                className={
                  row.orderStatusDisplay === "Completed"
                    ? "text-green-600 font-semibold"
                    : row.orderStatusDisplay === "Pending"
                    ? "text-yellow-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {statusDisplay}
              </span>
            </div>

            {row.description && (
              <div>
                <p className="text-gray-600 font-medium">Mô tả:</p>
                <p className="text-gray-700">{row.description}</p>
              </div>
            )}

            {row.note && (
              <div>
                <p className="text-gray-600 font-medium">Ghi chú:</p>
                <div className="bg-gray-50 border rounded px-3 py-2 text-gray-700 whitespace-pre-wrap">
                  {row.note}
                </div>
              </div>
            )}

            {row.imageUrl && (
              <div className="pt-2">
                <img
                  src={row.imageUrl}
                  alt="Ảnh minh chứng"
                  className="rounded-md border cursor-pointer hover:opacity-80 transition w-full max-h-48 object-contain"
                  onClick={() => {
                    toast.custom(
                      (t) => (
                        <div className="bg-white p-4 rounded-xl shadow-xl border max-w-2xl w-full relative z-[1001]">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => toast.dismiss(t)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                          >
                            <XCircle className="w-5 h-5" />
                          </Button>
                          <img
                            src={row.imageUrl}
                            alt="Ảnh minh chứng"
                            className="rounded-md max-h-[80vh] w-full object-contain"
                          />
                        </div>
                      ),
                      {
                        position: "top-center",
                        duration: 15000,
                      }
                    );
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ),
      {
        duration: 20000,
        position: "top-center",
      }
    );
  };

  return (
    <Button variant="outline" size="sm" onClick={handleOpenInvoice}>
      Xem hóa đơn
    </Button>
  );
};

export default ViewInvoiceButton;
