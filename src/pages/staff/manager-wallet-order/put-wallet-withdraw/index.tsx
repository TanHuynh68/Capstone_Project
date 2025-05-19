"use client";

import type React from "react";
import { useState } from "react";
import { toast } from "sonner";
import StaffService from "@/services/StaffService";
import { Check, FileImage, Loader2, Upload, X } from "lucide-react";

interface Props {
  walletOrderID: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

const PutWalletWithdraw: React.FC<Props> = ({
  walletOrderID,
  onSuccess,
  onClose,
}) => {
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [orderStatus, setOrderStatus] = useState("1"); // Mặc định: Thành công
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { putWalletWithdrawByStaff } = StaffService();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error("Vui lòng chọn ảnh xác nhận.");
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error("Ảnh vượt quá 1MB.");
      return;
    }
    if (!/\.(jpg|jpeg|png)$/i.test(file.name)) {
      toast.error("Ảnh phải là định dạng .jpg, .jpeg hoặc .png");
      return;
    }

    const formData = new FormData();
    formData.append("WalletOrderID", walletOrderID);
    formData.append("OrderStatus", orderStatus);
    formData.append("Note", note);
    formData.append("WithdrawImageFile", file);

    setLoading(true);
    try {
      const res = await putWalletWithdrawByStaff(formData);
      if (res?.isSuccess) {
        toast.success("Cập nhật trạng thái đơn rút thành công.");
        onSuccess?.();
      } else {
        toast.error("Không thể cập nhật đơn rút.");
      }
    } catch (error: any) {
      toast.error("Lỗi khi cập nhật đơn rút.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">
          Xác nhận hoàn tiền
        </h2>
        <div className="text-sm text-gray-500">Mã đơn: {walletOrderID}</div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Trạng thái đơn
          </label>
          <div className="flex gap-3">
            <label
              className={`flex-1 flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                orderStatus === "1"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="orderStatus"
                value="1"
                checked={orderStatus === "1"}
                onChange={() => setOrderStatus("1")}
                className="sr-only"
              />
              <Check
                className={`h-5 w-5 ${
                  orderStatus === "1" ? "text-green-500" : "text-gray-400"
                }`}
              />
              <span>Thành công</span>
            </label>

            <label
              className={`flex-1 flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                orderStatus === "3"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="orderStatus"
                value="3"
                checked={orderStatus === "3"}
                onChange={() => setOrderStatus("3")}
                className="sr-only"
              />
              <X
                className={`h-5 w-5 ${
                  orderStatus === "3" ? "text-red-500" : "text-gray-400"
                }`}
              />
              <span>Hủy</span>
            </label>
          </div>
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="note"
            className="block text-sm font-medium text-gray-700"
          >
            Ghi chú
          </label>
          <input
            id="note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            placeholder="Nhập ghi chú về giao dịch"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Ảnh xác nhận rút tiền
          </label>

          <div
            className={`border-2 border-dashed rounded-lg p-4 transition-all ${
              previewUrl
                ? "border-blue-400"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {previewUrl ? (
              <div className="space-y-3">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 truncate max-w-[200px]">
                    {file?.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreviewUrl(null);
                    }}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Xóa ảnh
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center py-4 cursor-pointer">
                <FileImage className="h-10 w-10 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-700">
                  Chọn ảnh xác nhận
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Chỉ chấp nhận ảnh .jpg, .jpeg, .png dưới 1MB
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                  className="sr-only"
                  required
                />
              </label>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex justify-center items-center gap-2 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Xác nhận
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PutWalletWithdraw;
