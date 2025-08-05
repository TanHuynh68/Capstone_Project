import { useState } from "react";
import { HeaderBanner } from "@/components/organisms/portfolio/header-banner";
import { ProjectsGridAll } from "@/components/organisms/portfolio-all/projects-grid-all";
import { ProfileSidebarAll } from "@/components/organisms/portfolio-all/profile-sidebar-all";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DesignerFeedback } from "@/components/organisms/feedback/DesignerFeedback";

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
              <Tabs defaultValue="portfolio" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-0 cursor-pointer">
                  <TabsTrigger className="cursor-pointer" value="portfolio">
                    Thiết kế cá nhân
                  </TabsTrigger>
                  <TabsTrigger className="cursor-pointer" value="feedback">
                    Đánh giá
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="portfolio" className="space-y-4">
                  <div className="mt-3 sm:mt-4 md:mt-6">
                    <ProjectsGridAll onPortfolioData={setPortfolioData} />
                  </div>
                </TabsContent>

                <TabsContent value="feedback" className="space-y-4">
                  <div className="mt-3 sm:mt-4 md:mt-6">
                    <DesignerFeedback />
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
