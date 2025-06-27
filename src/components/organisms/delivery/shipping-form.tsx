import { useState } from "react";
import { SenderInfo } from "../../molecules/delivery/sender-info";
import { ReceiverInfo } from "../../molecules/delivery/receiver-info";
import { ProductInfo } from "../../molecules/delivery/product-info";
import { PricingSidebar } from "../../molecules/delivery/pricing-sidebar";
import DeliveryService from "@/services/DeliveryService";
import {
  validateShippingForm,
  validateSender,
  validateReceiver,
  validateProduct,
} from "@/schemas/shippingSchema";

interface ShippingFormProps {
  onSuccess?: () => void;
  orderID?: string;
  onOrderCreated?: () => void;
}

export function ShippingForm({
  onSuccess,
  orderID,
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

  // Individual section validation functions
  const validateSenderSection = (senderData: Record<string, unknown>) => {
    const result = validateSender(senderData);
    const newErrors = { ...errors };
    if (result.success) {
      // Clear sender-related errors
      [
        "fromName",
        "fromPhone",
        "fromAddress",
        "fromDistrictName",
        "fromWardName",
        "fromProvinceName",
      ].forEach((field) => {
        delete newErrors[field];
      });
    } else {
      // Add sender-related errors
      Object.entries(result.errors).forEach(([field, message]) => {
        newErrors[field] = message;
      });
    }
    setErrors(newErrors);
    return result.success;
  };

  const validateReceiverSection = (receiverData: Record<string, unknown>) => {
    const result = validateReceiver(receiverData);
    const newErrors = { ...errors };
    // Always clear all receiver-related errors
    [
      "toName",
      "toPhone",
      "toAddressDetail",
      "toDistrictName",
      "toWardName",
      "toProvinceName",
    ].forEach((field) => {
      delete newErrors[field];
    });
    // Add new errors if any
    if (!result.success) {
      Object.entries(result.errors).forEach(([field, message]) => {
        newErrors[field] = message;
      });
    }
    setErrors(newErrors);
    return result.success;
  };

  const validateProductSection = (productData: Record<string, unknown>) => {
    const result = validateProduct(productData);
    const newErrors = { ...errors };
    // Xóa tất cả key lỗi liên quan
    [
      "content",
      "weight",
      "length",
      "width",
      "height",
      "images",
      "note",
      "files",
      "pickShift.pickShiftId",
    ].forEach((field) => {
      delete newErrors[field];
    });
    // Thêm lại lỗi mới nếu có
    if (!result.success) {
      Object.entries(result.errors).forEach(([field, message]) => {
        newErrors[field] = message;
      });
    }
    setErrors(newErrors);
    return result.success;
  };

  // Hàm tạo đơn hàng
  const handleCreateOrder = async () => {
    console.log("sender", sender);
    console.log("receiver", receiver);
    console.log("product", product);
    console.log("pickShift", pickShift);
    console.log("shippingFee", shippingFee);
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
              <SenderInfo
                onChange={(data) => {
                  setSender(data);
                  validateSenderSection(data);
                }}
                errors={errors}
              />
              <ReceiverInfo
                onChange={(data) => {
                  setReceiver(data);
                  validateReceiverSection(data);
                }}
                errors={errors}
              />
            </div>
          </div>
          <ProductInfo
            onChange={(data) => {
              setProduct(data);
              validateProductSection(data);
            }}
            errors={errors}
            setPickShift={setPickShift}
          />
        </div>
        {/* Pricing Sidebar + Create Order Button */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="sticky top-6 flex flex-col gap-4 border-t-4 border-primary rounded-lg">
            <PricingSidebar
              fee={shippingFee}
              isCalculating={false}
              onCalculateFee={(fee) => setShippingFee(fee)}
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
