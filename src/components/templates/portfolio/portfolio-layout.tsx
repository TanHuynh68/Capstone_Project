import { useState } from "react";
import { HeaderBanner } from "@/components/organisms/portfolio/header-banner";
import { ProfileSidebar } from "@/components/organisms/portfolio/profile-sidebar";
import { ProjectsGrid } from "@/components/organisms/portfolio/projects-grid";
import { MyFeedback } from "@/components/organisms/feedback/MyFeedback";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handlePortfolioUpdate = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderBanner />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8 mt-3 sm:mt-4 md:mt-6 lg:mt-8">
          <div className="md:col-span-1 sticky md:top-4 lg:top-6 h-fit">
            <ProfileSidebar
              portfolioData={portfolioData}
              onPortfolioUpdate={handlePortfolioUpdate}
            />
          </div>

          <div className="md:col-span-3">
            <div className="bg-card rounded-lg p-3 sm:p-4 md:p-6 shadow-sm border border-border transition-all duration-200">
              <Tabs defaultValue="portfolio" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="portfolio">Thiết kế cá nhân</TabsTrigger>
                  <TabsTrigger value="feedback">Đánh giá</TabsTrigger>
                </TabsList>

                <TabsContent value="portfolio" className="space-y-4">
                  <div className="mt-3 sm:mt-4 md:mt-6">
                    <ProjectsGrid
                      onPortfolioData={setPortfolioData}
                      key={refreshTrigger}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="feedback" className="space-y-4">
                  <div className="mt-3 sm:mt-4 md:mt-6">
                    <MyFeedback />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
