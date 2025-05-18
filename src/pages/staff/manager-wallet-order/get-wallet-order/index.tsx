// ManagerWalletOrderByStaff.tsx

"use client";

import React, { useEffect, useState } from "react";
import StaffService from "@/services/StaffService";
import { toast } from "sonner";

interface WalletOrder {
  id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
}

interface Props {
  page?: number;
  size?: number;
}

const ManagerWalletOrderByStaff: React.FC<Props> = ({

  page = 1,
  size = 10,
}) => {
  const [orders, setOrders] = useState<WalletOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const { getWalletOrderByStaff } = StaffService();

  useEffect(() => {
    const fetchWalletOrders = async () => {
      setLoading(true);
      try {
        const res = await getWalletOrderByStaff({
          page,
          size,
        });

        if (res?.data?.items) {
          setOrders(res.data.items);
        } else {
          toast.error("Không tìm thấy đơn ví nào.");
        }
      } catch (err) {
        toast.error("Lỗi khi tải dữ liệu đơn ví.");
      } finally {
        setLoading(false);
      }
    };

    fetchWalletOrders();
  }, [page, size]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        Danh sách đơn ví từ Wallet ID
      </h2>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : orders.length === 0 ? (
        <p>Không có đơn ví nào.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Mã đơn</th>
                <th className="py-2 px-4 border-b">Số tiền</th>
                <th className="py-2 px-4 border-b">Phương thức</th>
                <th className="py-2 px-4 border-b">Trạng thái</th>
                <th className="py-2 px-4 border-b">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="py-2 px-4 border-b">{order.id}</td>
                  <td className="py-2 px-4 border-b">
                    {order.amount.toLocaleString()}₫
                  </td>
                  <td className="py-2 px-4 border-b">{order.method}</td>
                  <td className="py-2 px-4 border-b">{order.status}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagerWalletOrderByStaff;
