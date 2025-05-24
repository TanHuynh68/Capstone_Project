"use client";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Edit,
  Camera,
  Award,
  UserCircle,
  Transgender,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import GetAddress from "../../manage-address/address";
import CreateAddress from "../../manage-address/create-address";
import CustomerService from "@/services/CustomerService";
import useAuthService from "@/services/AuthService";
import ReputationService from "@/services/ReputationService";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { RoleVietnamese } from "@/components/utils";

interface Profile {
  accountID: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  genderDisplay: string;
  roleDisplay: string;
  createdAt: string;
}

interface Reputation {
  currentScore: number;
  level: number;
  updatedAt: string;
}

const Profile = () => {
  const { getAddresses } = CustomerService();
  const { getReputation } = ReputationService();
  const { getProfile } = useAuthService();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reputation, setReputation] = useState<Reputation | null>(null);
  const userInfo = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchAddresses(), fetchProfile(), fetchReputation()]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const fetchReputation = async () => {
    try {
      const response = await getReputation();
      if (response) {
        setReputation(response.responseRequestModel);
      }
    } catch (error) {
      console.error("Error fetching reputation:", error);
    }
  };

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
      if (response) {
        setProfile(response.responseRequestModel);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const getGenderLabel = (gender?: string) => {
    switch (gender?.toLowerCase()) {
      case "male":
        return "Nam";
      case "female":
        return "Nữ";
      case "other":
        return "Khác";
      default:
        return "Chưa cập nhật";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const radius = 40;
  const cx = 50;
  const cy = 55;

  const displayScore = reputation?.currentScore || 0; // hiển thị đúng số thực
  const progressScore = Math.min(Math.max(displayScore, 0), 100); // giới hạn từ 0–100

  const arcLength = 260; // từ 130° đến 230°
  const startAngle = 140; // bắt đầu từ bên trái
  const dynamicArc = arcLength * (progressScore / 100);
  const endAngle = startAngle + dynamicArc;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const bgStartX = cx + radius * Math.cos(toRad(startAngle));
  const bgStartY = cy + radius * Math.sin(toRad(startAngle));
  const bgEndX = cx + radius * Math.cos(toRad(startAngle + arcLength));
  const bgEndY = cy + radius * Math.sin(toRad(startAngle + arcLength));

  const endX = cx + radius * Math.cos(toRad(endAngle));
  const endY = cy + radius * Math.sin(toRad(endAngle));

  const largeArcFlag = dynamicArc > 180 ? 1 : 0;

  let strokeColor = "#22c55e"; // mặc định: xanh lá
  let textColorClass = "text-green-600";

  if (displayScore < 50) {
    strokeColor = "#ef4444"; // red-500
    textColorClass = "text-red-600";
  } else if (displayScore < 80) {
    strokeColor = "#facc15"; // yellow-400
    textColorClass = "text-yellow-500";
  }

  return (
    <div className="container max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Thông tin tài khoản</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card - Left Side */}
        <Card className="md:col-span-1 shadow-sm">
          <CardHeader className="text-center pb-0">
            <div className="flex justify-center mb-4 relative">
              <Avatar className="h-24 w-24 shadow-sm">
                <AvatarImage
                  src={
                    profile?.fullName
                      ? undefined
                      : "/placeholder.svg?height=96&width=96"
                  }
                  alt={profile?.fullName}
                />
                <AvatarFallback className="bg-gray-100">
                  {profile?.fullName ? (
                    profile.fullName.charAt(0)
                  ) : (
                    <User className="h-12 w-12" />
                  )}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute bottom-0 right-1/4 h-8 w-8 rounded-full bg-white border border-gray-200 shadow"
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">Thay đổi ảnh đại diện</span>
              </Button>
            </div>

            <h2 className="text-xl font-semibold">
              {profile?.fullName || "Chưa cập nhật"}
            </h2>
            <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
              <span className="font-medium">Tham gia vào:</span>
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "Chưa cập nhật"}
            </p>
          </CardHeader>

          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>{profile?.email || "Chưa cập nhật"}</span>
              </div>

              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>{profile?.phoneNumber || "Chưa cập nhật"}</span>
              </div>

              <div className="flex items-center">
                <UserCircle className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>
                  {RoleVietnamese(userInfo.role) ||
                    profile?.roleDisplay ||
                    "Khách hàng"}
                </span>
              </div>

              <div className="flex items-center">
                <Transgender className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>{getGenderLabel(profile?.genderDisplay)}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            <Button variant="outline" className="w-full" asChild>
              <Link
                to="/edit-profile"
                className="flex items-center justify-center"
              >
                <Edit className="mr-2 h-4 w-4" />
                Thay đổi thông tin
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link
                to="/change-password"
                className="flex items-center justify-center"
              >
                <Lock className="mr-2 h-4 w-4" />
                Đổi mật khẩu
              </Link>
            </Button>

            {addresses.length < 3 && (
              <CreateAddress
                className="w-full"
                onCreated={fetchAddresses}
                addresses={addresses || []}
              />
            )}
          </CardFooter>
        </Card>

        {/* Reputation and Address - Right Side */}
        <Card className="md:col-span-2 shadow-sm">
          <CardContent className="pt-0">
            <CardTitle className="relative  pb-0 z-10">Điểm uy tín</CardTitle>
            <div className="space-y-3">
              {/* Reputation Section */}
              <div className="flex flex-col items-center gap-4 -mt-2">
                {/* Vòng cung + thông tin bên trong */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 -mt-2 w-full">
                  {/* Vòng cung uy tín - cột trái */}
                  <div className="relative w-44 h-44 mx-auto md:mx-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Vòng nền xám */}
                      <path
                        d={`M ${bgStartX} ${bgStartY} A ${radius} ${radius} 0 1 1 ${bgEndX} ${bgEndY}`}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="5"
                      />
                      {/* Vòng xanh theo score */}
                      {displayScore > 0 && (
                        <path
                          d={`M ${bgStartX} ${bgStartY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`}
                          fill="none"
                          stroke={strokeColor} // 👈 Màu động
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                      )}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-2 text-center">
                      <span
                        className={`${textColorClass} text-3xl font-bold leading-none`}
                      >
                        {displayScore}
                      </span>

                      <span className="text-sm font-semibold mt-1">
                        Cấp {reputation?.level || 1}
                      </span>
                      <span className="text-xs text-gray-500 pt-1">
                        Cập nhật:{" "}
                        {reputation?.updatedAt
                          ? new Date(reputation.updatedAt).toLocaleDateString(
                              "vi-VN"
                            )
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pl-5 flex-wrap">
                    {/* Nút Xem quyền lợi – xanh lá nổi bật */}
                    <Button
                      asChild
                      variant="outline"
                      className="border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                    >
                      <Link
                        to="/reputation-benefits"
                        className="flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Xem quyền lợi
                      </Link>
                    </Button>

                    {/* Nút Lịch sử điểm – xanh dương nhạt */}
                    <Button
                      asChild
                      variant="outline"
                      className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Link
                        to="/reputation-history"
                        className="flex items-center gap-2"
                      >
                        <Award className="w-4 h-4" />
                        Lịch sử điểm
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Mô tả */}
                {/* <p className="text-sm text-gray-700 text-center border-t pt-4 w-full">
                  Điểm uy tín phản ánh độ tin cậy của bạn trong cộng đồng. Tham
                  gia tích cực để nâng cao điểm số!
                </p> */}
              </div>

              <Separator />

              {/* Address Section */}
            </div>
          </CardContent>

          <div>
            <CardTitle className="relative pl-6 pr-6">Địa chỉ</CardTitle>

            {addresses.length > 0 ? (
              <GetAddress addresses={addresses} onUpdated={fetchAddresses} />
            ) : (
              <p className="text-muted-foreground text-sm mb-4 text-center">
                Không có địa chỉ nào.
              </p>
            )}

            {addresses.length >= 3 && (
              <p className="text-sm text-gray-500 mt-2 px-6 text-center">
                Bạn đã đạt giới hạn tối đa 3 địa chỉ.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
