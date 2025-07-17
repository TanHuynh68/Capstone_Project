import { useCallback, useEffect, useState } from "react";
import CustomerService from "@/services/CustomerService";
import useAuthService from "@/services/AuthService";
import { getDistricts, getWards } from "@/services/ghnApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import GetAddress from "@/pages/customer/manage-address/address";
import MainAddressSelector from "./main-address-selector";
import CreateAddress from "@/pages/customer/manage-address/create-address";

interface SenderInfoProps {
  onChange?: (data: Record<string, unknown>) => void;
  errors?: Record<string, string>;
}

interface District {
  DistrictID: number;
  DistrictName: string;
}

interface Ward {
  WardCode: number;
  WardName: string;
}

const HCM_PROVINCE_ID = 202;
const VALID_HCM_DISTRICTS = new Set([
  3695, 2090, 1534, 1533, 1463, 1462, 1461, 1460, 1459, 1458, 1457, 1456, 1455,
  1454, 1453, 1452, 1451, 1450, 1449, 1448, 1447, 1446, 1444, 1443, 1442,
]);

export function SenderInfo({ onChange, errors }: SenderInfoProps) {
  const { getAddresses } = CustomerService();
  const { getProfile } = useAuthService();

  const [addresses, setAddresses] = useState<Record<string, unknown>[]>([]);
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddressLoading, setIsAddressLoading] = useState(true);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [districtMap, setDistrictMap] = useState<Record<number, string>>({});
  const [wardMap, setWardMap] = useState<Record<number, string>>({});

  const fetchAddresses = useCallback(async () => {
    try {
      const res = await getAddresses({});
      const items = res?.responseRequestModel?.responseList?.items || [];
      setAddresses(items);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  }, [getAddresses]);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      if (response) setProfile(response.responseRequestModel);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchMapping = useCallback(async () => {
    try {
      setIsAddressLoading(true);
      const districtRes = await getDistricts(HCM_PROVINCE_ID);
      const allDistricts = districtRes.data.data;

      const validDistricts = allDistricts.filter((d: District) =>
        VALID_HCM_DISTRICTS.has(d.DistrictID)
      );

      const districtMapping: Record<number, string> = {};
      const wardMapping: Record<number, string> = {};

      validDistricts.forEach((d: District) => {
        districtMapping[d.DistrictID] = d.DistrictName;
      });

      for (const d of validDistricts) {
        const wardRes = await getWards(d.DistrictID);
        const wards = wardRes.data.data;
        wards.forEach((w: Ward) => {
          wardMapping[w.WardCode] = w.WardName;
        });
      }

      setDistrictMap(districtMapping);
      setWardMap(wardMapping);
      setIsAddressLoading(false);
    } catch (error) {
      console.error("Error mapping address:", error);
      setIsAddressLoading(false);
    }
  }, []);

  const getLocationName = useCallback(
    (type: "district" | "ward", id: string | number): string => {
      const numericId = Number(id);
      if (type === "district") return districtMap[numericId] || String(id);
      if (type === "ward") return wardMap[numericId] || String(id);
      return String(id);
    },
    [districtMap, wardMap]
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchAddresses(), fetchProfile()]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    fetchMapping();
  }, [fetchMapping]);

  useEffect(() => {
    if (onChange) onChange(form);
  }, [form, onChange]);

  useEffect(() => {
    if (profile && addresses.length > 0) {
      const mainAddress =
        addresses.find((addr) => addr.isMainAddress) || addresses[0];

      const districtName = getLocationName(
        "district",
        (mainAddress?.district as string | number) || ""
      );
      const wardName = getLocationName(
        "ward",
        (mainAddress?.ward as string | number) || ""
      );

      setForm((f) => ({
        ...f,
        fromName: profile.fullName || "",
        fromPhone: profile.phoneNumber || "",
        fromAddress: [
          mainAddress?.addressDetail,
          wardName,
          districtName,
          "TP. Hồ Chí Minh",
        ]
          .filter(Boolean)
          .join(", "),
        fromProvinceName: "TP. Hồ Chí Minh",
        fromDistrictName: districtName,
        fromWardName: wardName,
      }));
    } else if (profile) {
      setForm((f) => ({
        ...f,
        fromName: profile.fullName || "",
        fromPhone: profile.phoneNumber || "",
      }));
    }
  }, [profile, addresses, districtMap, wardMap, getLocationName]);

  if (isLoading) {
    return (
      <div className="p-6 rounded-lg border border-border border-t-4 border-t-primary">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Bên gửi</h3>

        <div className="space-y-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-2 text-foreground">
                Họ tên
              </div>
              <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2 text-foreground">
                Số điện thoại
              </div>
              <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>

        <div className="p-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">Địa chỉ</h3>
            <Button variant="outline" size="sm" disabled>
              <Edit className="w-4 h-4 mr-2" />
              Thay đổi
            </Button>
          </div>
          <div className="h-[100px] w-full bg-muted animate-pulse rounded-md"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg border border-border border-t-4 border-t-primary">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Người gửi</h3>

      <div className="space-y-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium mb-2 text-foreground">
              Họ tên
            </div>
            <span className="block h-10 px-3 py-2 bg-muted rounded-md flex items-center text-foreground text-sm">
              {typeof profile?.fullName === "string" ? profile.fullName : ""}
            </span>
            {errors?.fromName && (
              <div className="text-destructive text-sm mt-1">
                {errors.fromName}
              </div>
            )}
          </div>
          <div>
            <div className="text-sm font-medium mb-2 text-foreground">
              Số điện thoại
            </div>
            <span className="block h-10 px-3 py-2 bg-muted rounded-md flex items-center text-foreground text-sm">
              {typeof profile?.phoneNumber === "string"
                ? profile.phoneNumber
                : ""}
            </span>
            {errors?.fromPhone && (
              <div className="text-red-500 text-sm mt-1">
                {errors.fromPhone}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* {addresses.length < 3 ? (
        <CreateAddress
          className="w-full"
          onCreated={fetchAddresses}
          addresses={addresses || []}
        />
      ) : (
        <p className="text-sm text-gray-500 mt-2 px-4 text-center">
          Bạn đã đạt giới hạn tối đa 3 địa chỉ.
        </p>
      )} */}

      <div className="p-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold">Địa chỉ</h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={isAddressLoading}>
                <Edit className="w-4 h-4 mr-2" />
                Thay đổi
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Quản lý địa chỉ</DialogTitle>
              </DialogHeader>
              <GetAddress addresses={addresses} onUpdated={fetchAddresses} />
              {addresses.length < 3 ? (
                <CreateAddress
                  className="w-full"
                  onCreated={fetchAddresses}
                  addresses={addresses || []}
                />
              ) : (
                <p className="text-sm text-gray-500 mt-2 px-4 text-center">
                  Bạn đã đạt giới hạn tối đa 3 địa chỉ.
                </p>
              )}
            </DialogContent>
          </Dialog>
        </div>
        <MainAddressSelector addresses={addresses} onUpdated={fetchAddresses} />
      </div>
    </div>
  );
}
