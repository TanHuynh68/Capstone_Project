import { useEffect, useState } from "react";
import { getDistricts, getWards } from "@/services/ghnApi";
import { Skeleton } from "@/components/ui/skeleton";
import PutAddress from "../edit-addresss";
import DeleteAddress from "../delete-address";
import { ChevronDown, ChevronUp, Home } from "lucide-react";

const HCM_PROVINCE_ID = 202;
const VALID_HCM_DISTRICTS = new Set([
  3695, 2090, 1534, 1533, 1463, 1462, 1461, 1460, 1459, 1458, 1457, 1456, 1455,
  1454, 1453, 1452, 1451, 1450, 1449, 1448, 1447, 1446, 1444, 1443, 1442,
]);

type GetAddressProps = {
  addresses: any[];
  onUpdated: () => void;
};

const GetAddress = ({ addresses, onUpdated }: GetAddressProps) => {
  const [districtMap, setDistrictMap] = useState<Record<number, string>>({});
  const [wardMap, setWardMap] = useState<Record<number, string>>({});
  const [isMapping, setIsMapping] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null);
  const [showAll, setShowAll] = useState(false);

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

        const validDistricts = allDistricts.filter((d: any) =>
          VALID_HCM_DISTRICTS.has(d.DistrictID)
        );

        const districtMapping: Record<number, string> = {};
        const wardMapping: Record<number, string> = {};

        validDistricts.forEach((d: any) => {
          districtMapping[d.DistrictID] = d.DistrictName;
        });

        for (const d of validDistricts) {
          const wardRes = await getWards(d.DistrictID);
          const wards = wardRes.data.data;
          wards.forEach((w: any) => {
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

  const renderAddressItem = (addr: any) => (
    <li
      key={addr.addressID}
      className="relative pt-6 pr-6 pb-4 pl-4 border rounded-lg shadow-md bg-white hover:bg-gray-50 transition"
      onClick={() => setSelectedAddress(addr)}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 space-y-1">
          <p className="text-base font-medium text-gray-900 flex flex-wrap items-start gap-2 break-words">
            <Home className="w-4 h-4 mt-1 text-gray-500 shrink-0" />
            <span className="flex-1">
              {addr.addressDetail}, {getLocationName("ward", addr.ward)},{" "}
              {getLocationName("district", addr.district)}, TP. Hồ Chí Minh
            </span>
          </p>

          {addr.isMainAddress && (
            <span className="inline-block mt-2 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
              Địa chỉ chính
            </span>
          )}
        </div>
        {!addr.isMainAddress && (
          <div
            className="absolute top-2 right-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <DeleteAddress
              addressID={addr.addressID}
              addressDetail={addr.addressDetail}
              ward={addr.ward}
              district={addr.district}
              getLocationName={getLocationName}
              onDeleted={onUpdated}
            />
          </div>
        )}
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
        <li key={i} className="p-4 border rounded shadow-sm bg-white space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="p-4">
      {/* <h1 className="text-xl font-bold mb-4 items-center justify-center flex">
        Danh sách địa chỉ
      </h1> */}

      {isLoading ? (
        <ul>{renderSkeleton(skeletonCount)}</ul>
      ) : addresses.length === 0 ? (
        <div className="flex items-center justify-center text-gray-500">
          Không có địa chỉ nào.
        </div>
      ) : (
        <ul className="space-y-4">
          {mainAddress && renderAddressItem(mainAddress)}

          {showAll && otherAddresses.map((addr) => renderAddressItem(addr))}

          {otherAddresses.length > 0 && (
            <div className="flex justify-center mt-2">
              <button
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "Ẩn bớt" : "Hiển thị thêm"}
                {showAll ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>
          )}
        </ul>
      )}

      {/* Modal cập nhật địa chỉ */}
      {selectedAddress && (
        <PutAddress
          key={selectedAddress.addressID}
          address={selectedAddress}
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
