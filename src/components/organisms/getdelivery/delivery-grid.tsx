import React from "react";
import { DeliveryCard } from "@/components/molecules/getdelivery/delivery-card";
import type { DeliveryItem } from "@/components/organisms/delivery/delivery-by-token";
import { Package } from "lucide-react";

interface DeliveryGridProps {
  deliveries: DeliveryItem[];
  onViewDetails?: (delivery: DeliveryItem) => void;
  searchTerm?: string;
}

export const DeliveryGrid: React.FC<DeliveryGridProps> = ({
  deliveries,
  onViewDetails,
  searchTerm = "",
}) => {
  if (deliveries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Không có đơn giao hàng nào</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {deliveries.map((delivery) => (
          <DeliveryCard
            key={delivery.deliveryID}
            delivery={delivery}
            onViewDetails={onViewDetails}
            searchTerm={searchTerm}
          />
        ))}
      </div>
    </>
  );
};
