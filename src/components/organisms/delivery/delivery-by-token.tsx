"use client";

import type React from "react";
import { useEffect, useState, useMemo } from "react";
import { DeliveryListTemplate } from "@/components/templates/delivery/delivery-list-template";
import DeliveryService from "@/services/DeliveryService";

// Mock DeliveryService since we don't have the actual service
// const mockDeliveryService = () => ({
//   getDeliveryByToken: async ({
//     page,
//     size,
//   }: {
//     page: number;
//     size: number;
//   }) => {
//     // Simulate API delay
//     await new Promise((resolve) => setTimeout(resolve, 1000));

//     // Mock data
//     const mockDeliveries = Array.from({ length: size }, (_, index) => ({
//       deliveryID: `DLV${String(page * size + index + 1).padStart(6, "0")}`,
//       orderID: `ORD${String(page * size + index + 1).padStart(6, "0")}`,
//       senderName: `Người gửi ${page * size + index + 1}`,
//       receiverName: `Người nhận ${page * size + index + 1}`,
//       orderCode: `CODE${String(page * size + index + 1).padStart(4, "0")}`,
//       deliveryPrice: Math.floor(Math.random() * 100000) + 20000,
//       note:
//         index % 3 === 0
//           ? `Ghi chú cho đơn hàng ${page * size + index + 1}`
//           : "",
//       deliveryStatus: ["Picked", "Delivering", "Delivered", "Cancelled"][
//         Math.floor(Math.random() * 4)
//       ],
//       createdAt: new Date(
//         Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
//       ).toISOString(),
//       deliveredAt:
//         Math.random() > 0.5
//           ? new Date(
//               Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
//             ).toISOString()
//           : null,
//     }));

//     return {
//       responseRequestModel: {
//         responseList: {
//           items: mockDeliveries,
//         },
//       },
//     };
//   },
// });

// interface DeliveryByTokenProps {
//   // page: number;
// }

export interface DeliveryItem {
  deliveryID: string;
  orderID: string;
  senderName: string;
  receiverName: string;
  orderCode: string;
  deliveryPrice: number;
  note: string;
  deliveryStatus: string;
  createdAt: string;
  deliveredAt: string | null;
  isConfirm?: boolean | null;
}

const DeliveryByToken: React.FC = () => {
  const { getDeliveryByToken } = DeliveryService();
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchDeliveries = async (page = pageIndex, size = pageSize) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDeliveryByToken({ page: page + 1, size });
      console.log(response, "sdasdsadsa");
      setDeliveries(response?.responseRequestModel?.responseList?.items || []);
      setTotalPages(
        response?.responseRequestModel?.responseList?.totalPages || 5
      );
    } catch {
      setError("Đã xảy ra lỗi khi lấy thông tin giao hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries(pageIndex, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize]);

  const filteredDeliveries = useMemo(() => {
    return deliveries.filter((delivery) => {
      const searchLower = searchValue.toLowerCase();

      // Search across all relevant fields
      const matchesSearch =
        delivery.deliveryID.toLowerCase().includes(searchLower) ||
        delivery.orderID.toLowerCase().includes(searchLower) ||
        delivery.orderCode.toLowerCase().includes(searchLower) ||
        delivery.senderName.toLowerCase().includes(searchLower) ||
        delivery.receiverName.toLowerCase().includes(searchLower) ||
        delivery.note.toLowerCase().includes(searchLower) ||
        delivery.deliveryPrice.toString().includes(searchLower) ||
        new Date(delivery.createdAt)
          .toLocaleDateString("vi-VN")
          .includes(searchLower) ||
        (delivery.deliveredAt &&
          new Date(delivery.deliveredAt)
            .toLocaleDateString("vi-VN")
            .includes(searchLower));

      // Status filtering with case-insensitive matching
      const matchesStatus =
        statusFilter === "all" ||
        delivery.deliveryStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [deliveries, searchValue, statusFilter]);

  // const handleViewDetails = (delivery: DeliveryItem) => {
  //   // Implement view details logic here
  //   console.log("View details for:", delivery);
  // };

  return (
    <>
      <DeliveryListTemplate
        title={`Danh sách giao hàng`}
        deliveries={filteredDeliveries}
        loading={loading}
        error={error}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={() => fetchDeliveries(pageIndex, pageSize)}
        // onViewDetails={handleViewDetails}
        totalCount={filteredDeliveries.length}
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={totalPages}
        onPageChange={setPageIndex}
        onPageSizeChange={setPageSize}
      />
    </>
  );
};

export default DeliveryByToken;
