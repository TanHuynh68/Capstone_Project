"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import StaffService from "@/services/StaffService";
import { Check, FileImage, Loader2, Upload, X } from "lucide-react";

interface Props {
  walletOrderID: string;
  onSuccess?: () => void;
  onClose?: () => void;
  responseData?: {
    vietQrLink?: string;
    sepayQrLink?: string;
    balance?: number;
    fullName?: string;
    amount?: number;
  };
  qrImage?: string | null;
  qrLinks?: {
    vietQrLink: string;
    sepayQrLink: string;
  } | null;
}

// Component phụ trợ
const InputField = ({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-3 py-2 border rounded text-sm border-gray-200 focus:ring-1 focus:ring-blue-500 outline-none"
    />
  </div>
);

const RadioGroup = ({
  label,
  options,
  value,
  onChange,
  disabled,
}: {
  label: string;
  options: {
    value: string;
    label: string;
    icon: React.ElementType;
    color: string;
  }[];
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    <div className="flex gap-2">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isSelected = value === opt.value;
        return (
          <label
            key={opt.value}
            className={`flex-1 flex items-center gap-1.5 px-3 py-2 border rounded text-sm cursor-pointer
              ${
                isSelected
                  ? `border-${opt.color}-500 bg-${opt.color}-50/50 text-${opt.color}-700`
                  : "border-gray-200 hover:border-gray-300"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              type="radio"
              name="orderStatus"
              value={opt.value}
              checked={isSelected}
              onChange={() => onChange(opt.value)}
              className="sr-only"
              disabled={disabled}
            />
            <Icon
              className={`w-4 h-4 ${
                isSelected ? `text-${opt.color}-500` : "text-gray-400"
              }`}
            />
            <span>{opt.label}</span>
          </label>
        );
      })}
    </div>
  </div>
);

const PutWalletWithdraw: React.FC<Props> = ({
  walletOrderID,
  onSuccess,
  onClose,
  responseData,
}) => {
  const [note, setNote] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [orderStatus, setOrderStatus] = useState("1");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [disableStatusChange, setDisableStatusChange] = useState(false);

  const { putWalletWithdrawByStaff } = StaffService();

  useEffect(() => {
    if (responseData) {
      const { vietQrLink, sepayQrLink, balance } = responseData;
      if (!vietQrLink && !sepayQrLink) {
        setOrderStatus("3");
        setDisableStatusChange(true);
      }
      setBalance(balance ?? null);
    }
  }, [responseData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | File) => {
    const file = e instanceof File ? e : e.target.files?.[0];
    if (file && file.size <= 1024 * 1024) {
      setFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      alert("File quá lớn hoặc không hợp lệ!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) return toast.error("Vui lòng chọn ảnh xác nhận.");
    if (file.size > 1024 * 1024) return toast.error("Ảnh vượt quá 1MB.");
    if (!/\.(jpg|jpeg|png)$/i.test(file.name))
      return toast.error("Ảnh phải là .jpg, .jpeg hoặc .png");

    const formData = new FormData();
    formData.append("WalletOrderID", walletOrderID);
    formData.append("OrderStatus", orderStatus);
    formData.append("Note", note);
    formData.append("WithdrawImageFile", file);

    setLoading(true);
    try {
      const res = await putWalletWithdrawByStaff(formData);
      if (res?.isSuccess) {
        toast.success("Đã cập nhật đơn rút.");
        onSuccess?.();
      } else {
        toast.error("Không thể cập nhật đơn rút.");
      }
    } catch {
      toast.error("Lỗi khi cập nhật đơn rút.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          Xác nhận rút tiền
        </h2>
        <span className="text-sm text-gray-500">Mã đơn: {walletOrderID}</span>
      </div>

      <div className="space-y-2 text-sm bg-gray-50 border rounded p-3">
        {responseData?.fullName && (
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Người rút</span>
            <span className="text-gray-900 font-medium">
              {responseData.fullName}
            </span>
          </div>
        )}

        {responseData?.amount !== undefined && (
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Số tiền rút</span>
            <span className="text-blue-600 font-semibold">
              {responseData.amount.toLocaleString("vi-VN")} đ
            </span>
          </div>
        )}

        {typeof balance === "number" && (
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Số dư hiện tại</span>
            <span
              className={`font-semibold ${
                balance < (responseData?.amount ?? 0)
                  ? "text-red-600"
                  : "text-green-600"
              }`}
            >
              {balance.toLocaleString("vi-VN")} đ
            </span>
          </div>
        )}
      </div>

      {/* {disableStatusChange && (
        <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded">
          Số dư ví không đủ. Chỉ có thể chọn trạng thái <strong>Hủy</strong>.
        </div>
      )} */}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Trạng thái chọn */}
        <RadioGroup
          label="Trạng thái đơn"
          options={[
            {
              value: "1",
              label: "Thành công",
              icon: Check,
              color: "green",
            },
            {
              value: "3",
              label: "Hủy",
              icon: X,
              color: "red",
            },
          ]}
          value={orderStatus}
          onChange={setOrderStatus}
          disabled={disableStatusChange}
        />

        {/* Ghi chú */}
        <InputField
          label="Ghi chú"
          value={note}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNote(e.target.value)
          }
          placeholder="Nhập ghi chú về giao dịch"
          required
        />

        {/* Upload ảnh */}
        <FileUpload
          previewUrl={previewUrl}
          fileName={file?.name}
          onClear={() => {
            setFile(null);
            setPreviewUrl(null);
          }}
          onFileChange={handleFileChange}
        />

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 border rounded text-gray-700 hover:bg-gray-50 text-sm"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 bg-blue-600 text-white rounded text-sm flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PutWalletWithdraw;

const FileUpload = ({
  previewUrl,
  fileName,
  onClear,
  onFileChange,
}: {
  previewUrl: string | null;
  fileName?: string;
  onClear: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement> | File) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileChange(file); // 👈 Gọi file trực tiếp
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Ảnh xác nhận rút tiền
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border rounded p-3 border-dashed transition-colors ${
          previewUrl
            ? "border-blue-400 bg-blue-50"
            : isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {previewUrl ? (
          <div className="space-y-2">
            <div className="relative aspect-video w-full rounded overflow-hidden bg-gray-100">
              <img
                src={previewUrl}
                alt="Preview"
                className="object-contain w-full h-full"
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="truncate max-w-[200px] text-gray-500">
                {fileName}
              </span>
              <button
                type="button"
                onClick={onClear}
                className="text-red-600 hover:text-red-700"
              >
                Xóa ảnh
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center py-3 cursor-pointer">
            <FileImage className="h-8 w-8 text-gray-400 mb-1.5" />
            <span className="text-sm text-gray-600">
              Kéo & thả hoặc nhấn để chọn ảnh
            </span>
            <span className="text-xs text-gray-400 mt-0.5">
              Chỉ .jpg, .jpeg, .png dưới 1MB
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => onFileChange(e)}
              className="sr-only"
            />
          </label>
        )}
      </div>
    </div>
  );
};
