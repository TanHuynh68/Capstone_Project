"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowUpDown, Eye } from "lucide-react";
import { StatusBadge } from "@/components/atoms/delivery/status-badge";
// import { DeliveryId } from "@/components/atoms/delivery/delivery-id";
import { DeliveryDetailModal } from "@/components/molecules/getdelivery/delivery-detail-modal";
import { HighlightText } from "@/components/utils/highlight-text";
import type { DeliveryItem } from "@/components/organisms/delivery/delivery-by-token";

interface DeliveryTableProps {
  deliveries: DeliveryItem[];
  onViewDetails?: (delivery: DeliveryItem) => void;
  searchTerm?: string;
}

export const DeliveryTable: React.FC<DeliveryTableProps> = ({
  deliveries,
  onViewDetails,
  searchTerm = "",
}) => {
  const [sortField, setSortField] = useState<keyof DeliveryItem | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItem | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSort = (field: keyof DeliveryItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleViewDetails = (delivery: DeliveryItem) => {
    setSelectedDelivery(delivery);
    setIsModalOpen(true);
    onViewDetails?.(delivery);
  };

  const sortedDeliveries = [...deliveries].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    // Handle null values
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <>
      <TooltipProvider>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {/* <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("deliveryID")}
                  >
                    Mã giao hàng <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button variant="ghost" onClick={() => handleSort("orderID")}>
                    Mã đơn hàng <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead> */}
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("orderCode")}
                  >
                    Mã đơn <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("senderName")}
                  >
                    Người gửi <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("receiverName")}
                  >
                    Người nhận <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("deliveryPrice")}
                  >
                    Phí giao hàng <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("deliveryStatus")}
                  >
                    Trạng thái <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">Ghi chú</TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("createdAt")}
                  >
                    Ngày tạo <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => handleSort("deliveredAt")}
                  >
                    Ngày giao <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDeliveries.map((delivery) => (
                <TableRow key={delivery.deliveryID}>
                  {/* <TableCell className="text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="max-w-24 truncate cursor-help">
                          <DeliveryId id={delivery.deliveryID} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{delivery.deliveryID}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="max-w-24 truncate cursor-help">
                          <code className="px-2 py-1 bg-muted rounded text-sm">
                            <HighlightText
                              text={delivery.orderID}
                              searchTerm={searchTerm}
                              className="px-2 py-1 bg-muted rounded text-sm"
                            />
                          </code>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{delivery.orderID}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell> */}
                  <TableCell className="text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="max-w-24 truncate cursor-help">
                          <code className="px-2 py-1 bg-muted rounded text-sm">
                            <HighlightText
                              text={delivery.orderCode}
                              searchTerm={searchTerm}
                              className="px-2 py-1 bg-muted rounded text-sm"
                            />
                          </code>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{delivery.orderCode}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-medium text-foreground">
                      <HighlightText
                        text={delivery.senderName}
                        searchTerm={searchTerm}
                        className="font-medium text-foreground"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-medium text-foreground">
                      <HighlightText
                        text={delivery.receiverName}
                        searchTerm={searchTerm}
                        className="font-medium text-foreground"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-semibold text-green-600 dark:text-green-400">
                      <HighlightText
                        text={new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(delivery.deliveryPrice)}
                        searchTerm={searchTerm}
                        className="font-semibold text-green-600 dark:text-green-400"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={delivery.deliveryStatus} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-sm text-muted-foreground max-w-32 truncate cursor-help">
                          <HighlightText
                            text={delivery.note || "-"}
                            searchTerm={searchTerm}
                            className="text-sm text-muted-foreground"
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{delivery.note || "Không có ghi chú"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="text-sm text-foreground">
                      <HighlightText
                        text={new Date(delivery.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                        searchTerm={searchTerm}
                        className="text-sm text-foreground"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="text-sm text-foreground">
                      <HighlightText
                        text={
                          delivery.deliveredAt
                            ? new Date(delivery.deliveredAt).toLocaleDateString(
                                "vi-VN"
                              )
                            : "-"
                        }
                        searchTerm={searchTerm}
                        className="text-sm text-foreground"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(delivery)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TooltipProvider>

      {/* Delivery Detail Modal */}
      {selectedDelivery && (
        <DeliveryDetailModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDelivery(null);
          }}
          deliveryID={selectedDelivery.deliveryID}
        />
      )}
    </>
  );
};
