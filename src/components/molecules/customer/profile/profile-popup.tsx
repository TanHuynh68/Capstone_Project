import { useCurrentUser } from "@/utils";
import { PATH } from "@/routes/path";
import ChatService from "@/services/ChatService";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PortfolioService from "@/services/PortfolioService";
import { Phone } from "lucide-react";

interface ProfilePopupProps {
  fullName: string;
  avatar?: string;
  designerID: string;
  portfolioData?: {
    portfolioID: string;
    yearOfExperience: string;
    content: string;
    fullName: string;
    avatar: string | null;
    email: string;
    phoneNumber: string;
    expertIn: string;
    createdAt: string;
    updatedAt: string;
    portfolioImages: Array<{
      portfolioImageID: string;
      imageUrl: string;
      imageDescription: string;
      imageType: number;
      createdAt: string;
    }>;
  } | null;
}

interface PortfolioImage {
  portfolioImageID: string;
  imageUrl: string;
  imageDescription: string;
  imageType: number;
  createdAt: string;
}

interface PortfolioData {
  portfolioID: string;
  yearOfExperience: string;
  content: string;
  fullName: string;
  avatar: string | null;
  email: string;
  phoneNumber: string;
  expertIn: string;
  createdAt: string;
  updatedAt: string;
  portfolioImages: PortfolioImage[];
}

export function ProfilePopup({
  designerID,
  fullName,
  avatar,
  portfolioData: externalPortfolioData,
}: ProfilePopupProps) {
  const { createChatRoom } = ChatService();
  const { getPortfolioDesignerForAll } = PortfolioService();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const createChatRoomByCustomer = async () => {
    console.log("designerID: ", designerID);
    const response = await createChatRoom(designerID);
    console.log("createChatRoom: ", response);
    if (response) {
      navigate(PATH.CHAT_PAGE);
    }
  };

  const handleViewProfile = () => {
    navigate(PATH.DESIGNER_PORTFOLIO_PAGE.replace(":id", designerID));
  };

  const fetchPortfolioData = async () => {
    if (!portfolioData && !isLoading) {
      setIsLoading(true);
      try {
        const response = await getPortfolioDesignerForAll({
          DesignerID: designerID,
        });
        if (response?.isSuccess && response?.responseRequestModel) {
          setPortfolioData(response.responseRequestModel);
        }
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Use external portfolio data if provided, otherwise fetch from API
  useEffect(() => {
    if (externalPortfolioData) {
      setPortfolioData(externalPortfolioData);
    } else if (!portfolioData && !isLoading) {
      fetchPortfolioData();
    }
  }, [externalPortfolioData]);

  // Get up to 3 random portfolio images for display
  const getDisplayImages = () => {
    if (
      !portfolioData?.portfolioImages ||
      portfolioData.portfolioImages.length === 0
    ) {
      return [
        { imageUrl: "/images/logo.png", alt: "ảnh giới thiệu" },
        { imageUrl: "/images/logo.png", alt: "ảnh giới thiệu" },
        { imageUrl: "/images/logo.png", alt: "ảnh giới thiệu" },
      ];
    }

    // Shuffle array and take first 3 images
    const shuffledImages = [...portfolioData.portfolioImages].sort(
      () => Math.random() - 0.5
    );
    return shuffledImages.slice(0, 3).map((image) => ({
      imageUrl: image.imageUrl,
      alt: image.imageDescription || "ảnh portfolio",
    }));
  };

  const displayImages = getDisplayImages();

  return (
    <div className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-0 w-[300px] bg-popover text-popover-foreground rounded-2xl shadow-xl p-4 border border-border transition-all duration-300 origin-top opacity-100 scale-100 pointer-events-auto">
      {/* Top images */}
      <div className="grid grid-cols-3 gap-1 mb-3 overflow-hidden rounded">
        {displayImages.map((image, index) => (
          <img
            key={index}
            src={image.imageUrl}
            alt={image.alt}
            className="w-full h-[60px] object-contain"
          />
        ))}
      </div>

      {/* Avatar and info */}
      <div className="flex flex-col items-center text-center mb-3">
        <img
          src={avatar || "/unknown-user.png"}
          alt={fullName}
          className="w-16 h-16 rounded-full border-2 border-background -mt-8 shadow-md"
        />
        <div className="font-semibold text-base mt-2">{user.id != designerID ? fullName : `${fullName} (Bạn)`}</div>
        <div className="text-sm text-muted-foreground">
          {portfolioData?.email || "N/A"}
        </div>
        <span className="mt-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
          <Phone className="w-3 h-3" /> {portfolioData?.phoneNumber || "N/A"}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center text-sm text-muted-foreground mb-4">
        {[
          {
            label: "Kinh nghiệm",
            value: portfolioData?.yearOfExperience
              ? portfolioData.yearOfExperience.length > 5
                ? `${portfolioData.yearOfExperience.substring(0, 5)}...`
                : portfolioData.yearOfExperience
              : "N/A",
          },
          {
            label: "Chuyên môn",
            value: portfolioData?.expertIn
              ? portfolioData.expertIn.length > 5
                ? `${portfolioData.expertIn.substring(0, 5)}...`
                : portfolioData.expertIn
              : "N/A",
          },
          {
            label: "Giới thiệu",
            value: portfolioData?.content
              ? portfolioData.content.length > 5
                ? `${portfolioData.content.substring(0, 5)}...`
                : portfolioData.content
              : "N/A",
          },
        ].map((item, index, array) => (
          <div
            key={index}
            className={`flex flex-col items-center relative ${
              index !== array.length - 1
                ? "after:content-[''] after:absolute after:right-0 after:top-1/2 after:-translate-y-1/2 after:w-px after:h-5 after:bg-border"
                : ""
            }`}
          >
            <div className="font-semibold text-foreground text-xs">
              {item.value}
            </div>
            <div className="text-xs text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleViewProfile}
          className="flex-1 border border-border text-sm rounded-full py-1.5 font-medium text-primary hover:bg-accent/5 dark:hover:bg-accent/10 transition-colors cursor-pointer"
        >
          Hồ sơ
        </button>
        {user?.id != designerID && (
          <button
            onClick={createChatRoomByCustomer}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer"
          >
            Nhắn tin
          </button>
        )}
      </div>

      {/* Dropdown triangle */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-4 h-4 rotate-45 bg-popover border-l border-t border-border"></div>
    </div>
  );
}
