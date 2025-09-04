"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, MapPin, Wallet, CreditCard, Calendar, Phone, Mail, Home, Star, UserCircle } from "lucide-react";
import StaffService from "@/services/StaffService";
import { UserFullInfo } from "@/types/user";
import { getDistricts, getWards } from "@/services/ghnApi";
import { getGenderBadge, getRoleBadge, getUserStatusBadge } from "@/utils/badge-utils";
import { formatVietnamDateHours } from "@/utils/date";

const HCM_PROVINCE_ID = 202;
const VALID_HCM_DISTRICTS = new Set([
  3695, 2090, 1534, 1533, 1463, 1462, 1461, 1460, 1459, 1458, 1457, 1456, 1455,
  1454, 1453, 1452, 1451, 1450, 1449, 1448, 1447, 1446, 1444, 1443, 1442,
]);

export default function UserDetailsPage() {
  const { accountID } = useParams<{ accountID: string }>();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<UserFullInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [districtMap, setDistrictMap] = useState<Record<number, string>>({});
  const [wardMap, setWardMap] = useState<Record<number, string>>({});
  const [isMapping, setIsMapping] = useState(true);
  const { getInfoUserByStaff } = StaffService();

  useEffect(() => {
    if (accountID) {
      fetchUserInfo();
    }
  }, [accountID]);

  useEffect(() => {
    const fetchMapping = async () => {
      if (!userInfo || userInfo.addresses.length === 0) {
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
  }, [userInfo]);

  const getLocationName = (
    type: "district" | "ward",
    id: string | number
  ): string => {
    const numericId = Number(id);
    if (type === "district") return districtMap[numericId] || String(id);
    if (type === "ward") return wardMap[numericId] || String(id);
    return String(id);
  };

  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const response = await getInfoUserByStaff({ accountID });
      if (response?.responseRequestModel) {
        setUserInfo(response.responseRequestModel);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Deposit":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Withdraw":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Forfeit":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Refund":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "Deposit":
        return "Đặt cọc";
      case "Withdraw":
        return "Rút tiền";
      case "Forfeit":
        return "Bồi thường";
      case "Refund":
        return "Hoàn tiền";
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Thông tin chi tiết người dùng</h1>
            <p className="text-muted-foreground">
              {userInfo?.infomation.fullName || "Đang tải..."}
            </p>
          </div>
        </div>
      </div>

      {userInfo && (
        <div className="space-y-6">
          {/* Row 1: Information and Addresses */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Information Block */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5" />
                  Thông tin cá nhân
                </CardTitle>
              </CardHeader>
                             <CardContent className="space-y-3">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                       {/* Cột 1 */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4" />
                        <span className="font-medium">Tên:</span>
                        <span>{userInfo.infomation.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{userInfo.infomation.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{userInfo.infomation.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Ngày tạo: {formatVietnamDateHours(userInfo.infomation.createdAt)}</span>
                      </div>
                    </div>

                    {/* Cột 2 */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Vai trò:</span>
                        {getRoleBadge(userInfo.infomation.roleDisplay)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Trạng thái:</span>
                        {getUserStatusBadge(userInfo.infomation.isActive)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Xác thực:</span>
                        {getUserStatusBadge(userInfo.infomation.isVerify ? "Verified" : "Unverified")}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Giới tính:</span>
                        {getGenderBadge(userInfo.infomation.genderDisplay)}
                      </div>
                    </div>
                 </div>
               </CardContent>
            </Card>

            {/* Addresses Block */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5" />
                  Địa chỉ
                </CardTitle>
              </CardHeader>
                             <CardContent>
                 {isMapping ? (
                   <div className="space-y-3">
                     {userInfo.addresses.map((address) => (
                       <div key={address.addressID} className="p-3 border rounded-lg">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-muted animate-pulse"></div>
                           <div className="flex-1 space-y-2">
                             <div className="h-4 bg-muted rounded animate-pulse"></div>
                             <div className="h-3 bg-muted rounded animate-pulse w-2/3"></div>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : userInfo.addresses.length > 0 ? (
                   <div className="space-y-3">
                     {userInfo.addresses.map((address) => (
                       <div key={address.addressID} className="p-3 border rounded-lg">
                         <div className="flex items-center gap-3">
                           <div className="flex-shrink-0">
                             <div
                               className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                 address.isMainAddress ? "bg-primary/10" : "bg-muted"
                               }`}
                             >
                               <Home
                                 className={`w-4 h-4 ${
                                   address.isMainAddress ? "text-primary" : "text-muted-foreground"
                                 }`}
                               />
                             </div>
                           </div>

                           <div className="flex-1">
                             <div className="flex items-center gap-2 mb-2 justify-between">
                               <span
                                 className={`text-sm font-semibold break-words ${
                                   address.isMainAddress ? "text-primary" : "text-foreground"
                                 }`}
                               >
                                 {address.addressDetail}
                               </span>
                               {address.isMainAddress && (
                                 <div className="flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground text-xs rounded-md font-medium">
                                   <Star className="w-3 h-3" />
                                   Địa chỉ chính
                                 </div>
                               )}
                             </div>
                             <p className="text-sm text-muted-foreground">
                               {getLocationName("ward", address.ward)},{" "}
                               {getLocationName("district", address.district)}, TP. Hồ Chí Minh
                             </p>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <p className="text-muted-foreground">Chưa có địa chỉ</p>
                 )}
               </CardContent>
            </Card>
          </div>

          {/* Row 2: Wallet and Deposits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Wallet Block */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wallet className="h-5 w-5" />
                  Ví tiền
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Số dư khả dụng:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(userInfo.wallet.balance)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Số dư bị khóa:</span>
                  <span className="text-lg font-bold text-orange-600">
                    {formatCurrency(userInfo.wallet.locked)}
                  </span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <span className="font-medium">Thông tin ngân hàng:</span>
                  {userInfo.wallet.bankAccountNumber ? (
                    <div className="space-y-1 text-sm mt-2">
                      <div className="flex justify-between">
                        <span>Ngân hàng:</span>
                        <span>{userInfo.wallet.bankName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Số tài khoản:</span>
                        <span>{userInfo.wallet.bankAccountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chủ tài khoản:</span>
                        <span>{userInfo.wallet.accountHolderName}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">Chưa liên kết ngân hàng</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Deposits Block */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5" />
                  Lịch sử đặt cọc
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userInfo.deposits.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {userInfo.deposits.map((deposit) => (
                      <div key={deposit.orderDepositID} className="p-3 border rounded-lg">
                                                 <div className="flex justify-between items-start mb-2">
                           <span className="font-medium text-sm line-clamp-2">
                             {deposit.title}
                           </span>
                           <Badge className={getTypeColor(deposit.type)}>
                             {getTypeLabel(deposit.type)}
                           </Badge>
                         </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-lg font-bold ${
                            deposit.type === "Withdraw" ? "text-red-600" : "text-green-600"
                          }`}>
                            {formatCurrency(deposit.amount)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatVietnamDateHours(deposit.depositAt)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Order ID: {deposit.orderID}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Chưa có lịch sử đặt cọc</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
