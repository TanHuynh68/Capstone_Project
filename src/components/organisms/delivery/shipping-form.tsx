import { useState } from "react";
import { SenderInfo } from "../../molecules/delivery/sender-info";
// import { ReceiverInfo } from "../../molecules/delivery/receiver-info";
import { ProductInfo } from "../../molecules/delivery/product-info";
import { PricingSidebar } from "../../molecules/delivery/pricing-sidebar";
import DeliveryService from "@/services/DeliveryService";
import { validateShippingForm, validateField } from "@/schemas/shippingSchema";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Order } from "@/types/order";
import { ReceiverInfoAutofill } from "@/components/molecules/delivery/receiver-info-autofill";

interface ShippingFormProps {
  onSuccess?: () => void;
  orderID?: string;
  order?: Order;
  onOrderCreated?: () => void;
}

export function ShippingForm({
  onSuccess,
  orderID,
  order,
  onOrderCreated,
}: ShippingFormProps) {
  const [sender, setSender] = useState<Record<string, unknown>>({});
  const [receiver, setReceiver] = useState<Record<string, unknown>>({});
  const [product, setProduct] = useState<Record<string, unknown>>({});
  const [pickShift, setPickShift] = useState<{
    pickShiftId?: number;
    pickShiftTitle?: string;
  }>({});
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { createDelivery } = DeliveryService();
  const currentUserId = useSelector((state: RootState) => state.user.id);
  let receiverAccountId = undefined;
  if (order) {
    if (order.customerID !== currentUserId)
      receiverAccountId = order.customerID;
    else if (order.designerID !== currentUserId)
      receiverAccountId = order.designerID;
  }

  // Validate dữ liệu form using Zod schema
  const validate = () => {
    const formData = {
      ...sender,
      ...receiver,
      ...product,
      pickShift,
      shippingFee,
      orderID,
    };

    const result = validateShippingForm(formData);
    setErrors(result.errors);
    return result.success;
  };

  // Validate individual field and update errors
  const validateSingleField = (fieldName: string, value: unknown) => {
    const result = validateField(fieldName, value);
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      if (result.success) {
        // Clear only this field's error
        delete newErrors[fieldName];
      } else {
        // Add/update this field's error
        Object.entries(result.errors).forEach(([field, message]) => {
          newErrors[field] = message;
        });
      }

      return newErrors;
    });
    return result.success;
  };

  // Handle sender field changes
  const handleSenderChange = (data: Record<string, unknown>) => {
    setSender(data);
    // Validate each field individually
    Object.entries(data).forEach(([fieldName, value]) => {
      validateSingleField(fieldName, value);
    });
  };

  // Handle receiver field changes
  const handleReceiverChange = (data: Record<string, unknown>) => {
    setReceiver(data);
    // Validate each field individually
    Object.entries(data).forEach(([fieldName, value]) => {
      validateSingleField(fieldName, value);
    });
  };

  // Handle product field changes
  const handleProductChange = (data: Record<string, unknown>) => {
    setProduct(data);
    // Validate each field individually
    Object.entries(data).forEach(([fieldName, value]) => {
      validateSingleField(fieldName, value);
    });
  };

  // Handle pick shift changes
  const handlePickShiftChange = (newPickShift: {
    pickShiftId?: number;
    pickShiftTitle?: string;
  }) => {
    setPickShift(newPickShift);
    if (newPickShift.pickShiftId) {
      validateSingleField("pickShift.pickShiftId", newPickShift.pickShiftId);
    }
  };

  // Handle shipping fee changes
  const handleShippingFeeChange = (fee: number | null) => {
    setShippingFee(fee);
    if (fee !== null) {
      validateSingleField("shippingFee", fee);
    }
  };

  // Hàm tạo đơn hàng
  const handleCreateOrder = async () => {
    console.log("sender", sender);
    console.log("receiver", receiver);
    console.log("product", product);
    console.log("pickShift", pickShift);
    console.log("shippingFee", shippingFee);

    console.log("errors", errors);
    if (!validate()) return;

    setIsLoading(true);
    const data = {
      ...sender,
      ...receiver,
      ...product,
      orderID: orderID,
      pickShift: pickShift.pickShiftId,
      shippingFee: shippingFee,
    };
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "images" && Array.isArray(value)) {
        (value as File[]).forEach((file) =>
          formData.append("ShipsAttachmentFiles", file)
        );
      } else if (key === "shippingFee" && value !== null) {
        formData.append(key, String(value));
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    try {
      await createDelivery(formData);
      onSuccess?.();
      onOrderCreated?.();
    } catch (error) {
      console.error("Error creating delivery:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-8xl mx-auto p-0">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Form Content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="border-t-4 border-primary rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-0">
              <SenderInfo onChange={handleSenderChange} errors={errors} />
              {/* <ReceiverInfo
                onChange={handleReceiverChange}
                errors={errors}
                accountId={receiverAccountId}
              /> */}
              <ReceiverInfoAutofill
                onChange={handleReceiverChange}
                errors={errors}
                accountId={receiverAccountId}
              />
            </div>
          </div>
          <ProductInfo
            onChange={handleProductChange}
            errors={errors}
            setPickShift={handlePickShiftChange}
          />
        </div>
        {/* Pricing Sidebar + Create Order Button */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="sticky top-6 flex flex-col gap-4 border-t-4 border-primary rounded-lg">
            <PricingSidebar
              fee={shippingFee}
              isCalculating={false}
              onCalculateFee={handleShippingFeeChange}
              sender={sender}
              receiver={receiver}
              product={product}
            />
            <div className="flex justify-end bottom-0">
              <button
                type="button"
                disabled={isLoading}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition ${
                  isLoading
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/80"
                }`}
                onClick={handleCreateOrder}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ĐANG TẠO ĐƠN HÀNG...
                  </div>
                ) : (
                  "TẠO ĐƠN HÀNG"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
