"use client";

import React, { useEffect, useState } from "react";
import StaffService from "@/services/StaffService";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import PutWalletWithdraw from "../put-wallet-withdraw";
import { RefreshCw, Download } from "lucide-react";

interface WalletOrder {
  walletOrderID: string;
  walletID: string;
  amount: number;
  fullName: string;
  orderStatusDisplay: string;
  description: string;
  orderDate: string;
  walletOrderImage: string | null;
  walletOrderNote: string | null;
}

interface Props {
  walletID?: string;
}

const ManagerWalletOrderByStaff: React.FC<Props> = ({ walletID }) => {
  const [orders, setOrders] = useState<WalletOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [orderType, setOrderType] = useState<number | undefined>(undefined);
  const [transactionStatusEnum, setTransactionStatusEnum] = useState<
    number | undefined
  >(undefined);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [qrLinks, setQrLinks] = useState<{
    vietQrLink: string;
    sepayQrLink: string;
  } | null>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);

  const { getWalletOrderByStaff, getQRWithdrawByStaff } = StaffService();

  const transactionStatuses = [
    { value: 0, label: "Chờ duyệt" },
    { value: 1, label: "Hoàn tất" },
    { value: 2, label: "Thất bại" },
    { value: 3, label: "Đã hủy" },
    { value: 4, label: "Đang xử lý" },
  ];

  const transactionStatusLabelMap: Record<string, string> = {
    Pending: "Chờ duyệt",
    Completed: "Hoàn tất",
    Failed: "Thất bại",
    Canceled: "Đã hủy",
    InProcess: "Đang xử lý",
  };

  const statusColorMap: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-400",
    Completed: "bg-green-100 text-green-700 border-green-400",
    Failed: "bg-red-100 text-red-700 border-red-400",
    Canceled: "bg-gray-100 text-gray-700 border-gray-400",
    InProcess: "bg-blue-100 text-blue-700 border-blue-400",
  };

  const handleResetFilters = () => {
    setOrderType(undefined);
    setTransactionStatusEnum(undefined);
    setPage(1);
  };

  const fetchWalletOrders = async () => {
    setLoading(true);
    try {
      const res = await getWalletOrderByStaff({
        walletID,
        page,
        size,
        orderType,
        transactionStatusEnum,
      });
      const items = res?.responseRequestModel?.responseList?.items;
      const total = res?.responseRequestModel?.responseList?.totalPages;
      if (items && Array.isArray(items)) {
        setOrders(items);
        setTotalPages(total || 1);
      } else {
        setOrders([]);
        toast.error("Không tìm thấy đơn ví nào.");
      }
    } catch (err) {
      toast.error("Lỗi khi tải dữ liệu đơn ví.");
    } finally {
      setLoading(false);
    }
  };

  const handleShowWithdraw = async (walletOrderID: string) => {
    try {
      const res = await getQRWithdrawByStaff({ walletOrderID });
      const links = res?.responseRequestModel;
      if (links?.vietQrLink && links?.sepayQrLink) {
        setQrLinks({
          vietQrLink: links.vietQrLink,
          sepayQrLink: links.sepayQrLink,
        });
        setQrImage(links.vietQrLink);
        setSelectedOrderId(walletOrderID);
      } else {
        // toast.error("Không lấy được QR chuyển khoản");
      }
    } catch (_) {
      toast.error("Có lỗi xảy ra khi gọi API QR.");
    }
  };

  useEffect(() => {
    fetchWalletOrders();
  }, [walletID, page, size, orderType, transactionStatusEnum]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Danh sách đơn ví {walletID ? `của ví ${walletID}` : "(tất cả ví)"}
      </h2>

      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <select
          value={orderType ?? ""}
          onChange={(e) => {
            setOrderType(
              e.target.value === "" ? undefined : Number(e.target.value)
            );
            setPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">Tất cả giao dịch</option>
          <option value="0">Nạp tiền</option>
          <option value="1">Rút tiền</option>
        </select>

        <select
          value={transactionStatusEnum ?? ""}
          onChange={(e) => {
            setTransactionStatusEnum(
              e.target.value === "" ? undefined : Number(e.target.value)
            );
            setPage(1);
          }}
          className="border px-3 py-2 rounded"
        >
          <option value="">Tất cả trạng thái</option>
          {transactionStatuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleResetFilters}
          className="bg-gray-100 border border-gray-300 px-4 py-2 rounded hover:bg-gray-200"
        >
          Làm mới bộ lọc
        </button>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : orders.length === 0 ? (
        <p>Không có đơn ví nào.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">Mã đơn</th>
                  <th className="py-2 px-4 border-b">Họ tên</th>
                  <th className="py-2 px-4 border-b">Mô tả</th>
                  <th className="py-2 px-4 border-b">Số tiền</th>
                  <th className="py-2 px-4 border-b">Trạng thái</th>
                  <th className="py-2 px-4 border-b">Ngày tạo</th>
                  <th className="py-2 px-4 border-b">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.walletOrderID}>
                    <td className="py-2 px-4 border-b">
                      {order.walletOrderID}
                    </td>
                    <td className="py-2 px-4 border-b">{order.fullName}</td>
                    <td className="py-2 px-4 border-b">{order.description}</td>
                    <td className="py-2 px-4 border-b">
                      {order.amount.toLocaleString()}₫
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded border font-medium ${
                          statusColorMap[order.orderStatusDisplay] || ""
                        }`}
                      >
                        {transactionStatusLabelMap[order.orderStatusDisplay] ||
                          order.orderStatusDisplay}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(order.orderDate).toLocaleString("vi-VN")}
                    </td>
                    <td className="py-2 px-4 border-b space-y-2">
                      {(transactionStatusEnum === 1 ||
                        transactionStatusEnum === 3) &&
                        order.orderStatusDisplay === "Pending" && (
                          <button
                            onClick={() =>
                              handleShowWithdraw(order.walletOrderID)
                            }
                            className="text-sm text-red-600 hover:underline"
                          >
                            Hoàn tiền
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Dialog
            open={!!selectedOrderId}
            onOpenChange={() => setSelectedOrderId(null)}
          >
            <DialogContent className="w-full max-w-[95vw] sm:max-w-[900px] p-0 overflow-hidden rounded-xl">
              {selectedOrderId && qrLinks && (
                <div className="flex flex-col md:flex-row">
                  {/* QR Code Section */}
                  <div className="flex flex-col items-center justify-center bg-white p-6 md:p-8 md:w-2/5 border-b md:border-b-0 md:border-r border-gray-200">
                    <div className="w-full max-w-xs">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Mã QR hoàn tiền
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            qrImage === qrLinks.vietQrLink
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {qrImage === qrLinks.vietQrLink
                            ? "VietQR"
                            : "SePay QR"}
                        </span>
                      </div>

                      <div className="relative mb-6">
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-2 shadow-sm">
                          <img
                            src={qrImage ?? ""}
                            alt="QR Code"
                            className="h-full w-full object-contain"
                            onError={() => {
                              if (
                                qrLinks?.sepayQrLink &&
                                qrImage !== qrLinks.sepayQrLink
                              ) {
                                setQrImage(qrLinks.sepayQrLink);
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex w-full gap-3">
                        <button
                          onClick={() => {
                            // Toggle between VietQR and SePay QR
                            setQrImage(
                              qrImage === qrLinks.vietQrLink
                                ? qrLinks.sepayQrLink
                                : qrLinks.vietQrLink
                            );
                          }}
                          className="flex-1 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          {qrImage === qrLinks.vietQrLink
                            ? "SePay QR"
                            : "VietQR"}
                        </button>

                        <button
                          onClick={() => {
                            if (qrImage) {
                              // Create a temporary anchor element
                              const a = document.createElement("a");
                              a.href = qrImage;
                              a.download = "qr-code.png";
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }
                          }}
                          className="flex-1 flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Tải xuống
                        </button>
                      </div>

                      <div className="mt-6 rounded-lg bg-blue-50 p-4 border border-blue-100">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">
                          Hướng dẫn
                        </h4>
                        <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                          <li>Quét mã QR bằng ứng dụng ngân hàng</li>
                          <li>Xác nhận thông tin giao dịch</li>
                          <li>Hoàn tất giao dịch</li>
                          <li>Xác nhận hoàn tiền ở mục bên phải</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* Refund Information Section */}
                  <div className="bg-gray-50 p-6 md:p-8 md:w-3/5">
                    <div className="max-w-lg mx-auto">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                          Thông tin hoàn tiền
                        </h2>
                        <div className="text-sm text-gray-500">
                          Mã đơn: {selectedOrderId}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
                          <div className="text-xs text-gray-500 mb-1">
                            Loại QR
                          </div>
                          <div className="font-medium text-gray-900">
                            {qrImage === qrLinks.vietQrLink
                              ? "VietQR"
                              : "SePay QR"}
                          </div>
                        </div>

                        <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100">
                          <div className="text-xs text-gray-500 mb-1">
                            Trạng thái
                          </div>
                          <div className="font-medium">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              Chờ xác nhận
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Form xác nhận */}
                      <div className="border-t border-gray-200 pt-6">
                        <PutWalletWithdraw
                          walletOrderID={selectedOrderId}
                          onSuccess={() => {
                            fetchWalletOrders();
                            setSelectedOrderId(null);
                          }}
                          onClose={() => setSelectedOrderId(null)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <div className="flex justify-center mt-4 gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Trang trước
            </button>
            <span className="self-center">
              Trang {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Trang sau
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagerWalletOrderByStaff;
