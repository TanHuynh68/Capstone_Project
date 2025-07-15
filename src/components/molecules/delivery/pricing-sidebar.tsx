import { useState, useEffect } from "react";
import { getDistricts, getWards } from "@/services/ghnApi";

interface PricingSidebarProps {
  fee: number | null;
  isCalculating: boolean;
  onCalculateFee: (fee: number) => void;
  sender: Record<string, unknown>;
  receiver: Record<string, unknown>;
  product: Record<string, unknown>;
}

interface Shop {
  _id: string;
  district_id: number;
  status: number;
}

interface District {
  DistrictID: number;
  DistrictName: string;
}

interface Ward {
  WardCode: number;
  WardName: string;
}

const GHN_TOKEN = import.meta.env.VITE_GHN_TOKEN;
const SHOP_ID = import.meta.env.VITE_GHN_SHOP_ID;
const HCM_PROVINCE_ID = 202;

export function PricingSidebar({
  fee,
  isCalculating,
  onCalculateFee,
  sender,
  receiver,
  product,
}: PricingSidebarProps) {
  const [calculatedFee, setCalculatedFee] = useState<number | null>(null);
  const [shopId, setShopId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [districtMap, setDistrictMap] = useState<Record<string, number>>({});
  const [wardMap, setWardMap] = useState<Record<string, number>>({});

  useEffect(() => {
    console.log(sender, "sender");
    console.log(receiver, "receiver");
    console.log(product, "product");
    // Get shop ID and create mapping on component mount
    const fetchShopIdAndMapping = async () => {
      try {
        // Fetch shop ID
        const response = await fetch(
          "https://online-gateway.ghn.vn/shiip/public-api/v2/shop/all",
          {
            headers: {
              "Content-Type": "application/json",
              token: GHN_TOKEN,
            },
          }
        );
        const data = await response.json();
        const shop = data.data?.shops?.find(
          (s: Shop) => s.district_id && s.status === 1
        );
        if (shop) setShopId(shop._id);

        // Create reverse mapping (name -> id)
        const districtRes = await getDistricts(HCM_PROVINCE_ID);
        const allDistricts = districtRes.data.data;

        const districtNameToId: Record<string, number> = {};
        const wardNameToCode: Record<string, number> = {};

        allDistricts.forEach((d: District) => {
          districtNameToId[d.DistrictName] = d.DistrictID;
        });

        for (const d of allDistricts) {
          const wardRes = await getWards(d.DistrictID);
          const wards = wardRes.data.data;
          wards.forEach((w: Ward) => {
            wardNameToCode[w.WardName] = w.WardCode;
          });
        }

        setDistrictMap(districtNameToId);
        setWardMap(wardNameToCode);
      } catch (error) {
        console.error("Error fetching shop ID and mapping:", error);
      }
    };
    fetchShopIdAndMapping();
  }, []);

  // 1. Tạo các biến primitive cho từng trường liên quan đến tính phí
  const fromDistrictName = sender.fromDistrictName;
  const fromWardName = sender.fromWardName;
  const toDistrictName = receiver.toDistrictName;
  const toWardName = receiver.toWardName;
  const weight = product.weight;
  const length = product.length;
  const width = product.width;
  const height = product.height;
  const content = product.content;

  // Helper to check if a value is a valid number in a range
  const isValidNumber = (val: unknown, min: number, max: number) => {
    const num = Number(val);
    return typeof num === "number" && !isNaN(num) && num >= min && num <= max;
  };

  // Auto-calculate fee when all required data is available
  useEffect(() => {
    const calculateFeeAutomatically = async () => {
      // Check if all required data is available and valid
      console.log(shopId, "shopId");
      console.log(fromDistrictName, "fromDistrictName");
      console.log(fromWardName, "fromWardName");
      console.log(toDistrictName, "toDistrictName");
      console.log(toWardName, "toWardName");
      if (
        shopId &&
        fromDistrictName &&
        fromWardName &&
        toDistrictName &&
        toWardName
      ) {
        // Validate all dimensions before calculating
        const isWeightValid = isValidNumber(weight, 1, 3000);
        const isLengthValid = isValidNumber(length, 1, 100);
        const isWidthValid = isValidNumber(width, 1, 100);
        const isHeightValid = isValidNumber(height, 1, 150);

        // Only calculate if all dimensions are valid

        console.log(isWeightValid, "isWeightValid");
        console.log(isLengthValid, "isLengthValid");
        console.log(isWidthValid, "isWidthValid");
        console.log(isHeightValid, "isHeightValid");

        if (
          !isWeightValid ||
          !isLengthValid ||
          !isWidthValid ||
          !isHeightValid
        ) {
          console.log("Kích thước không hợp lệ:", {
            weight: isWeightValid ? "OK" : "INVALID",
            length: isLengthValid ? "OK" : "INVALID",
            width: isWidthValid ? "OK" : "INVALID",
            height: isHeightValid ? "OK" : "INVALID",
          });
          setCalculatedFee(null);
          return;
        }

        setIsLoading(true);
        try {
          console.log(sender, "sender2");
          console.log(receiver, "receiver2");
          console.log(product, "product2");

          // Convert name to id/code
          const fromDistrictId = districtMap[fromDistrictName as string];
          const fromWardCode = wardMap[fromWardName as string];
          const toDistrictId = districtMap[toDistrictName as string];
          const toWardCode = wardMap[toWardName as string];

          if (
            !fromDistrictId ||
            !fromWardCode ||
            !toDistrictId ||
            !toWardCode
          ) {
            console.log("Không tìm thấy mapping cho địa chỉ");
            setCalculatedFee(null);
            return;
          }

          // Get available services
          const servicesResponse = await fetch(
            "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                token: GHN_TOKEN,
              },
              body: JSON.stringify({
                shop_id: shopId,
                from_district: fromDistrictId,
                to_district: toDistrictId,
              }),
            }
          );

          const servicesData = await servicesResponse.json();
          const service = servicesData.data?.[0];

          if (!service) {
            console.log("GHN hiện không hỗ trợ tuyến đường này.");
            setCalculatedFee(null);
            return;
          }

          console.log("1231212312");

          // Calculate fee
          const feeData = {
            from_district_id: fromDistrictId,
            from_ward_code: String(fromWardCode),
            to_district_id: toDistrictId,
            to_ward_code: String(toWardCode),
            service_id: service.service_id,
            height: Number(height),
            length: Number(length),
            width: Number(width),
            weight: Number(weight),
            insurance_value: 0,
            coupon: null,
            items: [
              {
                name: content || "Sản phẩm",
                quantity: 1,
                length: Number(length),
                width: Number(width),
                height: Number(height),
                weight: Number(weight),
              },
            ],
          };

          const feeResponse = await fetch(
            "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                token: GHN_TOKEN,
                ShopId: SHOP_ID,
              },
              body: JSON.stringify(feeData),
            }
          );

          const feeResult = await feeResponse.json();
          setCalculatedFee(feeResult.data.total);
          onCalculateFee(feeResult.data.total);
        } catch (error) {
          console.error("Error calculating fee:", error);
          setCalculatedFee(null);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Reset fee if data is incomplete
        console.log("data is incomplete");
        setCalculatedFee(null);
      }
    };

    calculateFeeAutomatically();
  }, [
    shopId,
    fromDistrictName,
    fromWardName,
    toDistrictName,
    toWardName,
    weight,
    length,
    width,
    height,
    content,
    districtMap,
    wardMap,
    // onCalculateFee,
  ]);

  const displayFee = calculatedFee !== null ? calculatedFee : fee;
  const showLoading = isLoading || isCalculating;

  // Check if all dimensions are valid for display logic
  const isWeightValid = isValidNumber(weight, 1, 3000);
  const isLengthValid = isValidNumber(length, 1, 100);
  const isWidthValid = isValidNumber(width, 1, 100);
  const isHeightValid = isValidNumber(height, 1, 150);
  const allDimensionsValid =
    isWeightValid && isLengthValid && isWidthValid && isHeightValid;

  return (
    <div className="rounded-lg border border-border p-4 top-6 ">
      <div className="space-y-4">
        {/* Service Fee */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Phí giao hàng</span>
          <span className="font-semibold text-foreground">
            {showLoading ? (
              <span className="text-muted-foreground">Đang tính...</span>
            ) : allDimensionsValid &&
              typeof displayFee === "number" &&
              !isNaN(displayFee) ? (
              `${displayFee.toLocaleString()} đ`
            ) : (
              "--"
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
