import { useEffect, useState } from "react";
import { getDistricts, getWards } from "@/services/ghnApi";
import { Skeleton } from "@/components/ui/skeleton";
import PutAddress from "../edit-addresss";

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
  const [selectedAddress, setSelectedAddress] = useState<any | null>(null); // 👈 address được chọn để sửa

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

  const getLocationName = (type: "district" | "ward", id: number) => {
    if (type === "district") return districtMap[id] || id;
    if (type === "ward") return wardMap[id] || id;
    return id;
  };

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

  const isLoading = isMapping;
  const skeletonCount = addresses.length > 0 ? addresses.length : 1;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 items-center justify-center flex">
        Danh sách địa chỉ
      </h1>

      {isLoading ? (
        renderSkeleton(skeletonCount)
      ) : addresses.length === 0 ? (
        <p>Không có địa chỉ nào.</p>
      ) : (
        <ul className="space-y-4">
          {addresses.map((addr) => (
            <li
              key={addr.addressID}
              className="p-4 border rounded shadow-sm bg-white hover:cursor-pointer hover:bg-muted transition"
              onClick={() => setSelectedAddress(addr)}
            >
              <p>
                <strong>Chi tiết:</strong> {addr.addressDetail}
              </p>
              <p>
                <strong>Tỉnh:</strong> TP. Hồ Chí Minh
              </p>
              <p>
                <strong>Quận/Huyện:</strong>{" "}
                {getLocationName("district", addr.district)}
              </p>
              <p>
                <strong>Phường/Xã:</strong> {getLocationName("ward", addr.ward)}
              </p>
              {addr.isMainAddress && (
                <span className="inline-block mt-2 px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">
                  Địa chỉ chính
                </span>
              )}
            </li>
          ))}
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
