import { useEffect, useState } from "react";
import { getDistricts, getWards } from "@/services/ghnApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, MapPin, Star } from "lucide-react";

const HCM_PROVINCE_ID = 202;
const VALID_HCM_DISTRICTS = new Set([
  3695, 2090, 1534, 1533, 1463, 1462, 1461, 1460, 1459, 1458, 1457, 1456, 1455,
  1454, 1453, 1452, 1451, 1450, 1449, 1448, 1447, 1446, 1444, 1443, 1442,
]);

interface MainAddressSelectorProps {
  addresses: Record<string, unknown>[];
  onUpdated: () => void;
  className?: string;
}

const MainAddressSelector = ({
  addresses,
  className = "",
}: MainAddressSelectorProps) => {
  const [districtMap, setDistrictMap] = useState<Record<number, string>>({});
  const [wardMap, setWardMap] = useState<Record<number, string>>({});
  const [isMapping, setIsMapping] = useState(true);

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

  const mainAddress = addresses.find((addr) => addr.isMainAddress);

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

  if (!mainAddress) {
    return (
      <div className={`border border-border rounded-lg p-4 ${className}`}>
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Chưa có địa chỉ chính
          </span>
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
              {mainAddress.addressDetail as string}
            </span>
            <div className="flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md font-medium">
              <Star className="w-3 h-3" />
              Địa chỉ chính
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {getLocationName("ward", mainAddress.ward as string | number)},{" "}
            {getLocationName(
              "district",
              mainAddress.district as string | number
            )}
            , TP. Hồ Chí Minh
          </p>
        </div>
      </div>
    </div>
  );
};

export default MainAddressSelector;
