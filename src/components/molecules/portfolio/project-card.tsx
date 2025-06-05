import SingleImageGallery from "@/components/molecules/post/post-detail/SingleImageGallery";
import { formatVietnamDateHours } from "@/components/utils/date";
import { EditImagePortfolio } from "../../../pages/designer/manage-portfolio/edit-image-portfolio/edit-image-portfolio";
// import { Heart, Eye } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string;
  image: string;
  createdAt?: string;
  onEditSuccess?: () => void;
}

export function ProjectCard({
  id,
  title,
  image,
  createdAt,
  onEditSuccess,
}: ProjectCardProps) {
  return (
    <div className="group cursor-pointer flex justify-center">
      <div className="relative overflow-hidden rounded-lg bg-muted aspect-[4/3] w-[250px] h-[250px] flex items-center justify-center">
        <SingleImageGallery
          imageUrl={image}
          title=""
          className="!w-[250px] !h-[250px] flex items-center justify-center"
          alt={title}
        />
        <EditImagePortfolio
          imageId={id}
          currentTitle={title}
          currentImageUrl={image}
          onSuccess={onEditSuccess || (() => {})}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-end justify-start opacity-0 group-hover:opacity-100 pointer-events-none">
          <div className="text-white p-4 text-left">
            <p className="text-sm mb-1 font-medium break-all whitespace-pre-wrap overflow-hidden text-ellipsis line-clamp-8">
              {title}
            </p>
            {createdAt && (
              <p className="text-xs text-white/80">
                {formatVietnamDateHours(createdAt)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
