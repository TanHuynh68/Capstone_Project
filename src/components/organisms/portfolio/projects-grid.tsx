import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/molecules/portfolio/project-card";
import { CreatePortfolio } from "@/pages/designer/manage-portfolio/create-portfolio/create-portfolio";
import PortfolioService from "@/services/PortfolioService";

interface PortfolioImage {
  portfolioImageID: string;
  imageUrl: string;
  imageDescription: string;
  imageType: number;
  createdAt: string;
}

interface Project {
  id: string;
  title: string;
  image: string;
  createdAt: string;
  imageType: number;
}

interface PortfolioData {
  portfolioImages: PortfolioImage[];
  yearOfExperience?: string;
  content?: string;
  expertIn?: string;
}

interface ProjectsGridProps {
  onPortfolioData: (data: PortfolioData) => void;
}

export function ProjectsGrid({ onPortfolioData }: ProjectsGridProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const { getMyPortfolio } = PortfolioService();

  const refreshProjects = async () => {
    const data = await getMyPortfolio();
    const images: PortfolioImage[] =
      data?.responseRequestModel?.portfolioImages || [];
    const mappedProjects: Project[] = images.map((img) => ({
      id: img.portfolioImageID,
      title: img.imageDescription || "Untitled",
      image: img.imageUrl,
      createdAt: img.createdAt,
      imageType: img.imageType,
    }));
    setProjects(mappedProjects);
    if (data?.responseRequestModel) {
      onPortfolioData(data.responseRequestModel);
    }
  };

  useEffect(() => {
    refreshProjects();
  }, [getMyPortfolio, onPortfolioData]);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 px-1 sm:px-2 md:px-4">
      {projects.length === 0 ? (
        <CreatePortfolio onSuccess={refreshProjects} />
      ) : (
        projects.map((project) => (
          <div
            key={project.id}
            className="w-full max-w-[340px] min-w-[180px] mx-auto mb-2 flex flex-col items-center bg-white rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
          >
            <ProjectCard {...project} onEditSuccess={refreshProjects} />
          </div>
        ))
      )}
    </div>
  );
}
