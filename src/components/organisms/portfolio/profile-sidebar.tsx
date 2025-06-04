import MyProfileDesign from "@/pages/designer/manage-portfolio/my-profile-design";

interface PortfolioImage {
  portfolioImageID: string;
  imageUrl: string;
  imageDescription: string;
  imageType: number;
  createdAt: string;
}

interface PortfolioData {
  portfolioImages: PortfolioImage[];
  yearOfExperience?: string;
  content?: string;
  expertIn?: string;
}

interface ProfileSidebarProps {
  portfolioData: PortfolioData | null;
  onPortfolioUpdate?: () => void;
}

export function ProfileSidebar({
  portfolioData,
  onPortfolioUpdate,
}: ProfileSidebarProps) {
  return (
    <MyProfileDesign    
      portfolioData={portfolioData}
      onPortfolioUpdate={onPortfolioUpdate}
    />
  );
}
