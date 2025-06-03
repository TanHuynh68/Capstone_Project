import { useEffect, useState } from "react";
import { ProjectCard } from "@/components/molecules/portfolio/project-card";
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

  useEffect(() => {
    getMyPortfolio().then((data) => {
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
    });
  }, [getMyPortfolio, onPortfolioData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 place-items-center">
      {projects.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
}
