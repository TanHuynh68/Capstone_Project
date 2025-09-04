"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { Delivery } from "@/types/delivery";
import DeliveryFilters from "@/components/molecules/staff/manage-users/manage-deliveries/DeliveryFilters";
import DeliveryGrid from "@/components/organisms/staff/manage-users/manage-deliveries/DeliveryGrid";
import DeliveryService from "@/services/DeliveryService";

export default function StaffDeliveriesPage() {
  const { accountID } = useParams<{ accountID: string }>();
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt_desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDeliveries, setTotalDeliveries] = useState(0);
  const { staffGetUserDelivery } = DeliveryService();

  const fetchDeliveries = async () => {
    if (!accountID) return;

    setIsLoading(true);
    try {
      const params = {
        page: 1, // API uses 0-based pagination
        size: 100,
        accountID,
        ...(statusFilter !== "all" && {
          deliveryStatus: Number.parseInt(statusFilter),
        }),
      };

      const response = await staffGetUserDelivery(params);

      if (response && response.responseRequestModel?.responseList.items) {
        const {
          items,
          totalPages: pages,
          totalItems,
          currentPage: current,
        } = response.responseRequestModel.responseList;
        setDeliveries(items || []);
        setTotalPages(pages || 1);
        setTotalDeliveries(totalItems || 0);
        setCurrentPage(current + 1); // Convert back to 1-based
        // Get user name from first delivery if available
        if (items && items.length > 0) {
          setUserName(items[0].customerName || items[0].designerName || "");
        }
      } else {
        setDeliveries([]);
      }
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setDeliveries([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [accountID, statusFilter]);

  // Filter deliveries locally for search and sort
  const filteredDeliveries = deliveries
    .filter((delivery) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        delivery.deliveryID?.toLowerCase().includes(searchLower) ||
        delivery.orderID?.toLowerCase().includes(searchLower) ||
        delivery.recipientName?.toLowerCase().includes(searchLower) ||
        delivery.trackingNumber?.toLowerCase().includes(searchLower) ||
        delivery.shippingAddress?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "createdAt_desc":
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        case "createdAt_asc":
          return (
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
          );
        case "estimatedDeliveryDate_asc":
          return (
            new Date(a.estimatedDeliveryDate || 0).getTime() -
            new Date(b.estimatedDeliveryDate || 0).getTime()
          );
        case "deliveryFee_desc":
          return (b.deliveryFee || 0) - (a.deliveryFee || 0);
        case "deliveryFee_asc":
          return (a.deliveryFee || 0) - (b.deliveryFee || 0);
        default:
          return 0;
      }
    });

  const handleViewDelivery = (deliveryID: string) => {
    console.log("Viewing delivery:", deliveryID);
  };

  const handleBackToUserManagement = () => {
    navigate(-1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("createdAt_desc");
    setCurrentPage(1);
  };

  if (!accountID) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy thông tin người dùng
          </h2>
          <p className="text-gray-600 mb-4">Vui lòng quay lại và thử lại.</p>
          <Button onClick={handleBackToUserManagement}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const stats = {
    total: totalDeliveries,
    delivered: deliveries.filter((d) => d.deliveryStatus === 'Delivered').length,
    delivering: deliveries.filter((d) => ['Delivering', 'MoneyCollectDelivering'].includes(d.deliveryStatus))
      .length,
    pending: deliveries.filter((d) => ['ReadyToPick', 'Picking', 'MoneyCollectPicking', 'Picked'].includes(d.deliveryStatus))
      .length,
    failed: deliveries.filter((d) => ['DeliveryFail', 'OutForDeliveryFail'].includes(d.deliveryStatus))
      .length,
    returned: deliveries.filter((d) => ['WaitingToReturn', 'Returning', 'Returned'].includes(d.deliveryStatus))
      .length,

  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Card className="flex-1">
          <CardHeader className="">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              Giao hàng của {userName || "người dùng"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-500">Tổng giao hàng</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-green-600">
            {stats.delivered}
          </div>
          <div className="text-sm text-gray-500">Đã giao</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-blue-600">
            {stats.delivering}
          </div>
          <div className="text-sm text-gray-500">Đang giao</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.pending}
          </div>
          <div className="text-sm text-gray-500">Chờ xử lý</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          <div className="text-sm text-gray-500">Thất bại</div>
        </div>
        {/* <div className="bg-white p-4 rounded-lg border">
          <div className="text-2xl font-bold text-purple-600">
            {new Intl.NumberFormat("vi-VN", {
              notation: "compact",
              compactDisplay: "short",
            }).format(stats.totalFee)}
          </div>
          <div className="text-sm text-gray-500">Tổng phí</div>
        </div> */}
      </div>

      {/* Filters */}
      <DeliveryFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onClearFilters={handleClearFilters}
        userName={userName}
        accountID={accountID}
        totalDeliveries={totalDeliveries}
        isLoading={isLoading}
        onRefresh={() => fetchDeliveries()}
      />

      {/* Results Count */}
      <div className="flex items-center justify-between mb-6 mt-6">
        <p className="text-gray-600">
          Hiển thị {filteredDeliveries.length} / {totalDeliveries} giao hàng
        </p>
      </div>

      {/* Deliveries Grid */}
      <DeliveryGrid
        deliveries={filteredDeliveries}
        loading={isLoading}
        onView={handleViewDelivery}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDeliveries()}
            disabled={currentPage <= 1}
          >
            Trước
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => fetchDeliveries()}
              >
                {page}
              </Button>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDeliveries()}
            disabled={currentPage >= totalPages}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}
