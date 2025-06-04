import AllProfileDesign from "@/pages/designer/manage-portfolio/all-profile-design";

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

export function ProfileSidebarAll({
  portfolioData,
}: ProfileSidebarProps) {
  return (
    <AllProfileDesign
      portfolioData={portfolioData}
    />
  );
}
