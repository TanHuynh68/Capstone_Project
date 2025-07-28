"use client";
import { useEffect, useState } from "react";
import { User, Mail, Phone, UserCircle, Transgender } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReputationService from "@/services/ReputationService";
import GeneralService from "@/services/GeneralService";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { RoleVietnamese } from "@/utils";
import { Separator } from "@/components/ui/separator";

interface Profile {
  accountID: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  genderDisplay: string;
  roleDisplay: string;
  createdAt: string;
  avatar?: string;
}

interface Reputation {
  currentScore: number;
  level: number;
  updatedAt: string;
}

const ProfileForAll = () => {
  const { getReputation } = ReputationService();
  const { getProfileForAll } = GeneralService();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reputation, setReputation] = useState<Reputation | null>(null);
  const userInfo = useSelector((state: RootState) => state.user);
  const accountID = useSelector((state: RootState) => state.user.id);

  console.log(accountID);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchProfile(), fetchReputation()]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const fetchReputation = async () => {
    try {
      const response = await getReputation();
      if (response) setReputation(response.responseRequestModel);
    } catch (error) {
      console.error("Error fetching reputation:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await getProfileForAll({
        accountID: accountID,
      });
      if (response) setProfile(response.responseRequestModel);
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

  const displayScore = reputation?.currentScore || 0;
  const progressScore = Math.min(Math.max(displayScore, 0), 100);
  const arcLength = 260;
  const startAngle = 140;
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

  let strokeColor = "#22c55e";
  let textColorClass = "text-green-600";

  if (displayScore < 50) {
    strokeColor = "#ef4444";
    textColorClass = "text-red-600";
  } else if (displayScore < 80) {
    strokeColor = "#facc15";
    textColorClass = "text-yellow-600";
  }

  return (
    <>
      <div className="container max-w-6xl mx-auto px-4">
        {/* <h1 className="text-2xl font-bold mb-6">Thông tin tài khoản</h1> */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative">
          {/* Profile Card */}
          <div
            className={`w-full md:col-span-12 transition-all duration-500 ease-in-out`}
          >
            <Card className="shadow-sm h-full w-full">
              <CardContent className="pt-0">
                <CardTitle className="relative text-center  pb-3 z-10">
                  Điểm uy tín
                </CardTitle>
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
                  </div>
                </div>
              </CardContent>

              <Separator />
              <CardHeader className="text-center pb-0 mt-2">
                {/* Ảnh đại diện + nút Camera */}
                <div className="flex justify-center mb-4 relative">
                  <Avatar className="h-24 w-24 shadow-sm">
                    <AvatarImage
                      src={profile?.avatar}
                      alt={profile?.fullName || "Avatar"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-100">
                      {profile?.fullName?.charAt(0) || (
                        <User className="h-12 w-12" />
                      )}
                    </AvatarFallback>
                  </Avatar>

                  {/* Nút chọn ảnh */}
                  {/* <Button
                    size="icon"
                    variant="outline"
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-1/4 h-8 w-8 rounded-full bg-white border border-gray-200 shadow"
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Thay đổi ảnh đại diện</span>
                  </Button> */}
                </div>

                {/* Nằm ngoài thẻ Avatar để tránh conflict */}
                {/* <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                /> */}

                <h2 className="text-xl font-semibold">
                  {profile?.fullName || "Chưa cập nhật"}
                </h2>
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
                  <span className="font-medium">Tham gia vào:</span>
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("vi-VN")
                    : "Chưa cập nhật"}
                </p>
              </CardHeader>

              <CardContent>
                <div className="space-y-4 text-sm mt-3">
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

              {/* <CardFooter className="flex flex-col gap-3 pt-2">
                <Button variant="outline" className="w-full ">
                  <Link
                    to="/edit-profile"
                    className="flex items-center justify-center"
                  >
                    <Edit className="mr-2 h-4 w-4" /> Thay đổi thông tin
                  </Link>
                </Button>
                <Button variant="outline" className="w-full p-0">
                  <Dialog>
                    <DialogTrigger className="w-full">
                      <Button variant="outline" className="w-full">
                        <Lock className="mr-2 h-4 w-4" /> Đổi mật khẩu
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[550px]">
                      <ChangePasswordPage />
                    </DialogContent>
                  </Dialog>
                </Button>
              </CardFooter> */}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileForAll;
