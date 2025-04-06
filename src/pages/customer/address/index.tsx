import  { useEffect, useState } from "react";
import CustomerService from "@/services/CustomerService";
import { getProvinces, getDistricts, getWards } from "@/services/ghnApi";

const GetAddress = () => {
  const { getAddresses, loading } = CustomerService();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [provinceMap, setProvinceMap] = useState<Record<number, string>>({});
  const [districtMap, setDistrictMap] = useState<Record<number, string>>({});
  const [wardMap, setWardMap] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      // Lấy danh sách địa chỉ
      const res = await getAddresses({});
      const items = res?.responseRequestModel?.responseList?.items || [];
      setAddresses(items);

      // Lấy danh sách tỉnh
      const provincesRes = await getProvinces();
      const provinces = provincesRes.data.data;
      const provinceMapping: Record<number, string> = {};
      provinces.forEach((p: any) => {
        provinceMapping[p.ProvinceID] = p.ProvinceName;
      });
      setProvinceMap(provinceMapping);

      // Lấy tất cả district & ward từ các province/district được sử dụng
      const uniqueProvinceIds = [...new Set(items.map((a: any) => a.province))];
      const districtMapping: Record<number, string> = {};
      const wardMapping: Record<number, string> = {};

      for (const provinceId of uniqueProvinceIds) {
        const id = provinceId as number; // ép kiểu từ unknown => number
      
        const districtRes = await getDistricts(id);
        const districts = districtRes.data.data;
        districts.forEach((d: any) => {
          districtMapping[d.DistrictID] = d.DistrictName;
        });
      
        for (const d of districts) {
          const wardRes = await getWards(d.DistrictID);
          const wards = wardRes.data.data;
          wards.forEach((w: any) => {
            wardMapping[w.WardCode] = w.WardName;
          });
        }
      }      

      setDistrictMap(districtMapping);
      setWardMap(wardMapping);
    };

    fetchData();
  }, [getAddresses]);

  const getLocationName = (
    type: "province" | "district" | "ward",
    id: number
  ) => {
    if (type === "province") return provinceMap[id] || id;
    if (type === "district") return districtMap[id] || id;
    if (type === "ward") return wardMap[id] || id;
    return id;
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Danh sách địa chỉ GHN</h1>
      {loading ? (
        <p>Đang tải...</p>
      ) : addresses.length === 0 ? (
        <p>Không có địa chỉ nào.</p>
      ) : (
        <ul className="space-y-4">
          {addresses.map((addr) => (
            <li
              key={addr.addressID}
              className="p-4 border rounded shadow-sm bg-white"
            >
              <p>
                <strong>Chi tiết:</strong> {addr.addressDetail}
              </p>
              <p>
                <strong>Tỉnh:</strong>{" "}
                {getLocationName("province", addr.province)}
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
    </div>
  );
};

export default GetAddress;
