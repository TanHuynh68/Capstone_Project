import { useEffect, useState } from "react";
import { getDistricts, getWards } from "@/services/ghnApi";
import { Skeleton } from "@/components/ui/skeleton";
import PutAddress from "../edit-addresss";
import DeleteAddress from "../delete-address";
import { Home, Star } from "lucide-react";

const HCM_PROVINCE_ID = 202;
const VALID_HCM_DISTRICTS = new Set([
  3695, 2090, 1534, 1533, 1463, 1462, 1461, 1460, 1459, 1458, 1457, 1456, 1455,
  1454, 1453, 1452, 1451, 1450, 1449, 1448, 1447, 1446, 1444, 1443, 1442,
]);

type Address = {
  addressID: string;
  addressDetail: string;
  district: number;
  ward: number;
  isMainAddress: boolean;
};

type GetAddressProps = {
  addresses: Record<string, unknown>[];
  onUpdated: () => void;
};

const GetAddress = ({ addresses, onUpdated }: GetAddressProps) => {
  const [districtMap, setDistrictMap] = useState<Record<number, string>>({});
  const [wardMap, setWardMap] = useState<Record<number, string>>({});
  const [isMapping, setIsMapping] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Record<
    string,
    unknown
  > | null>(null);

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

  const renderAddressItem = (addr: Record<string, unknown>) => (
    <li
      key={addr.addressID as string}
      className={`relative p-4 border rounded-lg shadow-sm transition-all duration-200 cursor-pointer ${
        addr.isMainAddress
          ? "bg-primary/5 border-2 border-primary/20 hover:shadow-md"
          : "bg-card border-border hover:bg-muted"
      }`}
      onClick={() => setSelectedAddress(addr)}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              addr.isMainAddress ? "bg-primary/10" : "bg-muted"
            }`}
          >
            <Home
              className={`w-4 h-4 ${
                addr.isMainAddress ? "text-primary" : "text-muted-foreground"
              }`}
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2 justify-between">
            <span
              className={`text-sm font-semibold break-words ${
                addr.isMainAddress ? "text-primary" : "text-foreground"
              }`}
            >
              {addr.addressDetail as string}
            </span>
            {(addr.isMainAddress as boolean) && (
              <div className="flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md font-medium">
                <Star className="w-3 h-3" />
                Địa chỉ chính
              </div>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {getLocationName("ward", addr.ward as string | number)},{" "}
            {getLocationName("district", addr.district as string | number)}, TP.
            Hồ Chí Minh
          </p>
          {!addr.isMainAddress && (
            <div
              className="absolute top-1 right-1"
              onClick={(e) => e.stopPropagation()}
            >
              <DeleteAddress
                addressID={addr.addressID as string}
                addressDetail={addr.addressDetail as string}
                ward={addr.ward as string | number}
                district={addr.district as string | number}
                getLocationName={getLocationName}
                onDeleted={onUpdated}
              />
            </div>
          )}
        </div>
      </div>
    </li>
  );

  const isLoading = isMapping;
  const skeletonCount = addresses.length > 0 ? addresses.length : 1;

  const mainAddress = addresses.find((addr) => addr.isMainAddress);
  const otherAddresses = addresses.filter((addr) => !addr.isMainAddress);

  const renderSkeleton = (count: number) => (
    <ul className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="p-0">
      {/* <h1 className="text-xl font-bold mb-4 items-center justify-center flex">
        Danh sách địa chỉ
      </h1> */}

      {isLoading ? (
        <ul>{renderSkeleton(skeletonCount)}</ul>
      ) : addresses.length === 0 ? (
        <div className="flex items-center justify-center text-muted-foreground">
          Không có địa chỉ nào.
        </div>
      ) : (
        <ul className="space-y-4">
          {mainAddress && renderAddressItem(mainAddress)}
          {otherAddresses.map((addr) => renderAddressItem(addr))}
        </ul>
      )}

      {/* Modal cập nhật địa chỉ */}
      {selectedAddress && (
        <PutAddress
          key={selectedAddress.addressID as string}
          address={selectedAddress as Address}
          onUpdated={() => {
            setSelectedAddress(null);
            onUpdated();
          }}
          onClose={() => setSelectedAddress(null)}
        />
      )}
    </div>
  );
};

export default GetAddress;
