import { useEffect, useState } from "react";
import PortfolioService from "@/services/PortfolioService";
import { useParams } from "react-router-dom";
import { ProjectCardAll } from "@/components/molecules/portfolio/project-card-all";
import { FolderOpen } from "lucide-react";

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

export function ProjectsGridAll({ onPortfolioData }: ProjectsGridProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const { getPortfolioDesignerForAll } = PortfolioService();
  const { id } = useParams();
  console.log("iasdasdassdad: ", id);
  const refreshProjects = async () => {
    if (!id) return;
    const data = await getPortfolioDesignerForAll({ DesignerID: id });
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
  }, [getPortfolioDesignerForAll, onPortfolioData]);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 px-1 sm:px-2 md:p-4">
      {projects.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500 flex flex-col items-center gap-2">
          <FolderOpen className="w-12 h-12 text-gray-400" />
          <span>Chưa có dự án nào</span>
        </div>
      ) : (
        projects.map((project) => (
          <div
            key={project.id}
            className="w-full max-w-[340px] min-w-[180px] mx-auto mb-2 flex flex-col items-center bg-white rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
          >
            <ProjectCardAll {...project} onEditSuccess={refreshProjects} />
          </div>
        ))
      )}
    </div>
  );
}
