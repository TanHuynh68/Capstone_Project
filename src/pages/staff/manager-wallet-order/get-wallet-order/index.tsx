"use client";

import React, { useEffect, useState } from "react";
import StaffService from "@/services/StaffService";
import { toast } from "sonner";

interface WalletOrder {
  walletOrderID: string;
  walletID: string;
  amount: number;
  orderStatusDisplay: string;
  description: string;
  orderDate: string;
  walletOrderImage: string | null;
  walletOrderNote: string | null;
}

interface Props {
  walletID?: string; // có thể undefined
}

const ManagerWalletOrderByStaff: React.FC<Props> = ({ walletID }) => {
  const [orders, setOrders] = useState<WalletOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [orderType, setOrderType] = useState<number | undefined>(undefined); // 0 - nạp, 1 - rút
  const [transactionStatusEnum, setTransactionStatusEnum] = useState<
    number | undefined
  >(undefined); // 0 - 5 



  const { getWalletOrderByStaff } = StaffService();

  const transactionStatuses = [
    { value: 0, label: "Chờ duyệt" }, // Pending
    { value: 1, label: "Hoàn tất" }, // Completed
    { value: 2, label: "Thất bại" }, // Failed
    { value: 3, label: "Đã hủy" }, // Canceled
    { value: 4, label: "Đang xử lý" }, // InProcess
  ];


  useEffect(() => {
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

        console.log(res, "res");

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

    fetchWalletOrders();
  }, [
    walletID,
    page,
    size,
    orderType,
    transactionStatusEnum,
    getWalletOrderByStaff,
  ]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Danh sách đơn ví {walletID ? `của ví ${walletID}` : "(tất cả ví)"}
      </h2>

      {/* Bộ lọc */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={orderType ?? ""}
          onChange={(e) =>
            setOrderType(
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
          className="border px-3 py-2 rounded"
        >
          <option value="">Tất cả loại giao dịch</option>
          <option value="0">Nạp tiền</option>
          <option value="1">Rút tiền</option>
        </select>

        <select
          value={transactionStatusEnum ?? ""}
          onChange={(e) =>
            setTransactionStatusEnum(
              e.target.value === "" ? undefined : Number(e.target.value)
            )
          }
          className="border px-3 py-2 rounded"
        >
          <option value="">Tất cả trạng thái</option>
          {transactionStatuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
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
                  <th className="py-2 px-4 border-b">Mô tả</th>
                  <th className="py-2 px-4 border-b">Số tiền</th>
                  <th className="py-2 px-4 border-b">Trạng thái</th>
                  <th className="py-2 px-4 border-b">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.walletOrderID}>
                    <td className="py-2 px-4 border-b">
                      {order.walletOrderID}
                    </td>
                    <td className="py-2 px-4 border-b">{order.description}</td>
                    <td className="py-2 px-4 border-b">
                      {order.amount.toLocaleString()}₫
                    </td>
                    <td className="py-2 px-4 border-b">
                      {order.orderStatusDisplay}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {new Date(order.orderDate).toLocaleString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
