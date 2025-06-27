import { useState } from "react";
import { SenderInfo } from "../../molecules/delivery/sender-info";
import { ReceiverInfo } from "../../molecules/delivery/receiver-info";
import { ProductInfo } from "../../molecules/delivery/product-info";
import { PricingSidebar } from "../../molecules/delivery/pricing-sidebar";
import DeliveryService from "@/services/DeliveryService";

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

  // Validate dữ liệu form
  const validate = () => {
    const newErrors: Record<string, string> = {};
    // Validate sender
    if (!sender.fromName) newErrors.fromName = "Vui lòng nhập họ tên người gửi";
    if (!sender.fromPhone) newErrors.fromPhone = "Vui lòng nhập SĐT người gửi";
    else if (!/^\d{10}$/.test(String(sender.fromPhone)))
      newErrors.fromPhone = "SĐT người gửi phải đủ 10 số";
    if (!sender.fromAddress)
      newErrors.fromAddress = "Vui lòng nhập địa chỉ người gửi";
    if (!sender.fromDistrictName)
      newErrors.fromDistrictName = "Vui lòng chọn quận/huyện người gửi";
    if (!sender.fromWardName)
      newErrors.fromWardName = "Vui lòng chọn phường/xã người gửi";
    if (!sender.fromProvinceName)
      newErrors.fromProvinceName = "Vui lòng chọn tỉnh/thành người gửi";
    // Validate receiver
    if (!receiver.toName) newErrors.toName = "Vui lòng nhập họ tên người nhận";
    if (!receiver.toPhone) newErrors.toPhone = "Vui lòng nhập SĐT người nhận";
    else if (!/^\d{10}$/.test(String(receiver.toPhone)))
      newErrors.toPhone = "SĐT người nhận phải đủ 10 số";
    if (!receiver.toAddressDetail)
      newErrors.toAddressDetail = "Vui lòng nhập địa chỉ người nhận";
    if (!receiver.toDistrictName)
      newErrors.toDistrictName = "Vui lòng chọn quận/huyện người nhận";
    if (!receiver.toWardName)
      newErrors.toWardName = "Vui lòng chọn phường/xã người nhận";
    if (!receiver.toProvinceName)
      newErrors.toProvinceName = "Vui lòng chọn tỉnh/thành người nhận";
    // Validate product
    if (!product.content) newErrors.content = "Vui lòng nhập tên sản phẩm";
    if (
      product.weight === undefined ||
      product.weight === "" ||
      isNaN(Number(product.weight))
    ) {
      newErrors.weight = "Vui lòng nhập khối lượng";
    } else if (Number(product.weight) <= 0) {
      newErrors.weight = "Khối lượng phải lớn hơn 0";
    }
    if (
      product.length === undefined ||
      product.length === "" ||
      isNaN(Number(product.length))
    ) {
      newErrors.length = "Vui lòng nhập chiều dài";
    } else if (Number(product.length) <= 0) {
      newErrors.length = "Chiều dài phải lớn hơn 0";
    }
    if (
      product.width === undefined ||
      product.width === "" ||
      isNaN(Number(product.width))
    ) {
      newErrors.width = "Vui lòng nhập chiều rộng";
    } else if (Number(product.width) <= 0) {
      newErrors.width = "Chiều rộng phải lớn hơn 0";
    }
    if (
      product.height === undefined ||
      product.height === "" ||
      isNaN(Number(product.height))
    ) {
      newErrors.height = "Vui lòng nhập chiều cao";
    } else if (Number(product.height) <= 0) {
      newErrors.height = "Chiều cao phải lớn hơn 0";
    }
    if (!product.images || !(product.images as File[]).length)
      newErrors.files = "Vui lòng thêm ít nhất 1 ảnh sản phẩm";
    if (!product.note) newErrors.note = "Vui lòng nhập ghi chú cho sản phẩm";
    if (!pickShift.pickShiftId)
      newErrors.pickShift = "Vui lòng chọn ca lấy hàng";
    if (!shippingFee) newErrors.shippingFee = "Vui lòng tính phí giao hàng";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  // Hàm cập nhật lỗi khi input thay đổi
  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
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
                  if (data.fromName) clearError("fromName");
                  if (data.fromPhone && /^\d{10}$/.test(String(data.fromPhone)))
                    clearError("fromPhone");
                  if (data.fromAddress) clearError("fromAddress");
                  if (data.fromDistrictName) clearError("fromDistrictName");
                  if (data.fromWardName) clearError("fromWardName");
                  if (data.fromProvinceName) clearError("fromProvinceName");
                }}
                errors={errors}
              />
              <ReceiverInfo
                onChange={(data) => {
                  setReceiver(data);
                  if (data.toName) clearError("toName");
                  if (data.toPhone && /^\d{10}$/.test(String(data.toPhone)))
                    clearError("toPhone");
                  if (data.toAddressDetail) clearError("toAddressDetail");
                  if (data.toDistrictName) clearError("toDistrictName");
                  if (data.toWardName) clearError("toWardName");
                  if (data.toProvinceName) clearError("toProvinceName");
                }}
                errors={errors}
              />
            </div>
          </div>
          <ProductInfo
            onChange={(data) => {
              setProduct(data);
              // Chỉ xóa lỗi khi giá trị > 0
              if (
                data.weight !== undefined &&
                data.weight !== "" &&
                !isNaN(Number(data.weight)) &&
                Number(data.weight) > 0
              )
                clearError("weight");
              if (
                data.length !== undefined &&
                data.length !== "" &&
                !isNaN(Number(data.length)) &&
                Number(data.length) > 0
              )
                clearError("length");
              if (
                data.width !== undefined &&
                data.width !== "" &&
                !isNaN(Number(data.width)) &&
                Number(data.width) > 0
              )
                clearError("width");
              if (
                data.height !== undefined &&
                data.height !== "" &&
                !isNaN(Number(data.height)) &&
                Number(data.height) > 0
              )
                clearError("height");
              if (data.content) clearError("content");
              if (data.note) clearError("note");
              if (data.images && (data.images as File[]).length > 0)
                clearError("files");
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
