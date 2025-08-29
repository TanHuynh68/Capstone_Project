"use client";

import { useEffect, useState } from "react";
import { SenderInfo } from "../../molecules/delivery/sender-info";
// import { ReceiverInfo } from "../../molecules/delivery/receiver-info";
import { ProductInfo } from "../../molecules/delivery/product-info";
import { PricingSidebar } from "../../molecules/delivery/pricing-sidebar";
import DeliveryService from "@/services/DeliveryService";
import { validateShippingForm, validateField } from "@/schemas/shippingSchema";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { ReceiverInfoAutofill } from "@/components/molecules/delivery/receiver-info-autofill";
import { toast } from "sonner";
import {
  AlertTriangle,
  Info,
  Users,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import BenefitService from "@/services/BenefitService";

interface ShippingFormProps {
  onSuccess?: () => void;
  orderID?: string;
  order?: Order;
  onOrderCreated?: () => void;
}

interface BenefitWrongDelivery {
  benefitID: string;
  benefitType: string;
  title: string;
  description: string;
  version: number;
  customerScoreChange: number;
  designerScoreChange: number;
  customerCompensationRate: number;
  designerCompensationRate: number;
  isActive: boolean;
  createdAt: string; // hoặc Date nếu bạn muốn parse sang Date
  listVersion: Benefit[]; // Nếu danh sách này chứa các version Benefi
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
  const { getBenefitWrongDelivery } = BenefitService();
  const currentUserId = useSelector((state: RootState) => state.user.id);
  let receiverAccountId = undefined;
  let receiverID = undefined;
  const [deliveryBenefit, setDeliveryBenefit] =
    useState<BenefitWrongDelivery | null>(null);

  useEffect(() => {
    fetchBenefitWrongDelivery();
  }, []);

  // Benefit data - this could come from props or API in the future
  const fetchBenefitWrongDelivery = async () => {
    const response = await getBenefitWrongDelivery();
    if (response && response.responseRequestModel) {
      setDeliveryBenefit(response.responseRequestModel);
    }
  };

  if (order) {
    // If current user is the customer, then the receiver is the designer
    if (order.customerID === currentUserId) {
      receiverAccountId = order.designerID;
      receiverID = order.designerID;
    }
    // If current user is the designer, then the receiver is the customer
    else if (order.designerID === currentUserId) {
      receiverAccountId = order.customerID;
      receiverID = order.customerID;
    }
    // If current user is neither (shouldn't happen in normal cases), default to customer
    else {
      receiverAccountId = order.customerID;
      receiverID = order.customerID;
    }
  }

  // Kiểm tra xem form có đầy đủ thông tin cần thiết không
  const isFormValid = () => {
    // Kiểm tra thông tin người gửi
    const hasSenderAddress =
      sender.fromAddress &&
      typeof sender.fromAddress === "string" &&
      sender.fromAddress.trim() !== "";

    // Kiểm tra thông tin người nhận
    const hasReceiverAddress =
      receiver.toAddress &&
      typeof receiver.toAddress === "string" &&
      receiver.toAddress.trim() !== "";

    // Kiểm tra thông tin sản phẩm
    const hasProductInfo =
      product.content &&
      typeof product.content === "string" &&
      product.content.trim() !== "";

    // Kiểm tra ghi chú
    const hasNote =
      product.note &&
      typeof product.note === "string" &&
      product.note.trim() !== "";

    // Kiểm tra hình ảnh
    const hasImages =
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0;

    // Kiểm tra kích thước và khối lượng
    const hasWeight =
      product.weight &&
      typeof product.weight === "string" &&
      product.weight.trim() !== "" &&
      product.weight !== "0";

    const hasLength =
      product.length &&
      typeof product.length === "string" &&
      product.length.trim() !== "" &&
      product.length !== "0";

    const hasWidth =
      product.width &&
      typeof product.width === "string" &&
      product.width.trim() !== "" &&
      product.width !== "0";

    const hasHeight =
      product.height &&
      typeof product.height === "string" &&
      product.height.trim() !== "" &&
      product.height !== "0";

    // Kiểm tra pick shift
    const hasPickShift = pickShift.pickShiftId && pickShift.pickShiftId > 0;

    console.log("Form validation:", {
      hasSenderAddress,
      hasReceiverAddress,
      hasProductInfo,
      hasNote,
      hasImages,
      hasWeight,
      hasLength,
      hasWidth,
      hasHeight,
      hasPickShift,
      sender: sender.fromAddress,
      receiver: receiver.toAddress,
      product: product.content,
      note: product.note,
      images: product.images,
      weight: product.weight,
      length: product.length,
      width: product.width,
      height: product.height,
      pickShift: pickShift.pickShiftId,
    });

    return (
      hasSenderAddress &&
      hasReceiverAddress &&
      hasProductInfo &&
      hasNote &&
      hasImages &&
      hasWeight &&
      hasLength &&
      hasWidth &&
      hasHeight &&
      hasPickShift
    );
  };

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
    // Kiểm tra form có hợp lệ không trước khi thực hiện
    if (!isFormValid()) {
      console.log("Form chưa hợp lệ, không thể tạo đơn hàng");
      return;
    }

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
      const response = await createDelivery(formData);
      if (response) {
        toast.success("Tạo đơn giao hàng thành công!");
        onSuccess?.();
        onOrderCreated?.();
      }
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
          <div className="">
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
                receiverID={receiverID}
                orderID={orderID}
              />
            </div>
          </div>
          <ProductInfo
            orderId={orderID}
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
                disabled={isLoading || !isFormValid()}
                className={`w-full px-6 py-3 rounded-lg font-semibold transition cursor-pointer ${
                  isLoading || !isFormValid()
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/80"
                }`}
                onClick={handleCreateOrder}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ĐANG TẠO GIAO HÀNG...
                  </div>
                ) : (
                  "TẠO GIAO HÀNG"
                )}
              </button>
            </div>

            {/* Benefit Information Section */}
            {deliveryBenefit && deliveryBenefit.isActive && (
              <div className="mt-4 p-4 bg-amber-300  border border-amber-200  rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <AlertTriangle className="h-5 w-5 " />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold  mb-1">
                        {deliveryBenefit.title}
                      </h4>
                      <p className="text-xs  leading-relaxed">
                        {deliveryBenefit.description}
                      </p>
                    </div>

                    {/* Score and Compensation Info */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-amber-200 dark:border-amber-800">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3 " />
                          <span className="text-xs font-medium  ">Điểm số</span>
                        </div>
                        <div className="space-y-1">
                          {deliveryBenefit.customerScoreChange !== 0 && (
                            <div className="flex items-center gap-1">
                              {deliveryBenefit.customerScoreChange > 0 ? (
                                <TrendingUp className="h-3 w-3 text-green-600" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-600" />
                              )}
                              <span className="text-xs 0 ">
                                KH:{" "}
                                {deliveryBenefit.customerScoreChange > 0
                                  ? "+"
                                  : ""}
                                {deliveryBenefit.customerScoreChange}
                              </span>
                            </div>
                          )}
                          {deliveryBenefit.designerScoreChange !== 0 && (
                            <div className="flex items-center gap-1">
                              {deliveryBenefit.designerScoreChange > 0 ? (
                                <TrendingUp className="h-3 w-3 text-green-600" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-600" />
                              )}
                              <span className="text-xs 0 ">
                                TK:{" "}
                                {deliveryBenefit.designerScoreChange > 0
                                  ? "+"
                                  : ""}
                                {deliveryBenefit.designerScoreChange}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Info className="h-3 w-3  " />
                          <span className="text-xs font-medium  ">
                            Bồi thường
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xs  ">
                            KH: {deliveryBenefit.customerCompensationRate}%
                          </div>
                          <div className="text-xs t ">
                            TK: {deliveryBenefit.designerCompensationRate}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
