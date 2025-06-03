import MyProfileDesign from "@/pages/designer/manage-design-profile/my-profile-design";

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
}

export function ProfileSidebar({ portfolioData }: ProfileSidebarProps) {
  return <MyProfileDesign portfolioData={portfolioData} />;
}
