import { SenderInfo } from "../../molecules/delivery/sender-info";
import { ReceiverInfo } from "../../molecules/delivery/receiver-info";
import { ProductInfo } from "../../molecules/delivery/product-info";
import { PricingSidebar } from "../../molecules/delivery/pricing-sidebar";

export function ShippingForm() {
  return (
    <div className="max-w-7xl mx-auto p-0">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Form Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="border-t-4 border-orange-500 bg-white rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-0">
              <SenderInfo />
              <ReceiverInfo />
            </div>
          </div>

          <ProductInfo />
        </div>

        {/* Pricing Sidebar */}
        <div className="lg:col-span-1">
          <PricingSidebar />
        </div>
      </div>
    </div>
  );
}
