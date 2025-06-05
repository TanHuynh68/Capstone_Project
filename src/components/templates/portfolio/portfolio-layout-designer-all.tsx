import { useState } from "react";
import { HeaderBanner } from "@/components/organisms/portfolio/header-banner";
import { ProjectsGridAll } from "@/components/organisms/portfolio-all/projects-grid-all";
import { ProfileSidebarAll } from "@/components/organisms/portfolio-all/profile-sidebar-all";

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

export function PortfolioLayoutDesignerAll() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<"personal" | "completed">(
    "personal"
  );

  return (
    <div className="min-h-screen bg-background">
      <HeaderBanner />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-3 sm:mt-4 md:mt-6 lg:mt-8">
          <div className="md:col-span-1 sticky md:top-4 lg:top-6 h-fit">
            <ProfileSidebarAll portfolioData={portfolioData} />
          </div>

          <div className="md:col-span-3">
            <div className="bg-card rounded-lg p-3 sm:p-4 md:p-6 shadow-sm border border-border transition-all duration-200">
              <div className="border-b border-border mb-3 sm:mb-4 md:mb-6">
                <nav className="flex overflow-x-auto no-scrollbar flex-nowrap sm:flex-wrap sm:overflow-visible space-x-2 sm:space-x-4 md:space-x-8">
                  <button
                    onClick={() => setActiveTab("personal")}
                    className={`flex-shrink-0 py-2 sm:py-2.5 px-3 sm:px-4 text-sm font-medium w-full sm:w-auto text-center transition-colors duration-200 whitespace-nowrap ${
                      activeTab === "personal"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-border"
                    }`}
                  >
                    Thiết kế cá nhân
                  </button>
                  <button
                    onClick={() => setActiveTab("completed")}
                    className={`flex-shrink-0 py-2 sm:py-2.5 px-3 sm:px-4 text-sm font-medium w-full sm:w-auto text-center transition-colors duration-200 whitespace-nowrap ${
                      activeTab === "completed"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-border"
                    }`}
                  >
                    Các đơn đã hoàn thành
                  </button>
                </nav>
              </div>

              {activeTab === "personal" ? (
                <div className="mt-3 sm:mt-4 md:mt-6">
                  <ProjectsGridAll onPortfolioData={setPortfolioData} />
                </div>
              ) : (
                <div className="text-center py-4 sm:py-6 md:py-8 text-muted-foreground">
                  Danh sách các đơn đã hoàn thành sẽ được hiển thị ở đây
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
