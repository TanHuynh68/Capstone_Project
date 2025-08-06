import { useEffect, useState } from "react";
import { getDistricts, getWards } from "@/services/ghnApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Home, MapPin, Bell, Check } from "lucide-react";
import DeliveryService from "@/services/DeliveryService";
import { toast } from "sonner";

const HCM_PROVINCE_ID = 202;
const VALID_HCM_DISTRICTS = new Set([
  3695, 2090, 1534, 1533, 1463, 1462, 1461, 1460, 1459, 1458, 1457, 1456, 1455,
  1454, 1453, 1452, 1451, 1450, 1449, 1448, 1447, 1446, 1444, 1443, 1442,
]);

interface ReceiverAddressViewProps {
  addresses: Record<string, unknown>[];
  className?: string;
  receiverID?: string | number;
  orderID?: string | number;
}

const ReceiverAddressView = ({
  addresses,
  className = "",
  receiverID,
  orderID,
}: ReceiverAddressViewProps) => {
  const [districtMap, setDistrictMap] = useState<Record<number, string>>({});
  const [wardMap, setWardMap] = useState<Record<number, string>>({});
  const [isMapping, setIsMapping] = useState(true);
  const [isNotifying, setIsNotifying] = useState(false);
  const [hasNotified, setHasNotified] = useState(false);
  const { postNotifyMissing } = DeliveryService();

  // Generate a unique key for localStorage based on receiverID and orderID
  const getNotificationKey = () => {
    if (!receiverID || !orderID) return null;
    return `notification_sent_${receiverID}_${orderID}`;
  };

  // Check if notification was already sent (from localStorage)
  useEffect(() => {
    const checkNotificationState = () => {
      const key = getNotificationKey();
      if (!key) return;

      // Check localStorage
      const hasSent = localStorage.getItem(key);
      const expiration = localStorage.getItem(`${key}_expires`);

      if (
        hasSent === "true" &&
        expiration &&
        Date.now() <= parseInt(expiration)
      ) {
        setHasNotified(true);
      } else if (
        hasSent === "true" &&
        (!expiration || Date.now() > parseInt(expiration))
      ) {
        // Clean up expired entry
        localStorage.removeItem(key);
        localStorage.removeItem(`${key}_expires`);
      }
    };

    checkNotificationState();
  }, [receiverID, orderID]);

  // Save notification state to localStorage
  const saveNotificationState = () => {
    const key = getNotificationKey();
    if (key) {
      localStorage.setItem(key, "true");
      // Set expiration to 24 hours from now
      const expiration = Date.now() + 24 * 60 * 60 * 1000;
      localStorage.setItem(`${key}_expires`, expiration.toString());
    }
  };

  // Clean up expired localStorage entries
  const cleanupExpiredNotifications = () => {
    const keys = Object.keys(localStorage);
    const notificationKeys = keys.filter((key) =>
      key.startsWith("notification_sent_")
    );

    notificationKeys.forEach((key) => {
      const expirationKey = `${key}_expires`;
      const expiration = localStorage.getItem(expirationKey);

      if (expiration && Date.now() > parseInt(expiration)) {
        localStorage.removeItem(key);
        localStorage.removeItem(expirationKey);
      }
    });
  };

  // Clean up expired entries on component mount
  useEffect(() => {
    cleanupExpiredNotifications();
  }, []);

  useEffect(() => {
    const fetchMapping = async () => {
      if (addresses.length === 0) {
        setIsMapping(false);
        return;
      }

      setIsMapping(true);
      try {
        const districtRes = await getDistricts(HCM_PROVINCE_ID);
        const allDistricts = districtRes.data.data;

        const validDistricts = allDistricts.filter(
          (d: { DistrictID: number }) => VALID_HCM_DISTRICTS.has(d.DistrictID)
        );

        const districtMapping: Record<number, string> = {};
        const wardMapping: Record<number, string> = {};

        validDistricts.forEach(
          (d: { DistrictID: number; DistrictName: string }) => {
            districtMapping[d.DistrictID] = d.DistrictName;
          }
        );

        for (const d of validDistricts) {
          const wardRes = await getWards(d.DistrictID);
          const wards = wardRes.data.data;
          wards.forEach((w: { WardCode: number; WardName: string }) => {
            wardMapping[w.WardCode] = w.WardName;
          });
        }

        setDistrictMap(districtMapping);
        setWardMap(wardMapping);
      } catch (error) {
        console.error("Error mapping address:", error);
      }

      setIsMapping(false);
    };

    fetchMapping();
  }, [addresses]);

  const getLocationName = (
    type: "district" | "ward",
    id: string | number
  ): string => {
    const numericId = Number(id);
    if (type === "district") return districtMap[numericId] || String(id);
    if (type === "ward") return wardMap[numericId] || String(id);
    return String(id);
  };

  const handleNotifyMissing = async () => {
    if (!receiverID || !orderID) {
      toast.error("Thiếu thông tin receiverID hoặc orderID");
      return;
    }

    setIsNotifying(true);
    try {
      const result = await postNotifyMissing({
        receiverID,
        orderID,
      });

      if (result) {
        // Check if the API response indicates success or if it's already been sent
        if (result.isSuccess || result.statusCode === 200) {
          if (result.message && result.message.includes("gần đây")) {
            // Already sent recently
            toast.info(
              result.message ||
                "Đã gửi thông báo gần đây, sau 1 ngày mới có thể gửi lại."
            );
            setHasNotified(true);
            saveNotificationState();
          } else {
            // Successfully sent
            toast.success(
              "Đã gửi thông báo nhắc nhở người nhận thêm địa chỉ giao hàng"
            );
            setHasNotified(true);
            saveNotificationState();
          }
        } else {
          // Handle other success cases
          toast.success(
            "Đã gửi thông báo nhắc nhở người nhận thêm địa chỉ giao hàng"
          );
          setHasNotified(true);
          saveNotificationState();
        }
      }
    } catch (error) {
      console.error("Error notifying missing address:", error);
      // Check if the error response indicates it was already sent
      if (error && typeof error === "object" && "response" in error) {
        const errorResponse = (
          error as { response?: { data?: { message?: string } } }
        ).response;
        if (
          errorResponse?.data?.message &&
          errorResponse.data.message.includes("gần đây")
        ) {
          toast.info(errorResponse.data.message);
          setHasNotified(true);
          saveNotificationState();
        } else {
          toast.error("Đã xảy ra lỗi khi gửi thông báo");
        }
      } else {
        toast.error("Đã xảy ra lỗi khi gửi thông báo");
      }
    } finally {
      setIsNotifying(false);
    }
  };

  const receiverAddress = addresses[0];

  if (isMapping) {
    return (
      <div className={`border border-border rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="h-5 flex-1" />
        </div>
      </div>
    );
  }

  if (!receiverAddress) {
    return (
      <div className={`border border-border rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Người nhận chưa có địa chỉ
            </span>
          </div>
          {receiverID && orderID && (
            <Button
              variant={hasNotified ? "secondary" : "outline"}
              size="sm"
              onClick={handleNotifyMissing}
              disabled={isNotifying || hasNotified}
              className="flex items-center gap-2"
            >
              {hasNotified ? (
                <>
                  <Check className="w-3 h-3" />
                  Đã gửi thông báo
                </>
              ) : (
                <>
                  <Bell className="w-3 h-3" />
                  {isNotifying ? "Đang gửi..." : "Nhắc nhở thêm địa chỉ"}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-primary/5 border-2 border-primary/20 rounded-lg p-4 shadow-sm ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Home className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 justify-between">
            <span className="text-sm font-semibold text-primary">
              {receiverAddress.addressDetail as string}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {getLocationName("ward", receiverAddress.ward as string | number)},{" "}
            {getLocationName(
              "district",
              receiverAddress.district as string | number
            )}
            , TP. Hồ Chí Minh
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReceiverAddressView;
