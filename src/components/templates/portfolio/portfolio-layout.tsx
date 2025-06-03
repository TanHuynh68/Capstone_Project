import { useState } from "react";
import { HeaderBanner } from "@/components/organisms/portfolio/header-banner";
import { ProfileSidebar } from "@/components/organisms/portfolio/profile-sidebar";
import { ProjectsGrid } from "@/components/organisms/portfolio/projects-grid";

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

export function MyPortfolioLayout() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <HeaderBanner />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProfileSidebar portfolioData={portfolioData} />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  <button className="border-b-2 border-blue-600 pb-2 text-sm font-medium text-blue-600">
                    Work
                  </button>
                  <button className="pb-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Services
                  </button>
                  <button className="pb-2 text-sm font-medium text-gray-500 hover:text-gray-700">
                    Appreciations
                  </button>
                </nav>
              </div>

              <ProjectsGrid onPortfolioData={setPortfolioData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
