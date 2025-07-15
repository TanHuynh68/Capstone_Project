import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Package, PackagePlus } from "lucide-react";
import { ShippingForm } from "./shipping-form";
import { Order } from "@/types/order";

interface ShippingFormDialogProps {
  orderID?: string;
  order?: Order;
  onSuccess?: () => void;
  onOrderCreated?: () => void;
}

export function ShippingFormDialog({
  orderID,
  order,
  onSuccess,
  onOrderCreated,
}: ShippingFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentOrderID, setCurrentOrderID] = useState<string | undefined>(
    undefined
  );
  const [currentOrder, setCurrentOrder] = useState<Order | undefined>(
    undefined
  );

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setCurrentOrderID(orderID);
      setCurrentOrder(order);
    }
  };

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  const handleOrderCreated = () => {
    setOpen(false);
    onSuccess?.();
    onOrderCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <PackagePlus className="h-4 w-4 mr-2" />
          Tạo đơn hàng
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[98vw] w-[98vw] min-w-[1400px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Package className="h-5 w-5" />
            Tạo đơn giao hàng
          </DialogTitle>
        </DialogHeader>
        <div>
          <ShippingForm
            orderID={currentOrderID}
            order={currentOrder}
            onSuccess={handleSuccess}
            onOrderCreated={handleOrderCreated}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
