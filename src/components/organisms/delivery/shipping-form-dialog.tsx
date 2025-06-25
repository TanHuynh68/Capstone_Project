import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";
import { ShippingForm } from "./shipping-form";

interface ShippingFormDialogProps {
  onSuccess?: () => void;
}

export function ShippingFormDialog({ onSuccess }: ShippingFormDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tạo đơn hàng mới
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[98vw] w-[98vw] min-w-[1400px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Tạo đơn hàng giao hàng mới
          </DialogTitle>
        </DialogHeader>
        <div className="">
          <ShippingForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
