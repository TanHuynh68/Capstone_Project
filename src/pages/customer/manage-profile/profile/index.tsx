"use client";
import { useCallback, useEffect, useRef, useState } from "react";
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
  X,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import GetAddress from "../../manage-address/address";
import CreateAddress from "../../manage-address/create-address";
import CustomerService from "@/services/CustomerService";
import useAuthService from "@/services/AuthService";
import ReputationService from "@/services/ReputationService";
import GeneralService from "@/services/GeneralService";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { RoleVietnamese } from "@/components/utils";
import { toast } from "sonner";
import ReputationHistory from "@/components/reputation/ReputationHistory";

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

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB in bytes
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const keyframes = `
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out forwards;
}

.animate-slide-out-right {
  animation: slideOutRight 0.3s ease-out forwards;
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = keyframes;
document.head.appendChild(styleSheet);

const Profile = () => {
  const { getAddresses } = CustomerService();
  const { getReputation } = ReputationService();
  const { getProfile } = useAuthService();
  const { uploadAvatar } = GeneralService();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reputation, setReputation] = useState<Reputation | null>(null);
  const userInfo = useSelector((state: RootState) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragAndDrop, setIsDragAndDrop] = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarClick = () => setDialogOpen(true);

  const validateFile = (file: File): boolean => {
    // Reset error state
    setFileError(null);

    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setFileError("Chỉ chấp nhận file ảnh định dạng JPG, JPEG hoặc PNG");
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError("Kích thước file phải nhỏ hơn 1MB");
      return false;
    }

    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (validateFile(file)) {
        setSelectedFile(file);
        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setSelectedFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
      }
    }
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("request", selectedFile);

    try {
      const response = await uploadAvatar(formData);

      if (response?.isSuccess && response.responseRequestModel?.avatar) {
        toast.success("Cập nhật ảnh đại diện thành công!");

        // Update profile with the new avatar URL
        setProfile((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            avatar: response.responseRequestModel.avatar,
          };
        });

        setDialogOpen(false);
        setSelectedFile(null);
      } else {
        toast.error(response?.message || "Cập nhật ảnh đại diện thất bại!");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Có lỗi xảy ra khi cập nhật ảnh đại diện!");
    }
  };

  const SlideInPanel = ({
    open,
    onClose,
  }: {
    open: boolean;
    onClose: () => void;
  }) => {
    return (
      <div
        className={`
        fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-lg z-50
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Lịch sử điểm uy tín</h2>
          <button onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 space-y-3 overflow-y-auto">
          <p>• 23/04/2025: +5 điểm - Hoàn thành đơn hàng</p>
          <p>• 10/05/2025: -3 điểm - Bị khiếu nại</p>
          <p>• 28/05/2025: +10 điểm - Được đánh giá 5 sao</p>
          {/* You can fetch more history from API and map here */}
        </div>
      </div>
    );
  };

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
      if (response) setReputation(response.responseRequestModel);
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

  // Cleanup preview URL when dialog closes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setIsDragAndDrop(true);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (validateFile(file)) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setSelectedFile(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
      }
    }
  };

  const handleClick = () => {
    // Only open file dialog if it's a click (not after drag & drop)
    if (!isDragAndDrop) {
      fileInputRef.current?.click();
    }
    // Reset drag & drop flag
    setIsDragAndDrop(false);
  };

  const handleCloseHistory = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowHistoryPanel(false);
      setIsClosing(false);
    }, 300); // Match animation duration
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
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Thông tin tài khoản</h1>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative">
          {/* Profile Card */}
          <div
            className={`${
              showHistoryPanel ? "md:col-span-3" : "md:col-span-4"
            } transition-all duration-500 ease-in-out`}
          >
            <Card className="shadow-sm h-full">
              <CardHeader className="text-center pb-0">
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
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-1/4 h-8 w-8 rounded-full bg-white border border-gray-200 shadow"
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Thay đổi ảnh đại diện</span>
                  </Button>
                </div>

                {/* Nằm ngoài thẻ Avatar để tránh conflict */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

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
                    <Edit className="mr-2 h-4 w-4" /> Thay đổi thông tin
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link
                    to="/change-password"
                    className="flex items-center justify-center"
                  >
                    <Lock className="mr-2 h-4 w-4" /> Đổi mật khẩu
                  </Link>
                </Button>
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
              </CardFooter>
            </Card>
          </div>

          {/* Reputation and Address Card */}
          <div
            className={`${
              showHistoryPanel ? "md:col-span-6" : "md:col-span-8"
            } transition-all duration-500 ease-in-out`}
          >
            <Card className="shadow-sm h-full">
              <CardContent className="pt-0">
                <CardTitle className="relative  pb-0 z-10">
                  Điểm uy tín
                </CardTitle>
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
                              ? new Date(
                                  reputation.updatedAt
                                ).toLocaleDateString("vi-VN")
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
                          type="button"
                          variant="outline"
                          className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                          onClick={() =>
                            showHistoryPanel
                              ? handleCloseHistory()
                              : setShowHistoryPanel(true)
                          }
                        >
                          <Award className="w-4 h-4 mr-2" />
                          {showHistoryPanel ? "Ẩn lịch sử" : "Lịch sử điểm"}
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
                  <GetAddress
                    addresses={addresses}
                    onUpdated={fetchAddresses}
                  />
                ) : (
                  <p className="text-muted-foreground text-sm mb-4 text-center">
                    Không có địa chỉ nào.
                  </p>
                )}
              </div>
            </Card>
          </div>

          {/* History Panel */}
          {(showHistoryPanel || isClosing) && (
            <div
              className={`md:col-span-3 transition-all duration-500 ease-in-out ${
                isClosing ? "animate-slide-out-right" : "animate-slide-in-right"
              }`}
            >
              <ReputationHistory onClose={handleCloseHistory} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
